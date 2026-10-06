import { categories, countries, isRecord, parseArticle, validDate, type Article, type Category, type Country, type Feed } from './feed'

export const MAX_SAVED = 300
export const MAX_IMPORT_BYTES = 2 * 1024 * 1024
export type SavedArticle = { article: Article; savedAt: string; read: boolean }
export type ReaderState = { country: Country; category: Category; theme: 'light' | 'dark' }
export const storageKeys = { library: 'news-reader:library:v1', preferences: 'news-reader:preferences:v1' }
export const defaults: ReaderState = { country: 'in', category: 'general', theme: 'light' }
export function preferences(raw: string | null): ReaderState {
  try {
    const value: unknown = JSON.parse(raw || 'null')
    if (!isRecord(value)) return defaults
    return {
      country: typeof value.country === 'string' && Object.hasOwn(countries, value.country) ? value.country as Country : defaults.country,
      category: categories.includes(value.category as Category) ? value.category as Category : defaults.category,
      theme: value.theme === 'dark' ? 'dark' : 'light',
    }
  } catch { return defaults }
}
export function parseLibrary(raw: string | null, strict = false): SavedArticle[] {
  const invalid = () => { if (strict) throw new Error('Choose a valid News Reader export.'); return [] }
  if (!raw || raw.length > MAX_IMPORT_BYTES || new Blob([raw]).size > MAX_IMPORT_BYTES) return invalid()
  try {
    const value: unknown = JSON.parse(raw)
    const items = isRecord(value) && value.version === 1 ? value.articles : value
    if (!Array.isArray(items) || items.length > MAX_SAVED) return invalid()
    const seen = new Set<string>()
    const parsed = items.flatMap((item): SavedArticle[] => {
      if (!isRecord(item)) return []
      const article = parseArticle(item.article)
      const savedAt = validDate(item.savedAt)
      if (!article || !savedAt || typeof item.read !== 'boolean' || seen.has(article.id)) return []
      seen.add(article.id)
      return [{ article, savedAt, read: item.read }]
    })
    if (strict && parsed.length !== items.length) return invalid()
    return parsed
  } catch (error) {
    if (strict) throw error instanceof Error ? error : new Error('Could not read that export.')
    return []
  }
}
export function mergeLibrary(current: SavedArticle[], incoming: SavedArticle[]) {
  const merged = new Map(current.map((item) => [item.article.id, item]))
  for (const item of incoming) if (!merged.has(item.article.id)) merged.set(item.article.id, item)
  if (merged.size > MAX_SAVED) throw new Error(`The reading queue can hold ${MAX_SAVED} stories. Remove some before importing.`)
  return [...merged.values()]
}
export function readStorage(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}
export function writeStorage(key: string, value: unknown): boolean {
  try { localStorage.setItem(key, JSON.stringify(value)); return true } catch { return false }
}
export const cacheKey = (country: Country, category: Category, demo: boolean) => `news-reader:feed:v1:${demo ? 'demo' : 'live'}:${country}:${category}`
export function cachedFeed(raw: string | null): Feed | null {
  if (!raw || raw.length > MAX_IMPORT_BYTES) return null
  try {
    const value: unknown = JSON.parse(raw)
    if (!isRecord(value) || !Array.isArray(value.articles) || value.articles.length > 100) return null
    const seen = new Set<string>()
    const articles = value.articles.flatMap((x) => { const article = parseArticle(x); if (!article || seen.has(article.id)) return []; seen.add(article.id); return [article] })
    if (value.articles.length && !articles.length) return null
    return { articles, fetchedAt: validDate(value.fetchedAt), providers: Array.isArray(value.providers) ? value.providers.filter((x): x is string => typeof x === 'string').slice(0, 20) : [] }
  } catch { return null }
}
