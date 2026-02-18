import { RawUsageRecord, UsageRecord, InstanceFamily } from "./types.js";

const SUPPORTED_INSTANCE_FAMILIES: ReadonlySet<InstanceFamily> = new Set([
  "mac1.metal",
  "mac2.metal",
  "mac2-m1ultra.metal"
]);

const MINUTES_PER_HOUR = 60;
const ROUNDING_PRECISION = 1000;

const isSupportedInstanceFamily = (value: string): value is InstanceFamily =>
  SUPPORTED_INSTANCE_FAMILIES.has(value as InstanceFamily);

const parseIsoDate = (isoValue: string): string => {
  const parsed = Date.parse(isoValue);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid startIso timestamp: ${isoValue}`);
  }
  return new Date(parsed).toISOString();
};

const normalizeMinutes = (minutes: number): number => {
  if (!Number.isFinite(minutes)) {
    throw new Error(`usageMinutes must be finite: ${minutes}`);
  }

  if (minutes < 0) {
    throw new Error(`usageMinutes must be >= 0: ${minutes}`);
  }

  return Math.round(minutes * ROUNDING_PRECISION) / ROUNDING_PRECISION;
};

export const normalizeUsageRecord = (raw: RawUsageRecord): UsageRecord => {
  if (raw.accountId.trim().length === 0) {
    throw new Error("accountId cannot be empty");
  }

  if (raw.region.trim().length === 0) {
    throw new Error("region cannot be empty");
  }

  if (!isSupportedInstanceFamily(raw.instanceFamily)) {
    throw new Error(`Unsupported instance family: ${raw.instanceFamily}`);
  }

  const usageMinutes = normalizeMinutes(raw.usageMinutes);

  return {
    accountId: raw.accountId.trim(),
    instanceFamily: raw.instanceFamily,
    region: raw.region.trim(),
    usageMinutes,
    startIso: parseIsoDate(raw.startIso),
    usageHours: Math.round((usageMinutes / MINUTES_PER_HOUR) * ROUNDING_PRECISION) / ROUNDING_PRECISION
  };
};
