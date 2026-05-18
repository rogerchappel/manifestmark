const IGNORED_DIRS = new Set([
  ".git",
  ".hg",
  ".svn",
  ".turbo",
  ".next",
  ".nuxt",
  ".svelte-kit",
  ".cache",
  "coverage",
  "dist",
  "build",
  "node_modules",
  "out"
]);

export function shouldSkipDir(name: string): boolean {
  return IGNORED_DIRS.has(name);
}

export function ignoredDirs(): string[] {
  return [...IGNORED_DIRS].sort();
}
