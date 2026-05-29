module.exports = {
  async overview(ctx) {
    const lookbackDays = Number.parseInt(ctx.query?.lookbackDays, 10);
    const data = await strapi
      .service("api::analytics.analytics")
      .getOverview({ lookbackDays: Number.isNaN(lookbackDays) ? undefined : lookbackDays });

    ctx.body = { data };
  },
};
