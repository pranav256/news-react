import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarItem } from '@/components/ui/sidebar'

type Props = { view: 'headlines' | 'saved'; onView: (view: 'headlines' | 'saved') => void; onDetails: () => void }
export default function Navbar({ view, onView, onDetails }: Props) {
  return <Sidebar className="reader-sidebar" role="navigation" aria-label="Reader navigation">
    <SidebarHeader><span className="reader-brand">News Reader</span></SidebarHeader>
    <SidebarContent><SidebarGroup>
      <SidebarItem label="Headlines" active={view === 'headlines'} aria-current={view === 'headlines' ? 'page' : undefined} onClick={() => onView('headlines')} />
      <SidebarItem label="Saved reading" active={view === 'saved'} aria-current={view === 'saved' ? 'page' : undefined} onClick={() => onView('saved')} />
    </SidebarGroup></SidebarContent>
    <SidebarFooter><SidebarItem label="Feed details" onClick={onDetails} /></SidebarFooter>
  </Sidebar>
}
