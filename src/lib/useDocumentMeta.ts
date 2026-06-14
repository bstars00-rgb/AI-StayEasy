import { useEffect } from 'react'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Sets the document title and SEO/social meta tags for the current page.
 * Re-runs whenever title/description change (e.g. on language switch).
 */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)

    // Open Graph
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:site_name', 'StayEasy Vietnam')
    setMeta('property', 'og:url', window.location.href)

    // Twitter
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
  }, [title, description])
}
