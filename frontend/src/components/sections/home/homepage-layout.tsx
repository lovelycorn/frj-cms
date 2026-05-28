import type { Category, Product } from "@/types";
import { ProductGrid } from "@/src/components/commerce/product-grid";
import { FactoryStrengthSection } from "@/src/components/industry/factory-strength-section";
import { IndustrySolutionsSection } from "@/src/components/industry/industry-solutions-section";
import type { SiteConfig } from "@/lib/site-config";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Container } from "@/src/components/ui/container";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { Section } from "@/src/components/ui/section";
import { InquiryCtaSection } from "@/src/components/sections/inquiry/inquiry-cta";
import { designSystem } from "@/src/styles/design-system";

import { HomeHero } from "./home-hero";

interface HomepageLayoutProps {
  site: SiteConfig;
  products: Product[];
  categories: Category[];
}

const industrySolutions = [
  {
    title: "Distributor Channel Programs",
    description: "Private-label and channel protection support for industrial distributors entering new markets.",
  },
  {
    title: "OEM Manufacturing Projects",
    description: "Engineering collaboration for custom product configuration, packaging, and documentation.",
  },
  {
    title: "EPC & Contractor Supply",
    description: "Batch procurement support with milestone-based shipment planning for project execution.",
  },
  {
    title: "MRO Procurement Support",
    description: "Stable replenishment model for repeat procurement in maintenance and operation scenarios.",
  },
];

const factoryStrengthCards = [
  {
    title: "Stable Quality",
    description: "ISO-aligned quality checks from raw material to final shipment.",
  },
  {
    title: "Fast Delivery",
    description: "Flexible production planning with clear lead-time management.",
  },
  {
    title: "OEM Service",
    description: "Branding, packaging, and product customization for your market.",
  },
  {
    title: "Global Compliance",
    description: "Support for CE, RoHS, and market-specific export documentation.",
  },
];

export function HomepageLayout({ site, products, categories }: HomepageLayoutProps) {
  const hotProducts = products.slice(0, 6);

  return (
    <main>
      <HomeHero hero={site.hero} />

      <Section>
        <Container>
          <MotionFadeIn>
            <h2 className={designSystem.typography.sectionTitle}>Product Categories</h2>
            <p className={designSystem.typography.sectionLead}>
              Built for distributors, contractors, and industrial procurement teams.
            </p>
          </MotionFadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <MotionFadeIn
                  key={category.id}
                  delay={Math.min(0.08 + index * 0.04, 0.22)}
                  distance={12}
                >
                  <Card className="border-slate-200 transition-transform duration-200 hover:-translate-y-1 hover:border-brand-200">
                    <CardHeader>
                      <p className="text-base font-semibold text-brand-900">{category.name}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600">Engineered solutions for {category.name.toLowerCase()} applications.</p>
                    </CardContent>
                  </Card>
                </MotionFadeIn>
              ))
            ) : (
              <Card className="border-dashed border-slate-300 sm:col-span-2 lg:col-span-4">
                <CardContent className="pt-6 text-sm text-slate-600">Categories are being prepared in CMS.</CardContent>
              </Card>
            )}
          </div>
        </Container>
      </Section>

      <Section className="border-t border-slate-200/80 bg-white/70">
        <Container>
          <MotionFadeIn>
            <h2 className={designSystem.typography.sectionTitle}>Hot Products</h2>
            <p className={designSystem.typography.sectionLead}>
              Popular choices from buyers in our focus market: {site.serviceArea}
            </p>
          </MotionFadeIn>
          <div className="mt-8">
            <ProductGrid
              products={hotProducts}
              emptyMessage="No featured products yet. Add products in Strapi to display them."
            />
          </div>
        </Container>
      </Section>

      <IndustrySolutionsSection intro={site.companyIntro} serviceArea={site.serviceArea} solutions={industrySolutions} />

      <FactoryStrengthSection strengths={factoryStrengthCards} />

      <InquiryCtaSection
        title={`Need a trusted supplier for ${site.code.toUpperCase()} market projects?`}
        description="Tell us your requirements and we will provide a tailored quotation with lead time and compliance details."
        contact={site.contact}
      />
    </main>
  );
}
