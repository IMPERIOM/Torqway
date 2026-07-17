import type { Metadata } from "next";
import { CategoryListing } from "@/components/site/category-listing";
import { categoryRoutes } from "@/config/site";

export const metadata: Metadata = {
  title: categoryRoutes["containers"].title,
  description: categoryRoutes["containers"].description,
};

export default async function ContainersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <CategoryListing routeKey="containers" searchParams={sp} />;
}
