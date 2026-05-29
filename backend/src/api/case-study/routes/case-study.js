const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::case-study.case-study", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
