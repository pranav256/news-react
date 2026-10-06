import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import CardHolder from './components/CardHolder'
import ReadingQueue from './components/ReadingQueue'
import ArticleDialog from './components/ArticleDialog'
import FeedDetails from './components/FeedDetails'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useFeed } from '@/hooks/useFeed'
import { categories, countries, filterArticles, type Article } from '@/lib/feed'
import { MAX_SAVED, mergeLibrary, parseLibrary, preferences, readStorage, storageKeys, writeStorage, type SavedArticle } from '@/lib/library'
import { readerLocation, readerSearch, type ReaderLocation } from '@/lib/navigation'

export default function App() {
  const demo = window.location.pathname.replace(/\/$/, '') === '/demo'
  const [prefs] = useState(() => preferences(readStorage(storageKeys.preferences)))
  const [location, setLocation] = useState(() => readerLocation(window.location.search, prefs))
  const locationRef = useRef(location)
  const [theme, setTheme] = useState(prefs.theme)
  const libraryKey = `${storageKeys.library}${demo ? ':demo' : ''}`
  const [saved, setSaved] = useState(() => parseLibrary(readStorage(libraryKey)))
  const [notice, setNotice] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const feed = useFeed(location.country, location.category, demo)
  const navigate = (changes: Partial<ReaderLocation>, replace = false) => {
    const next = { ...locationRef.current, ...changes }
    locationRef.current = next
    window.history[replace ? 'replaceState' : 'pushState'](null, '', `${window.location.pathname}${readerSearch(next)}`)
    setLocation(next)
  }
  useEffect(() => {
    const onPop = () => { const next = readerLocation(window.location.search, prefs); locationRef.current = next; setLocation(next) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [prefs])
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    if (!writeStorage(storageKeys.preferences, { country: location.country, category: location.category, theme })) setNotice('Browser storage is unavailable. Export saved stories before leaving.')
  }, [location.country, location.category, theme])
  const updateSaved = (items: SavedArticle[]) => {
    setSaved(items)
    setNotice(writeStorage(libraryKey, { version: 1, articles: items }) ? '' : 'Browser storage is unavailable. Export saved stories before leaving.')
  }
  const toggleSave = (article: Article) => {
    if (saved.some((item) => item.article.id === article.id)) updateSaved(saved.filter((item) => item.article.id !== article.id))
    else if (saved.length >= MAX_SAVED) setNotice(`Your queue holds ${MAX_SAVED} stories. Remove a story before saving another.`)
    else updateSaved([{ article, savedAt: new Date().toISOString(), read: false }, ...saved])
  }
  const markRead = (id: string, read: boolean) => updateSaved(saved.map((item) => item.article.id === id ? { ...item, read } : item))
  const articles = filterArticles(feed.feed?.articles || [], location.query, location.source, location.order)
  const selected = [...(feed.feed?.articles || []), ...saved.map((item) => item.article)].find((article) => article.id === location.article)
  const sources = [...new Set((feed.feed?.articles || []).map((article) => article.source.name))].sort()
  return <div className="reader-shell">
    <a className="skip-link" href="#main">Skip to stories</a>
    <Navbar view={location.view} onView={(view) => navigate({ view, query: '', source: '', article: '' })} onDetails={() => navigate({ details: true })} />
    <main id="main" className="reader-main" tabIndex={-1}>
      <header className="reader-header">
        <div><h1>{location.view === 'saved' ? 'Saved reading' : 'Top stories'}</h1><p>{demo ? 'Demo. Fictional stories and browser-local saved reading.' : location.view === 'saved' ? 'Your browser-local reading queue.' : `${countries[location.country]}. ${location.category === 'general' ? 'General' : location.category[0].toUpperCase() + location.category.slice(1)} headlines.`}</p></div>
        <Button variant="outline" onClick={() => setFiltersOpen(true)}>Filters</Button>
      </header>
      {notice && <p role="alert" className="reader-notice">{notice}</p>}
      {location.view === 'headlines' ? <CardHolder articles={articles} loading={feed.loading} error={feed.error} cached={feed.cached} saved={saved} onPreview={(article) => navigate({ article: article.id })} onSave={toggleSave} onRetry={feed.retry} onClear={() => navigate({ query: '', source: '' })} filtered={!!(location.query || location.source)} /> :
        <ReadingQueue saved={saved} query={location.query} read={location.read} onQuery={(query) => navigate({ query }, true)} onReadFilter={(read) => navigate({ read })} onPreview={(article) => navigate({ article: article.id })} onRead={markRead} onRemove={(id) => updateSaved(saved.filter((item) => item.article.id !== id))} onImport={(incoming) => updateSaved(mergeLibrary(saved, incoming))} onDiscover={() => navigate({ view: 'headlines', query: '', source: '' })} />}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}><DialogContent className="reader-dialog"><DialogHeader><DialogTitle>Reader filters</DialogTitle><DialogDescription>Choose the stories you want to see.</DialogDescription></DialogHeader>
        <div className="reader-fields">
          <label>Country<NativeSelect value={location.country} onChange={(event) => navigate({ country: event.target.value as ReaderLocation['country'], source: '', article: '' })}>{Object.entries(countries).map(([code, name]) => <option key={code} value={code}>{name}</option>)}</NativeSelect></label>
          <label>Category<NativeSelect value={location.category} onChange={(event) => navigate({ category: event.target.value as ReaderLocation['category'], source: '', article: '' })}>{categories.map((category) => <option key={category} value={category}>{category[0].toUpperCase() + category.slice(1)}</option>)}</NativeSelect></label>
          <label>Search stories<Input type="search" value={location.query} maxLength={200} onChange={(event) => navigate({ query: event.target.value }, true)} /></label>
          <label>Source<NativeSelect value={location.source} onChange={(event) => navigate({ source: event.target.value })}><option value="">All sources</option>{sources.map((source) => <option key={source}>{source}</option>)}</NativeSelect></label>
          <label>Order<NativeSelect value={location.order} onChange={(event) => navigate({ order: event.target.value as ReaderLocation['order'] })}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></NativeSelect></label>
          <label>Appearance<NativeSelect value={theme} onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}><option value="light">Light</option><option value="dark">Dark</option></NativeSelect></label>
        </div><Button onClick={() => setFiltersOpen(false)}>Show stories</Button>
      </DialogContent></Dialog>
      <ArticleDialog article={selected} requested={!!location.article} loading={feed.loading} onClose={() => navigate({ article: '' })} saved={selected ? saved.find((item) => item.article.id === selected.id) : undefined} onSave={toggleSave} onRead={markRead} demo={demo} />
      <FeedDetails open={location.details} onClose={() => navigate({ details: false })} feed={feed.feed} country={location.country} category={location.category} demo={demo} onRefresh={feed.retry} />
    </main>
  </div>
}
