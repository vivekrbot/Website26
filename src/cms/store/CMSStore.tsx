import { createContext, useCallback, useContext, useState } from 'react';
import type { Project, MentorshipTier, AboutData, NavigationData } from '../../types';
import {
  getProjectsData, defaultProjects, PROJECTS_STORAGE_KEY,
} from '../../data/projects';
import {
  getAboutData, defaultAboutData, ABOUT_STORAGE_KEY,
} from '../../data/about';
import {
  getMentorshipData, defaultMentorshipTiers, MENTORSHIP_STORAGE_KEY,
} from '../../data/mentorship';
import {
  getNavigationData, defaultNavItems, defaultSocialLinks, NAVIGATION_STORAGE_KEY,
} from '../../data/navigation';

interface CMSStoreState {
  projects: Project[];
  about: AboutData;
  mentorshipTiers: MentorshipTier[];
  navigation: NavigationData;
}

interface CMSStoreContext extends CMSStoreState {
  setProjects: (projects: Project[]) => void;
  setAbout: (about: AboutData) => void;
  setMentorshipTiers: (tiers: MentorshipTier[]) => void;
  setNavigation: (nav: NavigationData) => void;
  resetSection: (section: 'projects' | 'about' | 'mentorship' | 'navigation') => void;
}

const Context = createContext<CMSStoreContext | null>(null);

export function CMSStoreProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjectsState]             = useState<Project[]>(() => getProjectsData());
  const [about, setAboutState]                   = useState<AboutData>(() => getAboutData());
  const [mentorshipTiers, setMentorshipState]    = useState<MentorshipTier[]>(() => getMentorshipData());
  const [navigation, setNavigationState]         = useState<NavigationData>(() => getNavigationData());

  const setProjects = useCallback((p: Project[]) => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(p));
    setProjectsState(p);
  }, []);

  const setAbout = useCallback((a: AboutData) => {
    localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(a));
    setAboutState(a);
  }, []);

  const setMentorshipTiers = useCallback((t: MentorshipTier[]) => {
    localStorage.setItem(MENTORSHIP_STORAGE_KEY, JSON.stringify(t));
    setMentorshipState(t);
  }, []);

  const setNavigation = useCallback((n: NavigationData) => {
    localStorage.setItem(NAVIGATION_STORAGE_KEY, JSON.stringify(n));
    setNavigationState(n);
  }, []);

  const resetSection = useCallback(
    (section: 'projects' | 'about' | 'mentorship' | 'navigation') => {
      switch (section) {
        case 'projects':
          localStorage.removeItem(PROJECTS_STORAGE_KEY);
          setProjectsState(defaultProjects);
          break;
        case 'about':
          localStorage.removeItem(ABOUT_STORAGE_KEY);
          setAboutState(defaultAboutData);
          break;
        case 'mentorship':
          localStorage.removeItem(MENTORSHIP_STORAGE_KEY);
          setMentorshipState(defaultMentorshipTiers);
          break;
        case 'navigation':
          localStorage.removeItem(NAVIGATION_STORAGE_KEY);
          setNavigationState({ navItems: defaultNavItems, socialLinks: defaultSocialLinks });
          break;
      }
    },
    []
  );

  return (
    <Context.Provider
      value={{
        projects, setProjects,
        about, setAbout,
        mentorshipTiers, setMentorshipTiers,
        navigation, setNavigation,
        resetSection,
      }}
    >
      {children}
    </Context.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCMSStore(): CMSStoreContext {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('useCMSStore must be used inside CMSStoreProvider');
  return ctx;
}
