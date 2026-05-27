import type { Metadata } from "next";

import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/api";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const { category } = await searchParams;
  const categoryText = category ? ` - ${category}` : "";

  return {
    title: `Products${categoryText}`,
    description: category
      ? `Browse industrial products filtered by category: ${category}.`
      : "Browse our full industrial product catalog for global procurement.",
    openGraph: {
      title: `Products${categoryText}`,
      description: "Industrial products for distributors and OEM buyers.",
      type: "website",
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps): Promise<JSX.Element> {
  const [{ category }, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);

  const filteredProducts = category
    ? products.filter((product) => product.category?.slug.toLowerCase() === category.toLowerCase())
    : products;

  return (
    <main className="section-wrap py-14">
      <h1 className="title-xl">Product Catalog</h1>
      <p className="section-subtitle">Search by category and discover export-ready industrial solutions.</p>

      <div className="mt-8 flex flex-wrap gap-2">
        <a
          href="/products"
          className={`rounded-full border px-3 py-1 text-sm transition ${
            category ? "border-slate-300 text-slate-700 hover:border-brand-600" : "border-brand-700 bg-brand-700 text-white"
          }`}
        >
          All
        </a>
        {categories.map((item) => {
          const isActive = category?.toLowerCase() === item.slug.toLowerCase();
          return (
            <a
              key={item.id}
              href={`/products?category=${encodeURIComponent(item.slug)}`}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                isActive ? "border-brand-700 bg-brand-700 text-white" : "border-slate-300 text-slate-700 hover:border-brand-600"
              }`}
            >
              {item.name}
            </a>
          );
        })}
      </div>

      <div className="mt-8">
        <ProductGrid
          products={filteredProducts}
          emptyMessage="No products matched this category. Please choose another filter or add products in Strapi."
        />
      </div>
    </main>
  );
}
