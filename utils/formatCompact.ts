/**
 * Formats a large number into a compact human-readable string.
 *
 * Examples:
 *   47_100_000  → "47.10M"
 *   6_410_000_000 → "6.41B"
 *   850_000  → "850.00K"
 *   500 → "500"
 */
export function formatCompact(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";

  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
  return value.toLocaleString();
}
