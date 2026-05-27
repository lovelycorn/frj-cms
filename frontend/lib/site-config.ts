export interface NavigationItem {
  href: string;
  label: string;
}

export interface SiteContact {
  email: string;
  phone: string;
  address: string;
  workingHours: string;
}

export interface SiteHeroContent {
  badge: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
}

export interface SiteConfig {
  code: SiteCode;
  htmlLang: string;
  ogLocale: string;
  brandShortName: string;
  brandName: string;
  companyName: string;
  seoTitle: string;
  seoDescription: string;
  ogDescription: string;
  footerDescription: string;
  companyIntro: string;
  serviceArea: string;
  contact: SiteContact;
  hero: SiteHeroContent;
  navigation: NavigationItem[];
}

const supportedSiteCodes = ["us", "de", "jp"] as const;
const supportedSiteLocales = ["en", "de", "ja"] as const;

export type SiteCode = (typeof supportedSiteCodes)[number];
export type SiteLocale = (typeof supportedSiteLocales)[number];

const localeToSiteCodeMap: Record<SiteLocale, SiteCode> = {
  en: "us",
  de: "de",
  ja: "jp",
};

const siteCodeToLocaleMap: Record<SiteCode, SiteLocale> = {
  us: "en",
  de: "de",
  jp: "ja",
};

const commonNavigation: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const siteConfigs: Record<SiteCode, SiteConfig> = {
  us: {
    code: "us",
    htmlLang: "en",
    ogLocale: "en_US",
    brandShortName: "FRJ",
    brandName: "FRJ Industrial USA",
    companyName: "FRJ Industrial Solutions",
    seoTitle: "FRJ Industrial USA | Trusted Global Supplier",
    seoDescription:
      "Industrial foreign trade template for North America, built with Next.js and Strapi for scalable multi-site deployment.",
    ogDescription: "Reliable industrial products and export services for buyers across North America.",
    footerDescription:
      "Your reliable global partner for industrial products, OEM solutions, and export-ready supply chains.",
    companyIntro:
      "We help North American importers build stable supply channels with strict quality systems and transparent communication.",
    serviceArea: "United States, Canada, Mexico, and LATAM project channels.",
    contact: {
      email: "sales-us@example.com",
      phone: "+1 (626) 555-0188",
      address: "Los Angeles, California, USA",
      workingHours: "Mon - Fri, 09:00 - 18:00 (PST)",
    },
    hero: {
      badge: "North America Supply Program",
      title: "Build a Strong Industrial Brand in the US Market",
      description:
        "We support distributors and engineering buyers with stable lead times, quality control, and compliant export delivery.",
      primaryActionLabel: "Explore Products",
      secondaryActionLabel: "Request Quote",
    },
    navigation: commonNavigation,
  },
  de: {
    code: "de",
    htmlLang: "de",
    ogLocale: "de_DE",
    brandShortName: "FRJ",
    brandName: "FRJ Industrial Europe",
    companyName: "FRJ Industrial Europe GmbH",
    seoTitle: "FRJ Industrial Europe | Zuverlaessiger Industriepartner",
    seoDescription:
      "Industrial export website template optimized for DACH and EU distributors with modular multi-site architecture.",
    ogDescription: "Industrial products and OEM sourcing support for Germany and the wider EU market.",
    footerDescription:
      "Industrial sourcing and private-label support for DACH distributors and engineering contractors.",
    companyIntro:
      "We help European buyers optimize sourcing risk, shorten procurement cycles, and improve delivery transparency.",
    serviceArea: "Germany, Austria, Switzerland, Benelux, and wider EU distribution networks.",
    contact: {
      email: "sales-eu@example.com",
      phone: "+49 30 2555 8822",
      address: "Berlin, Germany",
      workingHours: "Mon - Fri, 08:30 - 17:30 (CET)",
    },
    hero: {
      badge: "DACH Industry Program",
      title: "Reliable Industrial Sourcing for Germany and EU",
      description:
        "From OEM customization to compliance documentation, we deliver export-ready industrial products for EU projects.",
      primaryActionLabel: "Explore Products",
      secondaryActionLabel: "Request Quote",
    },
    navigation: commonNavigation,
  },
  jp: {
    code: "jp",
    htmlLang: "ja",
    ogLocale: "ja_JP",
    brandShortName: "FRJ",
    brandName: "FRJ Industrial Japan",
    companyName: "FRJ Industrial Japan Co., Ltd.",
    seoTitle: "FRJ Industrial Japan | Trusted Manufacturing Partner",
    seoDescription:
      "Foreign trade industrial site template for Japan-focused procurement teams, ready for scalable multi-country rollout.",
    ogDescription: "Quality-focused industrial export solutions for Japan procurement and OEM programs.",
    footerDescription:
      "Precision-oriented industrial supply support for Japanese trading firms and manufacturing projects.",
    companyIntro:
      "We support Japanese buyers with disciplined quality management, communication cadence, and long-term supply planning.",
    serviceArea: "Japan market projects, ASEAN-linked procurement, and APAC engineering supply chains.",
    contact: {
      email: "sales-jp@example.com",
      phone: "+81 3-4500-7788",
      address: "Tokyo, Japan",
      workingHours: "Mon - Fri, 09:00 - 18:00 (JST)",
    },
    hero: {
      badge: "Japan Quality Program",
      title: "Export-Ready Industrial Supply for Japan",
      description:
        "Stable process control, clear documentation, and responsive engineering support for long-term sourcing programs.",
      primaryActionLabel: "Explore Products",
      secondaryActionLabel: "Request Quote",
    },
    navigation: commonNavigation,
  },
};

const defaultSiteCode: SiteCode = "us";
const defaultLocale: SiteLocale = siteCodeToLocaleMap[defaultSiteCode];

export function resolveSiteCode(code: string | undefined): SiteCode {
  const normalized = code?.trim().toLowerCase();
  return supportedSiteCodes.includes(normalized as SiteCode) ? (normalized as SiteCode) : defaultSiteCode;
}

export function getSiteConfig(code: string | undefined = process.env.SITE_CODE): SiteConfig {
  return siteConfigs[resolveSiteCode(code)];
}

export function resolveSiteLocale(locale: string | undefined): SiteLocale {
  const normalized = locale?.trim().toLowerCase();
  return supportedSiteLocales.includes(normalized as SiteLocale) ? (normalized as SiteLocale) : defaultLocale;
}

export function getSiteCodeByLocale(locale: string | undefined): SiteCode {
  return localeToSiteCodeMap[resolveSiteLocale(locale)];
}

export function getDefaultSiteLocale(): SiteLocale {
  return siteCodeToLocaleMap[resolveSiteCode(process.env.SITE_CODE)];
}

export function getSiteConfigByLocale(locale: string | undefined): SiteConfig {
  return siteConfigs[getSiteCodeByLocale(locale)];
}

export function getSupportedSiteCodes(): SiteCode[] {
  return [...supportedSiteCodes];
}

export function getSupportedSiteLocales(): SiteLocale[] {
  return [...supportedSiteLocales];
}
