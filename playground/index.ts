import { addDependency, removeDependency } from '../src/cmd.ts';

await addDependency('typescript', {
  dev: true,
  silent: false,
  args: ['-w'],
});

console.log('dwadwad');
