import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { loadBalances, loadTransfers } from '../../src/services/csvLoader';

const fixture = (name: string) =>
  fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));

describe('loadBalances', () => {
  it('should loads accounts with balances as exact cents', () => {
    const bank = loadBalances(fixture('balances_valid.csv'));

    expect(bank.get('1111234522226789')?.balance).toBe(500000);
    expect(bank.get('2222123433331212')?.balance).toBe(55000);
  });

  it('should ignores blank lines and surrounding whitespace', () => {
    const bank = loadBalances(fixture('balances_with_blanks.csv'));

    expect(bank.accounts()).toHaveLength(2);
    expect(bank.get('2222123433331212')?.balance).toBe(55000);
  });

  it('should rejects a row with the wrong number of columns', () => {
    expect(() => loadBalances(fixture('balances_wrong_columns.csv'))).toThrow();
  });

  it('should rejects a row with an unparseable balance', () => {
    expect(() => loadBalances(fixture('balances_bad_amount.csv'))).toThrow();
  });

  it('should rejects a malformed account number', () => {
    expect(() => loadBalances(fixture('balances_bad_account.csv'))).toThrow();
  });

  it('should rejects a duplicate account number', () => {
    expect(() => loadBalances(fixture('balances_duplicate.csv'))).toThrow();
  });
});

describe('loadTransfers', () => {
  it('should load transfers with amounts as exact cents', () => {
    const transfers = loadTransfers(fixture('transfers_valid.csv'));

    expect(transfers).toHaveLength(2);
    expect(transfers[0]).toMatchObject({
      from: '1111234522226789',
      to: '1212343433335665',
      amount: 50000,
    });
  });

  it('should reject a row with the wrong number of columns', () => {
    expect(() =>
      loadTransfers(fixture('transfers_wrong_columns.csv')),
    ).toThrow();
  });

  it('should reject a row with an unparseable amount', () => {
    expect(() => loadTransfers(fixture('transfers_bad_amount.csv'))).toThrow();
  });

  it('should reject a malformed account number', () => {
    expect(() => loadTransfers(fixture('transfers_bad_account.csv'))).toThrow();
  });
});
