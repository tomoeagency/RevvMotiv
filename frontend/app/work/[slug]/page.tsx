import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProject, getProjects } from "@/lib/api";
import { ProjectAngleSelector } from "@/app/components/ProjectAngleSelector";
import { ClosingCta } from "@/app/components/ClosingCta";

type Params = { slug: string };

export async function generateStaticParams() {
  const { data: projects } = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Build Not Found — RevvMotiv" };
  }

  return {
    title: `${project.title} — RevvMotiv`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [{ url: project.cover_image }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  return (
    <>
      <div className="pt-6 sm:pt-8 md:pt-12 pb-20 px-4 sm:px-6 max-w-screen-2xl mx-auto w-full">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Our Work
        </Link>

        <ProjectAngleSelector project={project} />
      </div>

      <ClosingCta
        heading="Like This Build?"
        body="Tell us about your car and we'll help you get a similar look."
      />
    </>
  );
}
