import type { Project } from '../types';

export const projects: Project[] = [
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
    problem:
      'The product had grown to 14 teams shipping independently, resulting in 200+ inconsistent UI patterns, 6-week design debt cycles, and a broken handoff process.',
    process: [
      'Audited all existing UI patterns across 4 product surfaces.',
      'Ran stakeholder workshops to align on token naming conventions.',
      'Built the token architecture (primitive → semantic → component layers) in Figma Variables.',
      'Shipped the React component library in parallel with the Figma library.',
      'Authored the contribution guide and ran onboarding sessions for all design-eng pairs.',
    ],
    outcome:
      'Reduced design-to-dev handoff time by 60%. Adopted by all 14 teams within 3 months. Became the company\'s single source of truth for UI.',
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
    problem:
      'Young users (18–25) found traditional banking apps overwhelming and untrustworthy. The challenge was to design a financial product that felt approachable, transparent, and delightful.',
    process: [
      '48 user interviews across 3 cities to map financial anxiety points.',
      'Competitive teardowns of 12 fintech apps.',
      'Ran 4 rounds of prototype testing with target cohort.',
      'Designed the full IA, core flows, and micro-interaction library.',
    ],
    outcome:
      '4.8-star App Store rating at launch. 40K users onboarded in first 30 days. Featured by Apple as "App of the Day".',
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
    problem:
      'Power users were spending an average of 22 minutes per session just to locate the data they needed. The dashboard had grown organically with no information architecture strategy.',
    process: [
      'Card sorting and tree testing with 30 existing power users.',
      'Redesigned the IA from 5 levels deep to a flat, context-driven layout.',
      'Built an adaptive sidebar that learns from user behavior.',
      'Introduced progressive disclosure for advanced filters.',
    ],
    outcome:
      'Average time-to-insight dropped from 22 min to 12 min. User satisfaction score improved from 62 to 87 (NPS).',
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
    problem:
      'Terrain needed a brand identity that communicated environmental values without leaning on tired "green" clichés — and a website that converted skeptical outdoor enthusiasts.',
    process: [
      'Brand strategy workshops with founding team.',
      'Developed visual identity: mark, palette, typography, tone of voice.',
      'Designed and prototyped the full marketing site.',
      'Created motion guidelines for social/video content.',
    ],
    outcome:
      'Site conversion rate 2.3× above category benchmark. Brand featured in Fast Company\'s design roundup.',
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
    problem:
      'The founding team had strong engineering capability but no product strategy framework. They needed to move from "building features" to "building outcomes".',
    process: [
      'Ran a 6-week discovery sprint with 20 enterprise prospects.',
      'Defined the Jobs-to-be-Done framework and prioritization model.',
      'Built the 18-month product roadmap with clear bets and kill criteria.',
      'Established the design-engineering-product triad operating model.',
    ],
    outcome:
      'Closed Series A 4 months after strategy engagement. Product now used by 500+ enterprise teams.',
    links: [{ label: 'Case Study', url: '#' }],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
