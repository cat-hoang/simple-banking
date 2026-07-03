import { describe, it, expect } from "vitest";
import { parseCsv } from "../../src/utils/csv";

describe("parseCsv", () => {
  it("splits rows into trimmed fields", () => {
    expect(parseCsv("a,b,c")).toEqual([["a", "b", "c"]]);
  });

  it("parses multiple rows", () => {
    expect(parseCsv("a,b\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("trims whitespace around fields", () => {
    expect(parseCsv("  a , b  ")).toEqual([["a", "b"]]);
  });

  it("skips blank lines", () => {
    expect(parseCsv("a,b\n\n\nc,d\n")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("handles Windows line endings", () => {
    expect(parseCsv("a,b\r\nc,d")).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
  });

  it("returns nothing for empty content", () => {
    expect(parseCsv("")).toEqual([]);
    expect(parseCsv("\n  \n")).toEqual([]);
  });
});
