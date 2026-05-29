const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::certificate.certificate", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
