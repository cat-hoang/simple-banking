import { readFileSync } from 'node:fs';
import { parseCsv } from '../utils/csv';
import { parseMoney } from '../utils/money';
import { Account } from '../models/account';
import { Bank } from '../models/bank';
import { Transfer } from '../models/transfer';

const ACCOUNT_NUMBER_PATTERN = /^\d{16}$/;

export function loadBalances(filePath: string): Bank {
  const rows = parseCsv(readFileSync(filePath, 'utf-8'));
  return new Bank(rows.map(toAccount));
}

export function loadTransfers(filePath: string): Transfer[] {
  const rows = parseCsv(readFileSync(filePath, 'utf-8'));
  return rows.map(toTransfer);
}

function toAccount(row: string[], index: number): Account {
  const line = index + 1;

  if (row.length !== 2) {
    throw new Error(
      `Line ${line}: expected "account,balance" but got ${row.length} field(s)`,
    );
  }

  const [number, balance] = row as [string, string];

  if (!ACCOUNT_NUMBER_PATTERN.test(number)) {
    throw new Error(`Line ${line}: invalid account number "${number}"`);
  }

  return new Account(number, parseMoney(balance));
}

function toTransfer(row: string[], index: number): Transfer {
  const line = index + 1;

  if (row.length !== 3) {
    throw new Error(
      `Line ${line}: expected "from,to,amount" but got ${row.length} field(s)`,
    );
  }

  const [from, to, amount] = row as [string, string, string];

  if (!ACCOUNT_NUMBER_PATTERN.test(from)) {
    throw new Error(`Line ${line}: invalid source account "${from}"`);
  }
  if (!ACCOUNT_NUMBER_PATTERN.test(to)) {
    throw new Error(`Line ${line}: invalid destination account "${to}"`);
  }

  return new Transfer(from, to, parseMoney(amount));
}
