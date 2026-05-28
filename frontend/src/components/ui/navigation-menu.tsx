"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as React from "react";

import { cn } from "@/src/components/ui/cn";

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(function NavigationMenu({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Root ref={ref} className={cn("relative z-10 flex flex-1 items-center justify-center", className)} {...props}>
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
});

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.List ref={ref} className={cn("group flex flex-1 list-none items-center justify-center gap-2", className)} {...props} />
  );
});

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={cn(
        "group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 data-[state=open]:bg-slate-100",
        className,
      )}
      {...props}
    >
      {children}
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-500 transition-transform group-data-[state=open]:rotate-180" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </NavigationMenuPrimitive.Trigger>
  );
});

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
        "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out lg:absolute lg:w-auto",
        className,
      )}
      {...props}
    />
  );
});

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(function NavigationMenuViewport({ className, ...props }, ref) {
  return (
    <div className="absolute left-0 top-full flex justify-center">
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        className={cn(
          "relative mt-3 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.16)] data-[state=closed]:animate-out data-[state=open]:animate-in lg:w-[var(--radix-navigation-menu-viewport-width)]",
          className,
        )}
        {...props}
      />
    </div>
  );
});

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
};
