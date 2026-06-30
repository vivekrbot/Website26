import { useState } from 'react';
import { useCMSStore } from '../../store/CMSStore';
import { CMSCard } from '../../components/CMSCard/CMSCard';
import { ConfirmButton } from '../../components/ConfirmButton/ConfirmButton';
import { ProjectForm } from './ProjectForm';
import type { Project } from '../../../types';
import styles from './ProjectsEditor.module.css';

export function ProjectsEditor() {
  const { projects, setProjects, resetSection } = useCMSStore();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const save = (updated: Project[]) => {
    setProjects(updated);
    setSavedAt(new Date());
  };

  const toggleFeatured = (slug: string) => {
    save(projects.map((p) => p.slug === slug ? { ...p, featured: !p.featured } : p));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...projects];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    save(next);
  };

  const moveDown = (index: number) => {
    if (index === projects.length - 1) return;
    const next = [...projects];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    save(next);
  };

  const deleteProject = (slug: string) => {
    save(projects.filter((p) => p.slug !== slug));
    if (editingSlug === slug) setEditingSlug(null);
  };

  const handleSaveProject = (project: Project, originalSlug: string | null) => {
    if (originalSlug) {
      save(projects.map((p) => p.slug === originalSlug ? project : p));
    } else {
      save([...projects, project]);
      setAddingNew(false);
    }
    setEditingSlug(null);
  };

  const existingSlugs = (excludeSlug?: string) =>
    projects.map((p) => p.slug).filter((s) => s !== excludeSlug);

  return (
    <CMSCard
      title="Projects"
      description="Add, edit, reorder, and toggle featured status. Set a Case Study URL to link to your Medium write-up."
      savedAt={savedAt}
      actions={
        <ConfirmButton
          label="Reset to defaults"
          confirmLabel="Confirm reset?"
          onConfirm={() => { resetSection('projects'); setSavedAt(null); }}
        />
      }
    >
      <div className={styles.toolbar}>
        <button
          className={styles.addBtn}
          onClick={() => { setAddingNew(true); setEditingSlug(null); }}
          type="button"
          disabled={addingNew}
        >
          + Add project
        </button>
        <span className={styles.count}>{projects.length} project{projects.length !== 1 ? 's' : ''}</span>
      </div>

      {/* New project form */}
      {addingNew && (
        <div className={styles.formWrap}>
          <ProjectForm
            project={null}
            existingSlugs={existingSlugs()}
            onSave={(p) => handleSaveProject(p, null)}
            onCancel={() => setAddingNew(false)}
          />
        </div>
      )}

      {/* Project list */}
      <ul className={styles.list} role="list">
        {projects.map((project, index) => (
          <li key={project.slug} className={styles.projectItem}>
            <div className={styles.row}>
              {/* Reorder */}
              <div className={styles.reorder}>
                <button type="button" onClick={() => moveUp(index)} disabled={index === 0} aria-label="Move up" className={styles.reorderBtn}>↑</button>
                <button type="button" onClick={() => moveDown(index)} disabled={index === projects.length - 1} aria-label="Move down" className={styles.reorderBtn}>↓</button>
              </div>

              {/* Info */}
              <div className={styles.info}>
                <span className={styles.projectTitle}>{project.title}</span>
                <span className={styles.projectMeta}>{project.category} · {project.year}</span>
              </div>

              {/* Featured toggle */}
              <label className={styles.featuredLabel}>
                <input
                  type="checkbox"
                  className="cms-checkbox"
                  checked={project.featured}
                  onChange={() => toggleFeatured(project.slug)}
                  aria-label={`${project.title} featured`}
                />
                <span className={styles.featuredText}>Featured</span>
              </label>

              {/* Actions */}
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.editBtn}
                  onClick={() => setEditingSlug(editingSlug === project.slug ? null : project.slug)}
                  aria-expanded={editingSlug === project.slug}
                >
                  {editingSlug === project.slug ? 'Close' : 'Edit'}
                </button>
                <ConfirmButton
                  label="Delete"
                  confirmLabel="Delete?"
                  onConfirm={() => deleteProject(project.slug)}
                />
              </div>
            </div>

            {/* Inline edit form */}
            {editingSlug === project.slug && (
              <div className={styles.formWrap}>
                <ProjectForm
                  project={project}
                  existingSlugs={existingSlugs(project.slug)}
                  onSave={(p) => handleSaveProject(p, project.slug)}
                  onCancel={() => setEditingSlug(null)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </CMSCard>
  );
}
