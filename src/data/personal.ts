import { PersonalInfo, NavItem } from "@/types";

export const personalInfo: PersonalInfo = {
  name: "[Your Name]",
  title: "Frontend Engineer",
  email: "your.email@example.com",
  phone: "+886-XXX-XXX-XXX",
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourusername",
  location: "Taiwan",
  summary:
    "Cross-platform developer with 3-5 years of experience specializing in React, React Native, and Android. Building enterprise-grade, real-time data-driven applications across web, mobile, and developer tooling.",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
