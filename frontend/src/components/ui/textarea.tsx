import * as React from "react";

import { cn } from "@/src/components/ui/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-200",
          className,
        )}
        {...props}
      />
    );
  },
);
