import { getCategories, getProducts } from "@/lib/api";
import { getRequestSiteConfig } from "@/lib/request-context";
import { HomepageLayout } from "@/src/components/sections/home/homepage-layout";

export default async function HomePage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const site = await getRequestSiteConfig();

  return <HomepageLayout site={site} products={products} categories={categories} />;
}
