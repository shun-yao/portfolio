import { skills } from "@/data/skills";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionTitle from "@/components/shared/SectionTitle";

export default function SkillsOverview() {
  return (
    <section className="bg-slate-50 py-24 dark:bg-slate-800/50">
      <div className="mx-auto max-w-5xl px-6">
        <AnimatedSection>
          <SectionTitle
            title="Tech Stack"
            subtitle="Organized by ecosystem"
          />
        </AnimatedSection>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category, i) => (
            <AnimatedSection key={category.ecosystem} delay={i * 0.08}>
              <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
                <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {category.ecosystem}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
