import type { Cents } from "../utils/money";

export class Transfer {
  constructor(
    readonly from: string,
    readonly to: string,
    readonly amount: Cents,
  ) {}
}
