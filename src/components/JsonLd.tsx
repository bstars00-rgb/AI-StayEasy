/**
 * Injects a schema.org JSON-LD block — a structured-data signal that helps search
 * engines (and ad networks assessing quality) understand the page. SSR-safe: it
 * is just a <script> tag with serialized JSON.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Escape "<" and the JS line separators (U+2028/U+2029) so a value can never
  // break out of the <script> block — hardening for user-supplied hotel data.
  const json = JSON.stringify(data)
    .split('<').join('\u003c')
    .split(String.fromCharCode(0x2028)).join('\u2028')
    .split(String.fromCharCode(0x2029)).join('\u2029')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
