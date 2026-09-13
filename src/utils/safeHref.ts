const ALLOWED_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Neutralizes CMS-controlled URLs before they reach a raw `<a href>`. Content in
 * Sanity (project links, mentorship CTAs, nav/social links) is owner-only today,
 * but a `javascript:`/`data:` URI stored there would otherwise execute on click.
 * Relative/same-origin links (no scheme) pass through untouched.
 */
export function safeHref(href: string | undefined | null): string {
  if (!href) return '#';
  try {
    const url = new URL(href, window.location.href);
    return ALLOWED_SCHEMES.has(url.protocol) ? href : '#';
  } catch {
    return '#';
  }
}
