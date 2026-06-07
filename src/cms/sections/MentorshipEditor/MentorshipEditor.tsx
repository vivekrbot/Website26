import { useState } from 'react';
import { useCMSStore } from '../../store/CMSStore';
import { CMSCard } from '../../components/CMSCard/CMSCard';
import { CMSField } from '../../components/CMSField/CMSField';
import { StringArrayField } from '../../components/ArrayField/ArrayField';
import { ConfirmButton } from '../../components/ConfirmButton/ConfirmButton';
import type { MentorshipTier } from '../../../types';
import styles from './MentorshipEditor.module.css';

export function MentorshipEditor() {
  const { mentorshipTiers, setMentorshipTiers, resetSection } = useCMSStore();
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const updateTier = (index: number, patch: Partial<MentorshipTier>) => {
    const next = mentorshipTiers.map((t, i) => (i === index ? { ...t, ...patch } : t));
    setMentorshipTiers(next);
    setSavedAt(new Date());
  };

  return (
    <CMSCard
      title="Mentorship"
      description="Edit the 3 fixed mentorship tiers. Add/remove include items, update pricing, and CTA links."
      savedAt={savedAt}
      actions={
        <ConfirmButton
          label="Reset to defaults"
          confirmLabel="Confirm reset?"
          onConfirm={() => { resetSection('mentorship'); setSavedAt(null); }}
        />
      }
    >
      <div className={styles.tiers}>
        {mentorshipTiers.map((tier, index) => (
          <TierForm
            key={tier.id}
            tier={tier}
            onChange={(patch) => updateTier(index, patch)}
          />
        ))}
      </div>
    </CMSCard>
  );
}

function TierForm({
  tier,
  onChange,
}: {
  tier: MentorshipTier;
  onChange: (patch: Partial<MentorshipTier>) => void;
}) {
  return (
    <div className={styles.tier}>
      <div className={styles.tierHeader}>
        <span className={`${styles.typeTag} ${tier.type === 'free' ? styles.tagFree : styles.tagPaid}`}>
          {tier.type}
        </span>
        <span className={styles.tierId}>{tier.id}</span>
      </div>

      <div className={styles.grid2}>
        <CMSField label="Name">
          <input
            className="cms-input"
            value={tier.name}
            placeholder="Tier name"
            onChange={(e) => onChange({ name: e.target.value })}
          />
        </CMSField>
        <CMSField label="Duration">
          <input
            className="cms-input"
            value={tier.duration}
            placeholder="e.g. 4 sessions / month"
            onChange={(e) => onChange({ duration: e.target.value })}
          />
        </CMSField>
      </div>

      <CMSField label="Tagline">
        <input
          className="cms-input"
          value={tier.tagline}
          placeholder="One-line description…"
          onChange={(e) => onChange({ tagline: e.target.value })}
        />
      </CMSField>

      <div className={styles.priceRow}>
        <label className={styles.freeLabel}>
          <input
            type="checkbox"
            className="cms-checkbox"
            checked={tier.price === null}
            onChange={(e) => onChange({ price: e.target.checked ? null : '' })}
          />
          Free tier (no price)
        </label>
        {tier.price !== null && (
          <CMSField label="Price" hint="E.g. $200/mo or $1,200 total">
            <input
              className="cms-input"
              value={tier.price}
              placeholder="$200/mo"
              onChange={(e) => onChange({ price: e.target.value })}
            />
          </CMSField>
        )}
      </div>

      <CMSField label="For whom">
        <textarea
          className="cms-input cms-textarea"
          value={tier.forWhom}
          rows={2}
          placeholder="Who is this tier for?"
          onChange={(e) => onChange({ forWhom: e.target.value })}
        />
      </CMSField>

      <CMSField label="Includes" hint="Each item appears as a bullet point on the tier card.">
        <StringArrayField
          items={tier.includes}
          onChange={(includes) => onChange({ includes })}
          placeholder="Include item…"
          addLabel="+ Add item"
        />
      </CMSField>

      <div className={styles.grid2}>
        <CMSField label="CTA label">
          <input
            className="cms-input"
            value={tier.cta.label}
            placeholder="Book a session"
            onChange={(e) => onChange({ cta: { ...tier.cta, label: e.target.value } })}
          />
        </CMSField>
        <CMSField label="CTA href" hint="mailto: or https:// link">
          <input
            className="cms-input"
            value={tier.cta.href}
            placeholder="mailto:…"
            onChange={(e) => onChange({ cta: { ...tier.cta, href: e.target.value } })}
          />
        </CMSField>
      </div>
    </div>
  );
}
