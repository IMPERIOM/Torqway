"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];
const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
];
const STOCK = [
  { value: "in_stock", label: "In Stock" },
  { value: "limited", label: "Limited" },
  { value: "made_to_order", label: "Made to Order" },
  { value: "out_of_stock", label: "Out of Stock" },
];

type Option = { value: string; label: string };

export function ProductFilters({
  categoryOptions = [],
  categoryLabel = "Category",
}: {
  categoryOptions?: Option[];
  categoryLabel?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const hasActive =
    sp.has("category") ||
    sp.has("condition") ||
    sp.has("stock") ||
    (sp.get("sort") && sp.get("sort") !== "featured");

  const FilterSelect = ({
    param,
    label,
    options,
    includeAll = true,
    defaultValue = "all",
  }: {
    param: string;
    label: string;
    options: Option[];
    includeAll?: boolean;
    defaultValue?: string;
  }) => (
    <Select
      value={sp.get(param) ?? defaultValue}
      onValueChange={(v) => setParam(param, v)}
    >
      <SelectTrigger className="w-[170px]" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All {label}</SelectItem>}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      {categoryOptions.length > 0 && (
        <FilterSelect
          param="category"
          label={categoryLabel}
          options={categoryOptions}
        />
      )}
      <FilterSelect param="condition" label="Condition" options={CONDITIONS} />
      <FilterSelect param="stock" label="Availability" options={STOCK} />
      <FilterSelect
        param="sort"
        label="Sort"
        options={SORTS}
        includeAll={false}
        defaultValue="featured"
      />
      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          <X className="h-4 w-4" /> Reset
        </Button>
      )}
    </div>
  );
}
