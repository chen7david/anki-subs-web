import { atom } from "jotai";

/**
 * A single subtitle cue with timing and text content.
 */
export type SubtitleCue = {
  id: number;
  startMs: number; // start time in milliseconds
  endMs: number; // end time in milliseconds
  text: string;
};

/**
 * Raw uploaded file reference (optional), useful for debugging or re-parsing.
 */
export const rawSubtitleFileAtom = atom<File | null>(null);

/**
 * Parsed cues produced from the uploaded file.
 */
export const parsedCuesAtom = atom<SubtitleCue[]>([]);

/**
 * Working copy of cues used in the editor. Initialize from parsedCuesAtom after upload.
 */
export const editedCuesAtom = atom<SubtitleCue[]>([]);

/**
 * Derived atom that returns an array of text lines only (no timestamps),
 * suitable for sending to the backend for further processing.
 */
export const editedTextsOnlyAtom = atom((get) =>
  get(editedCuesAtom).map((c) => c.text)
);

/**
 * Replace all edited cues with a new array.
 */
export const setEditedCuesAtom = atom(
  null,
  (_get, set, next: SubtitleCue[]) => {
    set(editedCuesAtom, next);
  }
);

/**
 * Remove a cue by id.
 */
export const deleteCueAtom = atom(null, (get, set, id: number) => {
  const next = get(editedCuesAtom).filter((c) => c.id !== id);
  set(editedCuesAtom, next);
});

/**
 * Merge a cue with its immediate next neighbor by id ordering.
 * The merged cue keeps the earlier startMs and the later endMs, and concatenates text.
 */
export const mergeWithNextCueAtom = atom(null, (get, set, id: number) => {
  const cues = get(editedCuesAtom);
  const index = cues.findIndex((c) => c.id === id);
  if (index < 0 || index >= cues.length - 1) return;
  const current = cues[index];
  const next = cues[index + 1];
  const merged: SubtitleCue = {
    id: current.id,
    startMs: Math.min(current.startMs, next.startMs),
    endMs: Math.max(current.endMs, next.endMs),
    text: `${current.text}\n${next.text}`.trim(),
  };
  const updated = [...cues.slice(0, index), merged, ...cues.slice(index + 2)];
  // re-normalize ids to keep them sequential for UX simplicity
  const normalized = updated.map((c, i) => ({ ...c, id: i + 1 }));
  set(editedCuesAtom, normalized);
});
