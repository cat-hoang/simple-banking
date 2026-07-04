import { describe, it, expect } from 'vitest';
import {
  applyTransfer,
  applyTransfers,
} from '../../src/services/transferService';
import { Bank } from '../../src/models/bank';
import { Account } from '../../src/models/account';
import { Transfer } from '../../src/models/transfer';

const SOURCE = '1111234522226789';
const DESTINATION = '1212343433335665';
const UNKNOWN = '0000000000000000';

function bankWith(sourceBalance: number, destinationBalance: number): Bank {
  return new Bank([
    new Account(SOURCE, sourceBalance),
    new Account(DESTINATION, destinationBalance),
  ]);
}

describe('applyTransfer', () => {
  it('should move funds from source to destination on a valid transfer', () => {
    const bank = bankWith(500000, 120000);

    const result = applyTransfer(
      bank,
      new Transfer(SOURCE, DESTINATION, 50000),
    );

    expect(result.status).toBe('applied');
    expect(bank.get(SOURCE)?.balance).toBe(450000);
    expect(bank.get(DESTINATION)?.balance).toBe(170000);
  });

  it('should allow a transfer that empties the source account', () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(
      bank,
      new Transfer(SOURCE, DESTINATION, 50000),
    );

    expect(result.status).toBe('applied');
    expect(bank.get(SOURCE)?.balance).toBe(0);
  });

  it('should reject a transfer one cent over the source balance and leave balances unchanged', () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(
      bank,
      new Transfer(SOURCE, DESTINATION, 50001),
    );

    expect(result.status).toBe('rejected');
    expect(bank.get(SOURCE)?.balance).toBe(50000);
    expect(bank.get(DESTINATION)?.balance).toBe(0);
  });

  it('should reject a transfer from an unknown source account', () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(UNKNOWN, DESTINATION, 100));

    expect(result.status).toBe('rejected');
    expect(bank.get(DESTINATION)?.balance).toBe(0);
  });

  it('should reject a transfer to an unknown destination account and leave the source unchanged', () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(SOURCE, UNKNOWN, 100));

    expect(result.status).toBe('rejected');
    expect(bank.get(SOURCE)?.balance).toBe(50000);
  });

  it('should reject a transfer to the same account and leave the balance unchanged', () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(SOURCE, SOURCE, 100));

    expect(result.status).toBe('rejected');
    expect(bank.get(SOURCE)?.balance).toBe(50000);
  });

  it('should reject a zero-amount transfer and leave balances unchanged', () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(bank, new Transfer(SOURCE, DESTINATION, 0));

    expect(result.status).toBe('rejected');
    expect(bank.get(SOURCE)?.balance).toBe(50000);
    expect(bank.get(DESTINATION)?.balance).toBe(0);
  });

  it('should include a reason on a rejected transfer', () => {
    const bank = bankWith(50000, 0);

    const result = applyTransfer(
      bank,
      new Transfer(SOURCE, DESTINATION, 50001),
    );

    expect(result).toMatchObject({
      status: 'rejected',
      reason: expect.any(String),
    });
  });
});

describe('applyTransfers', () => {
  const A = '1111111111111111';
  const B = '2222222222222222';
  const C = '3333333333333333';

  function threeAccountBank(): Bank {
    return new Bank([
      new Account(A, 50000),
      new Account(B, 0),
      new Account(C, 20000),
    ]);
  }

  it('should return one result per transfer, in order', () => {
    const bank = threeAccountBank();

    const results = applyTransfers(bank, [
      new Transfer(A, B, 10000),
      new Transfer(C, B, 5000),
    ]);

    expect(results.map((r) => r.status)).toEqual(['applied', 'applied']);
  });

  it('should apply transfers cumulatively against the running balance', () => {
    const bank = threeAccountBank();

    applyTransfers(bank, [
      new Transfer(A, B, 30000),
      new Transfer(A, B, 30000),
    ]);

    // First debit leaves 20000; the second (30000) can no longer be afforded.
    expect(bank.get(A)?.balance).toBe(20000);
    expect(bank.get(B)?.balance).toBe(30000);
  });

  it('should skip a rejected transfer and still apply the ones after it', () => {
    const bank = threeAccountBank();

    const results = applyTransfers(bank, [
      new Transfer(A, B, 99999), // rejected: insufficient funds
      new Transfer(C, B, 5000), // still applied
    ]);

    expect(results[0]?.status).toBe('rejected');
    expect(results[1]?.status).toBe('applied');
    expect(bank.get(A)?.balance).toBe(50000); // untouched by the rejection
    expect(bank.get(B)?.balance).toBe(5000); // only C's transfer landed
    expect(bank.get(C)?.balance).toBe(15000);
  });

  it('should return an empty result set for no transfers', () => {
    expect(applyTransfers(threeAccountBank(), [])).toEqual([]);
  });
});
