"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { personalInfo } from "@/data/personal";

export default function Hero() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {personalInfo.title}
          </p>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            {personalInfo.name}
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {personalInfo.summary}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/projects"
            className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-slate-300 px-8 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            About Me
          </Link>
        </motion.div>

        {/* Tech icons row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-slate-400 dark:text-slate-500"
        >
          {[
            "React",
            "TypeScript",
            "React Native",
            "Kotlin",
            "Next.js",
            "Vite",
            "Node.js",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-slate-200 px-4 py-1.5 dark:border-slate-700"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
