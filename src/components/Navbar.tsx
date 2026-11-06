import { BookmarkIcon, HalfMoonIcon, InfoCircleIcon, SunLightIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

type Props = {
  view: 'headlines' | 'saved';
  savedCount: number;
  theme: 'light' | 'dark';
  onTheme: () => void;
  onView: (view: 'headlines' | 'saved') => void;
  onDetails: () => void;
};
export default function Navbar({ view, savedCount, theme, onTheme, onView, onDetails }: Props) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-lockup">
          <a
            href={window.location.pathname === '/demo' ? '/demo' : '/'}
            className="wordmark"
            aria-label="24×7 home"
          >
            24×7<span>.</span>
          </a>
          <span className="brand-descriptor">The open news reader</span>
        </div>
        <nav className="primary-nav" aria-label="Reader navigation">
          <Button
            variant="ghost"
            className={view === 'headlines' ? 'nav-active' : ''}
            aria-current={view === 'headlines' ? 'page' : undefined}
            onClick={() => onView('headlines')}
          >
            Headlines
          </Button>
          <Button
            variant="ghost"
            className={view === 'saved' ? 'nav-active' : ''}
            aria-label="Saved reading"
            aria-current={view === 'saved' ? 'page' : undefined}
            onClick={() => onView('saved')}
          >
            <BookmarkIcon aria-hidden="true" />
            Saved stories<span className="saved-count">{savedCount}</span>
          </Button>
        </nav>
        <div className="header-actions">
          <a
            className="api-link"
            href="https://news-api-live.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Meet the API <span aria-hidden="true">↗</span>
          </a>
          <Button
            size="icon"
            variant="ghost"
            aria-label="About this edition"
            title="About this edition"
            onClick={onDetails}
          >
            <InfoCircleIcon aria-hidden="true" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            onClick={onTheme}
          >
            {theme === 'light' ? (
              <HalfMoonIcon aria-hidden="true" />
            ) : (
              <SunLightIcon aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
