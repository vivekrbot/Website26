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
