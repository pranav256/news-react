import CardItem from './CardItem'
import Spinner from './Spinner'
import { Button } from '@/components/ui/button'
import { type Article } from '@/lib/feed'
import { type SavedArticle } from '@/lib/library'
type Props = { articles: Article[]; loading: boolean; error: string; cached: boolean; saved: SavedArticle[]; onSave: (article: Article) => void; onRetry: () => void; onClear: () => void; filtered: boolean }
export default function CardHolder(props: Props) {
  return <section aria-label="Stories" aria-busy={props.loading}>
    {props.error && <div className="reader-notice" role="alert"><p>{props.error} {props.cached && 'Showing your last successful feed.'}</p><Button variant="outline" onClick={props.onRetry}>Retry refresh</Button></div>}
    {props.loading && <Spinner />}
    {!props.loading && !props.error && !props.articles.length && <div className="reader-empty"><h2>{props.filtered ? 'No matching stories' : 'No stories in this feed'}</h2><p>{props.filtered ? 'Try another search or remove your source filter.' : 'Try another category or refresh the feed.'}</p><Button onClick={props.filtered ? props.onClear : props.onRetry}>{props.filtered ? 'Clear search filters' : 'Refresh feed'}</Button></div>}
    <div className="story-list">{props.articles.map((article, index) => <CardItem key={article.id} article={article} featured={index === 0} saved={props.saved.some((item) => item.article.id === article.id)} onSave={props.onSave} />)}</div>
  </section>
}
