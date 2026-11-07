import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
};
export default function CardItem({ article, featured, compact, saved, onSave }: Props) {
  const imageSrc = article.urlToImage;
  const [imageState, setImageState] = useState<{
    src: string | null;
    status: 'loading' | 'loaded' | 'failed';
  }>({ src: imageSrc, status: 'loading' });
  const imageStatus = imageState.src === imageSrc ? imageState.status : 'loading';
  const showImage = !!imageSrc && !compact && imageStatus !== 'failed';
  return (
    <Card
      role="article"
      className={cn('story', {
        'story-featured': featured,
        'story-compact': compact,
        'story-no-image': !showImage,
      })}
    >
      <div className="story-copy">
        <h3>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </h3>
        <div className="story-meta">
          <div className="story-byline">
            <span>{article.source.name}</span>
            <time title={dateLabel(article.publishedAt)} dateTime={article.publishedAt || undefined}>
              {shortDate(article.publishedAt)}
            </time>
          </div>
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
        {featured && article.description && <p className="story-summary">{article.description}</p>}
      </div>
      {showImage && (
        <a
          className="story-image-link"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={-1}
          aria-hidden="true"
          data-image-state={imageStatus}
        >
          {imageStatus === 'loading' && (
            <Skeleton className="story-image-loading" data-slot="skeleton" />
          )}
          <img
            key={imageSrc}
            src={imageSrc!}
            alt=""
            loading={featured ? 'eager' : 'lazy'}
            fetchPriority={featured ? 'high' : 'auto'}
            decoding="async"
            width={featured ? 1200 : 240}
            height={featured ? 750 : 180}
            referrerPolicy="no-referrer"
            onLoad={(event) =>
              setImageState({
                src: imageSrc,
                status:
                  event.currentTarget.naturalWidth > 1 && event.currentTarget.naturalHeight > 1
                    ? 'loaded'
                    : 'failed',
              })
            }
            onError={() => setImageState({ src: imageSrc, status: 'failed' })}
          />
        </a>
      )}
    </Card>
  );
}
