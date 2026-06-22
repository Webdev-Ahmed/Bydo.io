// Copies the compiled, alias-resolved Vercel handler into /api so Vercel's
// zero-config Node.js Function detection can pick it up directly as plain JS.
// This avoids Vercel's own TypeScript compiler, which does not resolve the
// "#/*" path aliases used throughout src/.
import { mkdir, cp } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const distDir = join(root, "dist");
const apiDir = join(root, "api");

await mkdir(apiDir, { recursive: true });
await cp(distDir, join(apiDir, "_dist"), { recursive: true });

const handlerSource = `export { default } from "./_dist/vercel.js";\n`;
await import("node:fs/promises").then(({ writeFile }) =>
  writeFile(join(apiDir, "index.js"), handlerSource, "utf8"),
);

console.log("✅ Vercel function staged at api/index.js");
