import { describe, it, expect } from 'vitest';
import { parseMoney, formatMoney } from '../../src/utils/money';

describe('parseMoney', () => {
  it('should parses a whole-dollar amount into cents', () => {
    expect(parseMoney('5000')).toBe(500000);
  });

  it('should parses a two-decimal amount into cents', () => {
    expect(parseMoney('320.50')).toBe(32050);
  });

  it('should parses a single-decimal amount into cents', () => {
    expect(parseMoney('25.6')).toBe(2560);
  });

  it('should parses zero', () => {
    expect(parseMoney('0')).toBe(0);
    expect(parseMoney('0.00')).toBe(0);
  });

  it('should keeps 320.50 exact where a float would drift', () => {
    // 0.1 + 0.2 !== 0.3 in floats; integer cents must be exact.
    expect(parseMoney('0.10') + parseMoney('0.20')).toBe(parseMoney('0.30'));
  });

  it('should ignores surrounding whitespace', () => {
    expect(parseMoney('  1200.00  ')).toBe(120000);
  });

  it('should rejects an empty string', () => {
    expect(() => parseMoney('')).toThrow();
  });

  it('should rejects a non-numeric value', () => {
    expect(() => parseMoney('abc')).toThrow();
  });

  it('should rejects a negative amount', () => {
    expect(() => parseMoney('-5.00')).toThrow();
  });

  it('should rejects more than two decimal places', () => {
    expect(() => parseMoney('5.123')).toThrow();
  });

  it('should rejects a trailing decimal point', () => {
    expect(() => parseMoney('5.')).toThrow();
  });
});

describe('formatMoney', () => {
  it('should formats cents into a two-decimal dollar string', () => {
    expect(formatMoney(32050)).toBe('320.50');
  });

  it('should pads the fractional part to two digits', () => {
    expect(formatMoney(2560)).toBe('25.60');
    expect(formatMoney(500)).toBe('5.00');
  });

  it('should formats zero', () => {
    expect(formatMoney(0)).toBe('0.00');
  });

  it('should formats a negative balance', () => {
    expect(formatMoney(-150)).toBe('-1.50');
  });

  it('should rejects a non-integer cents value', () => {
    expect(() => formatMoney(10.5)).toThrow();
  });
});

describe('parseMoney and formatMoney', () => {
  it('should round-trip a value without loss', () => {
    for (const value of ['0.00', '5.00', '25.60', '320.50', '50000.00']) {
      expect(formatMoney(parseMoney(value))).toBe(value);
    }
  });
});
