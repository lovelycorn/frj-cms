import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductBySlug, getProducts } from "@/lib/api";
import { getRequestSiteConfig } from "@/lib/request-context";
import { ProductDetailSummary } from "@/src/components/commerce/product-detail-summary";
import { ProductGallery } from "@/src/components/commerce/product-gallery";
import { ProductSpecificationTable } from "@/src/components/commerce/product-specification-table";
import { RelatedProducts } from "@/src/components/commerce/related-products";
import { InquiryCtaSection } from "@/src/components/sections/inquiry/inquiry-cta";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";
import type { Product, ProductSpecificationItem } from "@/types";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function buildProductSpecifications(slug: string, product: Product): ProductSpecificationItem[] {
  if (product.specifications.length > 0) {
    return product.specifications;
  }

  const image = product.images[0];
  const specs: ProductSpecificationItem[] = [
    { label: "Model", value: product.title },
    { label: "SKU", value: slug.toUpperCase() },
    { label: "Category", value: product.category?.name ?? "Industrial Product" },
  ];

  if (image?.width && image?.height) {
    specs.push({
      label: "Reference Size",
      value: `${image.width} x ${image.height} px`,
    });
  }

  return specs;
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
  const site = await getRequestSiteConfig();
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((item) => item.slug !== product.slug && item.category?.slug === product.category?.slug)
    .slice(0, 3);
  const specifications = buildProductSpecifications(slug, product);

  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <ProductGallery product={product} />
            <ProductDetailSummary product={product} />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <ProductSpecificationTable specifications={specifications} />
        </Container>
      </Section>

      <RelatedProducts products={relatedProducts} />

      <InquiryCtaSection
        title="Need technical specs or OEM support?"
        description="Our team can provide datasheets, packaging options, and shipping plans quickly."
        contact={site.contact}
        sourcePage={`/products/${product.slug}`}
        sourceProductId={product.id}
      />
    </main>
  );
}
