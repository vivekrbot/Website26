import { useState } from 'react';
import { useCMSStore } from '../../store/CMSStore';
import styles from './ExportModal.module.css';

type Tab = 'projects' | 'about' | 'mentorship' | 'navigation';

const TABS: { id: Tab; label: string; file: string }[] = [
  { id: 'projects',   label: 'projects.ts',    file: 'src/data/projects.ts' },
  { id: 'about',      label: 'about.ts',        file: 'src/data/about.ts' },
  { id: 'mentorship', label: 'mentorship.ts',   file: 'src/data/mentorship.ts' },
  { id: 'navigation', label: 'navigation.ts',   file: 'src/data/navigation.ts' },
];

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function buildProjectsSnippet(projects: unknown[]): string {
  return `// Replace the defaultProjects array in src/data/projects.ts with this:
export const defaultProjects: Project[] = ${pretty(projects)};`;
}

function buildAboutSnippet(about: unknown): string {
  return `// Replace the defaultAboutData object in src/data/about.ts with this:
export const defaultAboutData: AboutData = ${pretty(about)};`;
}

function buildMentorshipSnippet(tiers: unknown[]): string {
  return `// Replace the defaultMentorshipTiers array in src/data/mentorship.ts with this:
export const defaultMentorshipTiers: MentorshipTier[] = ${pretty(tiers)};`;
}

function buildNavigationSnippet(nav: { navItems: unknown[]; socialLinks: unknown[] }): string {
  return `// Replace in src/data/navigation.ts:
export const defaultNavItems: NavItem[] = ${pretty(nav.navItems)};

export const defaultSocialLinks: SocialLink[] = ${pretty(nav.socialLinks)};`;
}

interface ExportModalProps {
  onClose: () => void;
}

export function ExportModal({ onClose }: ExportModalProps) {
  const { projects, about, mentorshipTiers, navigation } = useCMSStore();
  const [tab, setTab] = useState<Tab>('projects');
  const [copied, setCopied] = useState(false);

  const snippets: Record<Tab, string> = {
    projects:   buildProjectsSnippet(projects),
    about:      buildAboutSnippet(about),
    mentorship: buildMentorshipSnippet(mentorshipTiers),
    navigation: buildNavigationSnippet(navigation),
  };

  const activeFile = TABS.find((t) => t.id === tab)!.file;

  const copy = () => {
    navigator.clipboard.writeText(snippets[tab]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Export to code">
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Export to code</h2>
            <p className={styles.subtitle}>
              Copy the snippet and paste it into <code className={styles.code}>{activeFile}</code>
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close export">✕</button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.active : ''}`}
              onClick={() => { setTab(t.id); setCopied(false); }}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Code block */}
        <div className={styles.codeWrap}>
          <pre className={styles.pre}><code>{snippets[tab]}</code></pre>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerHint}>
            After pasting, run <code className={styles.code}>git add src/data/ && git commit -m "Update content" && git push origin main</code>
          </p>
          <button className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} onClick={copy} type="button">
            {copied ? '✓ Copied!' : 'Copy snippet'}
          </button>
        </div>
      </div>
    </div>
  );
}
