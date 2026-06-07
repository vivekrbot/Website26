import { useState } from 'react';
import { useCMSStore } from '../../store/CMSStore';
import { CMSCard } from '../../components/CMSCard/CMSCard';
import { CMSField } from '../../components/CMSField/CMSField';
import { ArrayField } from '../../components/ArrayField/ArrayField';
import { ConfirmButton } from '../../components/ConfirmButton/ConfirmButton';
import type { Skill, Value, QuickFacts } from '../../../types';
import styles from './AboutEditor.module.css';

type Tab = 'text' | 'skills' | 'values' | 'quickfacts';

const TABS: { id: Tab; label: string }[] = [
  { id: 'text',       label: 'Text' },
  { id: 'skills',     label: 'Skills' },
  { id: 'values',     label: 'Values' },
  { id: 'quickfacts', label: 'Quick Facts' },
];

const SKILL_CATEGORIES = ['craft', 'strategy', 'tools'] as const;

export function AboutEditor() {
  const { about, setAbout, resetSection } = useCMSStore();
  const [tab, setTab] = useState<Tab>('text');
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const save = (patch: Partial<typeof about>) => {
    setAbout({ ...about, ...patch });
    setSavedAt(new Date());
  };

  return (
    <CMSCard
      title="About"
      description="Edit biography text, skills, values, and quick-fact items."
      savedAt={savedAt}
      actions={
        <ConfirmButton
          label="Reset to defaults"
          confirmLabel="Confirm reset?"
          onConfirm={() => { resetSection('about'); setSavedAt(null); }}
        />
      }
    >
      {/* Inner tabs */}
      <div className={styles.tabs} role="tablist" aria-label="About sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`${styles.tab} ${tab === t.id ? styles.active : ''}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={styles.panel}>
        {tab === 'text' && (
          <TextTab
            aboutIntro={about.aboutIntro}
            aboutFull={about.aboutFull}
            onChange={(intro, full) => save({ aboutIntro: intro, aboutFull: full })}
          />
        )}
        {tab === 'skills' && (
          <SkillsTab
            skills={about.skills}
            onChange={(skills) => save({ skills })}
          />
        )}
        {tab === 'values' && (
          <ValuesTab
            values={about.values}
            onChange={(values) => save({ values })}
          />
        )}
        {tab === 'quickfacts' && (
          <QuickFactsTab
            quickFacts={about.quickFacts}
            onChange={(quickFacts) => save({ quickFacts })}
          />
        )}
      </div>
    </CMSCard>
  );
}

function TextTab({
  aboutIntro,
  aboutFull,
  onChange,
}: {
  aboutIntro: string;
  aboutFull: string;
  onChange: (intro: string, full: string) => void;
}) {
  return (
    <div className={styles.stack}>
      <CMSField label="Intro line" hint="Short sentence shown on home page About snippet.">
        <input
          className="cms-input"
          value={aboutIntro}
          onChange={(e) => onChange(e.target.value, aboutFull)}
          placeholder="I'm Vivek…"
        />
      </CMSField>
      <CMSField label="Full bio" hint="Multi-paragraph bio shown on the About page.">
        <textarea
          className="cms-input cms-textarea"
          value={aboutFull}
          onChange={(e) => onChange(aboutIntro, e.target.value)}
          rows={12}
          placeholder="Tell your full story…"
        />
      </CMSField>
    </div>
  );
}

function SkillsTab({ skills, onChange }: { skills: Skill[]; onChange: (s: Skill[]) => void }) {
  return (
    <div className={styles.stack}>
      <p className={styles.hint}>Skills are grouped by category on the About page.</p>
      <ArrayField<Skill>
        items={skills}
        onChange={onChange}
        addItem={() => ({ name: '', category: 'craft' })}
        addLabel="+ Add skill"
        renderItem={(skill, _i, { update }) => (
          <div className={styles.skillRow}>
            <input
              className="cms-input"
              value={skill.name}
              placeholder="Skill name"
              onChange={(e) => update({ ...skill, name: e.target.value })}
              style={{ flex: 1 }}
            />
            <select
              className="cms-input"
              value={skill.category}
              onChange={(e) => update({ ...skill, category: e.target.value as Skill['category'] })}
              style={{ flex: '0 0 110px' }}
            >
              {SKILL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}
      />
    </div>
  );
}

function ValuesTab({ values, onChange }: { values: Value[]; onChange: (v: Value[]) => void }) {
  return (
    <div className={styles.stack}>
      <ArrayField<Value>
        items={values}
        onChange={onChange}
        addItem={() => ({ title: '', body: '' })}
        addLabel="+ Add value"
        renderItem={(val, _i, { update }) => (
          <div className={styles.valueCard}>
            <input
              className="cms-input"
              value={val.title}
              placeholder="Value title"
              onChange={(e) => update({ ...val, title: e.target.value })}
            />
            <textarea
              className="cms-input cms-textarea"
              value={val.body}
              placeholder="Describe the value…"
              rows={2}
              onChange={(e) => update({ ...val, body: e.target.value })}
            />
          </div>
        )}
      />
    </div>
  );
}

function QuickFactsTab({
  quickFacts,
  onChange,
}: {
  quickFacts: QuickFacts;
  onChange: (q: QuickFacts) => void;
}) {
  const set = (key: keyof QuickFacts, value: string) => onChange({ ...quickFacts, [key]: value });

  return (
    <div className={styles.stack}>
      <CMSField label="City">
        <input className="cms-input" value={quickFacts.city} placeholder="Mumbai, India" onChange={(e) => set('city', e.target.value)} />
      </CMSField>
      <CMSField label="Years experience">
        <input className="cms-input" value={quickFacts.years} placeholder="8+ years in product design" onChange={(e) => set('years', e.target.value)} />
      </CMSField>
      <CMSField label="Background">
        <input className="cms-input" value={quickFacts.background} placeholder="Engineering → Design" onChange={(e) => set('background', e.target.value)} />
      </CMSField>
      <CMSField label="Current role">
        <input className="cms-input" value={quickFacts.currentRole} placeholder="Senior Product Designer at Acme" onChange={(e) => set('currentRole', e.target.value)} />
      </CMSField>
      <CMSField label="Education">
        <input className="cms-input" value={quickFacts.education} placeholder="B.Tech Computer Science, IIT…" onChange={(e) => set('education', e.target.value)} />
      </CMSField>
    </div>
  );
}
