import Image from "next/image";

import type { Product } from "@/types";

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const coverImage = product.images[0];
  const thumbnails = product.images.slice(1, 5);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        {coverImage ? (
          <Image
            src={coverImage.url}
            alt={coverImage.alternativeText || product.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-slate-100 text-slate-500">No Image</div>
        )}
      </div>

      {thumbnails.length > 0 ? (
        <div className="grid grid-cols-4 gap-3">
          {thumbnails.map((image) => (
            <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white">
              <Image
                src={image.url}
                alt={image.alternativeText || product.title}
                fill
                sizes="(max-width: 640px) 25vw, 180px"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
