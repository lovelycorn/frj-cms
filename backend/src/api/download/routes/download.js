const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::download.download", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
