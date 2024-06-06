import defu from 'defu';
import { join, resolve } from 'pathe';
import { readFileSync, existsSync } from 'node:fs';

export type DetectOptions = {
  /**
   * When multiple package managers are detected, an error will be thrown.
   */
  strict?: boolean;

  /**
   * The directory to start searching for package manager files.
   */
  cwd?: string;

  /**
   * Ignored packageManager field in package.json
   */
  ignorePackageManagerField?: boolean;

  /**
   * Ignore extra files that are not lock files.
   */
  ignoreExtraFiles?: boolean;
};

export type PackageManagerData = {
  name: string;
  lockFile: string;
  extraFiles?: string[];
};

export const packageManagers: PackageManagerData[] = [
  {
    name: 'npm',
    lockFile: 'package-lock.json',
    extraFiles: ['npm-shrinkwrap.json'],
  },
  {
    name: 'yarn',
    lockFile: 'yarn.lock',
    extraFiles: ['.yarnrc.yml'],
  },
  {
    name: 'pnpm',
    lockFile: 'pnpm-lock.yaml',
    extraFiles: ['pnpm-workspace.yaml'],
  },
  {
    name: 'bun',
    lockFile: 'bun.lockb',
  },
];
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export const detectPackageManager = (_options?: DetectOptions) => {
  let detected: PackageManager[] = [];
  const options = defu(_options, {
    strict: true,
    cwd: process.cwd(),
    ignorePackageManagerField: false,
    ignoreExtraFiles: false,
  });

  options.cwd = resolve(options.cwd);

  if (!options.ignorePackageManagerField) {
    const packageJson = JSON.parse(
      readFileSync(join(options.cwd, 'package.json'), 'utf8'),
    );

    if (packageJson.packageManager) {
      const [name] = packageJson.packageManager.split('@');

      if (packageManagers.some((manager) => manager.name === name)) {
        detected.push(name as PackageManager);
      }
    }
  }

  const allFiles = packageManagers.flatMap((manager) => {
    return [
      manager.lockFile,
      ...((options.ignoreExtraFiles ? [] : manager.extraFiles) || []),
    ];
  });

  for (const file of allFiles) {
    const _path = resolve(options.cwd, file);

    const exists = existsSync(_path);

    if (exists) {
      const manager = packageManagers.find(
        (manager) =>
          manager.lockFile === file || manager.extraFiles?.includes(file),
      );

      if (manager) {
        detected.push(manager.name as PackageManager);
      }
    }
  }

  detected = [...new Set(detected)];

  if (detected.length > 1 && options.strict) {
    throw new Error(
      `Multiple package managers detected: ${detected.join(', ')}`,
    );
  }

  return detected[0] || 'npm';
};
