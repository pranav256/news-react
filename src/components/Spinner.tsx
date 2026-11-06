import { Skeleton } from '@/components/ui/skeleton';
export default function Spinner() {
  return (
    <div className="edition-loading" role="status">
      <span className="sr-only">Loading the edition.</span>
      <div className="cover-grid" aria-hidden="true">
        <div className="loading-feature">
          <Skeleton className="loading-meta" />
          <Skeleton className="loading-title" />
          <Skeleton className="loading-line" />
          <Skeleton className="loading-line short" />
          <Skeleton className="loading-action" />
        </div>
        <div className="cover-side">
          {[0, 1].map((i) => (
            <div className="loading-compact" key={i}>
              <Skeleton className="loading-image" />
              <Skeleton className="loading-meta" />
              <Skeleton className="loading-title" />
              <Skeleton className="loading-action" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
