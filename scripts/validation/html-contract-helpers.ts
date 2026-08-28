import { assert } from "../validation-assert.ts";

export function assertNoDuplicateClassAttributes(filePath: string, html: string): void {
  const duplicateClassAttribute = html.match(/<[^>]*\bclass\s*=\s*["'][^"']*["'][^>]*\bclass\s*=/);

  assert(!duplicateClassAttribute, `Expected ${filePath} to avoid duplicate class attributes. Found: ${duplicateClassAttribute?.[0]}`);
}
