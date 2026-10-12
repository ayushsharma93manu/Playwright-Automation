/**
 * Builds a RegExp that matches an absolute URL ending with `path`.
 * Tolerates a trailing slash and a `#google_vignette`-style hash that the
 * site's ad scripts sometimes append.
 */
export function pathUrl(path: string): RegExp {
  if (path === '/') {
    return /^https?:\/\/[^/]+\/?(#.*)?$/;
  }
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^https?://[^/]+${escaped}/?(#.*)?$`);
}
