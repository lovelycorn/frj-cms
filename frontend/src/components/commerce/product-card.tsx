import Image from "next/image";

import LocalizedLink from "@/components/LocalizedLink";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(15,23,42,0.14)]">
      <div className="relative aspect-[4/3] w-full bg-slate-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.alternativeText || product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">No Image</div>
        )}
      </div>

      <div className="p-5">
        {product.category ? (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">{product.category.name}</p>
        ) : null}
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-brand-950">{product.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{product.description}</p>
        <LocalizedLink
          href={`/products/${product.slug}`}
          className="mt-5 inline-flex items-center text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          View Details
        </LocalizedLink>
      </div>
    </article>
  );
}
