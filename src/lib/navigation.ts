import { categories, countries, type Category, type Country } from './feed'
import { type ReaderState } from './library'

export type ReaderLocation = { country: Country; category: Category; view: 'headlines' | 'saved'; query: string; source: string; order: 'newest' | 'oldest'; read: 'all' | 'unread' | 'read'; article: string; details: boolean }
export function readerLocation(search: string, fallback: ReaderState): ReaderLocation {
  const params = new URLSearchParams(search)
  const country = params.get('country') || fallback.country
  const category = params.get('category') || fallback.category
  return { country: Object.hasOwn(countries, country) ? country as Country : fallback.country,
    category: categories.includes(category as Category) ? category as Category : fallback.category,
    view: params.get('view') === 'saved' ? 'saved' : 'headlines', query: (params.get('q') || '').slice(0, 200),
    source: (params.get('source') || '').slice(0, 100), order: params.get('order') === 'oldest' ? 'oldest' : 'newest',
    read: params.get('read') === 'read' ? 'read' : params.get('read') === 'unread' ? 'unread' : 'all',
    article: params.get('article') || '', details: params.get('details') === 'feed' }
}
export function readerSearch(location: ReaderLocation) {
  const params = new URLSearchParams({ country: location.country, category: location.category })
  if (location.view === 'saved') params.set('view', 'saved')
  if (location.query) params.set('q', location.query)
  if (location.source) params.set('source', location.source)
  if (location.order !== 'newest') params.set('order', location.order)
  if (location.read !== 'all') params.set('read', location.read)
  if (location.article) params.set('article', location.article)
  if (location.details) params.set('details', 'feed')
  return `?${params}`
}
