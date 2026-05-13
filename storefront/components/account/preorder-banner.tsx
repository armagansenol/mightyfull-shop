import { AlertTriangle } from 'lucide-react';

interface PreorderLine {
  title: string;
  variantTitle: string | null;
  shipDate?: string | null;
}

interface PreorderBannerProps {
  lines: PreorderLine[];
}

const PREORDER_PATTERN = /pre[\s-]?order|preorder|coming\s*soon/i;
const SHIP_DATE_PATTERN =
  /ships?\s*(?:on|by|in)?\s*([A-Za-z]+\s+\d{1,2}(?:,?\s*\d{4})?|\d{1,2}\/\d{1,2}\/\d{2,4})/i;

function extractShipDate(text: string): string | null {
  const match = text.match(SHIP_DATE_PATTERN);
  return match ? match[1] : null;
}

export function detectPreorderLines(
  lines: Array<{ title: string; variantTitle: string | null }>
): PreorderLine[] {
  return lines
    .filter((line) => {
      const haystack = `${line.title} ${line.variantTitle ?? ''}`;
      return PREORDER_PATTERN.test(haystack);
    })
    .map((line) => {
      const haystack = `${line.title} ${line.variantTitle ?? ''}`;
      return {
        title: line.title,
        variantTitle: line.variantTitle,
        shipDate: extractShipDate(haystack)
      };
    });
}

export function PreorderBanner({ lines }: PreorderBannerProps) {
  if (lines.length === 0) return null;

  const withDates = lines.filter((l) => l.shipDate);
  const sharedDate =
    withDates.length > 0 &&
    withDates.every((l) => l.shipDate === withDates[0].shipDate)
      ? withDates[0].shipDate
      : null;

  return (
    <section
      aria-label="Pre-order notice"
      className="rounded-2xl border border-amber-400/60 bg-amber-50 text-amber-950 p-5 md:p-6 flex items-start gap-4"
    >
      <span
        aria-hidden="true"
        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-200/70 text-amber-900"
      >
        <AlertTriangle className="w-5 h-5" strokeWidth={1.75} />
      </span>
      <div className="flex flex-col gap-2 min-w-0">
        <p className="font-bomstad-display text-lg md:text-xl font-bold leading-tight">
          {lines.length === 1
            ? 'This item is a pre-order'
            : 'Pre-order items in this subscription'}
        </p>
        {sharedDate ? (
          <p className="text-sm md:text-base">
            Expected to ship around{' '}
            <span className="font-semibold">{sharedDate}</span>.
          </p>
        ) : (
          <p className="text-sm md:text-base">
            Your subscription will ship as soon as stock is available.
          </p>
        )}
        {lines.length > 1 && (
          <ul className="text-sm list-disc list-inside marker:text-amber-900/60 mt-1">
            {lines.map((line, idx) => (
              <li key={idx}>
                {line.title}
                {line.variantTitle ? ` — ${line.variantTitle}` : ''}
                {line.shipDate ? ` (ships ${line.shipDate})` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
