import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Newspaper, CalendarDays } from "lucide-react";
import { getPosts } from "@/lib/data/blog";
import { PageHeader } from "@/components/site/page-header";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides, insights and inspiration on shipping containers, container homes and modular construction.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHeader
        title="Blog"
        description="Guides, insights and inspiration for your next container project."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <Newspaper className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    {post.published_at && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(post.published_at)}
                      </span>
                    )}
                    <h3 className="mt-2 font-heading text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-brand-700">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
              <Newspaper className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-heading text-xl font-semibold">
                No posts yet
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Published articles will appear here once the database is
                connected and seeded.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
