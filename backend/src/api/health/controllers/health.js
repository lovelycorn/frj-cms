module.exports = {
  async check(ctx) {
    ctx.body = {
      status: "ok",
      service: "strapi",
      timestamp: new Date().toISOString(),
    };
  },
};
