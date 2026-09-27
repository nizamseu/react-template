// TopBarAppNavigation

// AppNavigation01 · Social Networks & Communities › Global Navigation & Profile Quick-Access

// Description:
// The global top bar of Hive, a community app for hobby "hives". It holds the honeycomb
// logo, a "Search hives, people, posts" field, Home / Notifications / Messages icons with
// live badge counts and an avatar button that opens Priya Raman's profile menu ("View
// profile", "Your hives", "Quiet mode", "Log out"). A small content pane under the bar
// follows the active tab. Use it as the persistent header of a social or community app.

// Design:
// - White bar (h-16) with a slate #e2e8f0 hairline over a #f8fafc canvas; slate #0f172a
//   text, honey #f59e0b for the logo, badges, active underline and focus rings
// - Logo is an SVG hexagon + lowercase font-black "hive" wordmark; nav icons sit in 44px
//   tall targets (40px wide on phones), gain labels from lg and share a gliding honey
//   underline (layoutId)
// - Profile menu: rounded-2xl white card, soft slate shadow, honey-tinted header strip,
//   pill switch for Quiet mode; springs in from the avatar corner (plain fade if reduced)
// - Content pane: honeycomb outline decor, hive cards with a "buzz" meter, notification
//   and message rows; cards 1 → sm:2 → lg:3 columns
// - Responsive: search collapses to an icon below md that opens a full-width search row;
//   the menu is capped at calc(100vw - 2rem) so it never overflows at 360px

// What it does:
// - active tab state (home / notifications / messages); opening a tab clears its badge
//   and swaps the pane below; the underline animates between icons
// - Avatar button toggles the profile menu (aria-expanded); it closes on Escape (focus
//   returns to the avatar), outside pointer down or choosing an item; Arrow keys, Home and
//   End move focus between menu items
// - Quiet mode (menuitemcheckbox) hides the notification badge and shows a "Quiet" chip;
//   the search form is controlled and shows how many results match on submit
// - Links point to #hive-* anchors (profile, hives, saved, settings, help, logout)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TopBarAppNavigation from '@/TestComponent/PageSections/community/AppNavigation01';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <TopBarAppNavigation />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import {
    HiBell,
    HiChatBubbleOvalLeftEllipsis,
    HiChevronDown,
    HiHome,
    HiMagnifyingGlass,
    HiOutlineArrowRightOnRectangle,
    HiOutlineBell,
    HiOutlineBookmark,
    HiOutlineChatBubbleOvalLeftEllipsis,
    HiOutlineCog6Tooth,
    HiOutlineHome,
    HiOutlineMoon,
    HiOutlineQuestionMarkCircle,
    HiOutlineUserGroup,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const PRIYA = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'

const tabs = [
    { id: 'home', label: 'Home', Icon: HiOutlineHome, ActiveIcon: HiHome },
    { id: 'notifications', label: 'Notifications', Icon: HiOutlineBell, ActiveIcon: HiBell },
    {
        id: 'messages',
        label: 'Messages',
        Icon: HiOutlineChatBubbleOvalLeftEllipsis,
        ActiveIcon: HiChatBubbleOvalLeftEllipsis,
    },
]

const hives = [
    { id: 'sourdough', name: 'Sourdough Society', members: '18.2k', fresh: 24, buzz: 86, tint: 'bg-[#fde68a]' },
    { id: 'night-owl', name: 'Night Owl Devs', members: '6,410', fresh: 9, buzz: 48, tint: 'bg-[#bfdbfe]' },
    { id: 'balcony', name: 'Balcony Gardeners', members: '11.7k', fresh: 41, buzz: 97, tint: 'bg-[#bbf7d0]' },
]

const notifications = [
    {
        id: 'n1',
        who: 'Tomás Ortega',
        text: 'replied to your post in Night Owl Devs',
        time: '4m',
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'n2',
        who: 'Aisha Bello',
        text: 'and 23 others liked your rye loaf photo',
        time: '18m',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'n3',
        who: 'Jonah Weiss',
        text: 'mentioned you: “@priya.builds has the best starter guide”',
        time: '3h',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
]

const messages = [
    {
        id: 'm1',
        who: 'Aisha Bello',
        text: 'Bringing the rye starter on Saturday!',
        time: '2m',
        unread: true,
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'm2',
        who: 'Tomás Ortega',
        text: 'Could you review my pull request tonight?',
        time: '1h',
        unread: true,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'm3',
        who: 'Mei Tanaka',
        text: 'Seed swap list is pinned in the hive.',
        time: 'Tue',
        unread: false,
        img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    },
]

const searchable = [
    'Sourdough Society',
    'Night Owl Devs',
    'Balcony Gardeners',
    'Aisha Bello',
    'Tomás Ortega',
    'Rye starter guide',
    'Seed swap Saturday',
]

function HexMark({ className }) {
    return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <polygon points="16,2 28.5,9 28.5,23 16,30 3.5,23 3.5,9" fill="#f59e0b" />
            <polygon points="16,9.5 22,13 22,19.5 16,23 10,19.5 10,13" fill="#ffffff" />
            <polygon points="16,13 19,14.75 19,18 16,19.75 13,18 13,14.75" fill="#0f172a" />
        </svg>
    )
}

export function TopBarAppNavigation({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const groupId = useId()
    const menuId = useId()
    const [active, setActive] = useState('home')
    const [badges, setBadges] = useState({ home: 0, notifications: 12, messages: 3 })
    const [menuOpen, setMenuOpen] = useState(false)
    const [quiet, setQuiet] = useState(false)
    const [mobileSearch, setMobileSearch] = useState(false)
    const [query, setQuery] = useState('')
    const [searchNote, setSearchNote] = useState('')
    const menuRef = useRef(null)
    const avatarRef = useRef(null)

    useEffect(() => {
        if (!menuOpen) return undefined
        const first = menuRef.current?.querySelector('[role^="menuitem"]')
        first?.focus()
        const onPointer = (event) => {
            if (menuRef.current?.contains(event.target) || avatarRef.current?.contains(event.target)) return
            setMenuOpen(false)
        }
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false)
                avatarRef.current?.focus()
            }
        }
        document.addEventListener('pointerdown', onPointer)
        document.addEventListener('keydown', onKey)
        return () => {
            document.removeEventListener('pointerdown', onPointer)
            document.removeEventListener('keydown', onKey)
        }
    }, [menuOpen])

    const openTab = (id) => {
        setActive(id)
        setBadges((prev) => ({ ...prev, [id]: 0 }))
    }

    const onMenuKeyDown = (event) => {
        const items = Array.from(menuRef.current?.querySelectorAll('[role^="menuitem"]') ?? [])
        const index = items.indexOf(document.activeElement)
        let next = null
        if (event.key === 'ArrowDown') next = items[(index + 1) % items.length]
        if (event.key === 'ArrowUp') next = items[(index - 1 + items.length) % items.length]
        if (event.key === 'Home') next = items[0]
        if (event.key === 'End') next = items[items.length - 1]
        if (next) {
            event.preventDefault()
            next.focus()
        }
    }

    const onSearch = (event) => {
        event.preventDefault()
        const q = query.trim().toLowerCase()
        if (!q) {
            setSearchNote('Type a hive, person or post to search.')
            return
        }
        const hits = searchable.filter((s) => s.toLowerCase().includes(q)).length
        setSearchNote(hits ? `${hits} result${hits > 1 ? 's' : ''} for “${query.trim()}”` : `No results for “${query.trim()}”`)
    }

    const badgeFor = (id) => (id === 'notifications' && quiet ? 0 : badges[id])

    const searchField = (idSuffix) => (
        <form role="search" onSubmit={onSearch} className="relative w-full">
            <label htmlFor={`${menuId}-search-${idSuffix}`} className="sr-only">
                Search Hive
            </label>
            <HiMagnifyingGlass
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#64748b]"
            />
            <input
                id={`${menuId}-search-${idSuffix}`}
                type="search"
                value={query}
                placeholder="Search hives, people, posts"
                autoComplete="off"
                className="h-11 w-full rounded-full border border-transparent bg-[#f1f5f9] pl-10 pr-4 text-sm text-[#0f172a] placeholder:text-[#94a3b8] transition-colors focus:border-[#f59e0b] focus:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f59e0b]/20"
                onChange={(event) => {
                    setQuery(event.target.value)
                    setSearchNote('')
                }}
            />
        </form>
    )

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#f8fafc] text-base font-normal text-[#0f172a]', className)}
            {...props}
        >
            <header className="relative z-30 border-b border-[#e2e8f0] bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
                    <a
                        href="#hive-home"
                        className="flex shrink-0 items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f59e0b]"
                    >
                        <HexMark className="size-8" />
                        <span className="text-2xl font-black lowercase tracking-[-0.06em] text-[#0f172a]">hive</span>
                    </a>

                    <div className="hidden max-w-sm flex-1 md:block lg:max-w-xs xl:max-w-sm">{searchField('desktop')}</div>

                    <LayoutGroup id={groupId}>
                        <nav aria-label="Primary" className="ml-auto flex h-full items-stretch lg:mx-auto">
                            <ul className="flex h-full items-stretch gap-0.5 sm:gap-1">
                                {tabs.map((tab) => {
                                    const isActive = active === tab.id
                                    const count = badgeFor(tab.id)
                                    const Icon = isActive ? tab.ActiveIcon : tab.Icon
                                    return (
                                        <li key={tab.id} className="relative flex items-stretch">
                                            <button
                                                type="button"
                                                aria-current={isActive ? 'page' : undefined}
                                                aria-label={count ? `${tab.label}, ${count} new` : tab.label}
                                                className={cn(
                                                    'group relative my-auto flex h-11 min-w-10 items-center justify-center gap-2 rounded-xl px-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b] sm:px-2.5 lg:px-4',
                                                    isActive
                                                        ? 'text-[#0f172a]'
                                                        : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]',
                                                )}
                                                onClick={() => openTab(tab.id)}
                                            >
                                                <span className="relative">
                                                    <Icon aria-hidden="true" className="size-6" />
                                                    <AnimatePresence>
                                                        {count > 0 && (
                                                            <motion.span
                                                                key="badge"
                                                                initial={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                                                                animate={{ scale: 1, opacity: 1 }}
                                                                exit={{ scale: reduceMotion ? 1 : 0.4, opacity: 0 }}
                                                                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                                                                aria-hidden="true"
                                                                className="absolute -right-2.5 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#f59e0b] px-1 text-[10px] font-bold leading-none text-[#0f172a] ring-2 ring-white"
                                                            >
                                                                {count > 9 ? '9+' : count}
                                                            </motion.span>
                                                        )}
                                                    </AnimatePresence>
                                                </span>
                                                <span className="hidden lg:inline">{tab.label}</span>
                                            </button>
                                            {isActive && (
                                                <motion.span
                                                    layoutId="hive-topbar-underline"
                                                    aria-hidden="true"
                                                    transition={
                                                        reduceMotion
                                                            ? { duration: 0 }
                                                            : { type: 'spring', stiffness: 420, damping: 34 }
                                                    }
                                                    className="absolute inset-x-1.5 bottom-0 h-[3px] rounded-t-full bg-[#f59e0b]"
                                                />
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>
                    </LayoutGroup>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                        <button
                            type="button"
                            aria-label={mobileSearch ? 'Close search' : 'Open search'}
                            aria-expanded={mobileSearch}
                            className="grid size-11 place-items-center rounded-xl text-[#475569] hover:bg-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b] md:hidden"
                            onClick={() => setMobileSearch((v) => !v)}
                        >
                            {mobileSearch ? (
                                <HiXMark aria-hidden="true" className="size-5" />
                            ) : (
                                <HiMagnifyingGlass aria-hidden="true" className="size-5" />
                            )}
                        </button>

                        {quiet && (
                            <span className="hidden items-center gap-1 rounded-full bg-[#0f172a] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#fde68a] sm:inline-flex">
                                <HiOutlineMoon aria-hidden="true" className="size-3.5" />
                                Quiet
                            </span>
                        )}

                        <div className="relative">
                            <button
                                ref={avatarRef}
                                type="button"
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                                aria-controls={menuId}
                                aria-label="Open profile menu for Priya Raman"
                                className={cn(
                                    'flex h-11 items-center gap-1 rounded-full p-1 pr-1.5 transition-colors hover:bg-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                    menuOpen && 'bg-[#fef3c7]',
                                )}
                                onClick={() => setMenuOpen((v) => !v)}
                            >
                                <span className="relative">
                                    <img
                                        src={PRIYA}
                                        alt=""
                                        className="size-9 rounded-full object-cover ring-2 ring-[#f59e0b] ring-offset-2 ring-offset-white"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-[#22c55e] ring-2 ring-white"
                                    />
                                </span>
                                <HiChevronDown
                                    aria-hidden="true"
                                    className={cn(
                                        'hidden size-4 text-[#475569] transition-transform sm:block',
                                        menuOpen && 'rotate-180',
                                    )}
                                />
                            </button>

                            <AnimatePresence>
                                {menuOpen && (
                                    <motion.div
                                        ref={menuRef}
                                        id={menuId}
                                        role="menu"
                                        aria-label="Profile menu"
                                        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.94, y: reduceMotion ? 0 : -6 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96, y: reduceMotion ? 0 : -4 }}
                                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                                        style={{ transformOrigin: 'top right' }}
                                        className="absolute right-0 top-full mt-3 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)]"
                                        onKeyDown={onMenuKeyDown}
                                    >
                                        <div className="flex items-center gap-3 bg-[#fffbeb] p-4">
                                            <img src={PRIYA} alt="" className="size-12 rounded-full object-cover" />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-[#0f172a]">Priya Raman</p>
                                                <p className="truncate text-xs text-[#64748b]">@priya.builds · 12 hives</p>
                                                <a
                                                    role="menuitem"
                                                    href="#hive-profile"
                                                    className="mt-1 inline-block rounded text-xs font-semibold text-[#b45309] underline decoration-[#f59e0b]/50 underline-offset-2 hover:decoration-[#b45309] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    View profile
                                                </a>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            {[
                                                { href: '#hive-your-hives', label: 'Your hives', Icon: HiOutlineUserGroup, meta: '12' },
                                                { href: '#hive-saved', label: 'Saved posts', Icon: HiOutlineBookmark, meta: '24' },
                                                { href: '#hive-settings', label: 'Settings & privacy', Icon: HiOutlineCog6Tooth },
                                            ].map((item) => (
                                                <a
                                                    key={item.href}
                                                    role="menuitem"
                                                    href={item.href}
                                                    className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[#334155] outline-none hover:bg-[#f8fafc] focus-visible:bg-[#fef3c7] focus-visible:text-[#0f172a]"
                                                    onClick={() => setMenuOpen(false)}
                                                >
                                                    <item.Icon aria-hidden="true" className="size-5 text-[#64748b]" />
                                                    <span className="flex-1">{item.label}</span>
                                                    {item.meta && (
                                                        <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-xs font-semibold text-[#475569]">
                                                            {item.meta}
                                                        </span>
                                                    )}
                                                </a>
                                            ))}
                                            <button
                                                type="button"
                                                role="menuitemcheckbox"
                                                aria-checked={quiet}
                                                className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-[#334155] outline-none hover:bg-[#f8fafc] focus-visible:bg-[#fef3c7] focus-visible:text-[#0f172a]"
                                                onClick={() => setQuiet((v) => !v)}
                                            >
                                                <HiOutlineMoon aria-hidden="true" className="size-5 text-[#64748b]" />
                                                <span className="flex-1">
                                                    Quiet mode
                                                    <span className="block text-xs font-normal text-[#94a3b8]">
                                                        Pause notification badges
                                                    </span>
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'relative h-6 w-10 shrink-0 rounded-full transition-colors',
                                                        quiet ? 'bg-[#f59e0b]' : 'bg-[#cbd5e1]',
                                                    )}
                                                >
                                                    <span
                                                        className={cn(
                                                            'absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform',
                                                            quiet && 'translate-x-4',
                                                        )}
                                                    />
                                                </span>
                                            </button>
                                            <a
                                                role="menuitem"
                                                href="#hive-help"
                                                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-[#334155] outline-none hover:bg-[#f8fafc] focus-visible:bg-[#fef3c7] focus-visible:text-[#0f172a]"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <HiOutlineQuestionMarkCircle aria-hidden="true" className="size-5 text-[#64748b]" />
                                                Help centre
                                            </a>
                                        </div>
                                        <div className="border-t border-[#e2e8f0] p-2">
                                            <a
                                                role="menuitem"
                                                href="#hive-logout"
                                                className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-[#b91c1c] outline-none hover:bg-[#fef2f2] focus-visible:bg-[#fef2f2]"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                <HiOutlineArrowRightOnRectangle aria-hidden="true" className="size-5" />
                                                Log out
                                            </a>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <AnimatePresence initial={false}>
                    {mobileSearch && (
                        <motion.div
                            key="mobile-search"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.2 }}
                            className="overflow-hidden border-t border-[#e2e8f0] md:hidden"
                        >
                            <div className="px-4 py-3 sm:px-6">{searchField('mobile')}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <div className="relative overflow-hidden">
                <svg
                    aria-hidden="true"
                    viewBox="0 0 200 180"
                    className="pointer-events-none absolute -right-10 -top-6 w-64 text-[#f59e0b]/25 sm:w-80"
                >
                    {[
                        [60, 40],
                        [112, 40],
                        [86, 85],
                        [138, 85],
                        [112, 130],
                    ].map(([x, y]) => (
                        <polygon
                            key={`${x}-${y}`}
                            points={`${x},${y - 26} ${x + 23},${y - 13} ${x + 23},${y + 13} ${x},${y + 26} ${x - 23},${y + 13} ${x - 23},${y - 13}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                    ))}
                </svg>

                <div className="relative mx-auto min-h-[520px] max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
                    <p aria-live="polite" className="mb-6 min-h-5 text-sm font-medium text-[#b45309]">
                        {searchNote}
                    </p>

                    {active === 'home' && (
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#b45309]">
                                Sunday, 27 September
                            </p>
                            <h2 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight text-[#0f172a] sm:text-4xl">
                                Good morning, Priya. Three hives are buzzing.
                            </h2>
                            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {hives.map((hive) => (
                                    <li key={hive.id}>
                                        <a
                                            href={`#hive-${hive.id}`}
                                            className="group block rounded-2xl border border-[#e2e8f0] bg-white p-5 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'grid size-11 place-items-center [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]',
                                                        hive.tint,
                                                    )}
                                                >
                                                    <HiOutlineUserGroup className="size-5 text-[#0f172a]" />
                                                </span>
                                                <div className="min-w-0">
                                                    <h3 className="truncate text-base font-bold text-[#0f172a]">{hive.name}</h3>
                                                    <p className="text-xs text-[#64748b]">{hive.members} members</p>
                                                </div>
                                            </div>
                                            <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[#475569]">
                                                <span>Buzz level</span>
                                                <span className="text-[#b45309]">{hive.fresh} new posts</span>
                                            </div>
                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f1f5f9]">
                                                <div
                                                    className="h-full rounded-full bg-linear-to-r from-[#fcd34d] to-[#f59e0b]"
                                                    style={{ width: `${hive.buzz}%` }}
                                                />
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {active !== 'home' && (
                        <div className="max-w-2xl">
                            <h2 className="text-3xl font-black tracking-tight text-[#0f172a] sm:text-4xl">
                                {active === 'notifications' ? 'Notifications' : 'Messages'}
                            </h2>
                            <ul className="mt-6 divide-y divide-[#e2e8f0] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
                                {(active === 'notifications' ? notifications : messages).map((row) => (
                                    <li key={row.id} className="flex items-start gap-3 p-4">
                                        <img
                                            src={row.img}
                                            alt={`${row.who}’s avatar`}
                                            loading="lazy"
                                            className="size-11 shrink-0 rounded-full object-cover"
                                        />
                                        <p className="min-w-0 flex-1 text-sm leading-snug text-[#475569]">
                                            <span className="font-bold text-[#0f172a]">{row.who}</span>{' '}
                                            {active === 'messages' ? <span className="block truncate">{row.text}</span> : row.text}
                                        </p>
                                        <span className="flex shrink-0 items-center gap-2 text-xs text-[#94a3b8]">
                                            {row.time}
                                            {row.unread && (
                                                <span className="size-2 rounded-full bg-[#f59e0b]">
                                                    <span className="sr-only">Unread</span>
                                                </span>
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default TopBarAppNavigation
