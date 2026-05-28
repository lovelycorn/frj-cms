const CATEGORY_UID = "api::category.category";
const PRODUCT_UID = "api::product.product";
const INDUSTRY_UID = "api::industry.industry";
const ARTICLE_UID = "api::article.article";
const BLOG_UID = "api::blog.blog";
const CASE_STUDY_UID = "api::case-study.case-study";
const NEWS_UID = "api::news.news";
const FAQ_UID = "api::faq.faq";
const GLOBAL_SETTING_UID = "api::global-setting.global-setting";

const defaultCategories = [
  { name: "Pumps", slug: "pumps" },
  { name: "Valves", slug: "valves" },
  { name: "Fittings", slug: "fittings" },
  { name: "Automation", slug: "automation" },
];

const defaultProducts = [
  {
    title: "Stainless Steel Centrifugal Pump",
    slug: "stainless-steel-centrifugal-pump",
    description:
      "Durable and corrosion-resistant centrifugal pump for industrial liquid transfer applications.",
    rich_text:
      "Designed for continuous-duty industrial transfer with stable flow and low maintenance requirements.",
    specifications: [
      { label: "Material", value: "SS304/SS316", sort_order: 1 },
      { label: "Flow Rate", value: "5-120", unit: "m3/h", sort_order: 2 },
    ],
    seoTitle: "Stainless Steel Centrifugal Pump | FRJ",
    seoDescription: "Industrial-grade centrifugal pump with stable flow and long service life.",
  },
  {
    title: "High Pressure Ball Valve",
    slug: "high-pressure-ball-valve",
    description:
      "Reliable shut-off performance under high pressure, suitable for oil, gas, and chemical processing lines.",
    rich_text:
      "Suitable for high-pressure pipelines where tight shutoff and corrosion resistance are required.",
    specifications: [
      { label: "Pressure Rating", value: "PN40/PN63", sort_order: 1 },
      { label: "Connection", value: "Flanged/Threaded", sort_order: 2 },
    ],
    seoTitle: "High Pressure Ball Valve | FRJ",
    seoDescription: "Precision valve solution for demanding industrial control systems.",
  },
  {
    title: "Precision Pneumatic Actuator",
    slug: "precision-pneumatic-actuator",
    description:
      "Fast and stable actuation for automated production lines and fluid control integrations.",
    rich_text: "Compact body with stable output torque for long-cycle automation use cases.",
    specifications: [
      { label: "Control Type", value: "Double-acting", sort_order: 1 },
      { label: "Operating Pressure", value: "2-8", unit: "bar", sort_order: 2 },
    ],
    seoTitle: "Precision Pneumatic Actuator | FRJ",
    seoDescription: "Compact actuator designed for long-cycle industrial automation.",
  },
];

const defaultIndustries = [
  { name: "Oil & Gas", slug: "oil-gas", description: "Upstream, midstream and downstream process systems." },
  { name: "Water Treatment", slug: "water-treatment", description: "Municipal and industrial fluid handling systems." },
  { name: "Food Processing", slug: "food-processing", description: "Sanitary-grade process control and transfer equipment." },
];

const defaultArticles = [
  {
    title: "How to Evaluate Industrial Supplier Reliability",
    slug: "evaluate-industrial-supplier-reliability",
    content:
      "Selecting the right supplier requires checks on process capability, documentation traceability, and shipment history.",
    seo: {
      title: "How to Evaluate Industrial Supplier Reliability",
      description: "A practical guide for global buyers to evaluate supplier performance and risk.",
    },
  },
];

const defaultBlogs = [
  {
    title: "How to Select Industrial Pumps for Corrosive Fluids",
    slug: "select-industrial-pumps-for-corrosive-fluids",
    summary: "A practical framework for material selection, sealing design, and lifecycle cost evaluation.",
    content:
      "When selecting pumps for corrosive fluids, evaluate material compatibility first, then verify seal systems and maintenance intervals.",
    seo: {
      title: "How to Select Industrial Pumps for Corrosive Fluids",
      description: "Engineering checklist for selecting corrosion-resistant industrial pumps.",
    },
  },
];

const defaultCaseStudies = [
  {
    title: "Valve Retrofit for Chemical Plant Expansion Line",
    slug: "valve-retrofit-chemical-plant-expansion-line",
    summary: "Replaced legacy valves to reduce unplanned shutdown risk and improve line stability.",
    content:
      "By replacing critical valves and standardizing specification checks, the plant reduced leakage incidents and improved maintenance predictability.",
    customer_name: "Regional Chemical Processor",
    seo: {
      title: "Valve Retrofit Case Study for Chemical Plant Expansion",
      description: "A retrofit case reducing downtime risk in chemical processing lines.",
    },
  },
];

const defaultNews = [
  {
    title: "FRJ Launches New Export-Focused Product Documentation Process",
    slug: "frj-launches-export-focused-product-documentation-process",
    summary: "Documentation workflows updated for faster inquiry response and quotation support.",
    content:
      "The updated process standardizes technical sheets, certificates, and manuals to shorten customer response time.",
    seo: {
      title: "FRJ Launches New Product Documentation Process",
      description: "News update on FRJ documentation workflow improvements for export operations.",
    },
  },
];

const defaultFaqs = [
  {
    question: "What is your typical lead time for standard products?",
    slug: "typical-lead-time-for-standard-products",
    answer: "Standard configurations are typically shipped within 2 to 4 weeks after order confirmation.",
    category: "Ordering",
    sort_order: 1,
  },
];

async function createDefaultAdmin(strapi) {
  const adminEmail = process.env.STRAPI_ADMIN_EMAIL;
  const adminPassword = process.env.STRAPI_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return;
  }

  const adminService = strapi.service("admin::user");
  const hasAdmin = await adminService.exists();

  if (hasAdmin) {
    return;
  }

  const superAdminRole = await strapi.service("admin::role").getSuperAdmin();

  await adminService.create({
    email: adminEmail,
    firstname: "System",
    lastname: "Admin",
    password: adminPassword,
    isActive: true,
    roles: [superAdminRole.id],
  });

  strapi.log.info(`Default admin created: ${adminEmail}`);
}

async function getExistingCount(documentService) {
  if (typeof documentService.count === "function") {
    return documentService.count();
  }

  const entries = await documentService.findMany({ limit: 1 });
  return Array.isArray(entries) ? entries.length : 0;
}

async function getFirstDocument(documentService) {
  if (typeof documentService.findFirst === "function") {
    return documentService.findFirst();
  }

  const entries = await documentService.findMany({ limit: 1 });
  if (Array.isArray(entries) && entries.length > 0) {
    return entries[0];
  }

  return null;
}

async function seedCollectionIfEmpty(strapi, uid, entries, options = {}) {
  const documentService = strapi.documents(uid);
  const existingCount = await getExistingCount(documentService);

  if (existingCount > 0) {
    return;
  }

  for (const entry of entries) {
    if (options.publish) {
      await documentService.create({
        data: entry,
        status: "published",
      });
    } else {
      await documentService.create({
        data: entry,
      });
    }
  }

  strapi.log.info(`Seeded data for ${uid}`);
}

async function seedGlobalSettings(strapi) {
  const documentService = strapi.documents(GLOBAL_SETTING_UID);
  const existing = await getFirstDocument(documentService);

  if (existing) {
    return;
  }

  await documentService.create({
    data: {
      companyName: "FRJ Industrial Solutions",
      contactInfo:
        "Email: sales@example.com | Phone: +86 21 5555 8888 | Address: Shanghai, China | WorkingHours: Mon - Fri, 09:00 - 18:00 (GMT+8)",
      socialLinks: ["https://www.linkedin.com", "https://www.youtube.com"],
    },
  });

  strapi.log.info("Seeded global settings");
}

module.exports = {
  register() {},

  async bootstrap({ strapi }) {
    await createDefaultAdmin(strapi).catch((error) => {
      strapi.log.error("Admin bootstrap failed", error);
    });

    await seedCollectionIfEmpty(strapi, CATEGORY_UID, defaultCategories).catch((error) => {
      strapi.log.error("Category seed failed", error);
    });

    await seedCollectionIfEmpty(strapi, PRODUCT_UID, defaultProducts, { publish: true }).catch((error) => {
      strapi.log.error("Product seed failed", error);
    });

    await seedCollectionIfEmpty(strapi, INDUSTRY_UID, defaultIndustries).catch((error) => {
      strapi.log.error("Industry seed failed", error);
    });

    await seedCollectionIfEmpty(strapi, ARTICLE_UID, defaultArticles, { publish: true }).catch((error) => {
      strapi.log.error("Article seed failed", error);
    });

    await seedCollectionIfEmpty(strapi, BLOG_UID, defaultBlogs, { publish: true }).catch((error) => {
      strapi.log.error("Blog seed failed", error);
    });

    await seedCollectionIfEmpty(strapi, CASE_STUDY_UID, defaultCaseStudies, { publish: true }).catch((error) => {
      strapi.log.error("Case study seed failed", error);
    });

    await seedCollectionIfEmpty(strapi, NEWS_UID, defaultNews, { publish: true }).catch((error) => {
      strapi.log.error("News seed failed", error);
    });

    await seedCollectionIfEmpty(strapi, FAQ_UID, defaultFaqs, { publish: true }).catch((error) => {
      strapi.log.error("FAQ seed failed", error);
    });

    await seedGlobalSettings(strapi).catch((error) => {
      strapi.log.error("Global settings seed failed", error);
    });
  },
};
