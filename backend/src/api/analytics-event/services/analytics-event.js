const { createCoreService } = require("@strapi/strapi").factories;

const ANALYTICS_EVENT_UID = "api::analytics-event.analytics-event";
const ALLOWED_EVENTS = new Set(["page_view", "inquiry_submit", "product_click", "download_click"]);

function sanitizeString(value, maxLength) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  return typeof maxLength === "number" ? normalized.slice(0, maxLength) : normalized;
}

module.exports = createCoreService(ANALYTICS_EVENT_UID, ({ strapi }) => ({
  sanitizeEvent(payload = {}, meta = {}) {
    const eventName = sanitizeString(payload.event_name, 50);
    if (!ALLOWED_EVENTS.has(eventName)) {
      throw new Error("Invalid analytics event name");
    }

    const occurredAtDate = payload.occurred_at ? new Date(payload.occurred_at) : new Date();
    const occurredAt = Number.isNaN(occurredAtDate.getTime())
      ? new Date().toISOString()
      : occurredAtDate.toISOString();

    const data = {
      event_name: eventName,
      source_page: sanitizeString(payload.source_page, 255),
      visitor_id: sanitizeString(payload.visitor_id, 120),
      session_id: sanitizeString(payload.session_id, 120),
      ip: sanitizeString(meta.ip, 64) || sanitizeString(payload.ip, 64),
      user_agent: sanitizeString(meta.userAgent, 255) || sanitizeString(payload.user_agent, 255),
      properties: payload.properties && typeof payload.properties === "object" ? payload.properties : undefined,
      occurred_at: occurredAt,
    };

    if (payload.source_product) {
      data.source_product = payload.source_product;
    }

    if (payload.source_inquiry) {
      data.source_inquiry = payload.source_inquiry;
    }

    if (payload.utm_params && typeof payload.utm_params === "object") {
      data.utm_params = {
        utm_source: sanitizeString(payload.utm_params.utm_source, 100),
        utm_medium: sanitizeString(payload.utm_params.utm_medium, 100),
        utm_campaign: sanitizeString(payload.utm_params.utm_campaign, 150),
        utm_term: sanitizeString(payload.utm_params.utm_term, 150),
        utm_content: sanitizeString(payload.utm_params.utm_content, 150),
      };
    }

    return data;
  },

  async capture(payload = {}, meta = {}) {
    const data = this.sanitizeEvent(payload, meta);

    return strapi.documents(ANALYTICS_EVENT_UID).create({
      data,
    });
  },
}));
