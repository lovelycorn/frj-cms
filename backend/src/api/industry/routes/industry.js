const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::industry.industry", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
