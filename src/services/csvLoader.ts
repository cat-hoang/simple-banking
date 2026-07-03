import { readFileSync } from "node:fs";
import { parseCsv } from "../utils/csv";
import { parseMoney } from "../utils/money";
import { Account } from "../models/account";
import { Bank } from "../models/bank";

const ACCOUNT_NUMBER_PATTERN = /^\d{16}$/;

export function loadBalances(filePath: string): Bank {
  const rows = parseCsv(readFileSync(filePath, "utf-8"));
  return new Bank(rows.map(toAccount));
}

function toAccount(row: string[], index: number): Account {
  const line = index + 1;

  if (row.length !== 2) {
    throw new Error(`Line ${line}: expected "account,balance" but got ${row.length} field(s)`);
  }

  const [number, balance] = row as [string, string];

  if (!ACCOUNT_NUMBER_PATTERN.test(number)) {
    throw new Error(`Line ${line}: invalid account number "${number}"`);
  }

  return new Account(number, parseMoney(balance));
}
