import { addDependency, removeDependency } from "../src/cmd.ts";

addDependency("typescript", {
  dev: true,
  silent: true
});
