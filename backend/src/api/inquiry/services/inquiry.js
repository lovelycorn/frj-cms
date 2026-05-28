const { createCoreService } = require("@strapi/strapi").factories;

const INQUIRY_UID = "api::inquiry.inquiry";
const ALLOWED_STATUSES = new Set(["new", "contacted", "quoted", "closed"]);

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

module.exports = createCoreService(INQUIRY_UID, ({ strapi }) => ({
  sanitizeSubmission(payload = {}, ipAddress) {
    const data = {
      name: sanitizeString(payload.name, 100),
      company: sanitizeString(payload.company, 120),
      email: sanitizeString(payload.email, 120),
      phone: sanitizeString(payload.phone, 50),
      country: sanitizeString(payload.country, 80),
      source_page: sanitizeString(payload.source_page, 255),
      message: sanitizeString(payload.message),
      status: "new",
      ip: sanitizeString(ipAddress, 64) || sanitizeString(payload.ip, 64),
    };

    if (payload.utm_params && typeof payload.utm_params === "object") {
      data.utm_params = {
        utm_source: sanitizeString(payload.utm_params.utm_source, 100),
        utm_medium: sanitizeString(payload.utm_params.utm_medium, 100),
        utm_campaign: sanitizeString(payload.utm_params.utm_campaign, 150),
        utm_term: sanitizeString(payload.utm_params.utm_term, 150),
        utm_content: sanitizeString(payload.utm_params.utm_content, 150),
      };
    }

    if (payload.source_product) {
      data.source_product = payload.source_product;
    }

    return data;
  },

  async submit(payload = {}, ipAddress) {
    const data = this.sanitizeSubmission(payload, ipAddress);

    const created = await strapi.documents(INQUIRY_UID).create({
      data,
    });

    try {
      await strapi.service("api::analytics-event.analytics-event").capture(
        {
          event_name: "inquiry_submit",
          source_page: data.source_page,
          source_product: data.source_product,
          utm_params: data.utm_params,
        },
        { ip: data.ip }
      );
    } catch (error) {
      strapi.log.warn(`Failed to capture inquiry_submit analytics event: ${error.message}`);
    }

    return created;
  },

  async updateStatus(documentId, status) {
    if (!ALLOWED_STATUSES.has(status)) {
      throw new Error("Invalid inquiry status");
    }

    return strapi.documents(INQUIRY_UID).update({
      documentId,
      data: { status },
    });
  },
}));
