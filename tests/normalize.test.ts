import { describe, expect, it } from "vitest";

import { normalizeUsageRecord } from "../src/normalize.js";

describe("normalizeUsageRecord", () => {
  it("normalizes valid records and derives hours", () => {
    const normalized = normalizeUsageRecord({
      accountId: " 123456789012 ",
      instanceFamily: "mac2.metal",
      region: " us-east-1 ",
      usageMinutes: 90,
      startIso: "2025-01-01T10:00:00-05:00"
    });

    expect(normalized).toEqual({
      accountId: "123456789012",
      instanceFamily: "mac2.metal",
      region: "us-east-1",
      usageMinutes: 90,
      startIso: "2025-01-01T15:00:00.000Z",
      usageHours: 1.5
    });
  });

  it("rounds floating minute values deterministically", () => {
    const normalized = normalizeUsageRecord({
      accountId: "acct",
      instanceFamily: "mac1.metal",
      region: "us-west-2",
      usageMinutes: 10 / 3,
      startIso: "2025-02-03T04:05:06Z"
    });

    expect(normalized.usageMinutes).toBe(3.333);
    expect(normalized.usageHours).toBe(0.056);
  });

  it("rejects unsupported instance families", () => {
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "m7i.large",
        region: "us-west-2",
        usageMinutes: 1,
        startIso: "2025-02-03T04:05:06Z"
      })
    ).toThrow("Unsupported instance family");
  });

  it("rejects invalid usage minutes", () => {
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: Number.NaN,
        startIso: "2025-02-03T04:05:06Z"
      })
    ).toThrow("usageMinutes must be finite");

    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: -1,
        startIso: "2025-02-03T04:05:06Z"
      })
    ).toThrow("usageMinutes must be >= 0");
  });

  it("rejects invalid timestamps", () => {
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: 1,
        startIso: "not-a-date"
      })
    ).toThrow("Invalid startIso timestamp");
  });

  it("rejects malformed dates that would be silently coerced", () => {
    // February 30th doesn't exist
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: 1,
        startIso: "2025-02-30T00:00:00Z"
      })
    ).toThrow("Invalid startIso timestamp");

    // February 29th in non-leap year
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: 1,
        startIso: "2025-02-29T00:00:00Z"
      })
    ).toThrow("Invalid startIso timestamp");

    // April only has 30 days
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: 1,
        startIso: "2025-04-31T00:00:00Z"
      })
    ).toThrow("Invalid startIso timestamp");

    // Month 13 doesn't exist
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: 1,
        startIso: "2025-13-01T00:00:00Z"
      })
    ).toThrow("Invalid startIso timestamp");

    // Day 0 is invalid
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: 1,
        startIso: "2025-01-00T00:00:00Z"
      })
    ).toThrow("Invalid startIso timestamp");
  });

  it("accepts leap year February 29th", () => {
    const normalized = normalizeUsageRecord({
      accountId: "acct",
      instanceFamily: "mac1.metal",
      region: "us-west-2",
      usageMinutes: 1,
      startIso: "2024-02-29T00:00:00Z"
    });

    expect(normalized.startIso).toBe("2024-02-29T00:00:00.000Z");
  });

  it("requires timezone information", () => {
    // Missing timezone should be rejected
    expect(() =>
      normalizeUsageRecord({
        accountId: "acct",
        instanceFamily: "mac1.metal",
        region: "us-west-2",
        usageMinutes: 1,
        startIso: "2025-01-15T00:00:00"
      })
    ).toThrow("Invalid startIso timestamp");
  });
});
