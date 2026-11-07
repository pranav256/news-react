import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookmarkIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { type Article } from '@/lib/feed';

export function dateLabel(value: string | null) {
  return value
    ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(value),
      )
    : 'Time unavailable';
}
export function shortDate(value: string | null) {
  if (!value) return 'Time unavailable';
  const minutes = Math.floor((Date.now() - Date.parse(value)) / 60000);
  if (minutes < 0)
    return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return minutes + 'm ago';
  if (minutes < 1440) return Math.floor(minutes / 60) + 'h ago';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
type Props = {
  article: Article;
  featured?: boolean;
  compact?: boolean;
  saved: boolean;
  onSave: (article: Article) => void;
  onPreview: (id: string) => void;
};
export default function CardItem({ article, featured, compact, saved, onSave, onPreview }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <Card
      role="article"
      className={cn('story', {
        'story-featured': featured,
        'story-compact': compact,
        'story-no-image': featured && (!article.urlToImage || imageFailed),
      })}
    >
      <div className="story-copy">
        <h3>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
        <div className="story-meta">
          <span>{article.source.name}</span>
          <time title={dateLabel(article.publishedAt)} dateTime={article.publishedAt || undefined}>
            {shortDate(article.publishedAt)}
          </time>
        </div>
        {featured && article.description && <p className="story-summary">{article.description}</p>}
        <div className="story-footer">
          <Button variant="ghost" className="preview-link" onClick={() => onPreview(article.id)}>
            Preview story <span aria-hidden="true">↗</span>
          </Button>
          <Button
            variant={saved ? 'secondary' : 'ghost'}
            size="icon"
            className="story-save"
            aria-pressed={saved}
            onClick={() => onSave(article)}
            aria-label={(saved ? 'Remove saved' : 'Save') + ' story: ' + article.title}
            title={saved ? 'Remove from saved reading' : 'Save for later'}
          >
            <BookmarkIcon aria-hidden="true" />
          </Button>
        </div>
      </div>
      {(!featured || (article.urlToImage && !imageFailed)) && (
        <a
          className="story-image-link"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
        >
          {article.urlToImage && !imageFailed ? (
            <img
              src={article.urlToImage}
              alt=""
              loading={featured ? 'eager' : 'lazy'}
              decoding="async"
              width={featured ? 1200 : 160}
              height={featured ? 800 : 160}
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="image-placeholder">
              <span>{article.source.name.slice(0, 1)}</span>
            </div>
          )}
        </a>
      )}
    </Card>
  );
}
