export const ROOT_DIRS = ['Project', 'Wet_Lab', 'Dry_Lab', 'Human_Practice', 'Safety'] as const;

export function encodeGithubPath(path: string): string {
  return path.split('/').filter(Boolean).map(encodeURIComponent).join('/');
}

export function isValidTargetDir(path: string): boolean {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return false;
  if (!(ROOT_DIRS as readonly string[]).includes(segments[0])) return false;
  return segments.every((s) => s !== '.' && s !== '..');
}
