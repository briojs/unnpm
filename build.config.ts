import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  // Only when Bun is installed, it will be used instead of execa
  externals: ['bun'],
});
