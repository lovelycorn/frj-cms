import * as React from "react";

import { cn } from "@/src/components/ui/cn";
import { designSystem } from "@/src/styles/design-system";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(designSystem.layout.container, className)} {...props} />;
}
