export type OutputFormat = "markdown" | "json";

export type IssueSeverity = "info" | "warning" | "error";

export interface ScanOptions {
  cwd?: string;
  format?: OutputFormat;
}

export interface PackageManifest {
  name?: string;
  version?: string;
  private?: boolean;
  license?: string;
  repository?: unknown;
  packageManager?: string;
  engines?: Record<string, string>;
  scripts?: Record<string, string>;
  bin?: string | Record<string, string>;
  publishConfig?: Record<string, unknown>;
  files?: string[];
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  workspaces?: string[] | { packages?: string[] };
}

export interface ScriptSummary {
  name: string;
  command: string;
  missingLocalFiles: string[];
}

export interface DependencySummary {
  name: string;
  range: string;
  kind: "dependencies" | "devDependencies" | "peerDependencies" | "optionalDependencies";
  broad: boolean;
}

export interface PackageSummary {
  path: string;
  relativeDir: string;
  name: string;
  version?: string;
  private: boolean;
  packageManager?: string;
  engines: Record<string, string>;
  scripts: ScriptSummary[];
  bin: Record<string, string>;
  publishConfig: Record<string, unknown>;
  files: string[];
  dependencies: DependencySummary[];
  issueIds: string[];
}

export interface ScanIssue {
  id: string;
  severity: IssueSeverity;
  packagePath?: string;
  message: string;
}

export interface ScanResult {
  root: string;
  packageCount: number;
  packages: PackageSummary[];
  issues: ScanIssue[];
  workspace: {
    detected: boolean;
    rootPackage?: string;
    patterns: string[];
    packageManagers: string[];
    engines: Record<string, string[]>;
  };
}
