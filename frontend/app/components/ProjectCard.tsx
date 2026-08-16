import Image from "next/image";
import Link from "next/link";
import { type ProjectListItem } from "@/lib/api";

export function ProjectCard({ project }: { project: ProjectListItem }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group cursor-pointer shimmer-card block"
    >
      <div className="aspect-[4/3] bg-surface border border-hairline-strong mb-4 relative overflow-hidden rounded">
        <Image
          src={project.cover_image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)] px-3 py-1.5 rounded shadow">
            View Build
          </span>
        </div>

        <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-500/40 transition-all duration-500 rounded" />
      </div>
      <div>
        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">
          {project.car_make} {project.car_model}
        </div>
        <h3 className="text-sm font-bold text-ink mb-2 group-hover:text-red-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
          {project.description}
        </p>
      </div>
    </Link>
  );
}
