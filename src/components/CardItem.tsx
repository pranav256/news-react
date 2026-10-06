import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { BookmarkIcon } from '@/components/icons'
import { type Article } from '@/lib/feed'
export function dateLabel(value: string | null) { return value ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : 'Date unavailable' }
type Props = { article: Article; featured?: boolean; saved: boolean; onPreview: (article: Article) => void; onSave: (article: Article) => void }
export default function CardItem({ article, featured, saved, onPreview, onSave }: Props) {
  const [imageFailed, setImageFailed] = useState(false)
  return <article className={`story ${featured ? 'story-featured' : ''} ${!article.urlToImage || imageFailed ? 'story-text-only' : ''}`}>
    <div className="story-copy"><h2><Button variant="ghost" className="story-title" onClick={() => onPreview(article)}>{article.title}</Button></h2>
      <p className="story-meta"><span>{article.source.name}</span><time dateTime={article.publishedAt || undefined}>{dateLabel(article.publishedAt)}</time></p>
      {article.description && <p className="story-summary">{article.description}</p>}
      <Button variant="outline" aria-pressed={saved} onClick={() => onSave(article)} aria-label={`${saved ? 'Remove saved' : 'Save'} story: ${article.title}`}><BookmarkIcon className="size-4" aria-hidden="true" />{saved ? 'Saved' : 'Save story'}</Button>
    </div>
    {article.urlToImage && !imageFailed && <img src={article.urlToImage} alt="" loading={featured ? 'eager' : 'lazy'} referrerPolicy="no-referrer" onError={() => setImageFailed(true)} className="story-image" />}
  </article>
}
