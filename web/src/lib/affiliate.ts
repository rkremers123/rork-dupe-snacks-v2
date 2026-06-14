// Builds Amazon links that carry the DupeSnacks affiliate tag so every
// outbound click is attributed to the Associates account, and derives a
// product image from an ASIN when no explicit image is set.

const AFFILIATE_TAG =
  process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG?.trim() || "dupesnacks-20";

type AmazonRef = {
  asin?: string | null;
  amazonUrl?: string | null;
};

const ASIN_RE = /^[A-Z0-9]{10}$/;

/**
 * Pulls a 10-character ASIN out of an Amazon product URL.
 * Handles /dp/<ASIN>, /gp/product/<ASIN>, /gp/aw/d/<ASIN>, and ?asin=<ASIN>.
 * Returns null for search URLs or anything without a recognizable ASIN.
 */
export function extractAsin(input?: string | null): string | null {
  if (!input) return null;
  const value = input.trim().toUpperCase();
  if (ASIN_RE.test(value)) return value;
  const patterns = [
    /\/DP\/([A-Z0-9]{10})/,
    /\/GP\/PRODUCT\/([A-Z0-9]{10})/,
    /\/GP\/AW\/D\/([A-Z0-9]{10})/,
    /\/PRODUCT\/([A-Z0-9]{10})/,
    /[?&]ASIN=([A-Z0-9]{10})/,
  ];
  for (const re of patterns) {
    const m = value.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Returns a clean, tagged Amazon URL that points at the EXACT product whenever
 * possible (so a celiac shopper never lands on a search page and risks buying
 * the wrong, gluten-containing item). Prefers a canonical /dp/<ASIN> link.
 */
export function amazonAffiliateUrl({ asin, amazonUrl }: AmazonRef): string {
  const resolvedAsin = extractAsin(asin) ?? extractAsin(amazonUrl);
  if (resolvedAsin) {
    return `https://www.amazon.com/dp/${resolvedAsin}?tag=${AFFILIATE_TAG}`;
  }

  if (amazonUrl && amazonUrl.trim()) {
    try {
      const url = new URL(amazonUrl.trim());
      url.searchParams.set("tag", AFFILIATE_TAG);
      return url.toString();
    } catch {
      // Not a fully-qualified URL — fall through to a search link.
    }
  }

  // Last resort: a tagged Amazon search so the link is never dead.
  return `https://www.amazon.com/s?k=gluten+free&tag=${AFFILIATE_TAG}`;
}

/** Whether this product links to an exact product page (vs. a fallback search). */
export function hasExactProductLink({ asin, amazonUrl }: AmazonRef): boolean {
  return Boolean(extractAsin(asin) ?? extractAsin(amazonUrl));
}

/**
 * Best-effort product image straight from Amazon's image CDN using the ASIN.
 * Not every ASIN resolves to an image here (it's the unofficial CDN pattern),
 * so an explicitly-set imageUrl always wins. Real, reliable images come from
 * the Product Advertising API once the account qualifies.
 */
export function amazonImageFromAsin(asin?: string | null): string | null {
  const resolved = extractAsin(asin);
  if (!resolved) return null;
  return `https://m.media-amazon.com/images/P/${resolved}.01._SCLZZZZZZZ_.jpg`;
}

/** The image to display for a product: explicit URL first, then ASIN fallback. */
export function productImage({
  imageUrl,
  asin,
}: {
  imageUrl?: string | null;
  asin?: string | null;
}): string | null {
  if (imageUrl && imageUrl.trim()) return imageUrl.trim();
  return amazonImageFromAsin(asin);
}

export { AFFILIATE_TAG };
