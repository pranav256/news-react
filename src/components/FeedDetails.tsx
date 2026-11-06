import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { countries, type Country, type Category, type Feed } from '@/lib/feed';
import { dateLabel } from './CardItem';

type Props = { open: boolean; onClose: () => void; feed: Feed | null; country: Country; category: Category; onRefresh: () => void };
export default function FeedDetails({open,onClose,feed,country,category,onRefresh}: Props) {
  return <Dialog open={open} onOpenChange={value => {if (!value) onClose();}}><DialogContent className="reader-dialog" onCloseAutoFocus={event => {event.preventDefault();document.querySelector<HTMLButtonElement>('[aria-label="About this edition"]')?.focus();}}><DialogHeader><DialogTitle>About this edition</DialogTitle><DialogDescription>Original reporting from independent publishers.</DialogDescription></DialogHeader>
    <dl className="feed-facts">
      <div><dt>Edition</dt><dd>{countries[country]} · {category.charAt(0).toUpperCase() + category.slice(1)}</dd></div>
      <div><dt>Last published</dt><dd>{dateLabel(feed?.fetchedAt || null)}</dd></div>
      <div><dt>Available stories</dt><dd>{feed?.articles.length ?? 'Unavailable'}</dd></div>
      <div><dt>Providers</dt><dd>{feed?.providers.join(', ') || 'Unavailable'}</dd></div>
    </dl>
    <p className="reader-prose">Published every two hours. Stories and photography belong to their publishers.</p>
    <div className="reader-actions"><Button onClick={() => {onRefresh();onClose();}}>Refresh edition</Button><a className="text-link" href="https://news-api-live.vercel.app/#status" target="_blank" rel="noopener noreferrer">View feed health ↗</a></div>
  </DialogContent></Dialog>;
}
