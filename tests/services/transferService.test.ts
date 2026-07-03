import { describe, it, expect } from "vitest";
import { applyTransfer } from "../../src/services/transferService";
import { Bank } from "../../src/models/bank";
import { Account } from "../../src/models/account";
import { Transfer } from "../../src/models/transfer";

const SOURCE = "1111234522226789";
const DESTINATION = "1212343433335665";
const UNKNOWN = "0000000000000000";

function bankWith(sourceBalance: number, destinationBalance: number): Bank {
  return new Bank([
    new Account(SOURCE, sourceBalance),
    new Account(DESTINATION, destinationBalance),
  ]);
}

describe("applyTransfer", () => {
  it("should move funds from source to destination on a valid transfer", () => {
    const bank = bankWith(500000, 120000);

    const result = applyTransfer(bank, new Transfer(SOURCE, DESTINATION, 50000));

    expect(result.status).toBe("applied");
    expect(bank.get(SOURCE)?.balance).toBe(450000);
    expect(bank.get(DESTINATION)?.balance).toBe(170000);
  });

  it("should allow a transfer that empties the source account", () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(SOURCE, DESTINATION, 50000));

    expect(result.status).toBe("applied");
    expect(bank.get(SOURCE)?.balance).toBe(0);
  });

  it("should reject a transfer one cent over the source balance and leave balances unchanged", () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(SOURCE, DESTINATION, 50001));

    expect(result.status).toBe("rejected");
    expect(bank.get(SOURCE)?.balance).toBe(50000);
    expect(bank.get(DESTINATION)?.balance).toBe(0);
  });

  it("should reject a transfer from an unknown source account", () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(UNKNOWN, DESTINATION, 100));

    expect(result.status).toBe("rejected");
    expect(bank.get(DESTINATION)?.balance).toBe(0);
  });

  it("should reject a transfer to an unknown destination account and leave the source unchanged", () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(SOURCE, UNKNOWN, 100));

    expect(result.status).toBe("rejected");
    expect(bank.get(SOURCE)?.balance).toBe(50000);
  });

  it("should include a reason on a rejected transfer", () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(SOURCE, DESTINATION, 50001));

    expect(result).toMatchObject({ status: "rejected", reason: expect.any(String) });
  });
});
