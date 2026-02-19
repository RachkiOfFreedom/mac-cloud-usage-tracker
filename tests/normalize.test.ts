import { describe, it, expect } from "vitest";
import { parseIsoDate } from "../src/normalize.js";

describe("parseIsoDate", () => {
  it("parses a valid UTC timestamp", () => {
    const d = parseIsoDate("2024-06-15T12:30:00Z");
    expect(d.toISOString()).toBe("2024-06-15T12:30:00.000Z");
  });

  it("parses a valid timestamp with positive offset", () => {
    const d = parseIsoDate("2024-06-15T14:30:00+02:00");
    expect(d.toISOString()).toBe("2024-06-15T12:30:00.000Z");
  });

  it("parses a valid timestamp with negative offset", () => {
    const d = parseIsoDate("2024-06-15T08:30:00-04:00");
    expect(d.toISOString()).toBe("2024-06-15T12:30:00.000Z");
  });

  it("throws on missing timezone", () => {
    expect(() => parseIsoDate("2024-06-15T12:30:00")).toThrow(
      'Invalid ISO 8601 timestamp: "2024-06-15T12:30:00"'
    );
  });

  it("throws on invalid month", () => {
    expect(() => parseIsoDate("2024-13-01T00:00:00Z")).toThrow(
      "Invalid month 13"
    );
  });

  it("throws on invalid day", () => {
    expect(() => parseIsoDate("2024-06-32T00:00:00Z")).toThrow("Invalid day 32");
  });

  it("throws on day out of range for month", () => {
    expect(() => parseIsoDate("2024-02-30T00:00:00Z")).toThrow(
      "Invalid day 30 for month 2"
    );
  });

  it("throws on invalid hour", () => {
    expect(() => parseIsoDate("2024-06-15T25:00:00Z")).toThrow(
      "Invalid hour 25"
    );
  });

  it("throws on invalid minute", () => {
    expect(() => parseIsoDate("2024-06-15T12:60:00Z")).toThrow(
      "Invalid minute 60"
    );
  });

  it("throws on invalid second", () => {
    expect(() => parseIsoDate("2024-06-15T12:30:61Z")).toThrow(
      "Invalid second 61"
    );
  });

  it("throws on completely invalid input", () => {
    expect(() => parseIsoDate("not-a-date")).toThrow(
      'Invalid ISO 8601 timestamp: "not-a-date"'
    );
  });

  it("handles leap year correctly", () => {
    const d = parseIsoDate("2024-02-29T00:00:00Z");
    expect(d.toISOString()).toBe("2024-02-29T00:00:00.000Z");
  });

  it("throws on Feb 29 in non-leap year", () => {
    expect(() => parseIsoDate("2023-02-29T00:00:00Z")).toThrow(
      "Invalid day 29 for month 2"
    );
  });
});
