import type { Metadata } from "next";

import { getCategories, getProducts } from "@/lib/api";
import { ProductCategoryTabs } from "@/src/components/commerce/product-category-tabs";
import { ProductGrid } from "@/src/components/commerce/product-grid";

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

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const [{ category }, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);

  const filteredProducts = category
    ? products.filter((product) => product.category?.slug.toLowerCase() === category.toLowerCase())
    : products;

  return (
    <main className="section-wrap py-14">
      <h1 className="title-xl">Product Catalog</h1>
      <p className="section-subtitle">Search by category and discover export-ready industrial solutions.</p>

      <div className="mt-8">
        <ProductCategoryTabs categories={categories} activeCategory={category} />
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
