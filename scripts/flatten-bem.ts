/**
 * Mechanical transform: flatten BEM bf-* class names to single-dash + is-* modifiers.
 *
 * Rules (applied in order):
 *   .bf-foo-bar.is-baz  →  .bf-foo-bar.is-baz
 *   .bf-foo-bar       →  .bf-foo-bar
 *   .bf-foo.is-bar       →  .bf-foo.is-bar
 *
 * For HTML class attributes:
 *   class="bf-foo__bar--baz"  →  class="bf-foo-bar is-baz"
 *   class="bf-foo--bar"       →  class="bf-foo is-bar"
 *
 * Also renames p-* classes in HTML to their bf-* flat equivalents:
 *   class="p-foo__bar--baz"  →  class="bf-foo-bar is-baz"
 *   class="p-foo__bar"       →  class="bf-foo-bar"
 *   class="p-foo--bar"       →  class="bf-foo is-bar"
 *   class="p-foo"            →  class="bf-foo"
 *
 * CSS custom properties (--bf-*) are never touched.
 * The p-* selectors in CSS are kept as deprecated aliases.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, extname } from "path";

function flattenBfBemInCss(content: string): string {
  // Order matters: longest pattern first
  // 1. .bf-foo-bar.is-baz → .bf-foo-bar.is-baz
  content = content.replace(/\.bf-([a-z0-9-]+)__([a-z0-9-]+)--([a-z0-9-]+)/g, ".bf-$1-$2.is-$3");
  // 2. .bf-foo-bar → .bf-foo-bar
  content = content.replace(/\.bf-([a-z0-9-]+)__([a-z0-9-]+)/g, ".bf-$1-$2");
  // 3. .bf-foo.is-bar → .bf-foo.is-bar
  content = content.replace(/\.bf-([a-z0-9-]+)--([a-z0-9-]+)/g, ".bf-$1.is-$2");
  return content;
}

function flattenBfBemInJsStrings(content: string): string {
  // Same transforms but for JS/TS string literals that contain CSS selectors
  // These appear in querySelector strings like ".bf-accordion-tab"
  // The dot-prefixed pattern is the same as CSS
  return flattenBfBemInCss(content);
}

/**
 * In HTML class attributes, BEM names appear WITHOUT the leading dot.
 * A class like `p-accordion__tab` needs to become `bf-accordion-tab`.
 * A class like `p-button--base` needs to become `bf-button is-base` (two classes).
 * A class like `bf-accordion__tab` also needs flattening.
 */
function flattenClassesInHtml(content: string): string {
  // Process class="..." and class='...' attributes
  return content.replace(/class="([^"]*)"/g, (match, classStr: string) => {
    const classes = classStr.split(/\s+/).filter(Boolean);
    const result: string[] = [];

    for (const cls of classes) {
      result.push(...flattenOneClass(cls));
    }

    return `class="${result.join(" ")}"`;
  });
}

function flattenOneClass(cls: string): string[] {
  // p-* BEM → bf-* flat
  if (cls.startsWith("p-")) {
    const stripped = cls.slice(2); // remove "p-"
    return bemToFlat("bf-" + stripped);
  }

  // bf-* BEM → bf-* flat (if it has __ or --)
  if (cls.startsWith("bf-") && (cls.includes("__") || /--[a-z]/.test(cls))) {
    return bemToFlat(cls);
  }

  // u-no-margin--bottom → margin is reset now, drop it
  if (cls === "u-no-margin--bottom") {
    return [];
  }

  return [cls];
}

function bemToFlat(cls: string): string[] {
  // bf-foo__bar--baz → [bf-foo-bar, is-baz]
  const tripleMatch = cls.match(/^bf-([a-z0-9-]+)__([a-z0-9-]+)--([a-z0-9-]+)$/);
  if (tripleMatch) {
    return [`bf-${tripleMatch[1]}-${tripleMatch[2]}`, `is-${tripleMatch[3]}`];
  }

  // bf-foo__bar → [bf-foo-bar]
  const doubleMatch = cls.match(/^bf-([a-z0-9-]+)__([a-z0-9-]+)$/);
  if (doubleMatch) {
    return [`bf-${doubleMatch[1]}-${doubleMatch[2]}`];
  }

  // bf-foo--bar → [bf-foo, is-bar]
  const modMatch = cls.match(/^bf-([a-z0-9-]+)--([a-z0-9-]+)$/);
  if (modMatch) {
    return [`bf-${modMatch[1]}`, `is-${modMatch[2]}`];
  }

  return [cls];
}

// --- Main ---

const root = join(import.meta.dirname ?? ".", "..");

// 1. Flatten bf-* BEM in TypeScript source files
const srcFiles = readdirSync(join(root, "src")).filter(f => extname(f) === ".ts");
let srcChanges = 0;

for (const file of srcFiles) {
  const path = join(root, "src", file);
  const before = readFileSync(path, "utf-8");
  const after = flattenBfBemInCss(before);

  if (after !== before) {
    writeFileSync(path, after, "utf-8");
    srcChanges++;
    console.log(`  ✏️  src/${file}`);
  }
}

// 2. Flatten p-*/bf-* BEM in demo HTML files
const demoDir = join(root, "demo", "components");
const htmlFiles = readdirSync(demoDir).filter(f => extname(f) === ".html");
let htmlChanges = 0;

for (const file of htmlFiles) {
  const path = join(demoDir, file);
  const before = readFileSync(path, "utf-8");
  const after = flattenClassesInHtml(before);

  if (after !== before) {
    writeFileSync(path, after, "utf-8");
    htmlChanges++;
    console.log(`  ✏️  demo/components/${file}`);
  }
}

// 3. Also flatten in demo root files
const demoRootFiles = readdirSync(join(root, "demo")).filter(f => extname(f) === ".html");
for (const file of demoRootFiles) {
  const path = join(root, "demo", file);
  const before = readFileSync(path, "utf-8");
  const after = flattenClassesInHtml(before);

  if (after !== before) {
    writeFileSync(path, after, "utf-8");
    htmlChanges++;
    console.log(`  ✏️  demo/${file}`);
  }
}

// 4. Flatten in scripts that reference class names
const scriptFiles = readdirSync(join(root, "scripts")).filter(f => extname(f) === ".ts");
for (const file of scriptFiles) {
  const path = join(root, "scripts", file);
  const before = readFileSync(path, "utf-8");
  const after = flattenBfBemInCss(before);

  if (after !== before) {
    writeFileSync(path, after, "utf-8");
    srcChanges++;
    console.log(`  ✏️  scripts/${file}`);
  }
}

console.log(`\n✅ Flattened BEM: ${srcChanges} source files, ${htmlChanges} HTML files`);
