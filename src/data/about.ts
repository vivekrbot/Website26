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
    },
    {
      "name": "ChatGPT / Claude",
      "category": "ai"
    },
    {
      "name": "Midjourney",
      "category": "ai"
    },
    {
      "name": "Cursor",
      "category": "ai"
    },
    {
      "name": "Copilot & Automation ",
      "category": "ai"
    },
    {
      "name": "Ollama LLM & Offline Hosting",
      "category": "ai"
    },
    {
      "name": "AI-Assisted Prototyping",
      "category": "ai"
    }
  ],
  "values": [
    {
      "title": "Vision before execution",
      "body": "Great products begin with a clear direction. I align teams around a shared vision before focusing on delivery."
    },
    {
      "title": "Customer value drives decisions",
      "body": "Every roadmap, feature, and investment should create meaningful value for customers and measurable value for the business."
    },
    {
      "title": "Build systems, not dependencies",
      "body": "Strong teams scale through frameworks, processes, and shared ownership not individual heroics."
    },
    {
      "title": "Outcomes define success",
      "body": "I focus on business impact, customer outcomes, and long-term product health rather than output alone."
    },
    {
      "title": "Create clarity in ambiguity",
      "body": "Leadership is turning uncertainty into direction. I bring structure, priorities, and confidence to complex challenges."
    },
    {
      "title": "Elevate people and culture",
      "body": "Products grow when people grow. I invest in mentorship, collaboration, and building high-performing teams."
    }
  ],
  "quickFacts": {
    "city": "Chennai, TN, India",
    "years": "8+ years in product design",
    "background": "Software, UI/UX Design, Product Management",
    "currentRole": "Lead UX Designer",
    "education": "B.Tech IT, M.sc AI & ML, IDX & CalsArts UX Design & Specialization, IIM Kozhikode Product Management, IIT Patna Agentic AI and Generative AI"
  }
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
