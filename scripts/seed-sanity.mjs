// One-time migration: pushes the real content that was already entered through
// the old local CMS (about/mentorship/navigation) into Sanity, so it doesn't
// need to be retyped by hand in Studio. Projects are left out — they were still
// placeholder data, so add real projects directly in Studio.
//
// Usage: SANITY_API_TOKEN=<token-with-write-access> node scripts/seed-sanity.mjs
import { createClient } from '@sanity/client';

try {
  process.loadEnvFile('.env.local');
} catch {
  // optional
}

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    'Set SANITY_PROJECT_ID (and SANITY_DATASET if not "production") in .env.local, ' +
      'and pass a write-capable SANITY_API_TOKEN — e.g.\n' +
      '  SANITY_API_TOKEN=sk... node scripts/seed-sanity.mjs'
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion: '2024-01-01', token, useCdn: false });

const aboutDoc = {
  _id: 'about',
  _type: 'about',
  aboutIntro:
    "I'm Vivek Ramachandran, a product designer and strategist who combines craft, systems thinking, and business impact.",
  aboutFull:
    "I've spent the last 8+ years designing products that millions of people use every day - from zero-to-one consumer apps to enterprise platforms with global scale. I work across the full product lifecycle: from early discovery and strategy through to shipping polished, production-ready experiences.\n\nMy background: I started as a software engineer (machine learning developer) and then transitioned into product design and management, which means I think in systems, speak the language of engineers and stakeholders equally well, and obsess over the things that sit between the pixels - the logic, the constraints, and the outcomes.\n\nWhen I'm not designing, I'm mentoring the next generation of product designers, business analysts, start-up entrepreneurs, and writing articles at the intersection of strategy and business.\n\nI believe that great design is invisible when it's working and unforgettable when it's not.",
  skills: [
    { name: 'Product Design', category: 'craft' },
    { name: 'Design Systems', category: 'craft' },
    { name: 'UX Research', category: 'craft' },
    { name: 'Interaction Design', category: 'craft' },
    { name: 'Prototyping', category: 'craft' },
    { name: 'Visual Design', category: 'craft' },
    { name: 'Product Strategy', category: 'strategy' },
    { name: 'Roadmapping', category: 'strategy' },
    { name: 'Stakeholder Alignment', category: 'strategy' },
    { name: 'Design Leadership', category: 'strategy' },
    { name: 'Figma', category: 'tools' },
    { name: 'Framer', category: 'tools' },
    { name: 'React', category: 'tools' },
    { name: 'TypeScript', category: 'tools' },
    { name: 'Storybook', category: 'tools' },
    { name: 'Notion', category: 'tools' },
    { name: 'ChatGPT / Claude', category: 'ai' },
    { name: 'Midjourney', category: 'ai' },
    { name: 'Cursor', category: 'ai' },
    { name: 'Copilot & Automation ', category: 'ai' },
    { name: 'Ollama LLM & Offline Hosting', category: 'ai' },
    { name: 'AI-Assisted Prototyping', category: 'ai' },
  ],
  values: [
    { title: 'Vision before execution', body: 'Great products begin with a clear direction. I align teams around a shared vision before focusing on delivery.' },
    { title: 'Customer value drives decisions', body: 'Every roadmap, feature, and investment should create meaningful value for customers and measurable value for the business.' },
    { title: 'Build systems, not dependencies', body: 'Strong teams scale through frameworks, processes, and shared ownership not individual heroics.' },
    { title: 'Outcomes define success', body: 'I focus on business impact, customer outcomes, and long-term product health rather than output alone.' },
    { title: 'Create clarity in ambiguity', body: 'Leadership is turning uncertainty into direction. I bring structure, priorities, and confidence to complex challenges.' },
    { title: 'Elevate people and culture', body: 'Products grow when people grow. I invest in mentorship, collaboration, and building high-performing teams.' },
  ],
  quickFacts: {
    city: 'Chennai, TN, India',
    years: '8+ years in product design',
    background: 'Software, UI/UX Design, Product Management',
    currentRole: 'Lead UX Designer',
    education:
      'B.Tech IT, M.sc AI & ML, IDX & CalsArts UX Design & Specialization, IIM Kozhikode Product Management, IIT Patna Agentic AI and Generative AI',
  },
};

const mentorshipDocs = [
  {
    _id: 'mentorship-free-office-hours',
    _type: 'mentorshipTier',
    tierId: { _type: 'slug', current: 'free-office-hours' },
    type: 'free',
    name: 'Open Office Hours',
    tagline: 'A free, no-agenda conversation for designers early in their journey.',
    price: null,
    duration: '30 min / session',
    includes: [
      'Portfolio feedback (first pass)',
      'Career path Q&A',
      'Job-search strategy chat',
      'No strings attached — no upsell',
    ],
    forWhom:
      "Junior designers, career switchers, and students who need a sounding board and don't know where to start.",
    cta: { label: 'Book a free session', href: 'mailto:vdraganer@gmail.com?subject=Office Hours Request' },
    order: 0,
  },
  {
    _id: 'mentorship-paid-starter',
    _type: 'mentorshipTier',
    tierId: { _type: 'slug', current: 'paid-starter' },
    type: 'paid',
    name: 'Orbit — Starter',
    tagline: 'Structured momentum for designers ready to level up their craft or career.',
    price: '[PRICE PLACEHOLDER]',
    duration: '4 sessions / month · 60 min each',
    includes: [
      'Weekly 1:1 video calls',
      'Async portfolio and case-study reviews',
      'Personalised skill-building exercises',
      'Figma file / design critique',
      'Email support between sessions',
      'Resource library access',
    ],
    forWhom:
      'Mid-level designers looking to break into senior roles, build a standout portfolio, or transition into product strategy.',
    cta: { label: 'Apply for Orbit', href: 'mailto:vdraganer@gmail.com?subject=Orbit Mentorship Application' },
    order: 1,
  },
  {
    _id: 'mentorship-paid-deep-dive',
    _type: 'mentorshipTier',
    tierId: { _type: 'slug', current: 'paid-deep-dive' },
    type: 'paid',
    name: 'Deep Dive — Intensive',
    tagline: 'High-touch, outcome-focused engagement for designers with specific goals and a tight timeline.',
    price: '[PRICE PLACEHOLDER]',
    duration: '8 sessions · 90 min each · 8 weeks',
    includes: [
      'Everything in Orbit, plus:',
      'Full portfolio audit and rebuild support',
      'End-to-end case study coaching',
      'Interview prep and salary negotiation coaching',
      'Introductions to relevant hiring managers (where possible)',
      'Voxer async access for the full 8 weeks',
      'Priority scheduling',
    ],
    forWhom:
      'Senior designers, design leads, or career-pivoting professionals with a concrete goal (landing a FAANG/Series-B role, getting promoted, launching a studio).',
    cta: { label: 'Apply for Deep Dive', href: 'mailto:vdraganer@gmail.com?subject=Deep Dive Application' },
    order: 2,
  },
];

const navigationDoc = {
  _id: 'navigation',
  _type: 'navigation',
  navItems: [
    { _type: 'navItem', _key: 'work', label: 'Work', href: '/works' },
    { _type: 'navItem', _key: 'about', label: 'About', href: '/about' },
    { _type: 'navItem', _key: 'mentorship', label: 'Mentorship', href: '/mentorship' },
  ],
  socialLinks: [
    { _type: 'socialLink', _key: 'github', label: 'GitHub', href: 'https://github.com/vivekrbot', icon: 'github' },
    { _type: 'socialLink', _key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/itsvivekramachandran/', icon: 'linkedin' },
    { _type: 'socialLink', _key: 'dribbble', label: 'Dribbble', href: 'https://dribbble.com/itsvivekdesign', icon: 'dribbble' },
    { _type: 'socialLink', _key: 'medium', label: 'Medium', href: 'https://medium.com/@vivekramachandran', icon: 'medium' },
    { _type: 'socialLink', _key: 'adplist', label: 'ADPList', href: 'https://adplist.org/mentors/vivek-ramachandran', icon: 'adplist' },
  ],
};

function addKeys(doc) {
  return { ...doc, skills: doc.skills?.map((s, i) => ({ _key: `skill-${i}`, ...s })), values: doc.values?.map((v, i) => ({ _key: `value-${i}`, ...v })) };
}

const tx = client.transaction();
tx.createOrReplace(addKeys(aboutDoc));
tx.createOrReplace(navigationDoc);
for (const doc of mentorshipDocs) tx.createOrReplace(doc);

const result = await tx.commit();
console.log(`[seed-sanity] Seeded ${result.results.length} documents into dataset "${dataset}".`);
