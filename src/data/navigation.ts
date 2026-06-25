import type { NavItem, SocialLink, NavigationData } from '../types';

export const NAVIGATION_STORAGE_KEY = 'vr-cms-navigation';

export const defaultNavItems: NavItem[] = [
  { label: 'Work', href: '/works' },
  { label: 'About', href: '/about' },
  { label: 'Mentorship', href: '/mentorship' },
];

export const defaultSocialLinks: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/vivekrbot', icon: 'github' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/itsvivekramachandran/', icon: 'linkedin' },
  { label: 'Dribbble', href: 'https://dribbble.com/itsvivekdesign', icon: 'dribbble' },
  { label: 'Medium', href: 'https://medium.com/@vivekramachandran', icon: 'medium' },
  { label: 'ADPList', href: 'https://adplist.org/mentors/vivek-ramachandran', icon: 'adplist' },
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
