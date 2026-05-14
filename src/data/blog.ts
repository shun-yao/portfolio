import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
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
