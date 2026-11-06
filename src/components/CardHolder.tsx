import { useState } from 'react';
import CardItem from './CardItem';
import Spinner from './Spinner';
import { Button } from '@/components/ui/button';
import { type Article } from '@/lib/feed';
import { type SavedArticle } from '@/lib/library';

type Props = {
  articles: Article[];
  loading: boolean;
  error: string;
  cached: boolean;
  saved: SavedArticle[];
  onSave: (article: Article) => void;
  onPreview: (id: string) => void;
  onRetry: () => void;
  onClear: () => void;
  filtered: boolean;
};
export default function CardHolder(props: Props) {
  const [limit, setLimit] = useState(12);
  const [lead, ...rest] = props.articles;
  const card = (article: Article, featured = false, compact = false) => (
    <CardItem
      key={article.id}
      article={article}
      featured={featured}
      compact={compact}
      saved={props.saved.some((item) => item.article.id === article.id)}
      onSave={props.onSave}
      onPreview={props.onPreview}
    />
  );
  return (
    <section aria-label="Stories" aria-busy={props.loading}>
      {props.error && (
        <div className="reader-notice" role="alert">
          <p>
            {props.error} {props.cached && 'Your last loaded edition is still here.'}
          </p>
          <Button variant="outline" onClick={props.onRetry}>
            Retry refresh
          </Button>
        </div>
      )}
      {props.loading && !lead && <Spinner />}
      {!props.loading && !props.error && !lead && (
        <div className="reader-empty">
          <h3>{props.filtered ? 'No matching stories' : 'No stories in this edition'}</h3>
          <p>
            {props.filtered
              ? 'Try another search or remove your source filter.'
              : 'Try another section or refresh.'}
          </p>
          <Button onClick={props.filtered ? props.onClear : props.onRetry}>
            {props.filtered ? 'Clear search filters' : 'Refresh feed'}
          </Button>
        </div>
      )}
      {lead && (
        <>
          <div className="cover-grid">
            {card(lead, true)}
            <div className="cover-side">
              {rest.slice(0, 2).map((article) => card(article, false, true))}
            </div>
          </div>
          {rest.length > 2 && (
            <>
              <div className="more-heading">
                <h2>
                  Latest stories<span className="accent">.</span>
                </h2>
                <p>From the original publishers</p>
              </div>
              <div className="story-grid">
                {rest.slice(2, limit - 1).map((article) => card(article))}
              </div>
            </>
          )}
          <div className="edition-end">
            <p>
              Showing {Math.min(limit, props.articles.length)} of {props.articles.length} stories
            </p>
            {limit < props.articles.length ? (
              <Button variant="outline" onClick={() => setLimit((value) => value + 12)}>
                More stories <span aria-hidden="true">↓</span>
              </Button>
            ) : (
              <span className="edition-complete">You’re up to date with this edition.</span>
            )}
            <a href="#main" className="text-link">
              Back to the top ↑
            </a>
          </div>
        </>
      )}
    </section>
  );
}
