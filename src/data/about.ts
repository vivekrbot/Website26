import type { AboutData, Skill, Value, QuickFacts } from '../types';

export const ABOUT_STORAGE_KEY = 'vr-cms-about';

// Replace the defaultAboutData object in src/data/about.ts with this:
export const defaultAboutData: AboutData = {
  "aboutIntro": "I'm Vivek Ramachandran, a product designer and strategist who combines craft, systems thinking, and business impact.",
  "aboutFull": "I've spent the last 8+ years designing products that millions of people use every day - from zero-to-one consumer apps to enterprise platforms with global scale. I work across the full product lifecycle: from early discovery and strategy through to shipping polished, production-ready experiences.\n\nMy background: I started as a software engineer (machine learning developer) and then transitioned into product design and management, which means I think in systems, speak the language of engineers and stakeholders equally well, and obsess over the things that sit between the pixels - the logic, the constraints, and the outcomes.\n\nWhen I'm not designing, I'm mentoring the next generation of product designers, business analysts, start-up entrepreneurs, and writing articles at the intersection of strategy and business.\n\nI believe that great design is invisible when it's working and unforgettable when it's not.",
  "skills": [
    {
      "name": "Product Design",
      "category": "craft"
    },
    {
      "name": "Design Systems",
      "category": "craft"
    },
    {
      "name": "UX Research",
      "category": "craft"
    },
    {
      "name": "Interaction Design",
      "category": "craft"
    },
    {
      "name": "Prototyping",
      "category": "craft"
    },
    {
      "name": "Visual Design",
      "category": "craft"
    },
    {
      "name": "Product Strategy",
      "category": "strategy"
    },
    {
      "name": "Roadmapping",
      "category": "strategy"
    },
    {
      "name": "Stakeholder Alignment",
      "category": "strategy"
    },
    {
      "name": "Design Leadership",
      "category": "strategy"
    },
    {
      "name": "Figma",
      "category": "tools"
    },
    {
      "name": "Framer",
      "category": "tools"
    },
    {
      "name": "React",
      "category": "tools"
    },
    {
      "name": "TypeScript",
      "category": "tools"
    },
    {
      "name": "Storybook",
      "category": "tools"
    },
    {
      "name": "Notion",
      "category": "tools"
    }
  ],
  "values": [
    {
      "title": "Clarity over cleverness",
      "body": "The best design solution is usually the most obvious one. I push past the clever idea to find the clear one."
    },
    {
      "title": "Systems before surfaces",
      "body": "Pixels are easy. Structure is hard. I design the system first, then the screens."
    },
    {
      "title": "Outcomes, not output",
      "body": "Shipping features is easy. Shipping features that move the needle is the real work."
    },
    {
      "title": "Craft at every layer",
      "body": "From the strategic frame to the micro-interaction, every layer deserves the same care."
    }
  ],
  "quickFacts": {
    "city": "[YOUR CITY — placeholder]",
    "years": "[X]+ years in product design",
    "background": "[YOUR BACKGROUND — placeholder]",
    "currentRole": "[CURRENT ROLE / STATUS — placeholder]",
    "education": "[YOUR EDUCATION — placeholder]"
  }
};

export function getAboutData(): AboutData {
  try {
    const stored = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') return parsed as AboutData;
    }
  } catch {
    localStorage.removeItem(ABOUT_STORAGE_KEY);
  }
  return defaultAboutData;
}

const _aboutData = getAboutData();

export const aboutIntro: string       = _aboutData.aboutIntro;
export const aboutFull: string        = _aboutData.aboutFull;
export const skills: Skill[]          = _aboutData.skills;
export const values: Value[]          = _aboutData.values;
export const quickFacts: QuickFacts   = _aboutData.quickFacts;
