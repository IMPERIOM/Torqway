import type { Metadata } from "next";
import { CategoryListing } from "@/components/site/category-listing";
import { categoryRoutes } from "@/config/site";

export const metadata: Metadata = {
  title: categoryRoutes["container-offices"].title,
  description: categoryRoutes["container-offices"].description,
};

export default async function ContainerOfficesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return <CategoryListing routeKey="container-offices" searchParams={sp} />;
}
