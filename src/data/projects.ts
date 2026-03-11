import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "real-time-web-console",
    title: "Real-time Interactive Web Console",
    subtitle: "Enterprise-grade real-time data visualization platform",
    description:
      "A responsive web console delivering real-time data dashboards, transaction management, trend analysis, and automated workflows. Features adaptive API polling, virtualized rendering, live video streaming, canvas animations, and an RxJS event bus for cross-module communication.",
    tech: [
      "React 17",
      "TypeScript",
      "Redux Toolkit",
      "MUI 5",
      "GSAP",
      "Lottie",
      "RxJS",
      "react-window",
      "Canvas",
      "FLV.js",
    ],
    highlights: [
      "7+ custom Redux middleware for JWT auth extraction, error logging, and cross-module state sync",
      "Adaptive polling system: 10-30s regular intervals, auto-switching to 1s on countdown expiry",
      "Virtualized lists with react-window for 1,000+ row rendering at 60fps",
      "RxJS Subject-based Event Bus for decoupled cross-feature communication (typed events, one-time listeners)",
      "FLV live streaming player with 20-attempt reconnection, exponential backoff, and H264 Canvas fallback",
      "Canvas animation framework using requestAnimationFrame with delta-time interpolation and multi-canvas anti-flicker",
      "GSAP + Lottie animation pipeline with CDN-based theme-configurable assets",
      "Shared library architecture via Git Submodules across 3 projects (nbg-common, react-common)",
    ],
    challenges: [
      {
        problem:
          "Frequent re-renders caused by real-time data updates degrading performance",
        solution:
          "Applied useMemo, useCallback, and granular Redux selectors to minimize re-render scope",
      },
      {
        problem:
          "FLV streaming on mobile browsers would silently fail due to autoplay restrictions",
        solution:
          "Implemented gesture-detection fallback, auto-reload on 1-hour timeout, and buffer monitoring with network latency tracking",
      },
      {
        problem:
          "Managing simultaneous canvas animations, video streams, and live data without memory leaks",
        solution:
          "Centralized lifecycle management with cleanup on component unmount, frame-skipping for low-priority animations",
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
      "A modern admin dashboard with 9 business modules including product management, member management, promotions, reporting, and real-time notifications. Features RBAC, multi-language support, SignalR WebSocket, audit logging, and OPC variant builds from a single codebase.",
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
      "i18next",
    ],
    highlights: [
      "Led state management migration from Redux Toolkit to Zustand (~60% less boilerplate)",
      "Type-safe form validation with React Hook Form + Zod schema inference (z.infer<typeof schema>)",
      "RBAC permission system: dual hierarchy (menu + function permissions) with product-group scoping",
      "SignalR WebSocket with custom useSignalR hook, stale-closure prevention via useRef, and auto-reconnection",
      "6 audit log types with field-level change tracking and localization keys for compliance",
      "Vite manualChunks splitting (vendor/antd/router/utils) + SWC compiler for optimized builds",
      "Sentry integration with automated source map upload, prod cleanup, and hidden sourcemaps",
      "9 domain modules with OPC variant builds from single codebase (isOpcMode dynamic API switching)",
      "Custom @xj/ui-framework integration with SCSS variable injection and themed MainProvider",
    ],
    challenges: [
      {
        problem:
          "CRA build times exceeding 30s, slowing development iteration",
        solution:
          "Migrated to Vite with SWC, reducing dev startup to <2s with instant HMR",
      },
      {
        problem:
          "Multi-tenant permission checking needed to support different products with different access rules",
        solution:
          "Singleton PermissionService with lazy-loaded permissions, supporting global/per-product/per-group checks",
      },
      {
        problem:
          "SignalR callbacks captured stale state in closures, causing incorrect UI updates",
        solution:
          "Wrapped listeners in useRef (listenersRef.current = listeners) and accessed current value in callbacks",
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
      "A cross-platform mobile application built with React Native supporting iOS, Android, and Web. Features a dual-bundle hot-update architecture, type-safe navigation, native module integration, Reanimated 3 worklet animations, and shared libraries across multiple products.",
    tech: [
      "React Native 0.68",
      "TypeScript",
      "Redux Toolkit",
      "RTK Query",
      "React Navigation 6",
      "Reanimated 3",
      "Lottie",
      "Native Bridge",
    ],
    highlights: [
      "Dual-bundle architecture (Launch + GameClient) for OTA zero-downtime updates via react-native-hotfix",
      "Type-safe navigation with RootStackParamList + CompositeScreenProps for multi-level navigator type inference",
      "RTK Query API layer with 3 custom middleware (auth token extraction / error logger / business sync)",
      "Reanimated 3 worklet-based collapsible header: useSharedValue + runOnUI for native-thread 60fps animations",
      "Native Bridge integration for IJK video player with platform-specific iOS/Android implementations",
      "RecyclerListView with cell recycling for high-performance rendering of 500+ item lists",
      "Shared library architecture: nbg-common + react-common as file-linked local packages across products",
    ],
    challenges: [
      {
        problem:
          "Managing triple-platform bundle builds (iOS/Android/Web) was error-prone and inconsistent",
        solution:
          "Custom Gulp scripts for automated manifest generation, version management, and platform-specific bundle output",
      },
      {
        problem:
          "Header collapse animation caused jank when driven from JS thread during fast scrolling",
        solution:
          "Migrated to Reanimated 3 worklets with runOnUI, keeping animation calculations on native thread with Extrapolate.CLAMP",
      },
      {
        problem:
          "iOS WebView had quirks with streaming video playback that didn't exist on Android",
        solution:
          "Platform-specific code paths with WebView configuration overrides and gesture handling for iOS autoplay restrictions",
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
      "A native Android library published as AAR, providing complete real-time data display, transaction submission, and analytics. Features strict MVVM architecture with 4 ViewModel patterns, Repository-based networking, NDK security, and comprehensive testing infrastructure (Unit + UI + Monkey).",
    tech: [
      "Kotlin",
      "Java",
      "MVVM",
      "LiveData",
      "ViewModel",
      "Coroutines",
      "Volley",
      "Gradle",
      "Jenkins",
      "Espresso",
    ],
    highlights: [
      "MVVM architecture with 4 ViewModel patterns: shared state, single-action, accumulated-combo, and remote-report",
      "Repository pattern with 5 repositories + Volley + Gson networking layer and abstract data access",
      "7-stage Jenkins CI/CD pipeline (Init → Versions → Compile → Build → Lint → Deploy → Tag) with Maven publishing",
      "Host integration via IGameLauncher + IBrandHeader + BroadcastReceiver for zero-intrusion SDK embedding",
      "NDK/JNI sensitive config encryption + AES/DES API response encryption + ProGuard obfuscation",
      "Comprehensive testing: Espresso UI tests organized by game type, Spoon screenshot testing, custom IdlingResources for async sync",
      "MediatorLiveData + Transformations.map() for composing reactive state from multiple data sources",
      "CacheManager orchestrating counter sync, member info, chips, and rewards with retry logic and server time sync",
    ],
    challenges: [
      {
        problem:
          "Library needed zero-intrusion integration with diverse host apps of different architectures",
        solution:
          "Interface + Broadcast pattern: hosts implement only IBrandHeader, receive events via BroadcastReceiver",
      },
      {
        problem:
          "Observer leaks in ViewPager where Fragments detach but don't destroy, causing duplicate updates",
        solution:
          "Used viewLifecycleOwner (View lifecycle) instead of Fragment instance for all LiveData observations",
      },
      {
        problem:
          "UI tests were flaky due to async network calls and animations completing at unpredictable times",
        solution:
          "Custom IdlingResources for Fragment lifecycle and LiveData updates, plus case/space-insensitive custom matchers",
      },
    ],
    role: "Android Developer",
    duration: "2013 - Present",
    category: "mobile",
  },
  {
    slug: "developer-automation-mcp-server",
    title: "Developer Automation MCP Server",
    subtitle: "AI-powered workflow automation for Cursor IDE",
    description:
      "A Model Context Protocol server integrating Jira, Jenkins, and SharePoint into Cursor IDE. Provides 12 automation tools with dual-transport support, per-session authentication, recursive Atlassian Document Format parsing, and streaming file downloads.",
    tech: [
      "Node.js",
      "Express",
      "MCP SDK",
      "Jira API",
      "Jenkins API",
      "SharePoint API",
    ],
    highlights: [
      "Dual transport: stdio (local) + SSE (remote) with runtime switching via environment variable",
      "12 MCP tools: 8 Jira (CRUD, transitions, search) + 3 Jenkins (trigger, status, poll) + 3 SharePoint (read, search, download)",
      "Per-session authentication: HTTP headers take precedence over query params (security best practice)",
      "Recursive ADF (Atlassian Document Format) text extraction for Jira issue parsing",
      "Streaming Excel download with in-memory processing and one-time token security",
      "Structured error responses with markdown formatting and graceful service degradation",
    ],
    challenges: [
      {
        problem:
          "MCP SDK early version lacked documentation for advanced transport and session patterns",
        solution:
          "Reverse-engineered SDK source code to understand protocol specifications and session lifecycle",
      },
      {
        problem:
          "Multi-tool session isolation needed for concurrent team usage in SSE mode",
        solution:
          "Each SSE connection creates independent client instances with isolated config and auth state",
      },
      {
        problem:
          "Large Excel files from SharePoint caused memory spikes when loaded entirely into memory",
        solution:
          "Streaming download with one-time tokens, processing sheets in-memory with xlsx library and cleanup after transfer",
      },
    ],
    role: "Full-stack Developer",
    duration: "2025",
    category: "tools",
  },
];
