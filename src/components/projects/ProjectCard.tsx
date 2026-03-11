import Link from "next/link";
import { Project } from "@/types";
import TechBadge from "./TechBadge";

interface ProjectCardProps {
  project: Project;
}

const categoryIcons: Record<string, string> = {
  web: "🌐",
  mobile: "📱",
  tools: "🛠",
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <div className="group h-full rounded-xl border border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-600">
        <div className="mb-3 flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[project.category]}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {project.category}
          </span>
        </div>

        <h3 className="mb-1 text-xl font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {project.title}
        </h3>

        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
          {project.subtitle}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <TechBadge key={t} name={t} />
          ))}
          {project.tech.length > 5 && (
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{project.role}</span>
          <span>{project.duration}</span>
        </div>
      </div>
    </Link>
  );
}
