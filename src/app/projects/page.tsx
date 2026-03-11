"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionTitle from "@/components/shared/SectionTitle";

const categories = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "mobile", label: "Mobile" },
  { key: "tools", label: "Tools" },
] as const;

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  return (
    <div className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <SectionTitle
          title="Projects"
          subtitle="Enterprise applications across web, mobile, and developer tooling"
        />

        {/* Filter tabs */}
        <div className="mb-12 flex justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                filter === cat.key
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <AnimatedSection key={project.slug} delay={i * 0.08}>
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
