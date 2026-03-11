import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "real-time-web-console",
    title: "Real-time Interactive Web Console",
    subtitle: "Enterprise-grade real-time data visualization platform",
    description:
      "A responsive web console delivering real-time data dashboards, transaction management, trend analysis, and automated workflows. Features adaptive API polling, virtualized rendering, and rich animations for seamless user experiences.",
    tech: [
      "React 17",
      "TypeScript",
      "Redux Toolkit",
      "MUI 5",
      "GSAP",
      "Lottie",
      "RxJS",
      "react-window",
    ],
    highlights: [
      "7+ custom Redux middleware for JWT auth, error logging, and cross-module state sync",
      "Adaptive polling: 10-30s regular intervals, 1s high-frequency on countdown expiry",
      "Virtualized lists with react-window for 1,000+ row rendering at 60fps",
      "GSAP + Lottie animation pipeline for live data transitions",
      "Shared library architecture via Git Submodules across 3 projects",
    ],
    challenges: [
      {
        problem:
          "Frequent re-renders caused by real-time data updates degrading performance",
        solution:
          "Applied useMemo, useCallback, and granular Redux selectors to minimize re-render scope",
      },
      {
        problem: "Multi-environment deployment consistency across 6 stages",
        solution:
          "GitLab CI matrix builds with isolated environment variables per stage",
      },
    ],
    role: "Frontend Developer",
    duration: "2023 - Present",
    category: "web",
  },
  {
    slug: "enterprise-admin-dashboard",
    title: "Enterprise Admin Dashboard",
    subtitle: "Full-featured back-office management system",
    description:
      "A modern admin dashboard with 9 business modules including product management, member management, promotions, reporting, and real-time notifications. Features role-based access control, multi-language support, and WebSocket communication.",
    tech: [
      "React 18",
      "TypeScript",
      "Vite",
      "Tailwind CSS 4",
      "Zustand",
      "Ant Design 5",
      "React Hook Form",
      "Zod",
      "SignalR",
      "Sentry",
    ],
    highlights: [
      "Led state management migration from Redux Toolkit to Zustand (~60% less boilerplate)",
      "Type-safe form validation with React Hook Form + Zod schema inference",
      "SignalR WebSocket with custom useSignalR hook managing connection lifecycle",
      "Vite manualChunks splitting (vendor/antd/router/utils) for optimized loading",
      "Sentry integration with automated source map upload and cleanup",
      "9 domain modules with OPC variant builds from single codebase",
    ],
    challenges: [
      {
        problem:
          "CRA build times exceeding 30s, slowing development iteration",
        solution:
          "Migrated to Vite, reducing dev startup to <2s with instant HMR",
      },
      {
        problem:
          "OPC and main back-office needed different API targets from same codebase",
        solution:
          "Vite mode-based isOpcMode detection with dynamic proxy target switching",
      },
    ],
    role: "Lead Frontend Developer",
    duration: "2024 - Present",
    category: "web",
  },
  {
    slug: "cross-platform-mobile-app",
    title: "Cross-Platform Mobile Application",
    subtitle: "iOS/Android/Web app with hot-update architecture",
    description:
      "A cross-platform mobile application built with React Native supporting iOS, Android, and Web. Features a dual-bundle hot-update architecture enabling zero-downtime OTA deployments, type-safe navigation, and native module integration.",
    tech: [
      "React Native 0.68",
      "TypeScript",
      "Redux Toolkit",
      "RTK Query",
      "React Navigation 6",
      "Lottie",
      "Native Bridge",
    ],
    highlights: [
      "Dual-bundle architecture (Launch + GameClient) for OTA zero-downtime updates",
      "Type-safe navigation with RootStackParamList + CompositeScreenProps",
      "RTK Query API layer with 3 custom middleware (auth/error/sync)",
      "Native Bridge integration for IJK video player across iOS/Android",
      "RecyclerListView for high-performance long list rendering",
    ],
    challenges: [
      {
        problem:
          "Managing triple-platform bundle builds (iOS/Android/Web) was error-prone",
        solution:
          "Custom Gulp scripts for automated manifest generation and version management",
      },
      {
        problem: "FlatList performance degradation with 500+ items",
        solution:
          "Replaced with RecyclerListView for recycled cell rendering",
      },
    ],
    role: "Mobile Developer",
    duration: "2023 - Present",
    category: "mobile",
  },
  {
    slug: "android-native-library",
    title: "Android Native SDK",
    subtitle: "Kotlin/Java AAR library for host app integration",
    description:
      "A native Android library published as AAR, providing complete real-time data display, transaction submission, and analytics. Features strict MVVM architecture with 4 ViewModel patterns, Repository-based networking, and zero-intrusion host app integration.",
    tech: [
      "Kotlin",
      "Java",
      "MVVM",
      "LiveData",
      "ViewModel",
      "Volley",
      "Gradle",
      "Jenkins",
    ],
    highlights: [
      "MVVM architecture with 4 ViewModel patterns (shared, single, combo, report)",
      "Repository pattern with 5 repositories + Volley + Gson networking layer",
      "7-stage Jenkins CI/CD pipeline with automated Maven/Artifactory publishing",
      "Host integration via IGameLauncher + IBrandHeader + BroadcastReceiver",
      "NDK/JNI sensitive config encryption + ProGuard obfuscation",
    ],
    challenges: [
      {
        problem:
          "Library needed zero-intrusion integration with diverse host apps",
        solution:
          "Interface + Broadcast pattern allowing hosts to implement only what they need",
      },
      {
        problem: "Observer leaks in ViewPager with Fragment lifecycle",
        solution:
          "Used viewLifecycleOwner instead of Fragment instance for LiveData observation",
      },
    ],
    role: "Android Developer",
    duration: "2023 - 2024",
    category: "mobile",
  },
  {
    slug: "developer-automation-mcp-server",
    title: "Developer Automation MCP Server",
    subtitle: "AI-powered workflow automation for Cursor IDE",
    description:
      "A Model Context Protocol server integrating Jira, Jenkins, and SharePoint into Cursor IDE. Provides 12 automation tools with dual-transport support (stdio/SSE) and per-session authentication for team-wide developer workflow optimization.",
    tech: ["Node.js", "Express", "MCP SDK", "Jira API", "Jenkins API", "SharePoint API"],
    highlights: [
      "Dual transport: stdio (local) + SSE (remote) deployment modes",
      "12 MCP tools: 8 Jira + 3 Jenkins + 3 SharePoint integrations",
      "Per-session authentication with dynamic environment switching",
      "Streaming Excel download with one-time token security",
    ],
    challenges: [
      {
        problem:
          "MCP SDK early version lacked documentation for advanced patterns",
        solution:
          "Reverse-engineered SDK source code to understand protocol specifications",
      },
      {
        problem: "Multi-tool session isolation for concurrent users",
        solution:
          "Each connection maintains independent config and auth state",
      },
    ],
    role: "Full-stack Developer",
    duration: "2025",
    category: "tools",
  },
];
