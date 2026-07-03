import { describe, it, expect } from "vitest";
import { Bank } from "../../src/models/bank";
import { Account } from "../../src/models/account";

describe("Bank", () => {
  it("should looks up an account it holds by number", () => {
    const account = new Account("1111234522226789", 500000);
    const bank = new Bank([account]);

    expect(bank.get("1111234522226789")).toBe(account);
  });

  it("should returns undefined for an unknown account", () => {
    const bank = new Bank();

    expect(bank.get("0000000000000000")).toBeUndefined();
  });

  it("should reports whether an account is present", () => {
    const bank = new Bank([new Account("1111234522226789", 500000)]);

    expect(bank.has("1111234522226789")).toBe(true);
    expect(bank.has("0000000000000000")).toBe(false);
  });

  it("should exposes all held accounts", () => {
    const accounts = [
      new Account("1111234522226789", 500000),
      new Account("2222123433331212", 55000),
    ];
    const bank = new Bank(accounts);

    expect(bank.accounts()).toEqual(accounts);
  });

  it("should rejects a duplicate account number", () => {
    const bank = new Bank([new Account("1111234522226789", 500000)]);

    expect(() => bank.add(new Account("1111234522226789", 100))).toThrow();
  });
});
