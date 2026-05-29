const ANALYTICS_EVENT_UID = "api::analytics-event.analytics-event";
const INQUIRY_UID = "api::inquiry.inquiry";
const PRODUCT_UID = "api::product.product";
const BLOG_UID = "api::blog.blog";
const CASE_STUDY_UID = "api::case-study.case-study";
const NEWS_UID = "api::news.news";
const FAQ_UID = "api::faq.faq";

const EVENT_NAMES = ["page_view", "inquiry_submit", "product_click", "download_click"];
const INQUIRY_STATUSES = ["new", "contacted", "quoted", "closed"];

function daysAgoStart(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

module.exports = ({ strapi }) => ({
  async getOverview(options = {}) {
    const lookbackDays = Number.isInteger(options.lookbackDays) ? options.lookbackDays : 30;
    const createdAtGte = daysAgoStart(lookbackDays);

    const eventCounts = {};
    for (const eventName of EVENT_NAMES) {
      eventCounts[eventName] = await strapi.db.query(ANALYTICS_EVENT_UID).count({
        where: {
          event_name: eventName,
          createdAt: {
            $gte: createdAtGte,
          },
        },
      });
    }

    const inquiryCounts = {};
    for (const status of INQUIRY_STATUSES) {
      inquiryCounts[status] = await strapi.db.query(INQUIRY_UID).count({
        where: { status },
      });
    }

    const contentTotals = {
      products: await strapi.db.query(PRODUCT_UID).count(),
      blogs: await strapi.db.query(BLOG_UID).count(),
      caseStudies: await strapi.db.query(CASE_STUDY_UID).count(),
      news: await strapi.db.query(NEWS_UID).count(),
      faqs: await strapi.db.query(FAQ_UID).count(),
      inquiries: await strapi.db.query(INQUIRY_UID).count(),
    };

    return {
      lookbackDays,
      events: eventCounts,
      inquiries: inquiryCounts,
      totals: contentTotals,
      generatedAt: new Date().toISOString(),
      source: "strapi-reserved-analytics-layer",
      note: "Heavy analytics should remain in PostHog. This API is only a lightweight operational summary.",
    };
  },
});
