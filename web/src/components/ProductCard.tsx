import Link from "next/link";
import type { Category, Product } from "@prisma/client";
import { formatPrice } from "@/lib/catalog";
import { StarRating } from "@/components/StarRating";
import { BuyButton } from "@/components/BuyButton";

type CardProduct = Product & { category: Category };

export function ProductCard({ product }: { product: CardProduct }) {
  return (
    <div className="group flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:border-teal/50">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-surface-2"
      >
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🍪</div>
        )}
        {product.dupeOf ? (
          <span className="absolute left-2 top-2 rounded-full bg-teal px-2 py-0.5 text-[11px] font-bold text-background">
            Dupe for {product.dupeOf}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <div className="text-xs font-semibold uppercase tracking-wide text-teal">
          {product.brand}
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 font-semibold leading-snug text-foreground hover:text-teal"
        >
          {product.name}
        </Link>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          <BuyButton asin={product.asin} amazonUrl={product.amazonUrl} size="sm" />
        </div>
      </div>
    </div>
  );
}
