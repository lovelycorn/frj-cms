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
    {
      method: "POST",
      path: "/inquiries/confirm",
      handler: "inquiry.confirm",
      config: {
        auth: false,
      },
    },
  ],
};
