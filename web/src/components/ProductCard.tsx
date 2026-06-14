import Link from "next/link";
import type { Category, Product } from "@prisma/client";
import { formatPrice } from "@/lib/catalog";
import { productImage } from "@/lib/affiliate";
import { StarRating } from "@/components/StarRating";
import { BuyButton } from "@/components/BuyButton";

type CardProduct = Product & { category: Category };

/** A designed placeholder so cards never look broken when an image is missing. */
function ImageFallback({ product }: { product: CardProduct }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-surface-2 to-surface px-3 text-center">
      <span className="text-4xl opacity-80">{product.category.emoji ?? "🍪"}</span>
      <span className="text-sm font-semibold text-foreground/80">
        {product.brand}
      </span>
    </div>
  );
}

export function ProductCard({ product }: { product: CardProduct }) {
  const image = productImage(product);

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition duration-200 hover:-translate-y-1 hover:border-teal/50 hover:shadow-lg hover:shadow-black/30">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-white"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={product.name}
            className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <ImageFallback product={product} />
        )}

        {product.dupeOf ? (
          <span className="absolute left-2 top-2 rounded-full bg-teal px-2.5 py-1 text-[11px] font-bold text-background shadow">
            Dupe for {product.dupeOf}
          </span>
        ) : null}

        {product.glutenFreeCertified ? (
          <span className="absolute right-2 top-2 rounded-full bg-success/95 px-2 py-1 text-[10px] font-bold text-background shadow">
            ✓ GF Certified
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <div className="text-[11px] font-bold uppercase tracking-wide text-teal">
          {product.brand}
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition group-hover:text-teal"
        >
          {product.name}
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-extrabold text-foreground">
            {formatPrice(product.price)}
          </span>
          <BuyButton asin={product.asin} amazonUrl={product.amazonUrl} size="sm" />
        </div>
      </div>
    </div>
  );
}
