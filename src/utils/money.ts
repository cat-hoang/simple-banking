// Money is stored as integer cents: floats can't represent values like 320.50
// exactly, which would corrupt balances and the below-$0 comparison.

export type Cents = number;

const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export function parseMoney(input: string): Cents {
  const trimmed = input.trim();

  if (!MONEY_PATTERN.test(trimmed)) {
    throw new Error(`Invalid money value: "${input}"`);
  }

  const [dollars, fraction = ""] = trimmed.split(".");
  const cents = fraction.padEnd(2, "0");

  return Number(dollars) * 100 + Number(cents);
}

export function formatMoney(cents: Cents): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`Cents must be an integer, got: ${cents}`);
  }

  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = abs % 100;

  return `${sign}${dollars}.${remainder.toString().padStart(2, "0")}`;
}
