module.exports = {
  routes: [
    {
      method: "POST",
      path: "/analytics/events",
      handler: "analytics-event.capture",
      config: {
        auth: false,
      },
    },
  ],
};
