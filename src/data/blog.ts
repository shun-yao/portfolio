import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "hilt-injection-reference",
    title: "Hilt Injection Reference: When to Use Which Annotation",
    subtitle:
      "A practical reference for Hilt's core injection annotations — @Inject, @AndroidEntryPoint, @EntryPoint, and @AssistedInject — for the moments when you're not sure which one fits your situation.",
    excerpt:
      "Hilt exposes its dependency graph through four core annotations, each fitting a specific situation. This is a quick lookup for when you've forgotten which one applies — pull it up when you're not sure whether you need @EntryPoint or @AssistedInject, or when you want to recall what @AndroidEntryPoint actually does under the hood. Assumes basic DI knowledge.",
    date: "2026-05-15",
    tags: ["Android", "Hilt", "Dagger", "Dependency Injection"],
    readingTime: "5 min read",
  },
  {
    slug: "android-startup-mechanism",
    title: "Before Application.onCreate(): How Android Libraries Run Code at Startup",
    subtitle:
      "From the ContentProvider lifecycle hack to androidx.startup — a deep dive into the mechanism that powers Jetpack auto-init",
    excerpt:
      "ContentProviders have a quiet property most developers never use directly: Android instantiates them before Application.onCreate() runs. Library authors discovered this hook years ago and abused it to the point that cold starts paid the price. This article traces the lifecycle property that started it all, the bloat it caused, and how Jetpack's Startup library refactored the entire ecosystem — using WorkManager as the worked example.",
    date: "2026-05-06",
    tags: ["Android", "Jetpack", "Architecture", "ContentProvider"],
    readingTime: "9 min read",
  },
];
