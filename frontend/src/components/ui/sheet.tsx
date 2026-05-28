"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/src/components/ui/cn";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;
const SheetTitle = DialogPrimitive.Title;
const SheetDescription = DialogPrimitive.Description;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function SheetOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-slate-950/45 data-[state=open]:animate-in data-[state=closed]:animate-out",
        className,
      )}
      {...props}
    />
  );
});

const sheetVariants = cva(
  "fixed z-50 bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.2)] transition ease-in-out data-[state=closed]:duration-200 data-[state=open]:duration-300",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-slate-200 data-[state=closed]:-translate-y-full data-[state=open]:translate-y-0",
        right:
          "inset-y-0 right-0 h-full w-full border-l border-slate-200 data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 sm:max-w-sm",
        bottom:
          "inset-x-0 bottom-0 border-t border-slate-200 data-[state=closed]:translate-y-full data-[state=open]:translate-y-0",
        left:
          "inset-y-0 left-0 h-full w-full border-r border-slate-200 data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0 sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, SheetContentProps>(
  function SheetContent({ side = "right", className, children, ...props }, ref) {
    return (
      <SheetPortal>
        <SheetOverlay />
        <DialogPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6 18 18M6 18 18 6" />
            </svg>
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  },
);

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle, SheetDescription };
