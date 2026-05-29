export const designSystem = {
  layout: {
    container: "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8",
    sectionSpacing: "py-14 sm:py-16 lg:py-20",
    heroSpacing: "py-16 sm:py-24 lg:py-28",
  },
  typography: {
    heroTitle: "text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl",
    sectionTitle: "text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl",
    sectionLead: "mt-4 max-w-2xl text-base leading-7 text-slate-600",
  },
  radius: {
    card: "rounded-2xl",
    button: "rounded-md",
    panel: "rounded-xl",
  },
  shadows: {
    soft: "shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
    strong: "shadow-[0_18px_40px_rgba(15,23,42,0.12)]",
  },
} as const;

export const pageShellClasses = {
  site: "min-h-screen bg-slate-50 text-slate-900",
  content: "flex-1",
} as const;
