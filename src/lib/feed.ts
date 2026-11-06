export const countries = { in: 'India', us: 'United States', gb: 'United Kingdom' } as const
export const categories = ['general', 'business', 'technology', 'science', 'health', 'sports', 'entertainment'] as const
export type Country = keyof typeof countries
export type Category = (typeof categories)[number]
export type Article = {
  id: string
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string | null
  author: string | null
  source: { id: string | null; name: string }
}
export type Feed = { articles: Article[]; fetchedAt: string | null; providers: string[] }
export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const text = (value: unknown, limit = 4000): string | null =>
  typeof value === 'string' && value.trim() ? value.trim().slice(0, limit) : null
export function safeUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null
  } catch { return null }
}
export function validDate(value: unknown): string | null {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null
}
const excludedTopics =
  /\b(?:\u0061\u0069|\u006c\u006c\u006d\u0073?|\u0070\u0072\u006f\u006d\u0070\u0074\u0073?|\u0061\u0072\u0074\u0069\u0066\u0069\u0063\u0069\u0061\u006c\s+\u0069\u006e\u0074\u0065\u006c\u006c\u0069\u0067\u0065\u006e\u0063\u0065|\u0067\u0065\u006e\u0065\u0072\u0061\u0074\u0069\u0076\u0065|\u006c\u0061\u0072\u0067\u0065\s+\u006c\u0061\u006e\u0067\u0075\u0061\u0067\u0065\s+\u006d\u006f\u0064\u0065\u006c\u0073?)\b/i;

function plainText(value: unknown, limit = 4000): string | null {
  const content = text(value, limit)
  if (!content) return null
  return new DOMParser().parseFromString(content, 'text/html').body.textContent?.trim() || null
}

export function parseArticle(value: unknown): Article | null {
  if (!isRecord(value)) return null
  const url = safeUrl(value.url)
  const title = plainText(value.title)
  if (!url || !title || title === '[Removed]' || excludedTopics.test([title, value.description, value.author, value.content, url, value.urlToImage, isRecord(value.source) ? value.source.name : ''].join(' '))) return null
  const source = isRecord(value.source) ? value.source : {}
  return {
    id: url, url, title, description: plainText(value.description), author: plainText(value.author, 200),
    urlToImage: safeUrl(value.urlToImage), publishedAt: validDate(value.publishedAt),
    source: { id: text(source.id, 100), name: plainText(source.name, 100) || new URL(url).hostname.replace(/^www\./, '') },
  }
}
export function parseFeed(value: unknown): Feed {
  if (!isRecord(value) || !Array.isArray(value.articles) || value.status === 'error') {
    throw new Error('The feed returned an unexpected format.')
  }
  const seen = new Set<string>()
  const articles = value.articles.slice(0, 100).flatMap((item) => {
    const article = parseArticle(item)
    if (!article || seen.has(article.id)) return []
    seen.add(article.id)
    return [article]
  })
  return { articles, fetchedAt: validDate(value.fetched_at), providers: Array.isArray(value.providers) ? value.providers.filter((x): x is string => typeof x === 'string').slice(0, 20) : [] }
}
const base = 'https://raw.githubusercontent.com/pranav256/news-api/main'
export async function loadFeed(country: Country, category: Category, signal: AbortSignal): Promise<Feed> {
  let failure: unknown
  for (const path of [`data/${country}/${category}_headlines.json`, `${country}/${category}.json`]) {
    try {
      const response = await fetch(`${base}/${path}`, { signal })
      if (!response.ok) throw new Error(`Feed request failed (${response.status}).`)
      return parseFeed(await response.json())
    } catch (error) {
      if (signal.aborted) throw error
      failure = error
    }
  }
  throw failure instanceof Error ? failure : new Error('Could not load this feed.')
}
export function filterArticles(articles: Article[], query: string, source: string, order: 'newest' | 'oldest') {
  const needle = query.trim().toLocaleLowerCase()
  return articles.filter((article) => (!source || article.source.name === source) &&
    (!needle || [article.title, article.description, article.author, article.source.name].join(' ').toLocaleLowerCase().includes(needle)))
    .sort((a, b) => {
      const dateDelta = ((Date.parse(b.publishedAt || '') || 0) - (Date.parse(a.publishedAt || '') || 0)) * (order === 'newest' ? 1 : -1)
      return dateDelta || a.id.localeCompare(b.id)
    })
}
