import type { AboutData, Skill, Value, QuickFacts } from '../types';

export const ABOUT_STORAGE_KEY = 'vr-cms-about';

export const defaultAboutData: AboutData = {
  aboutIntro: `I'm Vivek Ramachandran — a product designer and strategist who lives at the intersection of craft, systems thinking, and business impact.`,
  aboutFull: `I've spent the last [X] years designing products that millions of people use every day — from zero-to-one consumer apps to enterprise platforms with global scale. I work across the full product lifecycle: from early discovery and strategy through to shipping polished, production-ready experiences.

My background is unusual: I started as a [BACKGROUND PLACEHOLDER — e.g., engineer / brand designer / consultant], which means I think in systems, speak the language of engineers and stakeholders equally well, and obsess over the things that sit between the pixels — the logic, the constraints, the outcomes.

When I'm not designing, I'm mentoring the next generation of product designers, writing about design at the intersection of strategy, and [PERSONAL INTEREST PLACEHOLDER].

I believe great design is invisible when it's working and unforgettable when it's not.`,
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
    { name: 'Galileo AI', category: 'ai' },
    { name: 'Runway ML', category: 'ai' },
    { name: 'AI-Assisted Prototyping', category: 'ai' },
  ],
  values: [
    {
      title: 'Clarity over cleverness',
      body: 'The best design solution is usually the most obvious one. I push past the clever idea to find the clear one.',
    },
    {
      title: 'Systems before surfaces',
      body: 'Pixels are easy. Structure is hard. I design the system first, then the screens.',
    },
    {
      title: 'Outcomes, not output',
      body: 'Shipping features is easy. Shipping features that move the needle is the real work.',
    },
    {
      title: 'Craft at every layer',
      body: 'From the strategic frame to the micro-interaction, every layer deserves the same care.',
    },
  ],
  quickFacts: {
    city: '[YOUR CITY — placeholder]',
    years: '[X]+ years in product design',
    background: '[YOUR BACKGROUND — placeholder]',
    currentRole: '[CURRENT ROLE / STATUS — placeholder]',
    education: '[YOUR EDUCATION — placeholder]',
  },
};

export function getAboutData(): AboutData {
  try {
    const stored = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate it's a real AboutData object with skills array
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.skills)) {
        // Merge: if stored skills have no 'ai' category entries, append defaults
        const hasAI = parsed.skills.some((s: { category: string }) => s.category === 'ai');
        if (!hasAI) {
          const aiSkills = defaultAboutData.skills.filter((s) => s.category === 'ai');
          parsed.skills = [...parsed.skills, ...aiSkills];
          localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed as AboutData;
      }
    }
  } catch {
    localStorage.removeItem(ABOUT_STORAGE_KEY);
  }
  return defaultAboutData;
}

const _aboutData = getAboutData();

export const aboutIntro: string     = _aboutData.aboutIntro;
export const aboutFull: string      = _aboutData.aboutFull;
export const skills: Skill[]        = _aboutData.skills;
export const values: Value[]        = _aboutData.values;
export const quickFacts: QuickFacts = _aboutData.quickFacts;
