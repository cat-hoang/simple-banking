import { Account } from "./account";

export class Bank {
  private readonly accountsByNumber = new Map<string, Account>();

  constructor(accounts: Account[] = []) {
    for (const account of accounts) {
      this.add(account);
    }
  }

  add(account: Account): void {
    if (this.accountsByNumber.has(account.number)) {
      throw new Error(`Duplicate account: ${account.number}`);
    }
    this.accountsByNumber.set(account.number, account);
  }

  get(accountNumber: string): Account | undefined {
    return this.accountsByNumber.get(accountNumber);
  }

  has(accountNumber: string): boolean {
    return this.accountsByNumber.has(accountNumber);
  }

  accounts(): Account[] {
    return [...this.accountsByNumber.values()];
  }
}
