"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { trackBehaviorEvent } from "@/lib/analytics";
import { submitInquiry } from "@/lib/api";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { Textarea } from "@/src/components/ui/textarea";

type SubmitState = "idle" | "submitting" | "success" | "error";

function sanitizeField(value: FormDataEntryValue | null, maxLength: number): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  if (!normalized) {
    return undefined;
  }

  return normalized.slice(0, maxLength);
}

function parseSourceProduct(raw: string | null): number | undefined {
  if (!raw) {
    return undefined;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function ContactForm() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const submittingRef = useRef(false);

  const sourcePage = useMemo(() => {
    const fromQuery = searchParams.get("source_page");
    if (fromQuery && fromQuery.trim().length > 0) {
      return fromQuery.slice(0, 255);
    }
    return `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`.slice(0, 255);
  }, [pathname, searchParams]);

  const sourceProduct = useMemo(() => parseSourceProduct(searchParams.get("source_product")), [searchParams]);

  const utmParams = useMemo(
    () => ({
      utm_source: searchParams.get("utm_source") || undefined,
      utm_medium: searchParams.get("utm_medium") || undefined,
      utm_campaign: searchParams.get("utm_campaign") || undefined,
      utm_term: searchParams.get("utm_term") || undefined,
      utm_content: searchParams.get("utm_content") || undefined,
    }),
    [searchParams]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (submittingRef.current || submitState === "submitting") {
      return;
    }

    submittingRef.current = true;
    setSubmitState("submitting");

    const form = new FormData(event.currentTarget);
    const payload = {
      name: sanitizeField(form.get("name"), 100) || "",
      email: sanitizeField(form.get("email"), 120) || "",
      message: sanitizeField(form.get("message"), 2000) || "",
      company: sanitizeField(form.get("company"), 120),
      phone: sanitizeField(form.get("phone"), 50),
      country: sanitizeField(form.get("country"), 80),
      source_page: sourcePage,
      source_product: sourceProduct,
      utm_params: utmParams,
    };

    try {
      const success = await submitInquiry(payload);
      if (!success) {
        setSubmitState("error");
        return;
      }

      setSubmitState("success");
      event.currentTarget.reset();

      void trackBehaviorEvent(
        {
          eventName: "inquiry_submit",
          sourcePage: payload.source_page,
          sourceProduct: payload.source_product,
          utmParams: payload.utm_params,
        },
        {
          strapi: false,
          posthog: true,
        }
      );
    } catch {
      setSubmitState("error");
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <MotionFadeIn>
      <Card className="space-y-4 rounded-2xl p-6 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Label className="flex flex-col gap-2">
              <span>Name</span>
              <Input name="name" required />
            </Label>

            <Label className="flex flex-col gap-2">
              <span>Email</span>
              <Input type="email" name="email" required />
            </Label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Label className="flex flex-col gap-2">
              <span>Phone</span>
              <Input name="phone" />
            </Label>

            <Label className="flex flex-col gap-2">
              <span>Country</span>
              <Input name="country" />
            </Label>
          </div>

          <Label className="flex flex-col gap-2">
            <span>Company</span>
            <Input name="company" />
          </Label>

          <Label className="flex flex-col gap-2">
            <span>Message</span>
            <Textarea
              name="message"
              rows={5}
              required
              placeholder="Please share your product requirements, quantity, and target market."
            />
          </Label>

          <Button type="submit" size="lg" disabled={submitState === "submitting"}>
            Send Inquiry
          </Button>

          {submitState === "success" ? (
            <p className="text-sm font-medium text-emerald-700">Thanks! Your inquiry was submitted successfully.</p>
          ) : null}
          {submitState === "error" ? (
            <p className="text-sm font-medium text-red-700">Submit failed. Please try again in a moment.</p>
          ) : null}
        </form>
      </Card>
    </MotionFadeIn>
  );
}
