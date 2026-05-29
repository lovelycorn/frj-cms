import * as React from "react";

import { cn } from "@/src/components/ui/cn";
import { designSystem } from "@/src/styles/design-system";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
}

export function Section({ as = "section", className, ...props }: SectionProps) {
  const Tag = as;
  return <Tag className={cn(designSystem.layout.sectionSpacing, className)} {...props} />;
}
