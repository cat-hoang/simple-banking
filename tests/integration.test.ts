import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadBalances, loadTransfers } from '../src/services/csvLoader';
import { applyTransfers } from '../src/services/transferService';

const sample = (name: string) =>
  fileURLToPath(new URL(`../sample_files/${name}`, import.meta.url));

describe('end-to-end day processing', () => {
  it("should apply the sample day's transfers and produce the expected balances", () => {
    const bank = loadBalances(sample('mable_account_balances.csv'));
    const transfers = loadTransfers(sample('mable_transactions.csv'));

    const results = applyTransfers(bank, transfers);

    expect(results.every((r) => r.status === 'applied')).toBe(true);
    expect(bank.get('1111234522226789')?.balance).toBe(482050); // 5000.00 - 500.00 + 320.50
    expect(bank.get('1111234522221234')?.balance).toBe(997440); // 10000.00 - 25.60
    expect(bank.get('2222123433331212')?.balance).toBe(155000); // 550.00 + 1000.00
    expect(bank.get('1212343433335665')?.balance).toBe(172560); // 1200.00 + 500.00 + 25.60
    expect(bank.get('3212343433335755')?.balance).toBe(4867950); // 50000.00 - 1000.00 - 320.50
  });
});
