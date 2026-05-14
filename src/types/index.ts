export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  highlights: string[];
  challenges: { problem: string; solution: string }[];
  role: string;
  duration: string;
  category: "web" | "mobile" | "tools";
}

export interface SkillCategory {
  ecosystem: string;
  skills: string[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  location: string;
  summary: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  date: string; // ISO format: YYYY-MM-DD
  tags: string[];
  readingTime: string; // e.g. "8 min read"
}
