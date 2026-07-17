import Image from "next/image";
import Link from "next/link";
import { categoryHref } from "@/lib/category-link";
import { Icon } from "./lucide-icon";
import type { Category } from "@/types/database";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={categoryHref(category.slug)}
      className="group relative flex h-48 flex-col justify-end overflow-hidden rounded-lg bg-brand-800 p-5 text-white shadow-sm"
    >
      {category.image_url && (
        <Image
          src={category.image_url}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/40 to-transparent" />
      <div className="relative">
        <Icon name={category.icon} className="mb-2 h-8 w-8 text-brand-300" />
        <h3 className="font-heading text-lg font-semibold uppercase tracking-tight">
          {category.name}
        </h3>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-sm text-white/80">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
