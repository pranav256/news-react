import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { SearchIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MAX_IMPORT_BYTES, parseLibrary, type SavedArticle } from '@/lib/library'
type Props = { saved: SavedArticle[]; query: string; read: 'all' | 'read' | 'unread'; onQuery: (query: string) => void; onReadFilter: (read: Props['read']) => void; onRead: (id: string, read: boolean) => void; onRemove: (id: string) => void; onImport: (items: SavedArticle[]) => void; onDiscover: () => void }
export default function ReadingQueue(props: Props) {
  const [manage, setManage] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const needle = props.query.trim().toLocaleLowerCase()
  const visible = props.saved.filter((item) => (props.read === 'all' || item.read === (props.read === 'read')) && [item.article.title, item.article.description, item.article.source.name].join(' ').toLocaleLowerCase().includes(needle))
  const exportData = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, articles: props.saved }, null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `news-reader-${new Date().toISOString().slice(0, 10)}.json`; anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage('Export downloaded.')
  }
  return <section aria-label="Reading queue">
    <div className="queue-toolbar"><label className="reader-search grow"><SearchIcon aria-hidden="true" /><Input type="search" aria-label="Search saved stories" placeholder="Search saved stories" value={props.query} maxLength={200} onChange={(event) => props.onQuery(event.target.value)} /></label><label>Reading state<NativeSelect value={props.read} onChange={(event) => props.onReadFilter(event.target.value as Props['read'])}><option value="all">All stories</option><option value="unread">Unread</option><option value="read">Read</option></NativeSelect></label><Button variant="outline" aria-label="Manage queue" onClick={() => { setMessage(''); setManage(true) }}>Manage saved stories</Button></div>
    <p className="queue-count"><strong>{visible.length}</strong> {visible.length === 1 ? 'story' : 'stories'} in view <span>of {props.saved.length} saved</span></p>
    {!visible.length && <div className="reader-empty"><h2>{props.saved.length ? 'No matching saved stories' : 'Your reading queue is empty'}</h2><p>{props.saved.length ? 'Clear your search or choose another reading state.' : 'Save a headline to read it later.'}</p><Button onClick={props.saved.length ? () => { props.onQuery(''); props.onReadFilter('all') } : props.onDiscover}>{props.saved.length ? 'Clear queue filters' : 'Browse headlines'}</Button></div>}
    <div className="story-list queue-list">{visible.map(({ article, read }) => <article key={article.id} className="story queue-story"><div><h2><Button asChild variant="ghost" className="story-title"><a href={article.url} target="_blank" rel="noopener noreferrer" onClick={() => { if (!read) props.onRead(article.id, true) }}>{article.title}</a></Button></h2><div className="story-meta"><span>{article.source.name}</span><Badge variant={read ? 'outline' : 'secondary'}>{read ? 'Read' : 'Unread'}</Badge></div></div><div className="reader-actions"><Button variant="outline" onClick={() => props.onRead(article.id, !read)}>{read ? 'Mark unread' : 'Mark read'}</Button><Button variant="ghost" onClick={() => props.onRemove(article.id)} aria-label={`Remove story: ${article.title}`}>Remove</Button></div></article>)}</div>
    <Dialog open={manage} onOpenChange={setManage}><DialogContent className="reader-dialog"><DialogHeader><DialogTitle>Manage saved stories</DialogTitle><DialogDescription>Export a backup or merge a validated News Reader export.</DialogDescription></DialogHeader>
      <p>{props.saved.length} saved {props.saved.length === 1 ? 'story' : 'stories'}. Stored in this browser.</p>
      <div className="reader-actions"><Button disabled={!props.saved.length} onClick={exportData}>Export saved stories</Button><Button variant="outline" disabled={busy} onClick={() => input.current?.click()}>{busy ? 'Importing…' : 'Import saved stories'}</Button></div>
      <input ref={input} type="file" accept="application/json,.json" className="sr-only" aria-label="Reading queue export" onChange={async (event) => {
        const file = event.target.files?.[0]; event.target.value = ''; if (!file) return
        setBusy(true); setMessage('')
        try { if (file.size > MAX_IMPORT_BYTES) throw new Error('Choose an export smaller than 2 MB.'); const incoming = parseLibrary(await file.text(), true); props.onImport(incoming); setMessage('Imported stories. Existing duplicates kept their reading state.') }
        catch (error) { setMessage(error instanceof Error ? error.message : 'Could not import this file.') }
        finally { setBusy(false) }
      }} />{message && <p role="status">{message}</p>}
    </DialogContent></Dialog>
  </section>
}
