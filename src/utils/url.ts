export function getArticleUrl(slug: string): string {
  return `/articles/${slug}`;
}

export function getCategoryUrl(slug: string): string {
  return `/category/${slug}`;
}

export function getAuthorUrl(slug: string): string {
  return `/author/${slug}`;
}

export function getTagUrl(slug: string): string {
  return `/tag/${slug}`;
}

export function getSearchUrl(query: string): string {
  return `/search?q=${encodeURIComponent(query)}`;
}

export function buildSearchParams(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${baseUrl}${path}`;
}
