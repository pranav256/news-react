import { beforeEach, describe, expect, it, vi } from 'vitest'
import { categories, filterArticles, parseArticle, parseFeed, parseStatus } from './feed'
import { cachedFeed, mergeLibrary, parseLibrary, preferences, writeStorage } from './library'
import { demoFeed } from './demo'
import { readerLocation, readerSearch } from './navigation'

const raw = { title: 'A story [with punctuation]', description: null, url: 'https://example.com/story', urlToImage: null, source: { name: 'Example News' }, publishedAt: '2026-10-05T06:00:00Z' }
const article = parseArticle(raw)!
const saved = { article, savedAt: '2026-10-05T07:00:00.000Z', read: false }

beforeEach(() => { localStorage.clear(); vi.restoreAllMocks() })
describe('feed contracts', () => {
  it('keeps readable stories without optional images and descriptions', () => {
    const result = parseFeed({ articles: [raw, raw, null, { ...raw, url: 'javascript:alert(1)' }] })
    expect(result.articles).toHaveLength(1)
    expect(result.articles[0].urlToImage).toBeNull()
    expect(result.fetchedAt).toBeNull()
  })
  it('distinguishes an empty valid feed from a malformed or failed response', () => {
    expect(parseFeed({ articles: [] }).articles).toEqual([])
    expect(() => parseFeed({ articles: 'bad' })).toThrow()
    expect(() => parseFeed({ status: 'error', articles: [] })).toThrow()
    expect(() => parseFeed({ articles: [{ title: 'No URL' }] })).toThrow()
  })
  it('treats search punctuation literally and does not mutate the source list', () => {
    const list = [article, { ...article, id: 'other', title: 'Another story', source: { id: null, name: 'Other News' } }]
    expect(filterArticles(list, '[', '', 'newest')).toEqual([article])
    expect(filterArticles(list, '', '', 'newest')).toHaveLength(2)
    expect(filterArticles(list, '', 'Other News', 'newest')[0].title).toBe('Another story')
    expect(list).toHaveLength(2)
  })
  it('does not invent a timestamp from article dates or incomplete status data', () => {
    expect(parseFeed({ articles: [raw] }).fetchedAt).toBeNull()
    expect(parseStatus({ status: 'partial', rss_feeds_failed: 3 }).generated_at).toBeNull()
    expect(parseStatus({ status: 'partial', rss_feeds_failed: 3 }).rss_feeds_failed).toBe(3)
  })
})
describe('local reading data', () => {
  it('recovers from corrupt and unsupported preferences', () => {
    expect(preferences('{')).toEqual({ country: 'in', category: 'general', theme: 'light' })
    expect(preferences(JSON.stringify({ country: 'zz', category: 'invalid', theme: 'dark' }))).toEqual({ country: 'in', category: categories[0], theme: 'dark' })
  })
  it('round-trips an export and keeps existing read state on duplicate imports', () => {
    const imported = parseLibrary(JSON.stringify({ version: 1, articles: [saved] }), true)
    expect(imported).toEqual([saved])
    expect(mergeLibrary([{ ...saved, read: true }], imported)[0].read).toBe(true)
  })
  it('rejects hostile or partial imports instead of silently discarding records', () => {
    expect(() => parseLibrary(JSON.stringify({ version: 1, articles: [saved, { ...saved, article: { ...raw, url: 'data:text/html,bad' } }] }), true)).toThrow()
    expect(parseLibrary('broken local data')).toEqual([])
  })
  it('reports storage failures and validates cached feeds', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Full', 'QuotaExceededError') })
    expect(writeStorage('queue', [saved])).toBe(false)
    expect(cachedFeed('{')).toBeNull()
    expect(cachedFeed(JSON.stringify({ articles: [raw], fetchedAt: null, providers: [] }))?.articles).toEqual([article])
  })
  it('rejects inherited country names and restores URL filters without fabricated state', () => {
    const defaults = preferences(null)
    expect(preferences('{"country":"constructor"}').country).toBe('in')
    const location = readerLocation('?country=us&category=science&q=%5B&source=Example&order=oldest&view=saved&read=unread', defaults)
    expect(readerLocation(readerSearch(location), defaults)).toEqual(location)
    expect(readerLocation('?country=__proto__&category=not-valid', defaults).country).toBe('in')
  })
  it('keeps demo story identities stable across category filters', () => {
    const general = demoFeed('in', 'general')
    const science = demoFeed('in', 'science')
    expect(general.articles.find((item) => item.title === science.articles[0].title)?.id).toBe(science.articles[0].id)
  })
})
