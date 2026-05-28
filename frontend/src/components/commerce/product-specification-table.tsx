import type { ProductSpecificationItem } from "@/types";

interface ProductSpecificationTableProps {
  specifications: ProductSpecificationItem[];
}

export function ProductSpecificationTable({ specifications }: ProductSpecificationTableProps) {
  if (specifications.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        Detailed technical specifications will be provided during inquiry.
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Product Specifications</h2>
      </div>
      <dl className="divide-y divide-slate-200">
        {specifications.map((spec) => (
          <div key={spec.label} className="grid gap-2 px-6 py-4 sm:grid-cols-[220px_1fr] sm:items-start">
            <dt className="text-sm font-semibold text-slate-700">{spec.label}</dt>
            <dd className="text-sm leading-6 text-slate-700">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
