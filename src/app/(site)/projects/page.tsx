import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { getProjects } from "@/lib/data/projects";
import { ProjectCard } from "@/components/site/project-card";
import { PageHeader } from "@/components/site/page-header";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore container homes, office complexes and modular buildings BoxSpace has delivered worldwide.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        title="Project Showcase"
        description="Real builds, delivered worldwide — from coastal container homes to remote accommodation villages."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-heading text-xl font-semibold">
                Projects coming soon
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Once the database is connected and seeded, completed projects
                appear here.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
