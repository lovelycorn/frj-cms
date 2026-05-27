const CATEGORY_UID = "api::category.category";
const PRODUCT_UID = "api::product.product";
const ARTICLE_UID = "api::article.article";
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
    seoTitle: "Stainless Steel Centrifugal Pump | FRJ",
    seoDescription: "Industrial-grade centrifugal pump with stable flow and long service life.",
  },
  {
    title: "High Pressure Ball Valve",
    slug: "high-pressure-ball-valve",
    description:
      "Reliable shut-off performance under high pressure, suitable for oil, gas, and chemical processing lines.",
    seoTitle: "High Pressure Ball Valve | FRJ",
    seoDescription: "Precision valve solution for demanding industrial control systems.",
  },
  {
    title: "Precision Pneumatic Actuator",
    slug: "precision-pneumatic-actuator",
    description:
      "Fast and stable actuation for automated production lines and fluid control integrations.",
    seoTitle: "Precision Pneumatic Actuator | FRJ",
    seoDescription: "Compact actuator designed for long-cycle industrial automation.",
  },
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
      contactInfo: "Email: sales@example.com | Phone: +86 21 5555 8888 | Shanghai, China",
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

    await seedCollectionIfEmpty(strapi, ARTICLE_UID, defaultArticles, { publish: true }).catch((error) => {
      strapi.log.error("Article seed failed", error);
    });

    await seedGlobalSettings(strapi).catch((error) => {
      strapi.log.error("Global settings seed failed", error);
    });
  },
};
