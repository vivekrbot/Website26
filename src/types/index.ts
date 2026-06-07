export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  tags: string[];
  year: number;
  coverImage: string;
  featured: boolean;
  role: string;
  problem: string;
  process: string[];
  outcome: string;
  links: { label: string; url: string }[];
}

export interface MentorshipTier {
  id: string;
  type: 'free' | 'paid';
  name: string;
  tagline: string;
  price: string | null;
  duration: string;
  includes: string[];
  forWhom: string;
  cta: { label: string; href: string };
}

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface Skill {
  name: string;
  category: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface QuickFacts {
  city: string;
  years: string;
  background: string;
  currentRole: string;
  education: string;
}

export interface Value {
  title: string;
  body: string;
}

export interface AboutData {
  aboutIntro: string;
  aboutFull: string;
  skills: Skill[];
  values: Value[];
  quickFacts: QuickFacts;
}

export interface NavigationData {
  navItems: NavItem[];
  socialLinks: SocialLink[];
}
