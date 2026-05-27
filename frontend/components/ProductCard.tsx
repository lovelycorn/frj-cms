import { Product } from "@/types";
import LocalizedLink from "@/components/LocalizedLink";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps): JSX.Element {
  const image = product.images[0];

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[4/3] w-full bg-slate-100">
        {image ? (
          <img
            src={image.url}
            alt={image.alternativeText || product.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">No Image</div>
        )}
      </div>

      <div className="p-5">
        {product.category ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">{product.category.name}</p>
        ) : null}
        <h3 className="mt-2 text-lg font-semibold text-brand-950">{product.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-slate-600">{product.description}</p>
        <LocalizedLink
          href={`/products/${product.slug}`}
          className="mt-4 inline-flex items-center text-sm font-semibold text-brand-700 transition hover:text-brand-900"
        >
          View Details
        </LocalizedLink>
      </div>
    </article>
  );
}
