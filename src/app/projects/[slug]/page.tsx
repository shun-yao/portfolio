import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/data/projects";
import TechBadge from "@/components/projects/TechBadge";
import AnimatedSection from "@/components/shared/AnimatedSection";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.subtitle,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const next =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back link */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          &larr; All Projects
        </Link>

        <AnimatedSection>
          {/* Header */}
          <div className="mb-12">
            <span className="mb-2 inline-block text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {project.category} &middot; {project.role}
            </span>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {project.title}
            </h1>
            <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <TechBadge key={t} name={t} />
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              {project.duration}
            </p>
          </div>
        </AnimatedSection>

        {/* Highlights */}
        <AnimatedSection delay={0.1}>
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
              Key Highlights
            </h2>
            <ul className="space-y-3">
              {project.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-slate-700 dark:text-slate-300"
                >
                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>

        {/* Challenges */}
        <AnimatedSection delay={0.2}>
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
              Challenges & Solutions
            </h2>
            <div className="space-y-6">
              {project.challenges.map((c, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 p-6 dark:border-slate-700"
                >
                  <p className="mb-2 text-sm font-medium text-red-600 dark:text-red-400">
                    Challenge
                  </p>
                  <p className="mb-4 text-slate-700 dark:text-slate-300">
                    {c.problem}
                  </p>
                  <p className="mb-2 text-sm font-medium text-green-600 dark:text-green-400">
                    Solution
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    {c.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Navigation */}
        <div className="flex justify-between border-t border-slate-200 pt-8 dark:border-slate-700">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              &larr; {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/projects/${next.slug}`}
              className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {next.title} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  );
}
