const TTL_MS = 5 * 24 * 60 * 60 * 1000; // 5 days — clears weekly-recipe progress each weekend

export function loadProgress(key: string): number | null {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    if (!saved.savedAt || Date.now() - saved.savedAt > TTL_MS) return null;
    return saved.stepIndex ?? null;
  } catch { return null; }
}

export function saveProgress(key: string, stepIndex: number): void {
  try {
    localStorage.setItem(key, JSON.stringify({ stepIndex, savedAt: Date.now() }));
  } catch {
    // Ignore storage access issues and keep the current session usable.
  }
}
