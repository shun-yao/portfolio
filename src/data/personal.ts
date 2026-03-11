import { PersonalInfo, NavItem } from "@/types";

export const personalInfo: PersonalInfo = {
  name: "[Your Name]",
  title: "Senior Software Engineer",
  email: "your.email@example.com",
  phone: "+886-XXX-XXX-XXX",
  github: "https://github.com/shun-yao",
  linkedin: "https://linkedin.com/in/yourusername",
  location: "Taiwan",
  summary:
    "Senior software engineer with 12+ years of experience. Android native developer turned React/React Native cross-platform specialist. Building enterprise-grade, real-time data-driven applications across web, mobile, and developer tooling.",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
