/**
 * Formats a large number into a compact human-readable string.
 *
 * Examples:
 *   47_100_000  → "47.10M"
 *   6_410_000_000 → "6.41B"
 *   850_000  → "850.00K"
 *   500 → "500"
 */
export function formatCompact(
  value: number | null | undefined,
  locale: "en" | "vi" = "en",
): string {
  if (value == null || !Number.isFinite(value)) return "-";

  const abs = Math.abs(value);
  const suffixes =
    locale === "vi"
      ? { billion: "T", million: "Tr", thousand: "K" }
      : { billion: "B", million: "M", thousand: "K" };

  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}${suffixes.billion}`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}${suffixes.million}`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(2)}${suffixes.thousand}`;
  return value.toLocaleString();
}
