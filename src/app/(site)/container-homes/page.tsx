import type { Metadata } from "next";
import { CategoryListing } from "@/components/site/category-listing";
import { categoryRoutes } from "@/config/site";

export const metadata: Metadata = {
  title: categoryRoutes["container-homes"].title,
  description: categoryRoutes["container-homes"].description,
};

export default async function ContainerHomesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <CategoryListing routeKey="container-homes" searchParams={sp} />;
}
