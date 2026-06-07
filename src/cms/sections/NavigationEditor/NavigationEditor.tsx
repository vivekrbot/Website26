import { useState } from 'react';
import { useCMSStore } from '../../store/CMSStore';
import { CMSCard } from '../../components/CMSCard/CMSCard';
import { CMSField } from '../../components/CMSField/CMSField';
import { ArrayField } from '../../components/ArrayField/ArrayField';
import { ConfirmButton } from '../../components/ConfirmButton/ConfirmButton';
import type { NavItem } from '../../../types';
import styles from './NavigationEditor.module.css';

const ICON_OPTIONS = ['github', 'linkedin', 'dribbble', 'twitter'] as const;

export function NavigationEditor() {
  const { navigation, setNavigation, resetSection } = useCMSStore();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const save = (patch: Partial<typeof navigation>) => {
    setNavigation({ ...navigation, ...patch });
    setSavedAt(new Date());
  };

  return (
    <CMSCard
      title="Navigation"
      description="Edit nav links and social icon URLs. Changes apply after page reload."
      savedAt={savedAt}
      actions={
        <ConfirmButton
          label="Reset to defaults"
          confirmLabel="Confirm reset?"
          onConfirm={() => { resetSection('navigation'); setSavedAt(null); }}
        />
      }
    >
      <CMSField
        label="Nav items"
        hint="Order matches the header navigation. isExternal opens in a new tab."
      >
        <ArrayField<NavItem>
          items={navigation.navItems}
          onChange={(navItems) => save({ navItems })}
          addItem={() => ({ label: '', href: '' })}
          addLabel="+ Add nav item"
          renderItem={(item, _i, { update }) => (
            <div className={styles.navRow}>
              <input
                className="cms-input"
                value={item.label}
                placeholder="Label"
                onChange={(e) => update({ ...item, label: e.target.value })}
                style={{ flex: '0 0 100px' }}
              />
              <input
                className="cms-input"
                value={item.href}
                placeholder="/path or mailto:…"
                onChange={(e) => update({ ...item, href: e.target.value })}
                style={{ flex: 1 }}
              />
              <label className={styles.extLabel}>
                <input
                  type="checkbox"
                  className="cms-checkbox"
                  checked={!!item.isExternal}
                  onChange={(e) => update({ ...item, isExternal: e.target.checked })}
                />
                ext
              </label>
            </div>
          )}
        />
      </CMSField>

      <div className={styles.divider} />

      <CMSField
        label="Social links"
        hint="4 fixed social icons in the footer. Change only the href and icon type."
      >
        <ul className={styles.socialList} role="list">
          {navigation.socialLinks.map((link, index) => (
            <li key={link.icon} className={styles.socialRow}>
              <select
                className="cms-input"
                value={link.icon}
                onChange={(e) =>
                  save({
                    socialLinks: navigation.socialLinks.map((l, i) =>
                      i === index ? { ...l, icon: e.target.value } : l
                    ),
                  })
                }
                style={{ flex: '0 0 120px' }}
                aria-label="Icon"
              >
                {ICON_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <input
                className="cms-input"
                value={link.label}
                placeholder="Label"
                onChange={(e) =>
                  save({
                    socialLinks: navigation.socialLinks.map((l, i) =>
                      i === index ? { ...l, label: e.target.value } : l
                    ),
                  })
                }
                style={{ flex: '0 0 120px' }}
                aria-label="Label"
              />
              <input
                className="cms-input"
                value={link.href}
                placeholder="https://…"
                onChange={(e) =>
                  save({
                    socialLinks: navigation.socialLinks.map((l, i) =>
                      i === index ? { ...l, href: e.target.value } : l
                    ),
                  })
                }
                style={{ flex: 1 }}
                aria-label="URL"
              />
            </li>
          ))}
        </ul>
      </CMSField>
    </CMSCard>
  );
}
