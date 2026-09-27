// NotificationDrawerAppNavigation

// AppNavigation03 · Social Networks & Communities › Global Navigation & Profile Quick-Access

// Description:
// A cosy top navigation for Campfire, a storytelling community for hikers and campers. A
// floating pill bar carries the flame logo, "Circles / Tonight / Stories" links and a bell
// whose badge counts unread items. The bell slides in a "Notifications" drawer with All
// and Mentions tabs, unread dots, a "Mark all as read" button and a settings link, above a
// warm "Pull up a log, Jonas." home pane. Use it for community apps with rich notifications.

// Design:
// - Warm cream #fff7ed canvas, ember ink #431407, orange #ea580c for the badge, unread
//   dots, tab underline and focus rings, with a soft #fed7aa glow behind the heading
// - Nav is a floating rounded-full bar (white/80, backdrop blur, orange-tinted hairline);
//   serif "Campfire" wordmark beside an SVG flame; heading is serif text-4xl → lg:text-6xl
// - Drawer: white panel, rounded-l-[28px] from sm, full width below sm, ember scrim with
//   blur; rows show avatar + type badge, bold actor, quoted snippet and relative time
// - Motion: drawer slides from the right on a spring, the badge pops when its count
//   changes and the tab underline glides (layoutId); all become fades with reduced motion
// - Responsive: nav links hide below md; home cards 1 → md:2 columns; drawer is 100% wide
//   on phones and 420px from sm

// What it does:
// - items state tracks unread flags; the bell badge and tab counts are derived from it;
//   clicking a row marks it read and "Mark all as read" clears everything
// - The drawer is a modal dialog: focus moves to its close button, Tab is trapped inside,
//   Escape / scrim click / close button shut it and focus returns to the bell
// - Tabs (role="tablist") switch All / Mentions with click or Arrow keys; one extra mention
//   arrives 8 s after mount (timeout cleared on unmount) so the badge updates live
// - Links point to #campfire-* anchors; "Save my seat" toggles aria-pressed

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NotificationDrawerAppNavigation from '@/TestComponent/PageSections/community/AppNavigation03';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <NotificationDrawerAppNavigation />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import {
    HiAtSymbol,
    HiBell,
    HiChatBubbleLeft,
    HiCheck,
    HiFire,
    HiHeart,
    HiOutlineBell,
    HiOutlineCog6Tooth,
    HiUserPlus,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const JONAS = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'

const typeIcon = {
    mention: { Icon: HiAtSymbol, tint: 'bg-[#ea580c]' },
    reply: { Icon: HiChatBubbleLeft, tint: 'bg-[#0f766e]' },
    like: { Icon: HiHeart, tint: 'bg-[#e11d48]' },
    event: { Icon: HiFire, tint: 'bg-[#c2410c]' },
    follow: { Icon: HiUserPlus, tint: 'bg-[#6d28d9]' },
}

const initialItems = [
    {
        id: 'c1',
        type: 'mention',
        who: 'Hana Sato',
        text: 'mentioned you in #trail-stories',
        quote: '@jonas.wild tell them about the bear canister incident',
        time: '6m',
        unread: true,
        img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'c2',
        type: 'reply',
        who: 'Marcus Webb',
        text: 'replied to your story “Fog on Lake Tahoe”',
        quote: 'Chills. Did you ever go back for the lantern?',
        time: '22m',
        unread: true,
        img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'c3',
        type: 'event',
        who: 'Tonight’s fire',
        text: 'starts at 8:30 pm · 42 campers are going',
        time: '1h',
        unread: true,
    },
    {
        id: 'c4',
        type: 'like',
        who: 'Elena Ruiz',
        text: 'and 17 others warmed up to your photo from Kings Canyon',
        time: '3h',
        unread: true,
        img: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'c5',
        type: 'mention',
        who: 'Dev Patel',
        text: 'mentioned you in #gear-swap',
        quote: '@jonas.wild still selling the two-person tent?',
        time: 'Yesterday',
        unread: false,
        img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'c6',
        type: 'follow',
        who: 'Ola Nordmann',
        text: 'joined your circle Night Hikers',
        time: 'Mon',
        unread: false,
        img: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80',
    },
]

const incoming = {
    id: 'c0',
    type: 'mention',
    who: 'Grace Kim',
    text: 'mentioned you in #tonight',
    quote: 'Save me a spot by the fire, @jonas.wild',
    time: 'Just now',
    unread: true,
    img: 'https://images.unsplash.com/photo-1614644147724-2d4785d69962?auto=format&fit=crop&w=400&q=80',
}

function FlameMark({ className }) {
    return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <path
                d="M16 2c1.5 5-4.5 7.5-4.5 13a4.5 4.5 0 0 0 9 0c0-2.2-1.2-3.6-1.8-5.2 3.4 1.6 6.3 5.2 6.3 9.4A9 9 0 0 1 7 19.2C7 11.5 14.5 8.5 16 2Z"
                fill="#ea580c"
            />
            <path d="M16 17c.8 2 2.5 2.6 2.5 4.6a2.5 2.5 0 0 1-5 0c0-1.9 1.9-2.6 2.5-4.6Z" fill="#fdba74" />
            <path d="M6 29h20" stroke="#431407" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
    )
}

export function NotificationDrawerAppNavigation({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const baseId = useId()
    const [items, setItems] = useState(initialItems)
    const [open, setOpen] = useState(false)
    const [tab, setTab] = useState('all')
    const [seat, setSeat] = useState(false)
    const drawerRef = useRef(null)
    const closeRef = useRef(null)
    const bellRef = useRef(null)
    const tabRefs = useRef({})

    const unread = items.filter((item) => item.unread).length
    const mentions = items.filter((item) => item.type === 'mention')
    const mentionsUnread = mentions.filter((item) => item.unread).length
    const visible = tab === 'all' ? items : mentions

    useEffect(() => {
        const id = setTimeout(() => {
            setItems((prev) => (prev.some((item) => item.id === incoming.id) ? prev : [incoming, ...prev]))
        }, 8000)
        return () => clearTimeout(id)
    }, [])

    useEffect(() => {
        if (!open) return undefined
        closeRef.current?.focus()
        const onKey = (event) => {
            if (event.key !== 'Escape') return
            setOpen(false)
            bellRef.current?.focus()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open])

    const closeDrawer = () => {
        setOpen(false)
        bellRef.current?.focus()
    }

    const trapFocus = (event) => {
        if (event.key !== 'Tab') return
        const focusables = Array.from(
            drawerRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]') ?? [],
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
        }
    }

    const onTabKey = (event) => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
        event.preventDefault()
        const next = tab === 'all' ? 'mentions' : 'all'
        setTab(next)
        tabRefs.current[next]?.focus()
    }

    const markRead = (id) => setItems((prev) => prev.map((item) => (item.id === id ? { ...item, unread: false } : item)))
    const markAll = () => setItems((prev) => prev.map((item) => ({ ...item, unread: false })))

    const spring = reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 380, damping: 38 }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative min-h-[700px] overflow-hidden bg-[#fff7ed] text-base font-normal text-[#431407]', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-24 h-[380px] w-[680px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#fed7aa,transparent)] opacity-80 blur-2xl"
            />

            <div className="relative mx-auto max-w-6xl px-4 pt-5 sm:px-6 lg:px-8">
                <nav
                    aria-label="Campfire"
                    className="flex h-16 items-center gap-3 rounded-full border border-[#fed7aa] bg-white/80 pl-4 pr-2 shadow-[0_12px_40px_-24px_rgba(67,20,7,0.45)] backdrop-blur sm:pl-5"
                >
                    <a
                        href="#campfire-home"
                        className="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ea580c]"
                    >
                        <FlameMark className="size-8" />
                        <span className="font-serif text-2xl italic tracking-tight text-[#431407]">Campfire</span>
                    </a>
                    <ul className="ml-6 hidden items-center gap-1 md:flex">
                        {['Circles', 'Tonight', 'Stories'].map((link, index) => (
                            <li key={link}>
                                <a
                                    href={`#campfire-${link.toLowerCase()}`}
                                    aria-current={index === 0 ? 'page' : undefined}
                                    className={cn(
                                        'inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                        index === 0
                                            ? 'bg-[#431407] text-[#fff7ed]'
                                            : 'text-[#9a3412] hover:bg-[#ffedd5]',
                                    )}
                                >
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className="ml-auto flex items-center gap-1.5">
                        <button
                            ref={bellRef}
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded={open}
                            aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
                            className={cn(
                                'relative grid size-12 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                open ? 'bg-[#ea580c] text-white' : 'text-[#9a3412] hover:bg-[#ffedd5]',
                            )}
                            onClick={() => setOpen(true)}
                        >
                            {open ? (
                                <HiBell aria-hidden="true" className="size-6" />
                            ) : (
                                <HiOutlineBell aria-hidden="true" className="size-6" />
                            )}
                            <AnimatePresence>
                                {unread > 0 && (
                                    <motion.span
                                        key={unread}
                                        initial={{ scale: reduceMotion ? 1 : 1.6, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: reduceMotion ? 1 : 0.5, opacity: 0 }}
                                        transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                                        aria-hidden="true"
                                        className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ea580c] px-1 text-[11px] font-bold leading-none text-white ring-2 ring-white"
                                    >
                                        {unread}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                        <a
                            href="#campfire-profile"
                            aria-label="Your profile, Jonas Albrecht"
                            className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                        >
                            <img src={JONAS} alt="" className="size-11 rounded-full object-cover ring-2 ring-[#fdba74]" />
                        </a>
                    </div>
                </nav>
            </div>

            <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 md:pt-20 lg:px-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#c2410c]">Sunday · 6:14 pm</p>
                <h2 className="mt-4 max-w-2xl font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#431407] sm:text-5xl lg:text-6xl">
                    Pull up a log, <em className="text-[#ea580c]">Jonas.</em>
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-[#7c2d12]/80">
                    Your circles traded 38 stories while you were on the trail. The fire lights at 8:30.
                </p>

                <div className="mt-10 grid gap-5 md:grid-cols-2">
                    <article className="overflow-hidden rounded-[28px] border border-[#fed7aa] bg-white">
                        <img
                            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80"
                            alt="Starry night sky over snowy mountain peaks"
                            loading="lazy"
                            className="aspect-[16/8] w-full object-cover"
                        />
                        <div className="flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
                                    Tonight’s fire · 8:30 pm
                                </p>
                                <h3 className="mt-1.5 font-serif text-2xl font-normal text-[#431407]">
                                    Ghost stories from the Pacific Crest
                                </h3>
                                <p className="mt-1 text-sm text-[#7c2d12]/70">{seat ? 43 : 42} campers going</p>
                            </div>
                            <button
                                type="button"
                                aria-pressed={seat}
                                className={cn(
                                    'inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]',
                                    seat
                                        ? 'bg-[#ffedd5] text-[#9a3412]'
                                        : 'bg-[#ea580c] text-white hover:bg-[#c2410c]',
                                )}
                                onClick={() => setSeat((v) => !v)}
                            >
                                {seat && <HiCheck aria-hidden="true" className="size-4" />}
                                {seat ? 'Seat saved' : 'Save my seat'}
                            </button>
                        </div>
                    </article>
                    <article className="overflow-hidden rounded-[28px] border border-[#fed7aa] bg-white">
                        <img
                            src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=1000&q=80"
                            alt="View from inside a tent opening onto a pine forest"
                            loading="lazy"
                            className="aspect-[16/8] w-full object-cover"
                        />
                        <div className="p-5 sm:p-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c2410c]">
                                Circle · Night Hikers
                            </p>
                            <h3 className="mt-1.5 font-serif text-2xl font-normal text-[#431407]">
                                “Headlamps off at the ridge” — 12 new replies
                            </h3>
                            <a
                                href="#campfire-night-hikers"
                                className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[#c2410c] underline decoration-[#fdba74] underline-offset-4 hover:decoration-[#c2410c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                            >
                                Read the thread
                            </a>
                        </div>
                    </article>
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            key="scrim"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            aria-hidden="true"
                            className="absolute inset-0 z-40 bg-[#431407]/30 backdrop-blur-[2px]"
                            onClick={closeDrawer}
                        />
                        <motion.div
                            key="drawer"
                            ref={drawerRef}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={`${baseId}-title`}
                            initial={{ x: reduceMotion ? 0 : '100%', opacity: reduceMotion ? 0 : 1 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: reduceMotion ? 0 : '100%', opacity: reduceMotion ? 0 : 1 }}
                            transition={spring}
                            className="absolute inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-[-30px_0_80px_-30px_rgba(67,20,7,0.5)] sm:w-[420px] sm:rounded-l-[28px]"
                            onKeyDown={trapFocus}
                        >
                            <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5 sm:px-6">
                                <h2
                                    id={`${baseId}-title`}
                                    className="flex items-center gap-2 font-serif text-2xl font-normal text-[#431407]"
                                >
                                    Notifications
                                    <span className="rounded-full bg-[#ffedd5] px-2 py-0.5 font-sans text-xs font-bold text-[#c2410c]">
                                        {unread} new
                                    </span>
                                </h2>
                                <button
                                    ref={closeRef}
                                    type="button"
                                    aria-label="Close notifications"
                                    className="grid size-11 place-items-center rounded-full text-[#9a3412] hover:bg-[#ffedd5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                    onClick={closeDrawer}
                                >
                                    <HiXMark aria-hidden="true" className="size-6" />
                                </button>
                            </div>

                            <div className="flex items-end justify-between gap-3 border-b border-[#ffedd5] px-5 sm:px-6">
                                <LayoutGroup id={baseId}>
                                    <div role="tablist" aria-label="Filter notifications" className="flex">
                                        {[
                                            { id: 'all', label: 'All', count: unread },
                                            { id: 'mentions', label: 'Mentions', count: mentionsUnread },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                ref={(node) => {
                                                    tabRefs.current[t.id] = node
                                                }}
                                                type="button"
                                                role="tab"
                                                id={`${baseId}-tab-${t.id}`}
                                                aria-selected={tab === t.id}
                                                aria-controls={`${baseId}-panel`}
                                                tabIndex={tab === t.id ? 0 : -1}
                                                className={cn(
                                                    'relative flex min-h-11 items-center gap-1.5 px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c]',
                                                    tab === t.id ? 'text-[#431407]' : 'text-[#9a3412]/60 hover:text-[#9a3412]',
                                                )}
                                                onClick={() => setTab(t.id)}
                                                onKeyDown={onTabKey}
                                            >
                                                {t.label}
                                                {t.count > 0 && (
                                                    <span className="rounded-full bg-[#ea580c] px-1.5 text-[10px] font-bold leading-4 text-white">
                                                        {t.count}
                                                    </span>
                                                )}
                                                {tab === t.id && (
                                                    <motion.span
                                                        layoutId="campfire-tab-underline"
                                                        transition={spring}
                                                        aria-hidden="true"
                                                        className="absolute inset-x-2 -bottom-px h-[3px] rounded-full bg-[#ea580c]"
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </LayoutGroup>
                                <button
                                    type="button"
                                    disabled={unread === 0}
                                    className="mb-1.5 inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-xs font-semibold text-[#c2410c] hover:bg-[#fff7ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c] disabled:cursor-not-allowed disabled:text-[#9a3412]/35 disabled:hover:bg-transparent"
                                    onClick={markAll}
                                >
                                    <HiCheck aria-hidden="true" className="size-4" />
                                    Mark all as read
                                </button>
                            </div>

                            <div
                                id={`${baseId}-panel`}
                                role="tabpanel"
                                aria-labelledby={`${baseId}-tab-${tab}`}
                                className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 sm:px-3"
                            >
                                <ul className="space-y-1">
                                    {visible.map((item) => {
                                        const kind = typeIcon[item.type]
                                        return (
                                            <li key={item.id}>
                                                <button
                                                    type="button"
                                                    aria-label={`${item.unread ? 'Unread: ' : ''}${item.who} ${item.text}${item.quote ? `: ${item.quote}` : ''}, ${item.time}`}
                                                    className={cn(
                                                        'flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#ea580c]',
                                                        item.unread ? 'bg-[#fff7ed] hover:bg-[#ffedd5]' : 'hover:bg-[#fafaf9]',
                                                    )}
                                                    onClick={() => markRead(item.id)}
                                                >
                                                    <span className="relative shrink-0">
                                                        {item.img ? (
                                                            <img
                                                                src={item.img}
                                                                alt=""
                                                                loading="lazy"
                                                                className="size-11 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <span className="grid size-11 place-items-center rounded-full bg-[#431407]">
                                                                <FlameMark className="size-6" />
                                                            </span>
                                                        )}
                                                        <span
                                                            aria-hidden="true"
                                                            className={cn(
                                                                'absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full text-white ring-2 ring-white',
                                                                kind.tint,
                                                            )}
                                                        >
                                                            <kind.Icon className="size-3" />
                                                        </span>
                                                    </span>
                                                    <span className="min-w-0 flex-1 text-sm leading-snug text-[#7c2d12]">
                                                        <span className="font-bold text-[#431407]">{item.who}</span> {item.text}
                                                        {item.quote && (
                                                            <span className="mt-1.5 block rounded-xl border-l-2 border-[#fdba74] bg-white/70 px-2.5 py-1.5 font-serif text-[13px] italic text-[#7c2d12]">
                                                                “{item.quote}”
                                                            </span>
                                                        )}
                                                        <span className="mt-1 block text-xs text-[#9a3412]/60">{item.time}</span>
                                                    </span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'mt-1.5 size-2.5 shrink-0 rounded-full transition-colors',
                                                            item.unread ? 'bg-[#ea580c]' : 'bg-transparent',
                                                        )}
                                                    />
                                                </button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>

                            <div className="border-t border-[#ffedd5] p-3 sm:px-4">
                                <a
                                    href="#campfire-notification-settings"
                                    className="flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold text-[#9a3412] hover:bg-[#fff7ed] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea580c]"
                                >
                                    <HiOutlineCog6Tooth aria-hidden="true" className="size-5" />
                                    Notification settings
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    )
}

export default NotificationDrawerAppNavigation
