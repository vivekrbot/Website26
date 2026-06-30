import { useState } from 'react';
import { CMSField } from '../../components/CMSField/CMSField';
import { StringArrayField, ArrayField } from '../../components/ArrayField/ArrayField';
import type { Project } from '../../../types';
import styles from './ProjectForm.module.css';

function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const BLANK_PROJECT: Omit<Project, 'slug'> = {
  title: '',
  tagline: '',
  category: '',
  tags: [],
  year: new Date().getFullYear(),
  coverImage: '',
  featured: false,
  role: '',
  links: [],
};

interface ProjectFormProps {
  project: Project | null;
  existingSlugs: string[];
  onSave: (project: Project) => void;
  onCancel: () => void;
}

export function ProjectForm({ project, existingSlugs, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState<Project>(
    project ?? { slug: '', ...BLANK_PROJECT }
  );
  const [slugManual, setSlugManual] = useState(!!project);
  const [errors, setErrors] = useState<Partial<Record<keyof Project, string>>>({});

  const set = <K extends keyof Project>(key: K, value: Project[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === 'title' && !slugManual) {
        next.slug = toSlug(value as string);
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<Record<keyof Project, string>> = {};
    if (!form.title.trim()) errs.title = 'Required';
    if (!form.slug.trim())  errs.slug  = 'Required';
    if (existingSlugs.includes(form.slug)) errs.slug = 'Slug already exists';
    if (!form.category.trim()) errs.category = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (validate()) onSave(form);
  };

  return (
    <div className={styles.form}>
      <div className={styles.grid2}>
        <CMSField label="Title" required>
          <input className="cms-input" value={form.title} placeholder="Project title" onChange={(e) => set('title', e.target.value)} />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </CMSField>

        <CMSField label="Slug" hint="URL key: /works/[slug]. Auto-generated from title." required>
          <input
            className="cms-input"
            value={form.slug}
            placeholder="project-slug"
            onChange={(e) => { setSlugManual(true); set('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }}
          />
          {errors.slug && <span className={styles.error}>{errors.slug}</span>}
        </CMSField>

        <CMSField label="Category" required>
          <input className="cms-input" value={form.category} placeholder="e.g. Product Design" onChange={(e) => set('category', e.target.value)} />
          {errors.category && <span className={styles.error}>{errors.category}</span>}
        </CMSField>

        <CMSField label="Year">
          <input className="cms-input" type="number" value={form.year} min={2000} max={2100} onChange={(e) => set('year', Number(e.target.value))} />
        </CMSField>

        <CMSField label="Role">
          <input className="cms-input" value={form.role} placeholder="e.g. Lead Product Designer" onChange={(e) => set('role', e.target.value)} />
        </CMSField>

        <CMSField label="Cover Image URL" hint="Leave blank to use the gradient placeholder.">
          <input className="cms-input" value={form.coverImage} placeholder="/images/project.jpg" onChange={(e) => set('coverImage', e.target.value)} />
        </CMSField>
      </div>

      <CMSField label="Tagline" hint="One-line summary shown on project cards.">
        <input className="cms-input" value={form.tagline} placeholder="Short, punchy tagline…" onChange={(e) => set('tagline', e.target.value)} />
      </CMSField>

      <div className={styles.checkRow}>
        <label className={styles.checkLabel}>
          <input type="checkbox" className="cms-checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
          Show on home page (featured)
        </label>
      </div>

      <CMSField label="Tags">
        <StringArrayField items={form.tags} onChange={(v) => set('tags', v)} placeholder="Tag…" addLabel="+ Add tag" allowReorder={false} />
      </CMSField>

      <CMSField label="Links" hint="External links shown on the case study (e.g. Live Site, Case Study PDF).">
        <ArrayField
          items={form.links}
          onChange={(v) => set('links', v)}
          addItem={() => ({ label: '', url: '' })}
          addLabel="+ Add link"
          allowReorder={false}
          renderItem={(link, _i, { update }) => (
            <div className={styles.linkRow}>
              <input className="cms-input" value={link.label} placeholder="Label" onChange={(e) => update({ ...link, label: e.target.value })} style={{ flex: '0 0 140px' }} />
              <input className="cms-input" value={link.url} placeholder="https://…" onChange={(e) => update({ ...link, url: e.target.value })} style={{ flex: 1 }} />
            </div>
          )}
        />
      </CMSField>

      <div className={styles.formActions}>
        <button type="button" className={styles.saveBtn} onClick={handleSave}>Save project</button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
