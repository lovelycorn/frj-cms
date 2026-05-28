export interface MegaMenuLinkItem {
  label: string;
  href: string;
  description?: string;
}

export interface MegaMenuGroup {
  title: string;
  links: MegaMenuLinkItem[];
}

export interface MegaMenuPanel {
  title: string;
  description: string;
  groups: MegaMenuGroup[];
  ctaLabel: string;
  ctaHref: string;
}

export const megaMenuConfig: Record<string, MegaMenuPanel> = {
  "/products": {
    title: "Industrial Product Hub",
    description: "Explore standardized product lines and request OEM-ready configurations.",
    groups: [
      {
        title: "Catalog Access",
        links: [
          { label: "All Products", href: "/products", description: "Browse full export product catalog." },
          { label: "Featured Range", href: "/products", description: "Start from high-demand families." },
        ],
      },
      {
        title: "Procurement Support",
        links: [
          { label: "Specification Inquiry", href: "/contact", description: "Get technical data and lead time." },
          { label: "OEM & Label Service", href: "/contact", description: "Discuss custom branding requirements." },
        ],
      },
    ],
    ctaLabel: "Submit Product RFQ",
    ctaHref: "/contact",
  },
  "/about": {
    title: "Company & Capability",
    description: "Review manufacturing capability, compliance process, and export collaboration model.",
    groups: [
      {
        title: "Company Overview",
        links: [
          { label: "About Us", href: "/about", description: "Understand mission and service model." },
          { label: "Factory Strength", href: "/", description: "View quality and delivery capability." },
        ],
      },
      {
        title: "Cooperation",
        links: [
          { label: "Project Consultation", href: "/contact", description: "Talk with export engineering team." },
          { label: "Market Coverage", href: "/", description: "See supported regions and channels." },
        ],
      },
    ],
    ctaLabel: "Talk To Sales Team",
    ctaHref: "/contact",
  },
};
