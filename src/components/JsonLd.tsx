/**
 * Serialize `data` to a JSON string safe to inline inside a <script> tag:
 * "<" and the JS line separators (U+2028 / U+2029) become their \uXXXX escape
 * sequences (a real backslash + hex), so a value can never close the block.
 * JSON.parse restores them; the HTML parser never sees them. Code-point compare
 * avoids a literal separator inside a /regex/ (which is itself a line terminator).
 * Exported for regression testing.
 */
export function jsonLdString(data: Record<string, unknown>): string {
  let out = ''
  for (const ch of JSON.stringify(data)) {
    const code = ch.charCodeAt(0)
    out += ch === '<' || code === 0x2028 || code === 0x2029 ? '\\u' + code.toString(16).padStart(4, '0') : ch
  }
  return out
}

/**
 * Injects a schema.org JSON-LD block — a structured-data signal that helps search
 * engines (and ad networks assessing quality) understand the page. SSR-safe.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
}
