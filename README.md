## unnpm

> Stands for **uni**versal **npm**

[![npm version](https://img.shields.io/npm/v/unnpm?color=yellow)](https://npmjs.com/package/unnpm)
[![npm downloads](https://img.shields.io/npm/dm/unnpm?color=yellow)](https://npmjs.com/package/unnpm)
[![bundle size](https://img.shields.io/bundlephobia/minzip/unnpm?color=yellow)](https://bundlephobia.com/package/unnpm)
[![license](https://img.shields.io/github/license/briojs/unnpm?color=yellow)](https://github.com/briojs/unnpm/blob/main/LICENSE)

### Install

```sh
# npm
npm install -D unnpm

# yarn
yarn add -D unnpm

# pnpm
pnpm install -D unnpm

# bun
bun install -D unnpm
```

### Detecting package manager

```ts
import { detectPackageManager } from "unnpm";

const pm = detectPackageManager();
```

First `unnpm` will check if there is `packageManager` field in your package.json. Then it will scan for lock files and
pm specific files. If it fails, it will default to `npm`.

If there are multiple package managers detected, it throws an error, unless `strict` option is set to `false`.

#### Options

- `strict` - boolean, default `true`
- `cwd` - string, default `process.cwd()`
- `ignorePackageManagerField` - boolean, default `false`
- `ignoreExtraFiles` - boolean, default `false`

To use options in other function, you can use `detectOptions` field in the function options

```ts
import { installDependencies } from "unnpm";

await installDependencies({
  detectOptions: { strict: false },
});
```

### Installing dependencies

```ts
import { installDependencies } from "unnpm";

await installDependencies({ options });
```

### Adding and removing dependencies

```ts
import { addDependency, removeDependency } from "unnpm";

await addDependency("typescript@5.4.5", { options });

await removeDependency("typescript", { options });
```

Published under the [MIT](https://github.com/briojs/unnpm/blob/main/LICENSE) license.
Made by [@malezjaa](https://github.com/briojs)
and [community](https://github.com/briojs/unnpm/graphs/contributors) 💛
<br><br>
<a href="https://github.com/briojs/unnpm/graphs/contributors">
<img src="https://contrib.rocks/image?repo=briojs/unnpm" />
</a>
