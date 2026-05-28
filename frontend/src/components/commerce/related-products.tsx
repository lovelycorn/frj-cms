import type { Product } from "@/types";
import { Container } from "@/src/components/ui/container";
import { Section } from "@/src/components/ui/section";

import { ProductGrid } from "./product-grid";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <Section>
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-brand-950 sm:text-3xl">Related Products</h2>
        <div className="mt-8">
          <ProductGrid products={products} emptyMessage="No related products yet." />
        </div>
      </Container>
    </Section>
  );
}
