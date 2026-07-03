import type { Cents } from "../utils/money";

export class Account {
  constructor(
    readonly number: string,
    private balanceCents: Cents,
  ) {}

  get balance(): Cents {
    return this.balanceCents;
  }

  canDebit(amount: Cents): boolean {
    return this.balanceCents >= amount;
  }

  debit(amount: Cents): void {
    if (!this.canDebit(amount)) {
      throw new Error(`Insufficient funds in ${this.number}`);
    }
    this.balanceCents -= amount;
  }

  credit(amount: Cents): void {
    this.balanceCents += amount;
  }
}
