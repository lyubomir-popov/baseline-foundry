// CSS AST assertion helpers for scripts/validate-build.ts.
//
// Background: validate-build.ts grew up using `css.includes("...long literal...")`
// substring checks against the generated CSS bundle. That style is brittle —
// any whitespace, ordering, or formatting change in the generator can break
// dozens of unrelated assertions even though the rendered CSS is semantically
// identical.
//
// These helpers parse the CSS once via PostCSS, then expose small assert-style
// queries that match on selector + declaration semantics rather than exact
// byte sequences. New assertions should prefer these helpers; legacy
// substring checks are migrated incrementally as the surrounding invariant
// groups are touched.
//
// Usage:
//
//   import postcss from "postcss";
//   import { parseCss, assertRuleHasDecl, assertRuleMissingDecl } from "./css-ast-helpers.ts";
//
//   const root = parseCss(generatedCss);
//   assertRuleHasDecl(root, ":where(.bf-theme) :where(.bf-top-navigation-row)", {
//     "display": "flex",
//     "padding-block": "0"
//   });
//
// The helpers throw via the same `assert` pattern the rest of validate-build.ts
// uses, so failures surface inside the same invariant groups and counters.

import postcss, { type Root, type Rule, type Declaration, type Container } from "postcss";
import { assert } from "./validation-assert.ts";

export function parseCss(css: string): Root {
  return postcss.parse(css);
}

/**
 * Find the first rule whose selector exactly matches `selector`. Walks all
 * containers (root, @media, @supports, @container, …) so nested rules are
 * discoverable. Returns `null` if no match exists.
 */
export function findRule(root: Container, selector: string): Rule | null {
  let match: Rule | null = null;
  root.walkRules((rule) => {
    if (rule.selector === selector) {
      match = rule;
      return false;
    }
    return undefined;
  });
  return match;
}

/**
 * Find every rule whose selector exactly matches `selector`.
 */
export function findRules(root: Container, selector: string): Rule[] {
  const matches: Rule[] = [];
  root.walkRules((rule) => {
    if (rule.selector === selector) {
      matches.push(rule);
    }
  });
  return matches;
}

/**
 * Find the first declaration with `prop` inside `rule`.
 */
export function findDecl(rule: Rule, prop: string): Declaration | null {
  let match: Declaration | null = null;
  rule.walkDecls(prop, (decl) => {
    match = decl;
    return false;
  });
  return match;
}

/**
 * Assert a rule with the given selector exists and contains every declaration
 * in `expectedDecls`. Each entry asserts both the property exists and its
 * value equals the expected value (post-PostCSS-normalisation).
 */
export function assertRuleHasDecl(
  root: Container,
  selector: string,
  expectedDecls: Record<string, string>,
  context?: string
): void {
  const label = context ?? selector;
  const rule = findRule(root, selector);
  assert(rule !== null, `Expected rule "${selector}" to exist (${label}).`);
  for (const [prop, expected] of Object.entries(expectedDecls)) {
    const decl = findDecl(rule, prop);
    assert(
      decl !== null,
      `Expected rule "${selector}" to declare "${prop}" (${label}).`
    );
    assert(
      decl.value === expected,
      `Expected rule "${selector}" to declare "${prop}: ${expected}" but got "${prop}: ${decl.value}" (${label}).`
    );
  }
}

/**
 * Assert a rule with the given selector exists but does NOT declare `prop`.
 * Useful for guarding accidental reintroduction of removed properties.
 */
export function assertRuleMissingDecl(
  root: Container,
  selector: string,
  prop: string,
  context?: string
): void {
  const label = context ?? selector;
  const rule = findRule(root, selector);
  assert(rule !== null, `Expected rule "${selector}" to exist (${label}).`);
  const decl = findDecl(rule, prop);
  assert(
    decl === null,
    `Expected rule "${selector}" not to declare "${prop}" but it does (${label}).`
  );
}

/**
 * Assert that a rule with the given selector exists.
 */
export function assertRuleExists(
  root: Container,
  selector: string,
  context?: string
): void {
  const label = context ?? selector;
  assert(
    findRule(root, selector) !== null,
    `Expected rule "${selector}" to exist (${label}).`
  );
}
