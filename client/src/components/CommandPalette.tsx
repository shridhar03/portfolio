import { Command } from 'cmdk'
import {
  ArrowRight,
  Copy,
  FileDown,
  FolderGit2,
  Home,
  ExternalLink,
  Mail,
  MessageCircle,
  Moon,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { navLinks, profile } from '@/content/profile'
import { useProjects } from '@/hooks/useProjects'
import { useChat } from '@/providers/chat-context'
import { useLenis } from '@/providers/lenis-context'
import { usePalette } from '@/providers/palette-context'
import { useTheme } from '@/providers/theme-context'

function Item({
  icon: Icon,
  children,
  onSelect,
  shortcut,
  value,
}: {
  icon: LucideIcon
  children: ReactNode
  onSelect: () => void
  shortcut?: string
  value?: string
}) {
  return (
    <Command.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-fg data-[selected=true]:bg-surface-2"
    >
      <Icon className="size-4 text-accent-fg" aria-hidden />
      <span className="flex-1">{children}</span>
      {shortcut && <kbd className="font-mono text-[0.7rem] text-muted">{shortcut}</kbd>}
    </Command.Item>
  )
}

const groupCls =
  '[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[0.7rem] [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted [&_[cmdk-group-heading]]:uppercase'

/** ⌘K / Ctrl+K: jump to sections or projects, toggle theme, open the chatbot, quick contact. */
export function CommandPalette() {
  const { open, setOpen } = usePalette()
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()
  const lenis = useLenis()
  const { theme, toggle } = useTheme()
  const chat = useChat()
  const projects = useProjects().filter((p) => p.status !== 'coming-soon')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  // Pause smooth scrolling under the modal.
  useEffect(() => {
    if (!lenis) return
    if (open) lenis.stop()
    else lenis.start()
  }, [open, lenis])

  const run = (fn: () => void) => () => {
    setOpen(false)
    // Let the dialog close (and focus return) before navigating or scrolling.
    requestAnimationFrame(fn)
  }

  const goToSection = (id: string) => {
    if (window.location.pathname !== '/') return navigate(`/#${id}`)
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -72 })
    else el.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', `#${id}`)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      window.location.assign(`mailto:${profile.email}`)
    }
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      loop
      overlayClassName="fixed inset-0 z-[95] bg-bg/60 backdrop-blur-sm"
      contentClassName="fixed inset-x-4 top-[12vh] z-[96] mx-auto max-w-xl"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-card border border-border bg-surface shadow-2xl shadow-black/40"
        >
          <Command.Input
            placeholder="Type a command or search…"
            className="w-full border-b border-border bg-transparent px-5 py-4 text-base text-fg placeholder:text-muted focus:outline-none"
          />
          <Command.List className="max-h-[min(60vh,26rem)] overflow-y-auto p-2" data-lenis-prevent>
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted">
              No results.
            </Command.Empty>

            <Command.Group heading="Navigate" className={groupCls}>
              <Item icon={Home} onSelect={run(() => navigate('/'))}>
                Home
              </Item>
              {navLinks.map((l) => (
                <Item
                  key={l.id}
                  icon={ArrowRight}
                  value={`go to ${l.label}`}
                  onSelect={run(() => goToSection(l.id))}
                >
                  Go to {l.label}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Projects" className={groupCls}>
              {projects.map((p) => (
                <Item
                  key={p.slug}
                  icon={FolderGit2}
                  value={`project ${p.title}`}
                  onSelect={run(() => navigate(`/projects/${p.slug}`))}
                >
                  {p.title}
                </Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions" className={groupCls}>
              <Item
                icon={MessageCircle}
                value="ask shridhar chatbot ai"
                onSelect={run(() => chat.setOpen(true))}
              >
                Ask Shridhar (AI chat)
              </Item>
              <Item
                icon={MessageCircle}
                value="full screen chat"
                onSelect={run(() => navigate('/chat'))}
              >
                Open full-screen chat
              </Item>
              <Item
                icon={theme === 'dark' ? Sun : Moon}
                value="toggle theme dark light mode"
                onSelect={run(toggle)}
              >
                Switch to {theme === 'dark' ? 'light' : 'dark'} theme
              </Item>
              <Item
                icon={FileDown}
                value="download resume cv pdf"
                onSelect={run(() => window.open(profile.resumePdf, '_blank'))}
              >
                Download resume
              </Item>
            </Command.Group>

            <Command.Group heading="Contact" className={groupCls}>
              <Item icon={Copy} value="copy email address" onSelect={copyEmail}>
                {copied ? 'Copied!' : `Copy email (${profile.email})`}
              </Item>
              <Item
                icon={Mail}
                value="send email"
                onSelect={run(() => window.location.assign(`mailto:${profile.email}`))}
              >
                Send an email
              </Item>
              <Item
                icon={ExternalLink}
                value="linkedin profile"
                onSelect={run(() => window.open(profile.linkedin, '_blank', 'noopener'))}
              >
                Open LinkedIn
              </Item>
            </Command.Group>
          </Command.List>
          <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[0.7rem] text-muted">
            <span>↑↓ to move · ↵ to select</span>
            <span>esc to close</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </Command.Dialog>
  )
}
