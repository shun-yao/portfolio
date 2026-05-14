import { PersonalInfo, NavItem } from "@/types";

export const personalInfo: PersonalInfo = {
  name: "[Your Name]",
  title: "Senior Android Engineer",
  email: "your.email@example.com",
  phone: "+886-XXX-XXX-XXX",
  github: "https://github.com/shun-yao",
  linkedin: "https://linkedin.com/in/yourusername",
  location: "Taiwan",
  summary:
    "Senior Android Engineer with cross-platform experience in React Native and React. Committed to clean architecture, SOLID principles, and writing well-structured, maintainable, and testable code. Proficient in unit/UI testing, CI/CD automation, and leveraging AI tools (MCP, Skills, Rules) to boost team productivity.",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
