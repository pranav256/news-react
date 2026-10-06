import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/ui/native-select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { type Article } from '@/lib/feed'
import { MAX_IMPORT_BYTES, parseLibrary, type SavedArticle } from '@/lib/library'
type Props = { saved: SavedArticle[]; query: string; read: 'all' | 'read' | 'unread'; onQuery: (query: string) => void; onReadFilter: (read: Props['read']) => void; onPreview: (article: Article) => void; onRead: (id: string, read: boolean) => void; onRemove: (id: string) => void; onImport: (items: SavedArticle[]) => void; onDiscover: () => void }
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
    <div className="queue-toolbar"><label className="grow">Search saved stories<Input type="search" value={props.query} maxLength={200} onChange={(event) => props.onQuery(event.target.value)} /></label><label>Reading state<NativeSelect value={props.read} onChange={(event) => props.onReadFilter(event.target.value as Props['read'])}><option value="all">All stories</option><option value="unread">Unread</option><option value="read">Read</option></NativeSelect></label><Button variant="outline" onClick={() => { setMessage(''); setManage(true) }}>Manage queue</Button></div>
    {!visible.length && <div className="reader-empty"><h2>{props.saved.length ? 'No matching saved stories' : 'Your reading queue is empty'}</h2><p>{props.saved.length ? 'Clear your search or choose another reading state.' : 'Save a headline to read it later.'}</p><Button onClick={props.saved.length ? () => { props.onQuery(''); props.onReadFilter('all') } : props.onDiscover}>{props.saved.length ? 'Clear queue filters' : 'Browse headlines'}</Button></div>}
    <div className="story-list">{visible.map(({ article, read }) => <article key={article.id} className="story queue-story"><div><h2><Button variant="ghost" className="story-title" onClick={() => props.onPreview(article)}>{article.title}</Button></h2><p className="story-meta">{article.source.name}<span>{read ? 'Read' : 'Unread'}</span></p></div><div className="reader-actions"><Button variant="outline" onClick={() => props.onRead(article.id, !read)}>{read ? 'Mark unread' : 'Mark read'}</Button><Button variant="ghost" onClick={() => props.onRemove(article.id)} aria-label={`Remove story: ${article.title}`}>Remove</Button></div></article>)}</div>
    <Dialog open={manage} onOpenChange={setManage}><DialogContent className="reader-dialog"><DialogHeader><DialogTitle>Manage reading queue</DialogTitle><DialogDescription>Export a backup or merge a validated News Reader export.</DialogDescription></DialogHeader>
      <p>{props.saved.length} saved {props.saved.length === 1 ? 'story' : 'stories'}. Stored in this browser.</p>
      <div className="reader-actions"><Button disabled={!props.saved.length} onClick={exportData}>Export queue</Button><Button variant="outline" disabled={busy} onClick={() => input.current?.click()}>{busy ? 'Importing…' : 'Import queue'}</Button></div>
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
