import fs from "node:fs/promises";
import path from "node:path";

await Promise.all([
  fs.rm(path.resolve("dist"), { force: true, recursive: true }),
  fs.rm(path.resolve("generated/baseline"), { force: true, recursive: true })
]);
