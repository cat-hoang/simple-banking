import { Bank } from "../models/bank";
import { Transfer } from "../models/transfer";

export type TransferResult =
  | { status: "applied"; transfer: Transfer }
  | { status: "rejected"; transfer: Transfer; reason: string };

export function applyTransfers(bank: Bank, transfers: Transfer[]): TransferResult[] {
  return transfers.map((transfer) => applyTransfer(bank, transfer));
}

export function applyTransfer(bank: Bank, transfer: Transfer): TransferResult {
  const source = bank.get(transfer.from);
  if (!source) {
    return reject(transfer, `unknown source account ${transfer.from}`);
  }

  const destination = bank.get(transfer.to);
  if (!destination) {
    return reject(transfer, `unknown destination account ${transfer.to}`);
  }

  if (!source.canDebit(transfer.amount)) {
    return reject(transfer, `insufficient funds in ${transfer.from}`);
  }

  source.debit(transfer.amount);
  destination.credit(transfer.amount);
  return { status: "applied", transfer };
}

function reject(transfer: Transfer, reason: string): TransferResult {
  return { status: "rejected", transfer, reason };
}
