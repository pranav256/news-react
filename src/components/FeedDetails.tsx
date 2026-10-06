import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { countries, loadStatus, type Country, type Category, type Feed, type PipelineStatus } from '@/lib/feed'
import { dateLabel } from './CardItem'
type Props = { open: boolean; onClose: () => void; feed: Feed | null; country: Country; category: Category; demo: boolean; onRefresh: () => void }
export default function FeedDetails(props: Props) {
  const [status, setStatus] = useState<PipelineStatus | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    if (!props.open || props.demo) return
    const controller = new AbortController(); let current = true
    setLoading(true); setError(''); setStatus(null)
    const timer = setTimeout(() => controller.abort(), 15000)
    loadStatus(controller.signal).then((value) => { if (current) setStatus(value) }).catch(() => { if (current) setError('Pipeline status is unavailable. Feed reading still works.') }).finally(() => { clearTimeout(timer); if (current) setLoading(false) })
    return () => { current = false; clearTimeout(timer); controller.abort() }
  }, [props.open, props.demo, revision])
  return <Dialog open={props.open} onOpenChange={(open) => { if (!open) props.onClose() }}><DialogContent className="reader-dialog reader-feed-dialog"><DialogHeader><DialogTitle>Feed details</DialogTitle><DialogDescription>{props.demo ? 'Demo fixtures. No live pipeline requests.' : `${countries[props.country]}. ${props.category} feed.`}</DialogDescription></DialogHeader>
    <dl className="feed-facts"><div><dt>Last successful refresh</dt><dd>{props.feed?.fetchedAt ? dateLabel(props.feed.fetchedAt) : 'Unavailable from this feed'}</dd></div><div><dt>Providers</dt><dd>{props.feed?.providers.length ? props.feed.providers.join(', ') : 'Unavailable from this feed'}</dd></div></dl>
    <Button onClick={() => { props.onRefresh(); setRevision((value) => value + 1) }}>Refresh feed and status</Button>
    {props.demo && <p>Dates and sources belong to fictional samples.</p>}
    {loading && <p role="status">Loading pipeline status…</p>}
    {error && <p role="alert">{error}</p>}
    {status && <section aria-label="Pipeline status"><h2>Pipeline run</h2><p>{dateLabel(status.generated_at)}. Reported status: {status.status}.</p>
      <dl className="feed-facts"><div><dt>NewsAPI requests</dt><dd>{status.newsapi_requests_used ?? 'Unknown'} of {status.newsapi_requests_allowed ?? 'unknown'}</dd></div><div><dt>Failed RSS feeds</dt><dd>{status.rss_feeds_failed ?? 'Unknown'}</dd></div><div><dt>Failed API requests</dt><dd>{status.api_requests_failed ?? 'Unknown'}</dd></div></dl>
      {status.feeds.length ? <Table><TableHeader><TableRow><TableHead>Feed</TableHead><TableHead>Outcome</TableHead><TableHead>Last success</TableHead><TableHead>Stories</TableHead><TableHead>Providers</TableHead></TableRow></TableHeader><TableBody>{status.feeds.map((feed) => <TableRow key={`${feed.country}/${feed.category}`}><TableCell>{feed.country}/{feed.category}</TableCell><TableCell><Badge variant={feed.status === 'updated' ? 'success' : 'warning'}>{feed.status === 'updated' ? 'Updated' : 'Previous feed retained'}</Badge></TableCell><TableCell>{dateLabel(feed.last_successful_refresh)}</TableCell><TableCell>{feed.articles_count ?? 'Unknown'}</TableCell><TableCell>{feed.providers.join(', ') || 'Unavailable'}</TableCell></TableRow>)}</TableBody></Table> : <p>This pipeline version does not report per-feed outcomes.</p>}
    </section>}
  </DialogContent></Dialog>
}
