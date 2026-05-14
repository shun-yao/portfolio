import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "android-startup-mechanism",
    title: "How Android App Initialization Actually Works",
    subtitle:
      "A deep dive into androidx.startup, InitializationProvider, and the magic behind library auto-init",
    excerpt:
      "Have you ever wondered how WorkManager, EmojiCompat, and ProcessLifecycle all initialize themselves before your Application.onCreate() even runs — without you writing a single line of init code? This article traces the entire mechanism, from manifest merging to ContentProvider discovery, and explains why the Jetpack Startup library exists.",
    date: "2026-05-06",
    tags: ["Android", "Jetpack", "WorkManager", "Architecture"],
    readingTime: "8 min read",
  },
];
