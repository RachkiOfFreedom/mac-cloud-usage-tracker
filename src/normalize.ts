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
  // Strict ISO 8601 validation with timezone requirement
  const iso8601Regex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/;
  
  const match = isoValue.match(iso8601Regex);
  if (!match) {
    throw new Error(`Invalid startIso timestamp: ${isoValue}`);
  }

  const [, year, month, day, hour, minute, second] = match;
  
  // Validate date component ranges
  const yearNum = parseInt(year!, 10);
  const monthNum = parseInt(month!, 10);
  const dayNum = parseInt(day!, 10);
  const hourNum = parseInt(hour!, 10);
  const minuteNum = parseInt(minute!, 10);
  const secondNum = parseInt(second!, 10);
  
  // Check basic ranges
  if (monthNum < 1 || monthNum > 12) {
    throw new Error(`Invalid startIso timestamp: ${isoValue}`);
  }
  if (dayNum < 1 || dayNum > 31) {
    throw new Error(`Invalid startIso timestamp: ${isoValue}`);
  }
  if (hourNum < 0 || hourNum > 23) {
    throw new Error(`Invalid startIso timestamp: ${isoValue}`);
  }
  if (minuteNum < 0 || minuteNum > 59) {
    throw new Error(`Invalid startIso timestamp: ${isoValue}`);
  }
  if (secondNum < 0 || secondNum > 59) {
    throw new Error(`Invalid startIso timestamp: ${isoValue}`);
  }
  
  // Validate day is valid for the given month/year
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  if (dayNum > daysInMonth) {
    throw new Error(`Invalid startIso timestamp: ${isoValue}`);
  }

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
