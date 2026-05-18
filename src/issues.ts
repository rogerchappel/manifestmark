import type { PackageSummary, ScanIssue } from "./types.js";

export function packageIssues(pkg: PackageSummary): ScanIssue[] {
  const issues: ScanIssue[] = [];

  if (!pkg.private && !pkg.publishConfig.access && !pkg.files.length) {
    issues.push(issue("missing-files", "warning", pkg.path, "Public package does not declare files."));
  }

  if (!pkg.packageManager) {
    issues.push(issue("missing-package-manager", "warning", pkg.path, "Package does not declare packageManager."));
  }

  for (const script of pkg.scripts) {
    for (const missing of script.missingLocalFiles) {
      issues.push(
        issue(
          "missing-script-file",
          "error",
          pkg.path,
          `Script "${script.name}" references missing local file: ${missing}`
        )
      );
    }
  }

  for (const dependency of pkg.dependencies) {
    if (dependency.broad) {
      issues.push(
        issue(
          "broad-dependency-range",
          "warning",
          pkg.path,
          `${dependency.kind} entry ${dependency.name} uses broad range "${dependency.range}".`
        )
      );
    }
  }

  return issues;
}

export function requiredMetadataIssues(pkg: PackageSummary, hasLicense: boolean, hasRepository: boolean): ScanIssue[] {
  const issues: ScanIssue[] = [];
  if (!pkg.private && !hasLicense) {
    issues.push(issue("missing-license", "warning", pkg.path, "Public package is missing license."));
  }
  if (!hasRepository) {
    issues.push(issue("missing-repository", "warning", pkg.path, "Package is missing repository metadata."));
  }
  return issues;
}

export function issue(id: string, severity: ScanIssue["severity"], packagePath: string | undefined, message: string): ScanIssue {
  return { id, severity, packagePath, message };
}
