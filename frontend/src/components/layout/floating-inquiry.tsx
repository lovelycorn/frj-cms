"use client";

import LocalizedLink from "@/components/LocalizedLink";
import type { SiteContact } from "@/lib/site-config";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";

interface FloatingInquiryProps {
  contact: SiteContact;
}

function toWhatsAppHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function FloatingInquiry({ contact }: FloatingInquiryProps) {
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <TooltipProvider delayDuration={120}>
          <div className="flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <LocalizedLink
                  href="/contact"
                  className="inline-flex h-11 items-center rounded-md bg-brand-700 px-4 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.2)] transition hover:bg-brand-800"
                >
                  Request Quote
                </LocalizedLink>
              </TooltipTrigger>
              <TooltipContent side="left">Send product inquiry</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={toWhatsAppHref(contact.phone)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center rounded-md border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.12)] transition hover:bg-slate-100"
                >
                  WhatsApp
                </a>
              </TooltipTrigger>
              <TooltipContent side="left">Direct mobile chat</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden">
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_14px_40px_rgba(15,23,42,0.2)]">
          <LocalizedLink
            href="/contact"
            className="inline-flex h-10 items-center justify-center rounded-md bg-brand-700 px-3 text-sm font-semibold text-white"
          >
            Inquiry
          </LocalizedLink>
          <a
            href={toWhatsAppHref(contact.phone)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-slate-300 px-3 text-sm font-semibold text-slate-800"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
