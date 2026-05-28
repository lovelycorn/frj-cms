const { createCoreController } = require("@strapi/strapi").factories;

const INQUIRY_UID = "api::inquiry.inquiry";

module.exports = createCoreController(INQUIRY_UID, ({ strapi }) => ({
  async submit(ctx) {
    const payload = ctx.request.body?.data || ctx.request.body || {};
    const ip = ctx.request.ip || ctx.ip || null;

    const created = await strapi.service(INQUIRY_UID).submit(payload, ip);
    ctx.body = { data: created };
  },
}));
