"use client";

import { useEffect, useState, useRef } from "react";
import type { ProjectListItem } from "@/lib/api";
import { ProjectCard } from "@/app/components/ProjectCard";
import { Pagination } from "@/app/components/Pagination";

const ITEMS_PER_PAGE = 6;

export function WorkClientGrid({ initialProjects }: { initialProjects: ProjectListItem[] }) {
  const [projects, setProjects] = useState<ProjectListItem[]>(initialProjects);
  const [currentPage, setCurrentPage] = useState(1);
  const gridTopRef = useRef<HTMLDivElement>(null);

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

  const totalPages = Math.ceil((projects?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = (projects || []).slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        No builds published yet — check back soon.
      </p>
    );
  }

  return (
    <>
      <div ref={gridTopRef} className="scroll-mt-24" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={projects.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={handlePageChange}
      />
    </>
  );
}

