const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::faq.faq", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
