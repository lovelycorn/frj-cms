const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::product.product", () => ({
  getDefaultPopulate() {
    return {
      images: true,
      pdf_attachments: true,
      category: true,
      industries: true,
      downloads: true,
      certificates: true,
      specifications: true,
    };
  },
}));
