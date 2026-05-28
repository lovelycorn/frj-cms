const { createCoreController } = require("@strapi/strapi").factories;

const ANALYTICS_EVENT_UID = "api::analytics-event.analytics-event";

module.exports = createCoreController(ANALYTICS_EVENT_UID, ({ strapi }) => ({
  async capture(ctx) {
    const ingestToken = process.env.ANALYTICS_INGEST_TOKEN;
    if (ingestToken) {
      const providedToken = ctx.request.header?.["x-analytics-ingest-token"];
      if (!providedToken || providedToken !== ingestToken) {
        return ctx.unauthorized("Invalid analytics ingest token");
      }
    }

    const payload = ctx.request.body?.data || ctx.request.body || {};
    const meta = {
      ip: ctx.request.ip || ctx.ip || null,
      userAgent: ctx.request.header?.["user-agent"] || null,
    };

    const created = await strapi.service(ANALYTICS_EVENT_UID).capture(payload, meta);
    ctx.body = { data: created };
  },
}));
