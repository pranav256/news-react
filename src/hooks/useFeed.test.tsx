import { act, cleanup, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useFeed } from './useFeed'
import { cacheKey, writeStorage } from '@/lib/library'
import { parseFeed, type Country } from '@/lib/feed'

beforeEach(() => localStorage.clear())
afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.restoreAllMocks() })
const payload = (title: string) => ({ articles: [{ title, url: `https://example.com/${title}`, source: { name: 'Example News' } }] })
it('cancels superseded requests and prevents old responses replacing the selected feed', async () => {
  const requests: { signal: AbortSignal; resolve: (response: Response) => void }[] = []
  vi.stubGlobal('fetch', vi.fn((_url, options) => new Promise<Response>((resolve) => requests.push({ signal: options.signal, resolve }))))
  const { result, rerender } = renderHook(({ country }: { country: Country }) => useFeed(country, 'general', false), { initialProps: { country: 'in' as Country } })
  rerender({ country: 'us' })
  expect(requests[0].signal.aborted).toBe(true)
  await act(async () => requests[1].resolve(Response.json(payload('selected'))))
  await waitFor(() => expect(result.current.feed?.articles[0].title).toBe('selected'))
  await act(async () => requests[0].resolve(Response.json(payload('old'))))
  expect(result.current.feed?.articles[0].title).toBe('selected')
})
it('retains a usable last-successful feed after a failed refresh', async () => {
  writeStorage(cacheKey('gb', 'general', false), parseFeed(payload('cached')))
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network failed')))
  const { result } = renderHook(() => useFeed('gb', 'general', false))
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.error).toContain('Could not refresh')
  expect(result.current.cached).toBe(true)
  expect(result.current.feed?.articles[0].title).toBe('cached')
})
it('uses only labeled local fixtures in demo mode', async () => {
  const fetch = vi.fn()
  vi.stubGlobal('fetch', fetch)
  const { result } = renderHook(() => useFeed('in', 'general', true))
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(fetch).not.toHaveBeenCalled()
  expect(result.current.feed?.providers).toEqual(['demo fixtures'])
})

it('keeps the in-memory successful feed when storage fails and retry fails', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new DOMException('Restricted storage') })
  const fetch = vi.fn().mockResolvedValueOnce(Response.json(payload('last-success'))).mockRejectedValue(new Error('Offline'))
  vi.stubGlobal('fetch', fetch)
  const { result } = renderHook(() => useFeed('us', 'general', false))
  await waitFor(() => expect(result.current.loading).toBe(false))
  act(() => result.current.retry())
  await waitFor(() => expect(result.current.error).toContain('Could not refresh'))
  expect(result.current.feed?.articles[0].title).toBe('last-success')
})
