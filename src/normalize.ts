/**
 * Parses a strict ISO 8601 timestamp string and returns a UTC Date.
 * Requires format: YYYY-MM-DDTHH:mm:ssZ or YYYY-MM-DDTHH:mm:ss±HH:mm
 * Throws on invalid input.
 */
export function parseIsoDate(value: string): Date {
  const iso8601 =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/;
  const m = iso8601.exec(value);
  if (!m) {
    throw new Error(`Invalid ISO 8601 timestamp: "${value}"`);
  }

  const year = parseInt(m[1], 10);
  const month = parseInt(m[2], 10);
  const day = parseInt(m[3], 10);
  const hour = parseInt(m[4], 10);
  const minute = parseInt(m[5], 10);
  const second = parseInt(m[6], 10);

  if (month < 1 || month > 12) {
    throw new Error(`Invalid month ${month} in timestamp: "${value}"`);
  }
  if (day < 1 || day > 31) {
    throw new Error(`Invalid day ${day} in timestamp: "${value}"`);
  }
  if (hour > 23) {
    throw new Error(`Invalid hour ${hour} in timestamp: "${value}"`);
  }
  if (minute > 59) {
    throw new Error(`Invalid minute ${minute} in timestamp: "${value}"`);
  }
  if (second > 59) {
    throw new Error(`Invalid second ${second} in timestamp: "${value}"`);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    throw new Error(
      `Invalid day ${day} for month ${month} in timestamp: "${value}"`
    );
  }

  const parsed = Date.parse(value);
  if (isNaN(parsed)) {
    throw new Error(`Could not parse timestamp: "${value}"`);
  }

  return new Date(parsed);
}
