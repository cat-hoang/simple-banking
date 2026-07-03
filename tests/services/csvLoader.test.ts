import { describe, it, expect } from "vitest";
import { fileURLToPath } from "node:url";
import { loadBalances } from "../../src/services/csvLoader";

const fixture = (name: string) =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

describe("loadBalances", () => {
  it("loads accounts with balances as exact cents", () => {
    const bank = loadBalances(fixture("balances_valid.csv"));

    expect(bank.get("1111234522226789")?.balance).toBe(500000);
    expect(bank.get("2222123433331212")?.balance).toBe(55000);
  });

  it("ignores blank lines and surrounding whitespace", () => {
    const bank = loadBalances(fixture("balances_with_blanks.csv"));

    expect(bank.accounts()).toHaveLength(2);
    expect(bank.get("2222123433331212")?.balance).toBe(55000);
  });

  it("rejects a row with the wrong number of columns", () => {
    expect(() => loadBalances(fixture("balances_wrong_columns.csv"))).toThrow();
  });

  it("rejects a row with an unparseable balance", () => {
    expect(() => loadBalances(fixture("balances_bad_amount.csv"))).toThrow();
  });

  it("rejects a malformed account number", () => {
    expect(() => loadBalances(fixture("balances_bad_account.csv"))).toThrow();
  });

  it("rejects a duplicate account number", () => {
    expect(() => loadBalances(fixture("balances_duplicate.csv"))).toThrow();
  });
});
