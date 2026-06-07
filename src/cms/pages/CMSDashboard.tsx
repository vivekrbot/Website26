import { useState } from 'react';
import { ProjectsEditor } from '../sections/ProjectsEditor/ProjectsEditor';
import { AboutEditor } from '../sections/AboutEditor/AboutEditor';
import { MentorshipEditor } from '../sections/MentorshipEditor/MentorshipEditor';
import { NavigationEditor } from '../sections/NavigationEditor/NavigationEditor';
import styles from './CMSDashboard.module.css';

type Section = 'projects' | 'about' | 'mentorship' | 'navigation';

const SECTIONS: { id: Section; label: string; icon: string }[] = [
  { id: 'projects',   label: 'Projects',    icon: '◈' },
  { id: 'about',      label: 'About',       icon: '◉' },
  { id: 'mentorship', label: 'Mentorship',  icon: '◆' },
  { id: 'navigation', label: 'Navigation',  icon: '◇' },
];

export default function CMSDashboard() {
  const [active, setActive] = useState<Section>('projects');

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <nav className={styles.sidebar} aria-label="CMS sections">
        <p className={styles.sidebarLabel}>Content</p>
        <ul className={styles.sidebarList} role="list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                className={`${styles.sidebarItem} ${active === s.id ? styles.active : ''}`}
                onClick={() => setActive(s.id)}
                aria-current={active === s.id ? 'page' : undefined}
              >
                <span className={styles.sidebarIcon} aria-hidden="true">{s.icon}</span>
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <main className={styles.main} id="cms-main">
        {active === 'projects'   && <ProjectsEditor />}
        {active === 'about'      && <AboutEditor />}
        {active === 'mentorship' && <MentorshipEditor />}
        {active === 'navigation' && <NavigationEditor />}
      </main>
    </div>
  );
}
