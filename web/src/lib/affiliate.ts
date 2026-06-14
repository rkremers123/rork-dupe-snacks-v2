// Builds Amazon links that carry the DupeSnacks affiliate tag so every
// outbound click is attributed to the Associates account.

const AFFILIATE_TAG =
  process.env.NEXT_PUBLIC_AMAZON_AFFILIATE_TAG?.trim() || "dupesnacks-20";

type AmazonRef = {
  asin?: string | null;
  amazonUrl?: string | null;
};

/**
 * Returns a clean, tagged Amazon URL.
 * Prefers a canonical /dp/<ASIN> link when an ASIN is known, otherwise
 * appends the tag to the provided product URL. Designed so that when we
 * later add the Amazon Product Advertising API, only the data source
 * changes — every link still flows through here.
 */
export function amazonAffiliateUrl({ asin, amazonUrl }: AmazonRef): string {
  if (asin && asin.trim()) {
    return `https://www.amazon.com/dp/${asin.trim()}?tag=${AFFILIATE_TAG}`;
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

export { AFFILIATE_TAG };
