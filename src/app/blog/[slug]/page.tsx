import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { articleRegistry } from "@/components/blog/articleRegistry";
import AnimatedSection from "@/components/shared/AnimatedSection";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const Article = articleRegistry[slug];
  if (!Article) notFound();

  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  const currentIndex = sorted.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? sorted[currentIndex - 1] : null;
  const next =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null;

  return (
    <div className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          &larr; All Posts
        </Link>

        <AnimatedSection>
          {/* Header */}
          <header className="mb-12">
            <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <time>{formatDate(post.date)}</time>
              <span aria-hidden>&middot;</span>
              <span>{post.readingTime}</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {post.title}
            </h1>
            <p className="mb-6 text-lg text-slate-600 dark:text-slate-400">
              {post.subtitle}
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
          </header>
        </AnimatedSection>

        {/* Article body */}
        <AnimatedSection delay={0.1}>
          <article>
            <Article />
          </article>
        </AnimatedSection>

        {/* Navigation */}
        <div className="mt-16 flex justify-between border-t border-slate-200 pt-8 dark:border-slate-700">
          {prev ? (
            <Link
              href={`/blog/${prev.slug}`}
              className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              &larr; {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
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

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
