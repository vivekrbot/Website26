import type { Project } from '../types';

export const PROJECTS_STORAGE_KEY = 'vr-cms-projects';

export const defaultProjects: Project[] = [
  {
    slug: 'orbit-design-system',
    title: 'Orbit Design System',
    tagline: 'A scalable, token-driven design system for a fintech platform serving 2M+ users.',
    category: 'Design Systems',
    tags: ['Figma', 'Tokens', 'React', 'Documentation'],
    year: 2024,
    coverImage: '',
    featured: true,
    role: 'Lead Product Designer',
    links: [
      { label: 'Case Study', url: '#' },
      { label: 'Live Storybook', url: '#' },
    ],
  },
  {
    slug: 'nova-mobile-app',
    title: 'Nova — Mobile Banking App',
    tagline: 'Zero-to-one product design for a Gen-Z focused neobank, from discovery to launch.',
    category: 'Product Design',
    tags: ['iOS', 'Android', 'User Research', 'Prototyping'],
    year: 2024,
    coverImage: '',
    featured: true,
    role: 'Senior Product Designer',
    links: [
      { label: 'Case Study', url: '#' },
      { label: 'App Store', url: '#' },
    ],
  },
  {
    slug: 'pulse-dashboard',
    title: 'Pulse — Analytics Dashboard',
    tagline: 'Redesigning a complex B2B analytics product to reduce time-to-insight by 45%.',
    category: 'Product Design',
    tags: ['B2B', 'Data Visualization', 'Dashboard', 'UX Research'],
    year: 2023,
    coverImage: '',
    featured: true,
    role: 'Product Designer',
    links: [{ label: 'Case Study', url: '#' }],
  },
  {
    slug: 'terrain-brand',
    title: 'Terrain — Brand & Web',
    tagline: 'Full brand identity and marketing site for a sustainable outdoor gear startup.',
    category: 'Brand & Web',
    tags: ['Branding', 'Web Design', 'Motion', 'Sustainability'],
    year: 2023,
    coverImage: '',
    featured: false,
    role: 'Design Lead',
    links: [
      { label: 'Case Study', url: '#' },
      { label: 'Live Site', url: '#' },
    ],
  },
  {
    slug: 'waypoint-strategy',
    title: 'Waypoint — Product Strategy',
    tagline: 'Led the 0→1 product strategy for a B2B SaaS tool now used by 500+ enterprise teams.',
    category: 'Strategy',
    tags: ['Product Strategy', 'Roadmap', 'Enterprise', 'B2B SaaS'],
    year: 2022,
    coverImage: '',
    featured: false,
    role: 'Product Strategy Lead',
    links: [{ label: 'Case Study', url: '#' }],
  },
];

export function getProjectsData(): Project[] {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed as Project[];
    }
  } catch {
    localStorage.removeItem(PROJECTS_STORAGE_KEY);
  }
  return defaultProjects;
}

export const projects = getProjectsData();
export const featuredProjects = projects.filter((p) => p.featured);
