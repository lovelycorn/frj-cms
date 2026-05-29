const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::blog.blog", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
