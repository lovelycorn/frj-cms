const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::product.product", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
