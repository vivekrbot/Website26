import type { NavItem, SocialLink } from '../types';

export const navItems: NavItem[] = [
  { label: 'Work', href: '/works' },
  { label: 'About', href: '/about' },
  { label: 'Mentorship', href: '/mentorship' },
  { label: 'Contact', href: 'mailto:vdraganer@gmail.com', isExternal: true },
];

export const socialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/[YOUR-GITHUB-USERNAME]', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/[YOUR-LINKEDIN]', icon: 'linkedin' },
  { label: 'Dribbble', href: 'https://dribbble.com/[YOUR-DRIBBBLE]', icon: 'dribbble' },
  { label: 'Twitter / X', href: 'https://x.com/[YOUR-TWITTER]', icon: 'twitter' },
];
