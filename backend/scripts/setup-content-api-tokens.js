#!/usr/bin/env node

const { createStrapi } = require("@strapi/strapi");

const TOKEN_DEFINITIONS = [
  {
    name: "frontend-readonly",
    description: "Frontend public read access for published content.",
    type: "read-only",
  },
  {
    name: "ops-dashboard",
    description: "Operations dashboard and inquiry follow-up token.",
    type: "custom",
    permissions: [
      "api::dashboard.dashboard.overview",
      "api::inquiry.inquiry.find",
      "api::inquiry.inquiry.findOne",
      "api::inquiry.inquiry.update",
    ],
  },
  {
    name: "analytics-ingest",
    description: "Analytics event ingestion token.",
    type: "custom",
    permissions: ["api::analytics-event.analytics-event.capture"],
  },
];

function buildPayload(definition) {
  const payload = {
    name: definition.name,
    description: definition.description,
    type: definition.type,
    lifespan: null,
  };

  if (definition.type === "custom") {
    payload.permissions = definition.permissions || [];
  }

  return payload;
}

async function ensureActionsExist(strapi, definitions) {
  const validActions = new Set(strapi.contentAPI.permissions.providers.action.keys());

  for (const definition of definitions) {
    if (definition.type !== "custom") {
      continue;
    }

    const missing = (definition.permissions || []).filter((action) => !validActions.has(action));
    if (missing.length > 0) {
      throw new Error(
        `Token "${definition.name}" has unknown actions: ${missing.join(", ")}`
      );
    }
  }
}

async function upsertTokens(strapi, definitions) {
  const tokenService = strapi.service("admin::api-token-content-api");
  const created = [];
  const updated = [];

  for (const definition of definitions) {
    const payload = buildPayload(definition);
    const existing = await tokenService.getByName(definition.name);

    if (!existing) {
      const createdToken = await tokenService.create(payload);
      created.push({
        name: definition.name,
        accessKey: createdToken.accessKey,
      });
      continue;
    }

    await tokenService.update(existing.id, payload);
    updated.push({ name: definition.name });
  }

  return { created, updated };
}

async function main() {
  const app = await createStrapi().load();

  try {
    await ensureActionsExist(app, TOKEN_DEFINITIONS);
    const { created, updated } = await upsertTokens(app, TOKEN_DEFINITIONS);

    console.log("Token setup completed.");
    console.log(`Created: ${created.length}, Updated: ${updated.length}`);

    if (created.length > 0) {
      console.log("\nNewly created token secrets (shown once):");
      for (const item of created) {
        console.log(`${item.name}=${item.accessKey}`);
      }
    } else {
      console.log("\nNo new token was created. Existing tokens were updated in-place.");
    }
  } finally {
    await app.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
