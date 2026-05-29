module.exports = {
  routes: [
    {
      method: "GET",
      path: "/news",
      handler: "news.find",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/news/:id",
      handler: "news.findOne",
      config: {
        auth: false,
      },
    },
  ],
};
