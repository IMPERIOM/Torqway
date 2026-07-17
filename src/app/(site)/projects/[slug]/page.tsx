import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, CalendarDays, Quote } from "lucide-react";
import {
  getProjectBySlug,
  getAllProjectSlugs,
} from "@/lib/data/projects";
import { ProductGallery } from "@/components/site/product-gallery";
import { formatDate } from "@/lib/format";

export const revalidate = 60;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const description = project.meta_description ?? project.summary ?? undefined;
  return {
    title: project.meta_title ?? project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: project.title,
      description,
      images: project.images?.[0] ? [{ url: project.images[0] }] : undefined,
    },
  };
}

function humanize(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const specs =
    project.specs && typeof project.specs === "object" && !Array.isArray(project.specs)
      ? (project.specs as Record<string, unknown>)
      : {};
  const specEntries = Object.entries(specs).filter(
    ([, v]) => v !== null && v !== undefined && v !== "",
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/projects" className="hover:text-foreground">
          Projects
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{project.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={project.images} alt={project.title} />

        <div>
          {project.type && (
            <span className="rounded-full bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white">
              {project.type}
            </span>
          )}
          <h1 className="mt-3 font-heading text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            {project.title}
          </h1>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {project.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {project.location}
              </span>
            )}
            {project.completed_at && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />{" "}
                {formatDate(project.completed_at)}
              </span>
            )}
          </div>

          {project.summary && (
            <p className="mt-4 text-lg text-foreground/80">{project.summary}</p>
          )}

          {specEntries.length > 0 && (
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {specEntries.map(([k, v]) => (
                <div key={k} className="bg-card p-4">
                  <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                    {humanize(k)}
                  </dt>
                  <dd className="mt-1 font-semibold">{String(v)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {project.description && (
        <div className="mt-12 max-w-3xl">
          <p className="whitespace-pre-line leading-relaxed text-foreground/80">
            {project.description}
          </p>
        </div>
      )}

      {project.testimonial && (
        <figure className="mx-auto mt-12 max-w-3xl rounded-lg bg-brand-50 p-8 text-center">
          <Quote className="mx-auto h-8 w-8 text-brand-400" />
          <blockquote className="mt-4 text-lg font-medium text-brand-900">
            “{project.testimonial}”
          </blockquote>
          {project.testimonial_author && (
            <figcaption className="mt-3 text-sm font-semibold text-brand-700">
              — {project.testimonial_author}
            </figcaption>
          )}
        </figure>
      )}
    </div>
  );
}
