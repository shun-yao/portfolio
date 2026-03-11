import { Metadata } from "next";
import { personalInfo } from "@/data/personal";
import { skills } from "@/data/skills";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionTitle from "@/components/shared/SectionTitle";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle title="About Me" />

        {/* Bio */}
        <AnimatedSection>
          <div className="mb-16 rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              {personalInfo.summary}
            </p>
            <div className="mt-6 flex gap-6 text-sm text-slate-500 dark:text-slate-400">
              <span>
                <strong className="text-slate-900 dark:text-white">
                  Location:
                </strong>{" "}
                {personalInfo.location}
              </span>
              <span>
                <strong className="text-slate-900 dark:text-white">
                  Experience:
                </strong>{" "}
                12+ years
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* Skills by ecosystem */}
        <AnimatedSection delay={0.1}>
          <h2 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
            Technical Skills
          </h2>
          <div className="space-y-6">
            {skills.map((category) => (
              <div
                key={category.ecosystem}
                className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">
                  {category.ecosystem}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Education */}
        <AnimatedSection delay={0.2}>
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-white">
              Education
            </h2>
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                [University Name]
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                [Degree & Major] &middot; [Graduation Year]
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Download resume CTA */}
        <AnimatedSection delay={0.3}>
          <div className="mt-16 text-center">
            <p className="mb-4 text-slate-600 dark:text-slate-400">
              Want to learn more about my experience?
            </p>
            <a
              href="/resume.pdf"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Download Resume
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
