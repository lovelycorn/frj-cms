import LocalizedLink from "@/components/LocalizedLink";
import type { Product } from "@/types";

interface ProductDetailSummaryProps {
  product: Product;
}

export function ProductDetailSummary({ product }: ProductDetailSummaryProps) {
  return (
    <div>
      {product.category ? (
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-700">{product.category.name}</p>
      ) : null}
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">{product.title}</h1>
      <p className="mt-6 text-base leading-7 text-slate-700">{product.description}</p>

      <div className="mt-8 rounded-xl border border-brand-100 bg-brand-50 p-5">
        <h2 className="text-base font-semibold text-brand-900">Quick Inquiry</h2>
        <p className="mt-2 text-sm text-slate-700">Send your target quantity and destination port to get a focused quotation.</p>
        <LocalizedLink
          href="/contact"
          className="mt-4 inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
        >
          Contact Sales
        </LocalizedLink>
      </div>
    </div>
  );
}
