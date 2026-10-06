import { useCallback, useEffect, useRef, useState } from 'react'
import { loadFeed, type Category, type Country, type Feed } from '@/lib/feed'
import { cacheKey, cachedFeed, readStorage, writeStorage } from '@/lib/library'
import { demoFeed } from '@/lib/demo'

type State = { key: string; feed: Feed | null; loading: boolean; error: string; cached: boolean }
export function useFeed(country: Country, category: Category, demo: boolean) {
  const key = cacheKey(country, category, demo)
  const [revision, setRevision] = useState(0)
  const [state, setState] = useState<State>({ key: '', feed: null, loading: true, error: '', cached: false })
  const lastSuccess = useRef<{ key: string; feed: Feed } | null>(null)
  const retry = useCallback(() => setRevision((value) => value + 1), [])
  useEffect(() => {
    const controller = new AbortController()
    let current = true
    let timedOut = false
    const cached = lastSuccess.current?.key === key ? lastSuccess.current.feed : cachedFeed(readStorage(key))
    setState({ key, feed: cached, loading: true, error: '', cached: !!cached })
    const timeout = setTimeout(() => { timedOut = true; controller.abort() }, 15000)
    ;(demo ? Promise.resolve(demoFeed(country, category)) : loadFeed(country, category, controller.signal))
      .then((feed) => {
        if (!current) return
        if (controller.signal.aborted) throw new Error('Request timed out.')
        lastSuccess.current = { key, feed }
        writeStorage(key, feed)
        setState({ key, feed, loading: false, error: '', cached: false })
      })
      .catch(() => {
        if (!current) return
        setState({ key, feed: cached, loading: false, cached: !!cached,
          error: timedOut ? 'The feed request timed out. Try refreshing.' : navigator.onLine ? 'Could not refresh this feed. Try again.' : 'You are offline. Reconnect to refresh this feed.' })
      })
      .finally(() => clearTimeout(timeout))
    return () => { current = false; clearTimeout(timeout); controller.abort() }
  }, [country, category, demo, key, revision])
  return { ...(state.key === key ? state : { key, feed: cachedFeed(readStorage(key)), loading: true, error: '', cached: true }), retry }
}
