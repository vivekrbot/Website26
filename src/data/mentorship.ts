import type { MentorshipTier } from '../types';

export const MENTORSHIP_STORAGE_KEY = 'vr-cms-mentorship';

export const defaultMentorshipTiers: MentorshipTier[] = [
  {
    id: 'free-office-hours',
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
  },
  {
    id: 'paid-starter',
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
  },
  {
    id: 'paid-deep-dive',
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
  },
];

export function getMentorshipData(): MentorshipTier[] {
  try {
    const stored = localStorage.getItem(MENTORSHIP_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed as MentorshipTier[];
    }
  } catch {
    localStorage.removeItem(MENTORSHIP_STORAGE_KEY);
  }
  return defaultMentorshipTiers;
}

export const mentorshipTiers = getMentorshipData();
