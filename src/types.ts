export type InstanceFamily = "mac1.metal" | "mac2.metal" | "mac2-m1ultra.metal";

export interface RawUsageRecord {
  readonly accountId: string;
  readonly instanceFamily: string;
  readonly region: string;
  readonly usageMinutes: number;
  readonly startIso: string;
}

export interface UsageRecord {
  readonly accountId: string;
  readonly instanceFamily: InstanceFamily;
  readonly region: string;
  readonly usageMinutes: number;
  readonly startIso: string;
  readonly usageHours: number;
}
