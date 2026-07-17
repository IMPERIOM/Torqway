import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, CalendarDays, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAllPostSlugs } from "@/lib/data/blog";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  const description = post.meta_description ?? post.excerpt ?? undefined;
  return {
    title: post.meta_title ?? post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/blog" className="hover:text-foreground">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{post.title}</span>
      </nav>

      <h1 className="font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {post.author && (
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" /> {post.author}
          </span>
        )}
        {post.published_at && (
          <span className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> {formatDate(post.published_at)}
          </span>
        )}
      </div>

      {post.cover_image && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-neutral mt-8 max-w-none prose-headings:font-heading prose-headings:uppercase prose-headings:tracking-tight prose-a:text-brand-700 prose-strong:text-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content ?? ""}
        </ReactMarkdown>
      </div>
    </article>
  );
}
