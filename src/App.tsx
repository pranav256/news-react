import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import EditionControls from './components/EditionControls';
import CardHolder from './components/CardHolder';
import ReadingQueue from './components/ReadingQueue';
import ArticleDialog from './components/ArticleDialog';
import FeedDetails from './components/FeedDetails';
import { shortDate } from './components/CardItem';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarItem,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { BookmarkIcon, CancelIcon, InfoCircleIcon, SearchIcon } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFeed } from '@/hooks/useFeed';
import { categories, countries, filterArticles, type Article } from '@/lib/feed';
import {
  MAX_SAVED,
  mergeLibrary,
  parseLibrary,
  preferences,
  readStorage,
  storageKeys,
  writeStorage,
  type SavedArticle,
} from '@/lib/library';
import { readerLocation, readerSearch, type ReaderLocation } from '@/lib/navigation';

const demo = window.location.pathname === '/demo';
const keys = {
  library: storageKeys.library + (demo ? ':demo' : ''),
  preferences: storageKeys.preferences + (demo ? ':demo' : ''),
};
const categoryLabel = (category: string) =>
  category === 'general' ? 'Top stories' : category.charAt(0).toUpperCase() + category.slice(1);

export default function App() {
  const [prefs] = useState(() => preferences(readStorage(keys.preferences)));
  const [location, setLocation] = useState(() => readerLocation(window.location.search, prefs));
  const locationRef = useRef(location);
  const [theme, setTheme] = useState(prefs.theme);
  const [saved, setSaved] = useState(() => parseLibrary(readStorage(keys.library)));
  const [notice, setNotice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterTrigger = useRef<HTMLButtonElement>(null);
  const previewTrigger = useRef<HTMLElement | null>(null);
  const feed = useFeed(location.country, location.category, demo);
  const navigate = (changes: Partial<ReaderLocation>, replace = false) => {
    const next = { ...locationRef.current, ...changes };
    locationRef.current = next;
    window.history[replace ? 'replaceState' : 'pushState'](
      null,
      '',
      (demo ? '/demo' : '/') + readerSearch(next),
    );
    setLocation(next);
  };
  useEffect(() => {
    const onPop = () => {
      const next = readerLocation(window.location.search, prefs);
      locationRef.current = next;
      setLocation(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === keys.library) setSaved(parseLibrary(event.newValue));
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('storage', onStorage);
    };
  }, [prefs]);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#1b1e1b' : '#f7f4ee');
    if (
      !writeStorage(keys.preferences, {
        country: location.country,
        category: location.category,
        theme,
      })
    )
      setNotice('Browser storage is unavailable. Export saved stories before leaving.');
  }, [location.country, location.category, theme]);
  const updateSaved = (items: SavedArticle[]) => {
    setSaved(items);
    setNotice(
      writeStorage(keys.library, { version: 1, articles: items })
        ? ''
        : 'Browser storage is unavailable. Export saved stories before leaving.',
    );
  };
  const toggleSave = (article: Article) => {
    if (saved.some((item) => item.article.id === article.id))
      updateSaved(saved.filter((item) => item.article.id !== article.id));
    else if (saved.length >= MAX_SAVED)
      setNotice(
        'Your reading list holds ' + MAX_SAVED + ' stories. Remove a story before saving another.',
      );
    else updateSaved([{ article, savedAt: new Date().toISOString(), read: false }, ...saved]);
  };
  const markRead = (id: string, read: boolean) =>
    updateSaved(saved.map((item) => (item.article.id === id ? { ...item, read } : item)));
  const preview = (id: string) => {
    previewTrigger.current = document.activeElement as HTMLElement;
    navigate({ article: id });
  };
  const articles = filterArticles(
    feed.feed?.articles || [],
    location.query,
    location.source,
    location.order,
  );
  const selected = [...(feed.feed?.articles || []), ...saved.map((item) => item.article)].find(
    (article) => article.id === location.article,
  );
  const sources = [
    ...new Set((feed.feed?.articles || []).map((article) => article.source.name)),
  ].sort();
  const filterCount = [location.source, location.order !== 'newest' ? location.order : ''].filter(
    Boolean,
  ).length;
  const unread = saved.filter((item) => !item.read).length;
  const view = (value: ReaderLocation['view']) => {
    navigate({ view: value, query: '', source: '', article: '' });
    window.scrollTo({ top: 0 });
  };
  const changeCategory = (category: ReaderLocation['category']) =>
    navigate({ category, view: 'headlines', source: '', query: '', article: '' });
  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to stories
      </a>
      <Navbar
        savedCount={saved.length}
        view={location.view}
        theme={theme}
        onTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        onView={view}
        onDetails={() => navigate({ details: true })}
      />
      <div className="app-layout">
        <Sidebar className="edition-sidebar" role="complementary" aria-label="Edition navigation">
          <SidebarHeader className="rail-heading">
            <span className="rail-mark">The open edition</span>
          </SidebarHeader>
          <SidebarContent className="rail-content">
            <SidebarGroup>
              <SidebarGroupLabel className="rail-label">Sections</SidebarGroupLabel>
              {categories.map((category) => (
                <SidebarItem
                  key={category}
                  label={categoryLabel(category)}
                  active={location.view === 'headlines' && location.category === category}
                  aria-current={
                    location.view === 'headlines' && location.category === category
                      ? 'page'
                      : undefined
                  }
                  onClick={() => changeCategory(category)}
                />
              ))}
            </SidebarGroup>
            <SidebarGroup className="rail-library">
              <SidebarGroupLabel className="rail-label">Your reading</SidebarGroupLabel>
              <SidebarItem
                icon={<BookmarkIcon aria-hidden="true" />}
                label={'Saved stories (' + saved.length + ')'}
                active={location.view === 'saved'}
                onClick={() => view('saved')}
              />
              <p>{unread} unread · Stored in this browser</p>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="rail-footer">
            <p>
              Original reporting.
              <br />A wider perspective.
            </p>
            <Button variant="ghost" onClick={() => navigate({ details: true })}>
              <InfoCircleIcon aria-hidden="true" />
              About this edition
            </Button>
          </SidebarFooter>
        </Sidebar>
        <main id="main" className="reader-main" tabIndex={-1}>
          <div className="edition-dateline">
            <time dateTime={new Date().toISOString().slice(0, 10)}>
              {new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
            <span>India / United States / United Kingdom</span>
          </div>
          <header className="reader-header">
            <div>
              <h1>
                {location.view === 'saved' ? (
                  <>
                    Your reading <em>list.</em>
                  </>
                ) : (
                  <>
                    The daily <em>edition.</em>
                  </>
                )}
              </h1>
              <p>
                {location.view === 'saved'
                  ? 'Good stories, kept for a quieter moment. Saved in this browser.'
                  : 'Original reporting. Different perspectives. Room to think.'}
              </p>
            </div>
            <span className="edition-monogram" aria-hidden="true">
              24<span>×</span>7
            </span>
          </header>
          {demo && (
            <p className="demo-notice" role="note">
              Demo. Fictional stories and browser-local saved reading.
            </p>
          )}
          {notice && (
            <div role="alert" className="reader-notice">
              <p>{notice}</p>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Dismiss message"
                onClick={() => setNotice('')}
              >
                <CancelIcon aria-hidden="true" />
              </Button>
            </div>
          )}
          {location.view === 'headlines' ? (
            <>
              <EditionControls
                country={location.country}
                category={location.category}
                onCountry={(country) => navigate({ country, source: '', query: '', article: '' })}
                onCategory={changeCategory}
              />
              <div className="reader-toolbar">
                <div className="edition-context">
                  <h2>{categoryLabel(location.category)}</h2>
                  <span className="result-count" role="status">
                    {feed.loading && !feed.feed ? 'Loading edition…' : articles.length + ' stories'}
                  </span>
                </div>
                <div className="search-controls">
                  <label className="reader-search">
                    <SearchIcon aria-hidden="true" />
                    <Input
                      type="search"
                      aria-label="Search stories"
                      placeholder="Find a headline or source"
                      value={location.query}
                      maxLength={200}
                      onChange={(event) => navigate({ query: event.target.value }, true)}
                    />
                  </label>
                  <Button
                    ref={filterTrigger}
                    variant="outline"
                    aria-label="Filters"
                    onClick={() => setFiltersOpen(true)}
                  >
                    Filters{filterCount > 0 && <span className="filter-count">{filterCount}</span>}
                  </Button>
                </div>
              </div>
              {(location.query || location.source || location.order === 'oldest') && (
                <div className="reader-active-filters">
                  {location.query && (
                    <Button variant="ghost" onClick={() => navigate({ query: '' }, true)}>
                      Clear search <CancelIcon aria-hidden="true" />
                    </Button>
                  )}
                  {location.source && (
                    <Button variant="ghost" onClick={() => navigate({ source: '' })}>
                      Remove {location.source} <CancelIcon aria-hidden="true" />
                    </Button>
                  )}
                  {location.order === 'oldest' && (
                    <Button variant="ghost" onClick={() => navigate({ order: 'newest' })}>
                      Oldest first <CancelIcon aria-hidden="true" />
                    </Button>
                  )}
                </div>
              )}
              <CardHolder
                key={[
                  location.country,
                  location.category,
                  location.query,
                  location.source,
                  location.order,
                ].join('/')}
                articles={articles}
                loading={feed.loading}
                error={feed.error}
                cached={feed.cached}
                saved={saved}
                onSave={toggleSave}
                onPreview={preview}
                onRetry={feed.retry}
                onClear={() => navigate({ query: '', source: '' })}
                filtered={!!(location.query || location.source)}
              />
              <div className="edition-freshness">
                <span>
                  {feed.feed?.fetchedAt
                    ? (demo ? 'Sample edition ' : 'Edition published ') +
                      shortDate(feed.feed.fetchedAt)
                    : 'Publication time unavailable'}
                </span>
                <Button variant="ghost" disabled={feed.loading} onClick={feed.retry}>
                  {feed.loading ? 'Refreshing…' : 'Refresh edition'}{' '}
                  <span aria-hidden="true">↻</span>
                </Button>
              </div>
            </>
          ) : (
            <ReadingQueue
              saved={saved}
              query={location.query}
              read={location.read}
              onQuery={(query) => navigate({ query }, true)}
              onReadFilter={(read) => navigate({ read })}
              onRead={markRead}
              onPreview={preview}
              onRemove={(id) => updateSaved(saved.filter((item) => item.article.id !== id))}
              onImport={(incoming) => updateSaved(mergeLibrary(saved, incoming))}
              onDiscover={() => view('headlines')}
            />
          )}
          <footer className="reading-footer">
            <a href="https://news-api-live.vercel.app" target="_blank" rel="noopener noreferrer">
              Powered by the open news-api ↗
            </a>
            <span>Reporting belongs to its original publishers.</span>
            <a
              href="https://github.com/pranav256/news-react"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source code ↗
            </a>
          </footer>
        </main>
      </div>
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent
          className="reader-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            filterTrigger.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>Reader filters</DialogTitle>
            <DialogDescription>Choose a publisher and reading order.</DialogDescription>
          </DialogHeader>
          <div className="reader-fields">
            <label>
              Search stories
              <Input
                type="search"
                value={location.query}
                maxLength={200}
                onChange={(event) => navigate({ query: event.target.value }, true)}
              />
            </label>
            <label>
              Source
              <NativeSelect
                value={location.source}
                onChange={(event) => navigate({ source: event.target.value })}
              >
                <option value="">All sources</option>
                {sources.map((source) => (
                  <option key={source}>{source}</option>
                ))}
              </NativeSelect>
            </label>
            <label>
              Order
              <NativeSelect
                value={location.order}
                onChange={(event) =>
                  navigate({ order: event.target.value as ReaderLocation['order'] })
                }
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </NativeSelect>
            </label>
            <label>
              Appearance
              <NativeSelect
                value={theme}
                onChange={(event) => setTheme(event.target.value as 'light' | 'dark')}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </NativeSelect>
            </label>
          </div>
          <Button onClick={() => setFiltersOpen(false)}>Show stories</Button>
        </DialogContent>
      </Dialog>
      <ArticleDialog
        article={selected}
        requested={!!location.article}
        loading={feed.loading}
        onClose={() => navigate({ article: '' })}
        onReturnFocus={() =>
          (previewTrigger.current?.isConnected
            ? previewTrigger.current
            : document.getElementById('main')
          )?.focus({ preventScroll: true })
        }
        saved={selected ? saved.find((item) => item.article.id === selected.id) : undefined}
        onSave={toggleSave}
        onRead={markRead}
      />
      <FeedDetails
        open={location.details}
        onClose={() => navigate({ details: false })}
        feed={feed.feed}
        country={location.country}
        category={location.category}
        onRefresh={feed.retry}
      />
    </MotionConfig>
  );
}
