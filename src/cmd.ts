import {
  DetectOptions,
  PackageManager,
  detectPackageManager,
} from './detect.ts';

export type ActionOptions = {
  /**
   * Silent mode. Don't output anything
   */
  silent?: boolean;

  /**
   * Current working directory
   */
  cwd?: string;

  /**
   * Options for detecting package manager
   */
  detectOptions?: Omit<DetectOptions, 'cwd'>;

  /**
   * Override package manager
   */
  packageManager?: PackageManager;
};

export const isCorepackInstalled = async () => {
  if (typeof Bun !== 'undefined') {
    try {
      Bun.spawnSync(['corepack', '--version'], {
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      return true;
    } catch {
      return false;
    }
  }

  const execa = await import('execa').then((module_) => module_.execa);

  try {
    await execa('corepack', ['--verdsion']);
    return true;
  } catch {
    return false;
  }
};

export const isCorepackCompatible = (pm: PackageManager) => {
  return pm !== 'npm' && pm !== 'bun';
};

export const runCommand = async (
  command: string,
  arguments_: string[],
  options: ActionOptions,
) => {
  const corepack = await isCorepackInstalled();
  const execaArguments: [string, string[]] =
    isCorepackCompatible(command as PackageManager) && corepack
      ? ['corepack', [command, ...arguments_]]
      : [command, arguments_];

  if (typeof Bun !== 'undefined') {
    Bun.spawn([execaArguments[0], ...execaArguments[1]], {
      cwd: options.cwd,
      stdio: [
        'pipe',
        options.silent ? 'pipe' : 'inherit',
        options.silent ? 'pipe' : 'inherit',
      ],
    });
    return;
  }

  const execa = await import('execa').then((module_) => module_.execa);
  await execa(execaArguments[0], execaArguments[1], {
    cwd: options.cwd,
    stdio: options.silent ? 'pipe' : 'inherit',
  });
};

export interface ActionWithArguments extends ActionOptions {
  /**
   * Adds as a dev dependency
   */
  dev?: boolean;
  /**
   * Installs globally
   */
  global?: boolean;
  // TODO: add workspace support
}

export const resolveArgs = (
  pm: PackageManager,
  options: ActionWithArguments,
  action: 'add' | 'remove',
) => {
  return (
    pm === 'yarn'
      ? [action, options.dev ? '--D' : '']
      : [
          pm === 'npm' ? (action === 'add' ? 'install' : 'uninstall') : action,
          options.dev ? '--D' : '',
          options.global ? '-g' : '',
        ]
  ).filter(Boolean);
};

export const installDependencies = async (options: ActionOptions = {}) => {
  options.cwd = options.cwd ?? process.cwd();
  const packageManager =
    options.packageManager ||
    detectPackageManager({
      cwd: options.cwd,
      ...options.detectOptions,
    });

  await runCommand(packageManager, ['install'], options);
};

export const addDependency = async (
  packages: string | string[],
  options: ActionWithArguments = {},
) => {
  options.cwd = options.cwd ?? process.cwd();
  const packageManager =
    options.packageManager ||
    detectPackageManager({
      cwd: options.cwd,
      ...options.detectOptions,
    });
  const arguments_ = resolveArgs(packageManager, options, 'add');
  const _packages = Array.isArray(packages) ? packages : [packages];

  await runCommand(packageManager, [...arguments_, ..._packages], options);
};

export const removeDependency = async (
  packages: string | string[],
  options: ActionWithArguments = {},
) => {
  options.cwd = options.cwd ?? process.cwd();
  const packageManager =
    options.packageManager ||
    detectPackageManager({
      cwd: options.cwd,
      ...options.detectOptions,
    });

  const arguments_ = resolveArgs(packageManager, options, 'remove');
  const _packages = Array.isArray(packages) ? packages : [packages];

  await runCommand(packageManager, [...arguments_, ..._packages], options);
};
