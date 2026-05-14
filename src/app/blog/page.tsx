import Link from "next/link";
import { blogPosts } from "@/data/blog";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionTitle from "@/components/shared/SectionTitle";

export const metadata = {
  title: "Blog",
  description: "Articles on Android engineering, architecture, and tooling",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle
          title="Blog"
          subtitle="Notes, deep-dives, and observations from building production Android apps"
        />

        <div className="flex flex-col gap-6">
          {sorted.map((post, i) => (
            <AnimatedSection key={post.slug} delay={i * 0.08}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-slate-200 p-6 transition-colors hover:border-blue-500 dark:border-slate-700 dark:hover:border-blue-400"
              >
                <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <time>{formatDate(post.date)}</time>
                  <span aria-hidden>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="mb-2 text-2xl font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {post.title}
                </h2>
                <p className="mb-4 text-slate-600 dark:text-slate-400">
                  {post.excerpt}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
