const { createCoreController } = require("@strapi/strapi").factories;

const PRODUCT_UID = "api::product.product";

module.exports = createCoreController(PRODUCT_UID, ({ strapi }) => ({
  async find(ctx) {
    const populate = ctx.query?.populate || strapi.service(PRODUCT_UID).getDefaultPopulate();
    ctx.query = { ...ctx.query, populate };
    return super.find(ctx);
  },

  async findOne(ctx) {
    const populate = ctx.query?.populate || strapi.service(PRODUCT_UID).getDefaultPopulate();
    ctx.query = { ...ctx.query, populate };
    return super.findOne(ctx);
  },
}));
