// ponytail: /maintenance until app goes live; set NEXT_PUBLIC_APP_URL
export const PRIMARY_CTA_HREF = process.env.NEXT_PUBLIC_APP_URL ?? "/maintenance";
export const SEARCH_HREF = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/search` : "/maintenance";

export function ctaHref(source: string, extra?: Record<string, string | number>) {
  const params = new URLSearchParams({
    source,
    ...Object.fromEntries(
      Object.entries(extra ?? {}).map(([k, v]) => [k, String(v)])
    ),
  });
  return `${PRIMARY_CTA_HREF}?${params.toString()}`;
}
