import type { JSONContent } from '@tiptap/core';

export const BODIES_STORAGE_KEY = 'vr-cms-bodies';

export type BodiesMap = Record<string, JSONContent>;

export function readBodies(): BodiesMap {
  try {
    const stored = localStorage.getItem(BODIES_STORAGE_KEY);
    if (stored) return JSON.parse(stored) as BodiesMap;
  } catch {
    localStorage.removeItem(BODIES_STORAGE_KEY);
  }
  return {};
}

export function getBody(slug: string): JSONContent | null {
  return readBodies()[slug] ?? null;
}

export function setBody(slug: string, content: JSONContent): void {
  const bodies = readBodies();
  bodies[slug] = content;
  localStorage.setItem(BODIES_STORAGE_KEY, JSON.stringify(bodies));
}
