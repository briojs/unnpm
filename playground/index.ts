import { addDependency, removeDependency } from "../src/cmd.ts";

await addDependency("typescript", {
  dev: true,
});

await Bun.sleep(5000);

await removeDependency("typescript");
