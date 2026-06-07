import type { NavItem, SocialLink, NavigationData } from '../types';

export const NAVIGATION_STORAGE_KEY = 'vr-cms-navigation';

export const defaultNavItems: NavItem[] = [
  { label: 'Work', href: '/works' },
  { label: 'About', href: '/about' },
  { label: 'Mentorship', href: '/mentorship' },
  { label: 'Contact', href: 'mailto:vdraganer@gmail.com', isExternal: true },
];

export const defaultSocialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/vivekrbot', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/[YOUR-LINKEDIN]', icon: 'linkedin' },
  { label: 'Dribbble', href: 'https://dribbble.com/[YOUR-DRIBBBLE]', icon: 'dribbble' },
  { label: 'Twitter / X', href: 'https://x.com/[YOUR-TWITTER]', icon: 'twitter' },
];

export function getNavigationData(): NavigationData {
  try {
    const stored = localStorage.getItem(NAVIGATION_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.navItems)) {
        return parsed as NavigationData;
      }
    }
  } catch {
    localStorage.removeItem(NAVIGATION_STORAGE_KEY);
  }
  return { navItems: defaultNavItems, socialLinks: defaultSocialLinks };
}

const _navData = getNavigationData();
export const navItems: NavItem[]       = _navData.navItems;
export const socialLinks: SocialLink[] = _navData.socialLinks;
