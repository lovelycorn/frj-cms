import type { Metadata } from "next";
import { notFound } from "next/navigation";

import CTASection from "@/components/CTASection";
import LocalizedLink from "@/components/LocalizedLink";
import ProductGrid from "@/components/ProductGrid";
import { getProductBySlug, getProducts } from "@/lib/api";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.description,
    openGraph: {
      title: product.seoTitle || product.title,
      description: product.seoDescription || product.description,
      type: "article",
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((item) => item.slug !== product.slug && item.category?.slug === product.category?.slug)
    .slice(0, 3);

  return (
    <main>
      <section className="section-wrap py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
              {product.images[0] ? (
                <img
                  src={product.images[0].url}
                  alt={product.images[0].alternativeText || product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 text-slate-500">No Image</div>
              )}
            </div>
          </div>

          <div>
            {product.category ? (
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">{product.category.name}</p>
            ) : null}
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-950 sm:text-4xl">{product.title}</h1>
            <p className="mt-6 text-base leading-7 text-slate-700">{product.description}</p>

            <div className="mt-8 rounded-xl border border-brand-100 bg-brand-50 p-5">
              <h2 className="text-base font-semibold text-brand-900">Quick Inquiry</h2>
              <p className="mt-2 text-sm text-slate-700">
                Send your target quantity and destination port to get a focused quotation.
              </p>
              <LocalizedLink
                href="/contact"
                className="mt-4 inline-flex rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                Contact Sales
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap py-14">
        <h2 className="title-lg">Related Products</h2>
        <div className="mt-8">
          <ProductGrid products={relatedProducts} emptyMessage="No related products yet." />
        </div>
      </section>

      <CTASection title="Need technical specs or OEM support?" description="Our team can provide datasheets, packaging options, and shipping plans quickly." />
    </main>
  );
}
