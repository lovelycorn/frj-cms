module.exports = {
  routes: [
    {
      method: "POST",
      path: "/inquiries/submit",
      handler: "inquiry.submit",
      config: {
        auth: false,
      },
    },
  ],
};
