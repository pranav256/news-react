import { Button } from '@/components/ui/button'
export default function SocialMediaLinks({ url, title }: { url: string; title: string }) {
  const encoded = encodeURIComponent(url)
  const links = { Twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodeURIComponent(title)}`, Telegram: `https://telegram.me/share/url?url=${encoded}&text=${encodeURIComponent(title)}`, Facebook: `https://www.facebook.com/sharer.php?u=${encoded}`, WhatsApp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` }
  return <div className="reader-actions" aria-label="Share story">{Object.entries(links).map(([label, href]) => <Button key={label} asChild variant="outline"><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></Button>)}</div>
}
