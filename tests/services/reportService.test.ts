import { describe, it, expect } from "vitest";
import { formatBalances, formatReport } from "../../src/services/reportService";
import { TransferResult } from "../../src/services/transferService";
import { Bank } from "../../src/models/bank";
import { Account } from "../../src/models/account";
import { Transfer } from "../../src/models/transfer";

const A = "1111234522226789";
const B = "1212343433335665";

const applied: TransferResult = {
  status: "applied",
  transfer: new Transfer(A, B, 50000),
};

const rejected: TransferResult = {
  status: "rejected",
  transfer: new Transfer(A, B, 99999),
  reason: "insufficient funds in " + A,
};

function bank(): Bank {
  return new Bank([new Account(A, 450000), new Account(B, 170000)]);
}

describe("formatReport", () => {
  it("should summarise the applied and rejected counts", () => {
    const report = formatReport(bank(), [applied, rejected]);

    expect(report).toContain("Transfers: 1 applied, 1 rejected");
  });

  it("should list each applied transfer with a formatted amount", () => {
    const report = formatReport(bank(), [applied]);

    expect(report).toContain(`${A} -> ${B}: 500.00`);
  });

  it("should list each rejected transfer with its reason", () => {
    const report = formatReport(bank(), [rejected]);

    expect(report).toContain("insufficient funds");
    expect(report).toContain("999.99");
  });

  it("should list the final balance of every account", () => {
    const report = formatReport(bank(), []);

    expect(report).toContain(`${A}: 4500.00`);
    expect(report).toContain(`${B}: 1700.00`);
  });

  it("should omit the rejected section when nothing was rejected", () => {
    const report = formatReport(bank(), [applied]);

    expect(report).not.toContain("Rejected:");
  });
});

describe("formatBalances", () => {
  it("should list every account under the given title", () => {
    const balances = formatBalances(bank(), "Loaded balances");

    expect(balances).toContain("Loaded balances:");
    expect(balances).toContain(`${A}: 4500.00`);
    expect(balances).toContain(`${B}: 1700.00`);
  });
});
