import { Bank } from '../models/bank';
import { Account } from '../models/account';
import { formatMoney } from '../utils/money';
import { TransferResult } from './transferService';

type Applied = Extract<TransferResult, { status: 'applied' }>;
type Rejected = Extract<TransferResult, { status: 'rejected' }>;

export function formatReport(bank: Bank, results: TransferResult[]): string {
  const applied = results.filter(isApplied);
  const rejected = results.filter(isRejected);

  const sections = [
    `Transfers: ${applied.length} applied, ${rejected.length} rejected`,
    section('Applied', applied.map(formatApplied)),
  ];

  if (rejected.length > 0) {
    sections.push(section('Rejected', rejected.map(formatRejected)));
  }

  sections.push(formatBalances(bank, 'Final balances'));

  return sections.join('\n\n');
}

export function formatBalances(bank: Bank, title: string): string {
  return section(title, bank.accounts().map(formatBalance));
}

function isApplied(result: TransferResult): result is Applied {
  return result.status === 'applied';
}

function isRejected(result: TransferResult): result is Rejected {
  return result.status === 'rejected';
}

function formatApplied({ transfer }: Applied): string {
  return `  ${transfer.from} -> ${transfer.to}: ${formatMoney(transfer.amount)}`;
}

function formatRejected({ transfer, reason }: Rejected): string {
  return `  ${transfer.from} -> ${transfer.to}: ${formatMoney(transfer.amount)} (${reason})`;
}

function formatBalance(account: Account): string {
  return `  ${account.number}: ${formatMoney(account.balance)}`;
}

function section(title: string, lines: string[]): string {
  const body = lines.length > 0 ? lines.join('\n') : '  (none)';
  return `${title}:\n${body}`;
}
