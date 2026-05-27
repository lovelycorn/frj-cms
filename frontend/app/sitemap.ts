import type { MetadataRoute } from "next";

import { getProducts } from "@/lib/api";
import { getSupportedSiteLocales } from "@/lib/site-config";

const appUrl = process.env.APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const locales = getSupportedSiteLocales();

  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${appUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${appUrl}/${locale}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${appUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appUrl}/${locale}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ]);

  const productRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    products.map((product) => ({
      url: `${appUrl}/${locale}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  );

  return [...staticRoutes, ...productRoutes];
}
