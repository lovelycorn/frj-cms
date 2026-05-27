import CTASection from "@/components/CTASection";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { getCategories, getProducts } from "@/lib/api";
import { getRequestSiteConfig } from "@/lib/request-context";

export default async function HomePage(): Promise<JSX.Element> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const site = await getRequestSiteConfig();
  const hotProducts = products.slice(0, 6);

  return (
    <main>
      <Hero hero={site.hero} />

      <section className="section-wrap py-14">
        <h2 className="title-lg">Product Categories</h2>
        <p className="section-subtitle">Built for distributors, contractors, and industrial procurement teams.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1"
              >
                <p className="text-base font-semibold text-brand-900">{category.name}</p>
                <p className="mt-2 text-sm text-slate-600">Engineered solutions for {category.name.toLowerCase()} applications.</p>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600 sm:col-span-2 lg:col-span-4">
              Categories are being prepared in CMS.
            </div>
          )}
        </div>
      </section>

      <section className="section-wrap py-14">
        <h2 className="title-lg">Hot Products</h2>
        <p className="section-subtitle">Popular choices from buyers in our focus market: {site.serviceArea}</p>
        <div className="mt-8">
          <ProductGrid products={hotProducts} emptyMessage="No featured products yet. Add products in Strapi to display them." />
        </div>
      </section>

      <section className="section-wrap py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="title-lg">About Our Company</h2>
            <p className="section-subtitle">{site.companyIntro}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 className="text-base font-semibold text-brand-900">Stable Quality</h3>
              <p className="mt-2 text-sm text-slate-600">ISO-aligned quality checks from raw material to final shipment.</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 className="text-base font-semibold text-brand-900">Fast Delivery</h3>
              <p className="mt-2 text-sm text-slate-600">Flexible production planning with clear lead-time management.</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 className="text-base font-semibold text-brand-900">OEM Service</h3>
              <p className="mt-2 text-sm text-slate-600">Branding, packaging, and product customization for your market.</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
              <h3 className="text-base font-semibold text-brand-900">Global Compliance</h3>
              <p className="mt-2 text-sm text-slate-600">Support for CE, RoHS, and market-specific export documentation.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section-wrap py-14">
        <h2 className="title-lg">Why Choose Us</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-base font-semibold text-brand-900">Dedicated Export Team</h3>
            <p className="mt-2 text-sm text-slate-600">Single point of contact for quotation, production, and logistics.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-base font-semibold text-brand-900">Transparent Process</h3>
            <p className="mt-2 text-sm text-slate-600">Clear milestone tracking from order confirmation to shipment.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h3 className="text-base font-semibold text-brand-900">Long-Term Partnership</h3>
            <p className="mt-2 text-sm text-slate-600">Focused on repeat orders and sustainable international growth.</p>
          </article>
        </div>
      </section>

      <CTASection
        title={`Need a trusted supplier for ${site.code.toUpperCase()} market projects?`}
        description="Tell us your requirements and we will provide a tailored quotation with lead time and compliance details."
      />
    </main>
  );
}
