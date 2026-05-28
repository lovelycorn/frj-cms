import type { Product } from "@/types";

import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  columns?: 2 | 3 | 4;
}

const columnClasses: Record<NonNullable<ProductGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function ProductGrid({
  products,
  emptyMessage = "Products are being updated. Please check back soon.",
  columns = 3,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${columnClasses[columns]}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
