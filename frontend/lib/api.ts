import { Article, Category, Product, StrapiImage } from "@/types";

interface StrapiListResponse<T> {
  data: T[];
}

interface StrapiSingleResponse<T> {
  data: T | null;
}

type StrapiEntity<T extends Record<string, unknown>> =
  | ({ id: number } & T)
  | {
      id: number;
      attributes: T;
    };

interface RawCategory extends Record<string, unknown> {
  name?: string;
  slug?: string;
}

interface RawProduct extends Record<string, unknown> {
  title?: string;
  slug?: string;
  description?: string;
  images?: unknown;
  category?: unknown;
  seoTitle?: string;
  seoDescription?: string;
}

interface RawArticle extends Record<string, unknown> {
  title?: string;
  slug?: string;
  content?: string;
  cover?: unknown;
  seo?: unknown;
}

const FALLBACK_STRAPI_URL = "http://localhost:1337";

function getStrapiBaseUrl(): string {
  const raw = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_API_URL ?? FALLBACK_STRAPI_URL;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapEntity<T extends Record<string, unknown>>(entity: StrapiEntity<T>): T & { id: number } {
  if ("attributes" in entity && isRecord(entity.attributes)) {
    return { id: entity.id, ...(entity.attributes as T) };
  }
  return entity as T & { id: number };
}

function toAbsoluteMediaUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${getStrapiBaseUrl()}${url}`;
}

function parseImageEntry(entry: unknown): StrapiImage | null {
  if (!isRecord(entry)) {
    return null;
  }

  const idValue = entry.id;
  const attributesValue = isRecord(entry.attributes) ? entry.attributes : entry;
  const urlValue = attributesValue.url;

  if (typeof idValue !== "number" || typeof urlValue !== "string") {
    return null;
  }

  const alternativeText =
    typeof attributesValue.alternativeText === "string" ? attributesValue.alternativeText : "Product image";

  const width = typeof attributesValue.width === "number" ? attributesValue.width : undefined;
  const height = typeof attributesValue.height === "number" ? attributesValue.height : undefined;

  return {
    id: idValue,
    url: toAbsoluteMediaUrl(urlValue),
    alternativeText,
    width,
    height,
  };
}

function parseImages(input: unknown): StrapiImage[] {
  if (!input) {
    return [];
  }

  if (Array.isArray(input)) {
    return input.map(parseImageEntry).filter((item): item is StrapiImage => item !== null);
  }

  if (isRecord(input) && Array.isArray(input.data)) {
    return input.data.map(parseImageEntry).filter((item): item is StrapiImage => item !== null);
  }

  if (isRecord(input) && isRecord(input.data)) {
    const single = parseImageEntry(input.data);
    return single ? [single] : [];
  }

  const single = parseImageEntry(input);
  return single ? [single] : [];
}

function parseSingleImage(input: unknown): StrapiImage | null {
  const images = parseImages(input);
  return images.length > 0 ? images[0] : null;
}

function parseCategory(input: unknown): Category | null {
  if (!input) {
    return null;
  }

  if (isRecord(input) && isRecord(input.data)) {
    return parseCategory(input.data);
  }

  if (!isRecord(input)) {
    return null;
  }

  const raw = "attributes" in input && isRecord(input.attributes) ? { id: input.id, ...input.attributes } : input;
  const idValue = raw.id;
  const nameValue = raw.name;
  const slugValue = raw.slug;

  if (typeof idValue !== "number" || typeof nameValue !== "string" || typeof slugValue !== "string") {
    return null;
  }

  return {
    id: idValue,
    name: nameValue,
    slug: slugValue,
  };
}

function parseSeo(input: unknown): { title: string; description: string } | null {
  if (!isRecord(input)) {
    return null;
  }

  const title = typeof input.title === "string" ? input.title : null;
  const description = typeof input.description === "string" ? input.description : null;

  if (!title || !description) {
    return null;
  }

  return { title, description };
}

async function fetchFromStrapi<T>(path: string): Promise<T> {
  const url = `${getStrapiBaseUrl()}${path}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 120,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
  }

  return (await response.json()) as T;
}

function normalizeCategory(item: StrapiEntity<RawCategory>): Category {
  const raw = unwrapEntity(item);

  return {
    id: raw.id,
    name: typeof raw.name === "string" ? raw.name : "Uncategorized",
    slug: typeof raw.slug === "string" ? raw.slug : "uncategorized",
  };
}

function normalizeProduct(item: StrapiEntity<RawProduct>): Product {
  const raw = unwrapEntity(item);

  return {
    id: raw.id,
    title: typeof raw.title === "string" ? raw.title : "Untitled Product",
    slug: typeof raw.slug === "string" ? raw.slug : `product-${raw.id}`,
    description:
      typeof raw.description === "string" ? raw.description : "Contact us for detailed product specifications.",
    images: parseImages(raw.images),
    category: parseCategory(raw.category),
    seoTitle: typeof raw.seoTitle === "string" ? raw.seoTitle : "",
    seoDescription: typeof raw.seoDescription === "string" ? raw.seoDescription : "",
  };
}

function normalizeArticle(item: StrapiEntity<RawArticle>): Article {
  const raw = unwrapEntity(item);

  return {
    id: raw.id,
    title: typeof raw.title === "string" ? raw.title : "Untitled Article",
    slug: typeof raw.slug === "string" ? raw.slug : `article-${raw.id}`,
    content: typeof raw.content === "string" ? raw.content : "",
    cover: parseSingleImage(raw.cover),
    seo: parseSeo(raw.seo),
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetchFromStrapi<StrapiListResponse<StrapiEntity<RawProduct>>>("/api/products?populate=*");
    return response.data.map(normalizeProduct);
  } catch (error) {
    console.error("getProducts error", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const encodedSlug = encodeURIComponent(slug);
    const response = await fetchFromStrapi<StrapiListResponse<StrapiEntity<RawProduct>>>(
      `/api/products?filters[slug][$eq]=${encodedSlug}&populate=*`,
    );
    const target = response.data[0];
    return target ? normalizeProduct(target) : null;
  } catch (error) {
    console.error("getProductBySlug error", error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchFromStrapi<StrapiListResponse<StrapiEntity<RawCategory>>>("/api/categories");
    return response.data.map(normalizeCategory);
  } catch (error) {
    console.error("getCategories error", error);
    return [];
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetchFromStrapi<StrapiListResponse<StrapiEntity<RawArticle>>>("/api/articles?populate=*");
    return response.data.map(normalizeArticle);
  } catch (error) {
    console.error("getArticles error", error);
    return [];
  }
}

export async function getGlobalSettings(): Promise<{ companyName: string } | null> {
  try {
    const response = await fetchFromStrapi<StrapiSingleResponse<Record<string, unknown>>>(
      "/api/global-setting?populate=*",
    );
    if (!response.data || typeof response.data.companyName !== "string") {
      return null;
    }

    return { companyName: response.data.companyName };
  } catch {
    return null;
  }
}
