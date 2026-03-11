import Link from "next/link";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionTitle from "@/components/shared/SectionTitle";

export default function FeaturedProjects() {
  const featured = projects.slice(0, 3);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-6">
        <AnimatedSection>
          <SectionTitle
            title="Featured Projects"
            subtitle="Enterprise-grade applications across web, mobile, and tooling"
          />
        </AnimatedSection>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <AnimatedSection key={project.slug} delay={i * 0.1}>
              <ProjectCard project={project} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection>
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all projects &rarr;
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
