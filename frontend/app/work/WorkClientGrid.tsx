"use client";

import { useEffect, useState } from "react";
import type { ProjectListItem } from "@/lib/api";
import { ProjectCard } from "@/app/components/ProjectCard";

export function WorkClientGrid({ initialProjects }: { initialProjects: ProjectListItem[] }) {
  const [projects, setProjects] = useState<ProjectListItem[]>(initialProjects);

  useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects);
      return;
    }

    fetch("/api/v1/projects")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setProjects(json.data);
        }
      })
      .catch(() => {});
  }, [initialProjects]);

  if (!projects || projects.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No builds published yet — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
