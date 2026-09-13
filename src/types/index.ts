import type { ArbitraryTypedObject, PortableTextBlock } from '@portabletext/types';

export type ProjectBody = (PortableTextBlock | ArbitraryTypedObject)[];

// Deliberately excludes `body` — the full case-study rich text for every
// project. It lives in a separate per-slug map (src/data/project-bodies.ts)
// loaded on demand by WorkDetail, so listing pages (Works, WorksSnippet) that
// only ever render this metadata don't pull all six case studies' text into
// their bundle just to render title/tagline/tags on a card.
export interface Project {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  category: string;
  tags: string[];
  year: number;
  coverImage: string;
  featured: boolean;
  role: string;
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

export interface NavigationData {
  navItems: NavItem[];
  socialLinks: SocialLink[];
}
