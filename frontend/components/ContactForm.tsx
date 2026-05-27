"use client";

import { FormEvent, useState } from "react";

type SubmitState = "idle" | "success";

export default function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitState("success");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Name
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Company
        <input
          type="text"
          name="company"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Message
        <textarea
          name="message"
          rows={5}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
          placeholder="Please share your product requirements, quantity, and target market."
        />
      </label>

      <button
        type="submit"
        className="inline-flex rounded-md bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800"
      >
        Send Inquiry
      </button>

      {submitState === "success" ? (
        <p className="text-sm font-medium text-emerald-700">Thanks! Your inquiry was submitted successfully.</p>
      ) : null}
    </form>
  );
}
