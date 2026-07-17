import Image from "next/image";
import Link from "next/link";
import { ImageOff, MapPin } from "lucide-react";
import type { Project } from "@/types/database";

export function ProjectCard({ project }: { project: Project }) {
  const img = project.images?.[0];
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {img ? (
          <Image
            src={img}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageOff className="h-10 w-10" />
          </div>
        )}
        {project.type && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-700 px-2.5 py-1 text-xs font-semibold text-white">
            {project.type}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-lg font-semibold leading-tight tracking-tight transition-colors group-hover:text-brand-700">
          {project.title}
        </h3>
        {project.location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> {project.location}
          </p>
        )}
        {project.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {project.summary}
          </p>
        )}
      </div>
    </Link>
  );
}
