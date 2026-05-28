"use client";

import LocalizedLink from "@/components/LocalizedLink";
import type { Category } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

interface ProductCategoryTabsProps {
  categories: Category[];
  activeCategory?: string;
}

export function ProductCategoryTabs({ categories, activeCategory }: ProductCategoryTabsProps) {
  const activeValue = activeCategory?.trim().toLowerCase() || "all";

  return (
    <Tabs value={activeValue}>
      <TabsList>
        <TabsTrigger value="all" asChild>
          <LocalizedLink href="/products">All</LocalizedLink>
        </TabsTrigger>
        {categories.map((item) => {
          const value = item.slug.toLowerCase();
          return (
            <TabsTrigger key={item.id} value={value} asChild>
              <LocalizedLink href={`/products?category=${encodeURIComponent(item.slug)}`}>{item.name}</LocalizedLink>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
