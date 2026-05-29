import * as React from "react";

import { cn } from "@/src/components/ui/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus-visible:border-brand-600 focus-visible:ring-2 focus-visible:ring-brand-200",
        className,
      )}
      {...props}
    />
  );
});
