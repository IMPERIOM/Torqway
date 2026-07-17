import type { Metadata } from "next";
import { CategoryListing } from "@/components/site/category-listing";
import { categoryRoutes } from "@/config/site";

export const metadata: Metadata = {
  title: categoryRoutes["modular-buildings"].title,
  description: categoryRoutes["modular-buildings"].description,
};

export default async function ModularBuildingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <CategoryListing routeKey="modular-buildings" searchParams={sp} />;
}
