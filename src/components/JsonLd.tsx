/**
 * Injects a schema.org JSON-LD block — a structured-data signal that helps search
 * engines (and ad networks assessing quality) understand the page. SSR-safe: it
 * is just a <script> tag with serialized JSON.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; no user-controlled HTML.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
