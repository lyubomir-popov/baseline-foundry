/**
 * strip-demo-chrome.ts
 *
 * Radical simplification of demo HTML pages:
 *   <body class="{theme}" data-bf-tone="dark" data-component-capture>
 *     {component markup — parasites cleaned}
 *   </body>
 *
 * Structural class mapping:
 *   component-demo-stack      → bf-stack
 *   component-demo-flow-box   → bf-stack
 *   component-demo-cluster    → bf-cluster
 *   component-demo-specimens  → bf-stack
 *   component-demo-narrow-rail → (inline style)
 *   component-demo-parameter-rail → (inline style)
 *
 * Everything else component-demo-* → removed.
 */

import fs from "node:fs";
import path from "node:path";

const DEMO_DIR = path.resolve("demo/components");

// Map structural parasites to bf-* equivalents
const CLASS_REPLACEMENTS: Record<string, string> = {
  "component-demo-stack": "bf-stack",
  "component-demo-flow-box": "bf-stack",
  "component-demo-cluster": "bf-cluster",
  "component-demo-specimens": "bf-stack",
  "component-demo-specimen": "",
};

// These get replaced with inline styles
const INLINE_STYLE_CLASSES: Record<string, string> = {
  "component-demo-narrow-rail": "display:grid;gap:var(--bf-field-gap,0.75rem);inline-size:min(100%,12rem);min-inline-size:0",
  "component-demo-parameter-rail": "display:grid;gap:var(--bf-field-gap,0.75rem);inline-size:min(100%,19rem);min-inline-size:0",
  "component-demo-shell-grid": "display:grid;gap:1.5rem",
  "component-demo-micro-list": "display:grid;gap:calc(var(--bf-baseline)*3)",
};

function cleanClasses(classAttr: string): { classes: string; inlineStyle: string } {
  const tokens = classAttr.split(/\s+/).filter(Boolean);
  const kept: string[] = [];
  const styles: string[] = [];

  for (const token of tokens) {
    // Check for inline-style replacements first
    if (INLINE_STYLE_CLASSES[token]) {
      styles.push(INLINE_STYLE_CLASSES[token]);
      continue;
    }
    // Check for class replacements
    if (CLASS_REPLACEMENTS[token] !== undefined) {
      if (CLASS_REPLACEMENTS[token]) kept.push(CLASS_REPLACEMENTS[token]);
      continue;
    }
    // Remove all remaining component-demo-* classes
    if (token.startsWith("component-demo-")) continue;
    // Remove component-atlas* classes
    if (token.startsWith("component-atlas")) continue;
    // Remove component-index* classes
    if (token.startsWith("component-index")) continue;
    // Remove component-status* classes
    if (token.startsWith("component-status")) continue;
    // Keep everything else
    kept.push(token);
  }

  return { classes: kept.join(" "), inlineStyle: styles.join(";") };
}

function processClassAttributes(html: string): string {
  // Process class="..." attributes, cleaning parasite classes
  return html.replace(/class="([^"]*)"/g, (_match, classValue: string) => {
    const { classes, inlineStyle } = cleanClasses(classValue);
    if (!classes && !inlineStyle) return "";
    let result = "";
    if (classes) result += `class="${classes}"`;
    if (inlineStyle) {
      result += (result ? " " : "") + `style="${inlineStyle}"`;
    }
    return result;
  });
}

function extractTheme(html: string): { theme: string; tone: string } {
  const themeMatch = html.match(/class="[^"]*\b(bf-theme)\b/);
  const theme = themeMatch?.[1] ?? "bf-theme";

  // Find tone
  const toneMatch = html.match(/data-bf-tone="([^"]*)"/);
  const tone = toneMatch?.[1] ?? "dark";

  return { theme, tone };
}

function extractStylesheets(html: string): string[] {
  const links: string[] = [];
  const re = /<link\s+rel="stylesheet"\s+href="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const href = m[1].replace(/\?.*$/, ""); // strip cache busters
    links.push(href);
  }
  return links;
}

function extractCaptureContent(html: string): string | null {
  // Find the element with data-component-capture and extract its innerHTML
  const captureStart = html.indexOf("data-component-capture");
  if (captureStart === -1) return null;

  // Find the > that closes this opening tag
  const tagClose = html.indexOf(">", captureStart);
  if (tagClose === -1) return null;

  // Now find the matching closing tag
  // Walk backwards from captureStart to find the tag name
  let tagStart = captureStart;
  while (tagStart > 0 && html[tagStart] !== "<") tagStart--;
  const tagNameMatch = html.slice(tagStart).match(/<(\w+)\s/);
  if (!tagNameMatch) return null;
  const tagName = tagNameMatch[1];

  // Simple depth-counting approach to find the matching close tag
  const contentStart = tagClose + 1;
  let depth = 1;
  let pos = contentStart;
  const openRe = new RegExp(`<${tagName}[\\s>]`, "gi");
  const closeRe = new RegExp(`</${tagName}>`, "gi");

  // Collect all open/close positions
  const events: { pos: number; type: "open" | "close" }[] = [];
  openRe.lastIndex = contentStart;
  closeRe.lastIndex = contentStart;

  let om: RegExpExecArray | null;
  while ((om = openRe.exec(html)) !== null) {
    events.push({ pos: om.index, type: "open" });
  }
  let cm: RegExpExecArray | null;
  while ((cm = closeRe.exec(html)) !== null) {
    events.push({ pos: cm.index, type: "close" });
  }

  events.sort((a, b) => a.pos - b.pos);

  for (const event of events) {
    if (event.type === "open") depth++;
    else {
      depth--;
      if (depth === 0) {
        return html.slice(contentStart, event.pos);
      }
    }
  }

  return null;
}

function extractTitle(html: string): string {
  const m = html.match(/<title>([^<]*)<\/title>/);
  return m?.[1] ?? "Demo";
}

function extractScripts(html: string): string[] {
  const scripts: string[] = [];
  const re = /<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const src = m[1].replace(/\?.*$/, "");
    scripts.push(src);
  }
  return scripts;
}

function dedent(content: string): string {
  const lines = content.split("\n");
  // Find minimum indentation of non-empty lines
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim() === "") continue;
    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    if (indent < minIndent) minIndent = indent;
  }
  if (minIndent === Infinity || minIndent === 0) return content;
  // Remove exactly 2 levels of indent to bring content to body-child level
  const strip = Math.max(0, minIndent - 2);
  return lines.map(line => {
    if (line.trim() === "") return "";
    return line.slice(strip);
  }).join("\n");
}

function processFile(filePath: string): void {
  const html = fs.readFileSync(filePath, "utf8");
  const fileName = path.basename(filePath);

  // Skip index.html (it's a listing page, not a component demo)
  if (fileName === "index.html") return;

  const { theme, tone } = extractTheme(html);
  const stylesheets = extractStylesheets(html);
  const title = extractTitle(html);
  const scripts = extractScripts(html);

  // Extract captured content
  let content = extractCaptureContent(html);
  if (!content) {
    console.warn(`⚠ ${fileName}: no data-component-capture found, skipping`);
    return;
  }

  // Clean parasite classes in content
  content = processClassAttributes(content);

  // Remove empty class="" and style="" attributes left behind
  content = content.replace(/\s+class=""/g, "");
  content = content.replace(/\s+style=""/g, "");
  // Collapse multiple spaces in tags
  content = content.replace(/ {2,}/g, " ");

  // Dedent content to match body-child indentation
  content = dedent(content.trim());

  // Filter stylesheets: keep framework CSS, drop component-shell.css
  const frameworkCss = stylesheets.filter(s => !s.includes("component-shell"));
  // Keep component-shell.css for now (minimal version) to provide body reset
  const shellCss = stylesheets.filter(s => s.includes("component-shell"));

  const cssLinks = [...frameworkCss, ...shellCss]
    .map(href => `  <link rel="stylesheet" href="${href}">`)
    .join("\n");

  const scriptTags = scripts
    .map(src => `  <script type="module" src="${src}"></script>`)
    .join("\n");

  const output = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
${cssLinks}
</head>
<body class="${theme}" data-bf-tone="${tone}" data-component-capture>
${content}
${scriptTags}
</body>
</html>
`;

  fs.writeFileSync(filePath, output, "utf8");
  console.log(`✓ ${fileName}`);
}

// Process all HTML files in demo/components/
const files = fs.readdirSync(DEMO_DIR)
  .filter(f => f.endsWith(".html"))
  .map(f => path.join(DEMO_DIR, f));

console.log(`Processing ${files.length} demo files...`);
for (const file of files) {
  processFile(file);
}
console.log("Done.");
