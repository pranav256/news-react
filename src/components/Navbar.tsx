import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar'
import { BookmarkIcon, HalfMoonIcon, InfoCircleIcon, SearchIcon, SunLightIcon } from '@/components/icons'

type Props = { view: 'headlines' | 'saved'; savedCount: number; theme: 'light' | 'dark'; onTheme: () => void; onView: (view: 'headlines' | 'saved') => void; onDetails: () => void }
export default function Navbar({ view, savedCount, theme, onTheme, onView, onDetails }: Props) {
  return <Sidebar className="reader-sidebar" role="navigation" aria-label="Reader navigation">
    <SidebarHeader><span className="reader-brand">News Reader<span aria-hidden="true">.</span></span></SidebarHeader>
    <SidebarContent><SidebarGroup>
      <SidebarItem icon={<SearchIcon aria-hidden="true" />} label="Headlines" active={view === 'headlines'} aria-current={view === 'headlines' ? 'page' : undefined} onClick={() => onView('headlines')} />
      <SidebarItem icon={<BookmarkIcon aria-hidden="true" />} label={savedCount ? `Saved stories (${savedCount})` : 'Saved stories'} aria-label="Saved reading" active={view === 'saved'} aria-current={view === 'saved' ? 'page' : undefined} onClick={() => onView('saved')} />
    </SidebarGroup></SidebarContent>
    <SidebarFooter>
      <SidebarItem icon={<InfoCircleIcon aria-hidden="true" />} className="reader-utility" aria-label="Feed details" title="Feed details" label="Feed details" onClick={onDetails} />
      <SidebarItem icon={theme === 'light' ? <HalfMoonIcon aria-hidden="true" /> : <SunLightIcon aria-hidden="true" />} className="reader-utility" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} label={theme === 'light' ? 'Dark mode' : 'Light mode'} onClick={onTheme} />
    </SidebarFooter>
  </Sidebar>
}
