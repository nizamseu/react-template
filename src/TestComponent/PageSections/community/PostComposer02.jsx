// MentionToolbarPostComposer

// PostComposer02 · Social Networks & Communities › Post Creation Widget

// Description:
// A forum reply editor for Agora Forums, shown under the thread "Is it worth moving our
// colour tokens to OKLCH?". A Bold / Italic / Link / Code / Quote / Mention toolbar wraps
// the selection in markdown, typing "@" opens a keyboard-selectable member list, and a
// Write / Preview switch renders the markdown. "Post reply" adds the reply to the thread.
// Use it for discussion boards, Q&A sites and comment areas that accept rich text.

// Design:
// - Two columns on lg (main thread + 18rem aside with a formatting cheatsheet and "In this
//   thread" members); one column below lg with the aside after the editor
// - Paper #fafafa section, stone ink #1c1917 / #57534e, hairlines #e7e5e4, forest #166534
//   for buttons, mentions and focus rings, mint #f0fdf4 / #dcfce7 tints
// - Serif display heading (text-4xl → lg:text-6xl) and serif thread title; the editor
//   source uses font-mono, the preview renders in sans; cards rounded-2xl with 1px borders
// - Mention list is a floating rounded-xl listbox with avatars and roles; new replies slide
//   in with framer-motion (plain fade for reduced motion)
// - Toolbar buttons are 40px squares; the Write / Preview tabs sit at the right end of
//   the toolbar row and wrap beneath the buttons on narrow screens

// What it does:
// - Toolbar and Ctrl/⌘ + B / I / K wrap (or unwrap) the selection as **bold**, _italic_,
//   [text](https://) and `code`; Quote prefixes lines with "> "; Ctrl/⌘ + Enter posts
// - Typing "@name" filters six members; ↑ / ↓ move, Enter or Tab inserts "@handle ",
//   Escape dismisses; "Mention" buttons in the aside insert a handle at the caret
// - Validation: 20–1500 characters (live counter + hint); submit (preventDefault) appends
//   the rendered reply with the list of notified members and a success note
// - Links typed in a reply render only for https:// or #hash targets; nothing is sent

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MentionToolbarPostComposer from '@/TestComponent/PageSections/community/PostComposer02';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <MentionToolbarPostComposer />
//     </main>
// )
// ```

'use client'

import { Fragment, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    PiArrowFatUpBold,
    PiAtBold,
    PiChatsCircleBold,
    PiCheckBold,
    PiCodeSimpleBold,
    PiLinkSimpleBold,
    PiQuotesBold,
    PiTextBBold,
    PiTextItalicBold,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const MIN = 20
const MAX = 1500

const members = [
    {
        handle: 'hana.okafor',
        name: 'Hana Okafor',
        role: 'Original poster',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
    },
    {
        handle: 'dev.marcus',
        name: 'Marcus Devlin',
        role: 'Moderator',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
    },
    {
        handle: 'lin.zhao',
        name: 'Lin Zhao',
        role: 'Accessibility',
        avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80',
    },
    {
        handle: 'ravi.kapoor',
        name: 'Ravi Kapoor',
        role: 'Frontend',
        avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    },
    {
        handle: 'sofia.mendes',
        name: 'Sofía Mendes',
        role: 'Product design',
        avatar: 'https://images.unsplash.com/photo-1619895862022-09114b41f16f?auto=format&fit=crop&w=400&q=80',
    },
    {
        handle: 'noah.b',
        name: 'Noah Brandt',
        role: 'Colour nerd',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80',
    },
]

const byHandle = Object.fromEntries(members.map((m) => [m.handle, m]))

const ME = {
    name: 'Jonah Ellis',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
}

const seedReplies = [
    {
        id: 'r-1',
        author: members[1],
        time: '3 h ago',
        body: 'We shipped OKLCH ramps in **v4.2** of our kit. The big win is _predictable lightness_ across hues — contrast checks stopped surprising us. Pinging @lin.zhao for the a11y side.',
        notified: ['lin.zhao'],
    },
]

const TOKEN = /(\*\*[^*\n]+\*\*|_[^_\n]+_|`[^`\n]+`|\[[^\]\n]+\]\([^)\s]+\)|@[a-z0-9._]+)/gi

function renderInline(line, keyBase) {
    return line.split(TOKEN).map((part, i) => {
        const key = `${keyBase}-${i}`
        if (!part) return null
        if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={key} className="font-semibold text-[#1c1917]">
                    {part.slice(2, -2)}
                </strong>
            )
        }
        if (part.length > 2 && part.startsWith('_') && part.endsWith('_')) {
            return (
                <em key={key} className="italic">
                    {part.slice(1, -1)}
                </em>
            )
        }
        if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
            return (
                <code key={key} className="rounded-md bg-[#f5f5f4] px-1.5 py-0.5 font-mono text-[0.85em] text-[#166534]">
                    {part.slice(1, -1)}
                </code>
            )
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
        if (link) {
            const safe = /^(https:\/\/[^\s]+\.[^\s]+|#[\w-]+)/i.test(link[2])
            return safe ? (
                <a
                    key={key}
                    href={link[2]}
                    rel="nofollow noopener noreferrer"
                    className="font-medium text-[#166534] underline decoration-[#86efac] decoration-2 underline-offset-2 hover:decoration-[#166534]"
                >
                    {link[1]}
                </a>
            ) : (
                <span key={key} className="underline decoration-dotted">
                    {link[1]}
                </span>
            )
        }
        if (part.startsWith('@') && byHandle[part.slice(1).toLowerCase()]) {
            return (
                <span key={key} className="rounded-md bg-[#dcfce7] px-1 font-semibold text-[#166534]">
                    {part}
                </span>
            )
        }
        return <Fragment key={key}>{part}</Fragment>
    })
}

function Markdown({ source }) {
    const blocks = source.trim().split(/\n{2,}/)
    return blocks.map((block, bi) => {
        const lines = block.split('\n')
        if (lines.every((l) => l.startsWith('>'))) {
            return (
                <blockquote
                    key={bi}
                    className="border-l-4 border-[#bbf7d0] bg-[#f0fdf4] py-2 pl-4 pr-2 text-[#44403c] [&:not(:first-child)]:mt-3"
                >
                    {lines.map((l, li) => (
                        <Fragment key={li}>
                            {li > 0 && <br />}
                            {renderInline(l.replace(/^>\s?/, ''), `${bi}-${li}`)}
                        </Fragment>
                    ))}
                </blockquote>
            )
        }
        return (
            <p key={bi} className="break-words [&:not(:first-child)]:mt-3">
                {lines.map((l, li) => (
                    <Fragment key={li}>
                        {li > 0 && <br />}
                        {renderInline(l, `${bi}-${li}`)}
                    </Fragment>
                ))}
            </p>
        )
    })
}

function findMention(value, caret) {
    const before = value.slice(0, caret)
    const match = before.match(/(^|\s)@([a-z0-9._]{0,24})$/i)
    if (!match) return null
    return { start: caret - match[2].length - 1, query: match[2].toLowerCase() }
}

function mentionedHandles(value) {
    const found = new Set()
    for (const m of value.matchAll(/@([a-z0-9._]+)/gi)) {
        const h = m[1].toLowerCase()
        if (byHandle[h]) found.add(h)
    }
    return [...found]
}

export function MentionToolbarPostComposer({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const areaRef = useRef(null)
    const dismissedAt = useRef(-1)
    const nextId = useRef(2)

    const [text, setText] = useState('')
    const [mode, setMode] = useState('write')
    const [mention, setMention] = useState(null)
    const [active, setActive] = useState(0)
    const [replies, setReplies] = useState(seedReplies)
    const [status, setStatus] = useState('')

    const length = text.trim().length
    const tooShort = length < MIN
    const tooLong = text.length > MAX
    const valid = !tooShort && !tooLong
    const hint = tooLong
        ? `Trim ${text.length - MAX} characters to post.`
        : tooShort
          ? `Replies need at least ${MIN} characters (${MIN - length} to go).`
          : 'Looks good — ready to post.'

    const results = mention
        ? members
              .filter((m) => m.handle.includes(mention.query) || m.name.toLowerCase().includes(mention.query))
              .slice(0, 5)
        : []
    const listOpen = mode === 'write' && mention !== null

    const syncMention = (value, caret) => {
        const found = findMention(value, caret)
        if (!found || found.start === dismissedAt.current) {
            setMention(null)
            return
        }
        dismissedAt.current = -1
        if (!mention || mention.query !== found.query) setActive(0)
        setMention(found)
    }

    const placeCaret = (start, end = start) => {
        requestAnimationFrame(() => {
            const el = areaRef.current
            if (!el) return
            el.focus()
            el.setSelectionRange(start, end)
        })
    }

    const wrap = (before, after, placeholder) => {
        const el = areaRef.current
        if (!el) return
        const s = el.selectionStart
        const e = el.selectionEnd
        if (text.slice(s - before.length, s) === before && text.slice(e, e + after.length) === after && e > s) {
            const next = text.slice(0, s - before.length) + text.slice(s, e) + text.slice(e + after.length)
            setText(next)
            placeCaret(s - before.length, e - before.length)
            return
        }
        const selected = text.slice(s, e) || placeholder
        setText(text.slice(0, s) + before + selected + after + text.slice(e))
        placeCaret(s + before.length, s + before.length + selected.length)
    }

    const insertLink = () => {
        const el = areaRef.current
        if (!el) return
        const s = el.selectionStart
        const e = el.selectionEnd
        const selected = text.slice(s, e)
        if (/^https:\/\//i.test(selected)) {
            const chunk = `[link text](${selected})`
            setText(text.slice(0, s) + chunk + text.slice(e))
            placeCaret(s + 1, s + 10)
            return
        }
        const label = selected || 'link text'
        const chunk = `[${label}](https://)`
        setText(text.slice(0, s) + chunk + text.slice(e))
        const urlStart = s + label.length + 3
        placeCaret(urlStart, urlStart + 8)
    }

    const quote = () => {
        const el = areaRef.current
        if (!el) return
        const s = el.selectionStart
        const e = el.selectionEnd
        const lineStart = text.lastIndexOf('\n', s - 1) + 1
        const segment = text.slice(lineStart, e)
        const quoted = segment
            .split('\n')
            .map((l) => (l.startsWith('> ') ? l : `> ${l}`))
            .join('\n')
        setText(text.slice(0, lineStart) + quoted + text.slice(e))
        placeCaret(lineStart + quoted.length)
    }

    const insertAt = (chunk) => {
        const el = areaRef.current
        const s = el ? el.selectionStart : text.length
        const e = el ? el.selectionEnd : text.length
        const needsSpace = s > 0 && !/\s/.test(text[s - 1])
        const piece = (needsSpace ? ' ' : '') + chunk
        const next = text.slice(0, s) + piece + text.slice(e)
        setText(next)
        setMode('write')
        placeCaret(s + piece.length)
        if (chunk === '@') {
            dismissedAt.current = -1
            setMention({ start: s + piece.length - 1, query: '' })
            setActive(0)
        }
    }

    const pickMember = (member) => {
        if (!mention) return
        const el = areaRef.current
        const caret = el ? el.selectionStart : text.length
        const chunk = `@${member.handle} `
        setText(text.slice(0, mention.start) + chunk + text.slice(caret))
        setMention(null)
        placeCaret(mention.start + chunk.length)
    }

    const tools = [
        { id: 'bold', label: 'Bold', keys: 'B', icon: PiTextBBold, run: () => wrap('**', '**', 'bold text') },
        { id: 'italic', label: 'Italic', keys: 'I', icon: PiTextItalicBold, run: () => wrap('_', '_', 'italic text') },
        { id: 'link', label: 'Link', keys: 'K', icon: PiLinkSimpleBold, run: insertLink },
        { id: 'code', label: 'Inline code', icon: PiCodeSimpleBold, run: () => wrap('`', '`', 'code') },
        { id: 'quote', label: 'Quote', icon: PiQuotesBold, run: quote },
        { id: 'mention', label: 'Mention someone', icon: PiAtBold, run: () => insertAt('@') },
    ]

    const onKeyDown = (event) => {
        if (listOpen) {
            if (event.key === 'Escape') {
                event.preventDefault()
                dismissedAt.current = mention.start
                setMention(null)
                return
            }
            if (results.length) {
                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setActive((i) => (i + 1) % results.length)
                    return
                }
                if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    setActive((i) => (i - 1 + results.length) % results.length)
                    return
                }
                if (event.key === 'Enter' || event.key === 'Tab') {
                    event.preventDefault()
                    pickMember(results[Math.min(active, results.length - 1)])
                    return
                }
            }
        }
        const mod = event.metaKey || event.ctrlKey
        if (!mod) return
        const key = event.key.toLowerCase()
        if (key === 'b') {
            event.preventDefault()
            wrap('**', '**', 'bold text')
        } else if (key === 'i') {
            event.preventDefault()
            wrap('_', '_', 'italic text')
        } else if (key === 'k') {
            event.preventDefault()
            insertLink()
        } else if (event.key === 'Enter') {
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
        }
    }

    const onSubmit = (event) => {
        event.preventDefault()
        if (!valid) return
        const notified = mentionedHandles(text)
        nextId.current += 1
        setReplies((list) => [
            ...list,
            { id: `r-${nextId.current}`, author: { ...ME, role: 'You' }, time: 'Just now', body: text.trim(), notified },
        ])
        setText('')
        setMention(null)
        setMode('write')
        setStatus(
            notified.length
                ? `Reply posted — ${notified.length} ${notified.length === 1 ? 'member' : 'members'} notified.`
                : 'Reply posted to the thread.',
        )
    }

    const listId = `${uid}-mentions`
    const activeOption = listOpen && results.length ? `${uid}-opt-${results[Math.min(active, results.length - 1)].handle}` : undefined

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative bg-[#fafafa] px-4 py-16 text-base font-normal text-[#1c1917] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <nav aria-label="Breadcrumb" className="font-mono text-xs uppercase tracking-[0.18em] text-[#78716c]">
                    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <li>
                            <a href="#agora-home" className="hover:text-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]">
                                Agora Forums
                            </a>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li>
                            <a href="#agora-design-systems" className="hover:text-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]">
                                Design Systems
                            </a>
                        </li>
                        <li aria-hidden="true">/</li>
                        <li aria-current="page" className="text-[#166534]">
                            Thread #4127
                        </li>
                    </ol>
                </nav>
                <h2 className="mt-5 max-w-3xl font-serif text-4xl font-normal leading-[1.05] tracking-tight text-[#1c1917] sm:text-5xl lg:text-6xl">
                    Add your voice to <em className="text-[#166534]">the discussion.</em>
                </h2>

                <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-12">
                    <div className="min-w-0">
                        <article className="rounded-2xl border border-[#e7e5e4] bg-white p-5 sm:p-7">
                            <div className="flex gap-4">
                                <div className="flex shrink-0 flex-col items-center gap-1 text-[#166534]">
                                    <PiArrowFatUpBold className="size-5" aria-hidden="true" />
                                    <span className="font-mono text-sm font-bold tabular-nums">
                                        <span className="sr-only">Score </span>128
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-serif text-2xl font-normal leading-snug text-[#1c1917] sm:text-3xl">
                                        Is it worth moving our colour tokens to OKLCH?
                                    </h3>
                                    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#78716c]">
                                        <img
                                            src={members[0].avatar}
                                            alt=""
                                            loading="lazy"
                                            className="size-6 rounded-full object-cover"
                                        />
                                        <span className="font-semibold text-[#1c1917]">@hana.okafor</span>
                                        <span aria-hidden="true">·</span>
                                        <span>posted 26 Sep 2026</span>
                                        <span aria-hidden="true">·</span>
                                        <span className="inline-flex items-center gap-1">
                                            <PiChatsCircleBold className="size-3.5" aria-hidden="true" />
                                            {replies.length + 13} replies
                                        </span>
                                    </p>
                                    <p className="mt-4 text-[15px] leading-relaxed text-[#44403c]">
                                        Our palette is 11 hues × 10 steps in HSL and the mid-tones never look equally
                                        bright. Has anyone migrated a production design system to OKLCH? Curious about
                                        tooling, browser fallbacks and whether designers actually noticed.
                                    </p>
                                </div>
                            </div>
                        </article>

                        <ol className="mt-6 space-y-4 border-l-2 border-[#e7e5e4] pl-4 sm:pl-6" aria-label="Replies">
                            <AnimatePresence initial={false}>
                                {replies.map((reply) => (
                                    <motion.li
                                        key={reply.id}
                                        initial={{ opacity: 0, x: reduceMotion ? 0 : -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        className="rounded-2xl border border-[#e7e5e4] bg-white p-4 sm:p-5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={reply.author.avatar}
                                                alt=""
                                                loading="lazy"
                                                className="size-9 shrink-0 rounded-full object-cover"
                                            />
                                            <p className="min-w-0 text-sm">
                                                <span className="font-semibold text-[#1c1917]">{reply.author.name}</span>{' '}
                                                <span className="text-[#78716c]">· {reply.author.role} · {reply.time}</span>
                                            </p>
                                        </div>
                                        <div className="mt-3 text-[15px] leading-relaxed text-[#292524]">
                                            <Markdown source={reply.body} />
                                        </div>
                                        {reply.notified.length > 0 && (
                                            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#78716c]">
                                                Notified {reply.notified.map((h) => `@${h}`).join(', ')}
                                            </p>
                                        )}
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ol>

                        <form noValidate className="mt-8" onSubmit={onSubmit}>
                            <div className="rounded-2xl border border-[#d6d3d1] bg-white shadow-[0_24px_48px_-32px_rgba(28,25,23,0.35)] focus-within:border-[#166534]">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e7e5e4] p-2">
                                    <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-1">
                                        {tools.map((tool) => {
                                            const Icon = tool.icon
                                            return (
                                                <button
                                                    key={tool.id}
                                                    type="button"
                                                    disabled={mode !== 'write'}
                                                    aria-label={tool.keys ? `${tool.label} (Ctrl or ⌘ + ${tool.keys})` : tool.label}
                                                    title={tool.label}
                                                    className="grid size-10 place-items-center rounded-lg text-[#44403c] transition-colors hover:bg-[#f0fdf4] hover:text-[#166534] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#166534] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                                                    onClick={tool.run}
                                                >
                                                    <Icon className="size-[18px]" aria-hidden="true" />
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div role="tablist" aria-label="Editor mode" className="flex rounded-lg bg-[#f5f5f4] p-1">
                                        {['write', 'preview'].map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                role="tab"
                                                aria-selected={mode === m}
                                                aria-controls={`${uid}-editor`}
                                                className={cn(
                                                    'min-h-9 rounded-md px-3 text-sm font-semibold capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#166534]',
                                                    mode === m ? 'bg-white text-[#166534] shadow-sm' : 'text-[#78716c] hover:text-[#1c1917]',
                                                )}
                                                onClick={() => {
                                                    setMode(m)
                                                    setMention(null)
                                                }}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div id={`${uid}-editor`} role="tabpanel" aria-label={mode === 'write' ? 'Write' : 'Preview'} className="relative">
                                    {mode === 'write' ? (
                                        <>
                                            <label htmlFor={`${uid}-area`} className="sr-only">
                                                Your reply (markdown supported)
                                            </label>
                                            <textarea
                                                ref={areaRef}
                                                id={`${uid}-area`}
                                                rows={7}
                                                value={text}
                                                placeholder="Share what worked for your team… type @ to mention someone"
                                                aria-autocomplete="list"
                                                aria-controls={listId}
                                                aria-activedescendant={activeOption}
                                                aria-describedby={`${uid}-hint`}
                                                aria-invalid={tooLong}
                                                className="block w-full resize-y rounded-none bg-transparent p-4 font-mono text-[15px] leading-7 text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none sm:p-5"
                                                onChange={(e) => {
                                                    setText(e.target.value)
                                                    syncMention(e.target.value, e.target.selectionStart)
                                                }}
                                                onSelect={(e) => syncMention(e.currentTarget.value, e.currentTarget.selectionStart)}
                                                onKeyDown={onKeyDown}
                                                onBlur={() => setMention(null)}
                                            />
                                        </>
                                    ) : (
                                        <div className="min-h-[196px] p-4 text-[15px] leading-relaxed text-[#292524] sm:p-5">
                                            {text.trim() ? (
                                                <Markdown source={text} />
                                            ) : (
                                                <p className="text-[#a8a29e]">Nothing to preview yet.</p>
                                            )}
                                        </div>
                                    )}

                                    <div
                                        id={listId}
                                        role="listbox"
                                        aria-label="Mention a member"
                                        hidden={!listOpen}
                                        className="absolute left-3 top-12 z-20 w-[min(20rem,calc(100%-1.5rem))] overflow-hidden rounded-xl border border-[#d6d3d1] bg-white p-1.5 shadow-[0_20px_40px_-16px_rgba(28,25,23,0.35)]"
                                    >
                                        <p className="px-2.5 pb-1.5 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#78716c]">
                                            {mention?.query ? `Members matching “${mention.query}”` : 'Mention a member'}
                                        </p>
                                        {results.length === 0 && (
                                            <p className="px-2.5 py-2 text-sm text-[#78716c]">No members match.</p>
                                        )}
                                        {results.map((m, i) => (
                                            <div
                                                key={m.handle}
                                                id={`${uid}-opt-${m.handle}`}
                                                role="option"
                                                aria-selected={i === active}
                                                className={cn(
                                                    'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-1.5',
                                                    i === active ? 'bg-[#f0fdf4] text-[#166534]' : 'text-[#1c1917]',
                                                )}
                                                onMouseDown={(e) => {
                                                    e.preventDefault()
                                                    pickMember(m)
                                                }}
                                                onMouseEnter={() => setActive(i)}
                                            >
                                                <img src={m.avatar} alt="" loading="lazy" className="size-8 shrink-0 rounded-full object-cover" />
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-sm font-semibold">{m.name}</span>
                                                    <span className="block truncate font-mono text-xs text-[#78716c]">@{m.handle}</span>
                                                </span>
                                                <span className="hidden shrink-0 text-[11px] text-[#78716c] sm:block">{m.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 border-t border-[#e7e5e4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                    <p
                                        id={`${uid}-hint`}
                                        className={cn('text-sm', tooLong ? 'text-[#b91c1c]' : valid ? 'text-[#166534]' : 'text-[#78716c]')}
                                    >
                                        {hint}
                                    </p>
                                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                                        <span
                                            className={cn('font-mono text-xs tabular-nums', tooLong ? 'font-bold text-[#b91c1c]' : 'text-[#78716c]')}
                                            aria-label={`${text.length} of ${MAX} characters`}
                                        >
                                            {text.length}/{MAX}
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={!valid}
                                            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#166534] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#14532d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534] disabled:cursor-not-allowed disabled:bg-[#d6d3d1] disabled:text-[#78716c]"
                                        >
                                            Post reply
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p role="status" className="mt-3 min-h-6 text-sm font-semibold text-[#166534]">
                                {status && (
                                    <span className="inline-flex items-center gap-2">
                                        <PiCheckBold className="size-4" aria-hidden="true" />
                                        {status}
                                    </span>
                                )}
                            </p>
                        </form>
                    </div>

                    <aside className="min-w-0 space-y-6 lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
                            <h3 className="font-serif text-xl font-normal text-[#1c1917]">Formatting</h3>
                            <dl className="mt-4 space-y-2.5 text-sm">
                                {[
                                    ['**bold**', <strong key="b" className="font-semibold">bold</strong>, '⌘B'],
                                    ['_italic_', <em key="i">italic</em>, '⌘I'],
                                    ['[text](url)', <span key="l" className="text-[#166534] underline">text</span>, '⌘K'],
                                    ['`code`', <code key="c" className="rounded bg-[#f5f5f4] px-1 font-mono text-[#166534]">code</code>, ''],
                                    ['@handle', <span key="m" className="rounded bg-[#dcfce7] px-1 font-semibold text-[#166534]">@handle</span>, ''],
                                ].map(([src, out, key]) => (
                                    <div key={src} className="flex items-center justify-between gap-3">
                                        <dt className="font-mono text-xs text-[#57534e]">{src}</dt>
                                        <dd className="flex items-center gap-2 text-[#1c1917]">
                                            {out}
                                            {key && (
                                                <kbd className="rounded border border-[#e7e5e4] bg-[#fafafa] px-1.5 font-mono text-[10px] text-[#78716c]">
                                                    {key}
                                                </kbd>
                                            )}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        <div className="rounded-2xl border border-[#e7e5e4] bg-white p-5">
                            <h3 className="font-serif text-xl font-normal text-[#1c1917]">In this thread</h3>
                            <ul className="mt-4 space-y-2">
                                {members.map((m) => (
                                    <li key={m.handle} className="flex items-center gap-3">
                                        <img src={m.avatar} alt="" loading="lazy" className="size-9 shrink-0 rounded-full object-cover" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-semibold text-[#1c1917]">{m.name}</span>
                                            <span className="block truncate text-xs text-[#78716c]">{m.role}</span>
                                        </span>
                                        <button
                                            type="button"
                                            aria-label={`Mention ${m.name}`}
                                            className="grid size-10 shrink-0 place-items-center rounded-full border border-[#e7e5e4] text-[#166534] transition-colors hover:border-[#166534] hover:bg-[#f0fdf4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
                                            onClick={() => insertAt(`@${m.handle} `)}
                                        >
                                            <PiAtBold className="size-4" aria-hidden="true" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default MentionToolbarPostComposer
