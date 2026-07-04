import { describe, it, expect } from 'vitest';
import { Account } from '../../src/models/account';

describe('Account', () => {
  it('should allow a debit up to the full balance', () => {
    const account = new Account('1111234522226789', 500000);

    expect(account.canDebit(500000)).toBe(true);
  });

  it('should refuse a debit one cent over the balance', () => {
    const account = new Account('1111234522226789', 500000);

    expect(account.canDebit(500001)).toBe(false);
  });

  it('should reduce the balance when debited', () => {
    const account = new Account('1111234522226789', 500000);

    account.debit(32050);

    expect(account.balance).toBe(467950);
  });

  it('should allow a debit that lands exactly on zero', () => {
    const account = new Account('1111234522226789', 500000);

    account.debit(500000);

    expect(account.balance).toBe(0);
  });

  it('should throw and leave the balance unchanged when debiting more than the balance', () => {
    const account = new Account('1111234522226789', 500000);

    expect(() => account.debit(500001)).toThrow();
    expect(account.balance).toBe(500000);
  });

  it('should increase the balance when credited', () => {
    const account = new Account('1111234522226789', 500000);

    account.credit(32050);

    expect(account.balance).toBe(532050);
  });
});
