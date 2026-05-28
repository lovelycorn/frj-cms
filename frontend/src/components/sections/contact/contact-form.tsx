"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { MotionFadeIn } from "@/src/components/ui/motion-fade-in";
import { Textarea } from "@/src/components/ui/textarea";

type SubmitState = "idle" | "success";

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitState("success");
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

          <Button type="submit" size="lg">
            Send Inquiry
          </Button>

          {submitState === "success" ? (
            <p className="text-sm font-medium text-emerald-700">Thanks! Your inquiry was submitted successfully.</p>
          ) : null}
        </form>
      </Card>
    </MotionFadeIn>
  );
}
