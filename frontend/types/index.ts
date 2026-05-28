export interface SEOFields {
  title: string;
  description: string;
}

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string;
  width?: number;
  height?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductSpecificationItem {
  label: string;
  value: string;
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  images: StrapiImage[];
  category: Category | null;
  seoTitle: string;
  seoDescription: string;
  specifications: ProductSpecificationItem[];
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover: StrapiImage | null;
  seo: SEOFields | null;
}

export interface GlobalSettings {
  companyName: string;
  logo: StrapiImage | null;
  contactInfo: string;
  socialLinks: string[];
}
