import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { type Article } from '@/lib/feed'
import { type SavedArticle } from '@/lib/library'
import { dateLabel } from './CardItem'
import SocialMediaLinks from './SocialMediaLinks'
type Props = { article?: Article; requested: boolean; loading: boolean; saved?: SavedArticle; onClose: () => void; onReturnFocus: () => void; onSave: (article: Article) => void; onRead: (id: string, read: boolean) => void; demo: boolean }
export default function ArticleDialog({ article, requested, loading, saved, onClose, onReturnFocus, onSave, onRead, demo }: Props) {
  return <Dialog open={requested} onOpenChange={(open) => { if (!open) onClose() }}><DialogContent className="reader-dialog reader-article-dialog" onCloseAutoFocus={(event) => { event.preventDefault(); onReturnFocus() }}><DialogHeader>
    <DialogTitle>{article?.title || (loading ? 'Loading story' : 'Story unavailable')}</DialogTitle>
    <DialogDescription>{article ? `${article.source.name}. ${dateLabel(article.publishedAt)}` : loading ? 'Waiting for the selected feed.' : 'This story is not in the current feed or your saved queue.'}</DialogDescription>
  </DialogHeader>{article && <>
    <p className="reader-prose">{article.description || 'This feed has no summary. Read the complete article at its publisher.'}</p>
    {article.author && <p className="text-muted-foreground">By {article.author}</p>}
    <div className="reader-actions">
      {!demo && <Button asChild><a href={article.url} target="_blank" rel="noopener noreferrer" onClick={() => saved && onRead(article.id, true)}>Read at publisher</a></Button>}
      <Button variant={demo ? 'default' : 'outline'} onClick={() => onSave(article)} aria-pressed={!!saved}>{saved ? 'Remove from saved' : 'Save story'}</Button>
      {saved && <Button variant="outline" onClick={() => onRead(article.id, !saved.read)}>{saved.read ? 'Mark unread' : 'Mark read'}</Button>}
    </div>
    {demo ? <p className="text-muted-foreground">Fictional sample. There is no published article.</p> : <details><summary>Share story</summary><SocialMediaLinks url={article.url} title={article.title} /></details>}
  </>}</DialogContent></Dialog>
}
