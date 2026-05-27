import { cache } from "react";

import { getGlobalSettings } from "@/lib/api";
import { SiteConfig, SiteContact } from "@/lib/site-config";

interface GlobalContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  workingHours?: string;
}

const getGlobalSettingsCached = cache(getGlobalSettings);

function toSafeString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function parseContactInfoJson(value: string): GlobalContactInfo | null {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (typeof parsed !== "object" || parsed === null) {
      return null;
    }

    const record = parsed as Record<string, unknown>;

    return {
      email: toSafeString(record.email),
      phone: toSafeString(record.phone),
      address: toSafeString(record.address),
      workingHours: toSafeString(record.workingHours ?? record.hours),
    };
  } catch {
    return null;
  }
}

function parseContactInfoText(value: string): GlobalContactInfo {
  const sections = value
    .split(/\||\n|;/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  const parsed: GlobalContactInfo = {};

  sections.forEach((section) => {
    const [rawKey, ...rest] = section.split(":");
    if (!rawKey) {
      return;
    }

    if (rest.length === 0) {
      if (!parsed.address) {
        parsed.address = section;
      }
      return;
    }

    const key = rawKey.trim().toLowerCase();
    const content = rest.join(":").trim();

    if (!content) {
      return;
    }

    if (key.includes("email") || key.includes("mail")) {
      parsed.email = content;
      return;
    }

    if (key.includes("phone") || key.includes("tel") || key.includes("mobile")) {
      parsed.phone = content;
      return;
    }

    if (key.includes("hour") || key.includes("time")) {
      parsed.workingHours = content;
      return;
    }

    if (key.includes("address") || key.includes("location")) {
      parsed.address = content;
    }
  });

  return parsed;
}

function parseGlobalContactInfo(value: string): GlobalContactInfo {
  if (!value.trim()) {
    return {};
  }

  const jsonResult = parseContactInfoJson(value);
  if (jsonResult) {
    return jsonResult;
  }

  return parseContactInfoText(value);
}

function mergeContact(defaultContact: SiteContact, contactInfo: string): SiteContact {
  const parsed = parseGlobalContactInfo(contactInfo);

  return {
    email: parsed.email ?? defaultContact.email,
    phone: parsed.phone ?? defaultContact.phone,
    address: parsed.address ?? defaultContact.address,
    workingHours: parsed.workingHours ?? defaultContact.workingHours,
  };
}

export async function resolveSiteConfig(baseConfig: SiteConfig): Promise<SiteConfig> {
  const globalSettings = await getGlobalSettingsCached();

  if (!globalSettings) {
    return baseConfig;
  }

  return {
    ...baseConfig,
    companyName:
      globalSettings.companyName.trim().length > 0 ? globalSettings.companyName.trim() : baseConfig.companyName,
    contact: mergeContact(baseConfig.contact, globalSettings.contactInfo),
  };
}
