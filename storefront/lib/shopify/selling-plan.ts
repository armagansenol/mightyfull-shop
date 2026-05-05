/**
 * Normalize a Shopify selling plan name to "Delivery every N month(s)".
 * Handles names like "Deliver every month, 10% off",
 * "Delivery Interval Every 3 Months", "Every 1 Month", etc.
 */
export function formatSellingPlanName(name: string): string {
  if (!name) return name;

  const match = name.match(/every\s+(\d+)?\s*months?/i);
  if (!match) return name;

  const num = match[1];
  if (!num || num === '1') return 'Delivery every month';
  return `Delivery every ${num} months`;
}
