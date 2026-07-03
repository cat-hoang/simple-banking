import type { Cents } from "../utils/money";

export class Account {
  constructor(
    readonly number: string,
    private balanceCents: Cents,
  ) {}

  get balance(): Cents {
    return this.balanceCents;
  }
}
