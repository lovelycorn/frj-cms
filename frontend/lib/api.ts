import { Article, Category, GlobalSettings, Product, ProductSpecificationItem, StrapiImage } from "@/types";

interface StrapiListResponse<T> {
  data: T[];
}

interface StrapiSingleResponse<T> {
  data: T | null;
}

interface InquiryConfirmResponse {
  data?: {
    exists?: boolean;
  };
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
  specifications?: unknown;
  specificationTable?: unknown;
  specs?: unknown;
}

interface RawArticle extends Record<string, unknown> {
  title?: string;
  slug?: string;
  content?: string;
  cover?: unknown;
  seo?: unknown;
}

interface RawGlobalSettings extends Record<string, unknown> {
  companyName?: string;
  logo?: unknown;
  contactInfo?: string;
  socialLinks?: unknown;
}

export interface InquiryUtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface SubmitInquiryInput {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  country?: string;
  source_page?: string;
  source_product?: number;
  utm_params?: InquiryUtmParams;
}

const FALLBACK_STRAPI_URL = "http://localhost:1337";

function getStrapiBaseUrl(): string {
  const raw = process.env.STRAPI_URL ?? process.env.NEXT_PUBLIC_API_URL ?? FALLBACK_STRAPI_URL;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

function sanitizeString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, maxLength);
}

async function confirmInquirySubmission(input: SubmitInquiryInput): Promise<boolean> {
  const requestBody = JSON.stringify({
    data: {
      name: input.name,
      email: input.email,
      message: input.message,
    },
  });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const response = await fetch("/api/inquiries/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        cache: "no-store",
      });

      if (response.ok) {
        const json = (await response.json()) as InquiryConfirmResponse;
        if (json?.data?.exists === true) {
          return true;
        }
      }
    } catch {
      // Ignore transient request failure and retry.
    }

    await new Promise((resolve) => {
      setTimeout(resolve, 300);
    });
  }

  return false;
}

function logApiError(context: string, error: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(`${context} error`, error);
  }
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

function parseProductSpecificationItem(input: unknown): ProductSpecificationItem | null {
  if (!isRecord(input)) {
    return null;
  }

  const labelCandidates = [input.label, input.name, input.key, input.title];
  const valueCandidates = [input.value, input.content, input.detail, input.description];

  const label = labelCandidates.find(
    (candidate): candidate is string => typeof candidate === "string" && candidate.trim().length > 0,
  );
  const value = valueCandidates.find(
    (candidate): candidate is string => typeof candidate === "string" && candidate.trim().length > 0,
  );

  if (!label || !value) {
    return null;
  }

  return {
    label: label.trim(),
    value: value.trim(),
  };
}

function parseKeyValueObjectSpecs(input: Record<string, unknown>): ProductSpecificationItem[] {
  return Object.entries(input)
    .filter(([key, value]) => {
      if (["id", "createdAt", "updatedAt", "publishedAt"].includes(key)) {
        return false;
      }

      return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
    })
    .map(([key, value]) => ({
      label: key,
      value: String(value),
    }));
}

function parseProductSpecifications(input: unknown): ProductSpecificationItem[] {
  if (!input) {
    return [];
  }

  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input) as unknown;
      return parseProductSpecifications(parsed);
    } catch {
      return [];
    }
  }

  if (Array.isArray(input)) {
    return input
      .map(parseProductSpecificationItem)
      .filter((item): item is ProductSpecificationItem => item !== null);
  }

  if (isRecord(input) && Array.isArray(input.data)) {
    return parseProductSpecifications(input.data);
  }

  if (isRecord(input)) {
    const fromItem = parseProductSpecificationItem(input);
    if (fromItem) {
      return [fromItem];
    }

    return parseKeyValueObjectSpecs(input);
  }

  return [];
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
  const specificationSource = raw.specifications ?? raw.specificationTable ?? raw.specs;

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
    specifications: parseProductSpecifications(specificationSource),
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

function parseSocialLinks(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function normalizeGlobalSettings(entity: StrapiEntity<RawGlobalSettings> | Record<string, unknown>): GlobalSettings | null {
  const raw =
    "id" in entity
      ? unwrapEntity(entity as StrapiEntity<RawGlobalSettings>)
      : (entity as RawGlobalSettings & { id?: number });

  if (typeof raw.companyName !== "string" || raw.companyName.trim().length === 0) {
    return null;
  }

  return {
    companyName: raw.companyName,
    logo: parseSingleImage(raw.logo),
    contactInfo: typeof raw.contactInfo === "string" ? raw.contactInfo : "",
    socialLinks: parseSocialLinks(raw.socialLinks),
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetchFromStrapi<StrapiListResponse<StrapiEntity<RawProduct>>>("/api/products?populate=*");
    return response.data.map(normalizeProduct);
  } catch (error) {
    logApiError("getProducts", error);
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
    logApiError("getProductBySlug", error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetchFromStrapi<StrapiListResponse<StrapiEntity<RawCategory>>>("/api/categories");
    return response.data.map(normalizeCategory);
  } catch (error) {
    logApiError("getCategories", error);
    return [];
  }
}

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetchFromStrapi<StrapiListResponse<StrapiEntity<RawArticle>>>("/api/articles?populate=*");
    return response.data.map(normalizeArticle);
  } catch (error) {
    logApiError("getArticles", error);
    return [];
  }
}

export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  try {
    const response = await fetchFromStrapi<StrapiSingleResponse<StrapiEntity<RawGlobalSettings> | Record<string, unknown>>>(
      "/api/global-setting?populate=*",
    );

    if (!response.data) {
      return null;
    }

    return normalizeGlobalSettings(response.data);
  } catch {
    return null;
  }
}

export async function submitInquiry(input: SubmitInquiryInput): Promise<boolean> {
  const payload: SubmitInquiryInput = {
    name: sanitizeString(input.name, 100) || "",
    email: sanitizeString(input.email, 120) || "",
    message: sanitizeString(input.message, 2000) || "",
    company: sanitizeString(input.company, 120),
    phone: sanitizeString(input.phone, 50),
    country: sanitizeString(input.country, 80),
    source_page: sanitizeString(input.source_page, 255),
    source_product: typeof input.source_product === "number" ? input.source_product : undefined,
    utm_params: input.utm_params,
  };

  if (!payload.name || !payload.email || !payload.message) {
    return false;
  }

  try {
    const response = await fetch("/api/inquiries/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: payload }),
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    logApiError("submitInquiry", error);
  }

  try {
    return await confirmInquirySubmission(payload);
  } catch (error) {
    logApiError("confirmInquirySubmission", error);
    return false;
  }
}
