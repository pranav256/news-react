import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BookmarkIcon } from '@/components/icons'
import { type Article } from '@/lib/feed'
export function dateLabel(value: string | null) { return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Date unavailable' }
type Props = { article: Article; featured?: boolean; saved: boolean; onSave: (article: Article) => void }
export default function CardItem({ article, featured, saved, onSave }: Props) {
  const [imageFailed, setImageFailed] = useState(false)
  const Surface = featured ? Card : 'article'
  return <Surface role={featured ? 'article' : undefined} className={`story ${featured ? 'story-featured' : ''} ${!article.urlToImage || imageFailed ? 'story-text-only' : ''}`}>
    <div className="story-copy"><h2><Button asChild variant="ghost" className="story-title"><a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a></Button></h2>
      <p className="story-meta"><span>{article.source.name}</span><time dateTime={article.publishedAt || undefined}>{dateLabel(article.publishedAt)}</time></p>
      {article.description && <p className="story-summary">{article.description}</p>}
      <div className="story-footer"><Button variant={saved ? 'secondary' : 'ghost'} className="story-save" aria-pressed={saved} onClick={() => onSave(article)} aria-label={`${saved ? 'Remove saved' : 'Save'} story: ${article.title}`} title={saved ? 'Remove from saved reading' : 'Save for later'}><BookmarkIcon className="size-4" aria-hidden="true" />{saved ? 'Saved' : 'Save'}</Button></div>
    </div>
    {article.urlToImage && !imageFailed && <img src={article.urlToImage} alt="" loading={featured ? 'eager' : 'lazy'} referrerPolicy="no-referrer" onError={() => setImageFailed(true)} className="story-image" />}
  </Surface>
}
