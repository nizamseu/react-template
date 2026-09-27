// TabbedComposerPostCreation

// PostComposer01 · Social Networks & Communities › Post Creation Widget

// Description:
// A three-mode post composer for the community app Hive. Under the heading "Say it, show
// it, or ask the hive." a white card offers Text / Photo / Poll tabs with a "Post to"
// hive picker, a character meter per field and a honey "Post" button that stays disabled
// until the draft is valid. Posts land at the top of a "Fresh in the hive" preview column
// (with votable polls). Use it at the top of a community feed or a group home page.

// Design:
// - Split layout: intro + composer card on the left, preview feed on the right
//   (lg:grid-cols-[1.15fr_0.85fr]); stacks to one column below lg
// - White #ffffff section, slate ink #0f172a / #475569, hairlines #e2e8f0, honey #f59e0b
//   (tab pill, meters, button) with honey-50 #fffbeb tints and a faint honeycomb SVG
// - Sans type with a heavy text-4xl → lg:text-6xl heading; rounded-[28px] card with a
//   soft slate shadow; inputs rounded-2xl; pills and chips fully rounded
// - Tab pill slides with a shared layoutId; poll options and new posts animate in/out
//   with AnimatePresence (y offsets removed for reduced motion)
// - Responsive: photo picker grid-cols-3 on every width, poll duration chips wrap, card
//   padding p-4 → sm:p-6; feed column follows the composer on mobile

// What it does:
// - tab state (Text / Photo / Poll) with Arrow/Home/End keys on the tablist; each tab
//   keeps its own draft; the hive <select> sets where the post goes
// - Validation: text 1–500 chars, a chosen photo with a caption up to 300, or a poll with a
//   question and 2–5 filled, distinct options (add/remove); the hint line explains what
//   is missing and the Post button is disabled until it is valid
// - Submitting (preventDefault) prepends a post to the preview list, clears that tab and
//   shows a 3 s "Posted to …" toast (timer cleared on unmount); posted polls take one
//   vote each (aria-pressed) and your own posts can be deleted

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TabbedComposerPostCreation from '@/TestComponent/PageSections/community/PostComposer01';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <TabbedComposerPostCreation />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiCheck,
    HiOutlineChartBar,
    HiOutlinePencilSquare,
    HiOutlinePhoto,
    HiOutlinePlus,
    HiOutlineTrash,
    HiXMark,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const TEXT_MAX = 500
const CAPTION_MAX = 300
const QUESTION_MAX = 140
const OPTION_MAX = 60
const MIN_OPTIONS = 2
const MAX_OPTIONS = 5

const ME = {
    name: 'Priya Raman',
    handle: '@priya.builds',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
}

const hives = ['Design Guild', 'Frontend Friday', 'Remote Parents Club']

const tabs = [
    { id: 'text', label: 'Text', icon: HiOutlinePencilSquare },
    { id: 'photo', label: 'Photo', icon: HiOutlinePhoto },
    { id: 'poll', label: 'Poll', icon: HiOutlineChartBar },
]

const durations = ['1 day', '3 days', '7 days']

const photos = [
    {
        id: 'sketch',
        src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=800&q=80',
        alt: 'Hand sketching an interface on a tablet with a stylus',
    },
    {
        id: 'stickies',
        src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
        alt: 'Team arranging sticky notes on a glass wall during planning',
    },
    {
        id: 'desk',
        src: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80',
        alt: 'Desk flat lay with a laptop, notebook and a cup of coffee',
    },
    {
        id: 'latte',
        src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
        alt: 'Two latte art cups on a table beside potted plants',
    },
    {
        id: 'cafe',
        src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
        alt: 'Friends meeting around laptops in a bright cafe',
    },
    {
        id: 'notes',
        src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
        alt: 'Hand writing notes in a notebook next to a coffee',
    },
]

const seedPosts = [
    {
        id: 'seed-2',
        type: 'poll',
        author: 'Tomás Ibarra',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        hive: 'Frontend Friday',
        time: '42 min',
        question: 'Where do your design tokens live right now?',
        duration: '3 days',
        options: [
            { id: 'a', label: 'Figma variables only', votes: 38 },
            { id: 'b', label: 'JSON in the repo', votes: 71 },
            { id: 'c', label: 'A token platform', votes: 19 },
        ],
        voted: null,
        mine: false,
    },
    {
        id: 'seed-1',
        type: 'text',
        author: 'Amara Nwosu',
        avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80',
        hive: 'Design Guild',
        time: '2 h',
        text: 'Wrapped our first handoff without a single “which blue is this?” message. Naming the tokens after intent, not colour, was the whole trick.',
        mine: false,
    },
]

// pointy-top hexagon, radius 28
const HEX = 'M0 -28 L24.25 -14 L24.25 14 L0 28 L-24.25 14 L-24.25 -14 Z'
const combCells = Array.from({ length: 24 }, (_, i) => {
    const row = Math.floor(i / 6)
    const col = i % 6
    return { key: i, x: col * 48.5 + (row % 2) * 24.25, y: row * 42, filled: [3, 8, 10, 15, 21].includes(i) }
})

function getProblem(tab, draft) {
    if (tab === 'text') {
        if (!draft.text.trim()) return 'Write something to post.'
        if (draft.text.length > TEXT_MAX) return `Trim ${draft.text.length - TEXT_MAX} characters to post.`
        return null
    }
    if (tab === 'photo') {
        if (!draft.photoId) return 'Pick a photo to share.'
        if (draft.caption.length > CAPTION_MAX) return `Caption is ${draft.caption.length - CAPTION_MAX} characters too long.`
        return null
    }
    if (!draft.question.trim()) return 'Ask a question for your poll.'
    const empty = draft.options.findIndex((o) => !o.value.trim())
    if (empty >= 0) return `Fill in option ${empty + 1}.`
    const seen = new Set()
    for (const o of draft.options) {
        const key = o.value.trim().toLowerCase()
        if (seen.has(key)) return 'Each option needs to be different.'
        seen.add(key)
    }
    return null
}

function Meter({ count, max, id }) {
    const over = count > max
    const pct = Math.min(100, (count / max) * 100)
    return (
        <div id={id} className="flex items-center gap-3">
            <span className="relative h-1.5 w-20 overflow-hidden rounded-full bg-[#f1f5f9]" aria-hidden="true">
                <span
                    className={cn('absolute inset-y-0 left-0 rounded-full', over ? 'bg-[#e11d48]' : 'bg-[#f59e0b]')}
                    style={{ width: `${pct}%` }}
                />
            </span>
            <span className={cn('font-mono text-xs tabular-nums', over ? 'font-semibold text-[#e11d48]' : 'text-[#64748b]')}>
                {count} / {max}
            </span>
        </div>
    )
}

export function TabbedComposerPostCreation({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const nextId = useRef(3)

    const [tab, setTab] = useState('text')
    const [hive, setHive] = useState(hives[0])
    const [text, setText] = useState('')
    const [photoId, setPhotoId] = useState(null)
    const [caption, setCaption] = useState('')
    const [question, setQuestion] = useState('')
    const [options, setOptions] = useState([
        { id: 'opt-1', value: '' },
        { id: 'opt-2', value: '' },
    ])
    const [duration, setDuration] = useState(durations[1])
    const [posts, setPosts] = useState(seedPosts)
    const [toast, setToast] = useState(null)

    useEffect(() => {
        if (!toast) return undefined
        const id = setTimeout(() => setToast(null), 3200)
        return () => clearTimeout(id)
    }, [toast])

    const problem = getProblem(tab, { text, photoId, caption, question, options })
    const valid = problem === null

    const makeId = (prefix) => {
        nextId.current += 1
        return `${prefix}-${nextId.current}`
    }

    const onTabKey = (event) => {
        const index = tabs.findIndex((t) => t.id === tab)
        let next = null
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = tabs.length - 1
        if (next === null) return
        event.preventDefault()
        setTab(tabs[next].id)
        document.getElementById(`${uid}-tab-${tabs[next].id}`)?.focus()
    }

    const updateOption = (id, value) => setOptions((list) => list.map((o) => (o.id === id ? { ...o, value } : o)))
    const addOption = () => {
        if (options.length >= MAX_OPTIONS) return
        setOptions((list) => [...list, { id: makeId('opt'), value: '' }])
    }
    const removeOption = (id) => {
        if (options.length <= MIN_OPTIONS) return
        setOptions((list) => list.filter((o) => o.id !== id))
    }

    const onSubmit = (event) => {
        event.preventDefault()
        if (!valid) return
        const base = { id: makeId('post'), author: ME.name, avatar: ME.avatar, hive, time: 'Just now', mine: true }
        let post
        if (tab === 'text') {
            post = { ...base, type: 'text', text: text.trim() }
            setText('')
        } else if (tab === 'photo') {
            const photo = photos.find((p) => p.id === photoId)
            post = { ...base, type: 'photo', src: photo.src, alt: photo.alt, caption: caption.trim() }
            setPhotoId(null)
            setCaption('')
        } else {
            post = {
                ...base,
                type: 'poll',
                question: question.trim(),
                duration,
                voted: null,
                options: options.map((o) => ({ id: o.id, label: o.value.trim(), votes: 0 })),
            }
            setQuestion('')
            setOptions([
                { id: makeId('opt'), value: '' },
                { id: makeId('opt'), value: '' },
            ])
        }
        setPosts((list) => [post, ...list])
        setToast(`Posted to ${hive}`)
    }

    const vote = (postId, optionId) => {
        setPosts((list) =>
            list.map((p) => {
                if (p.id !== postId || p.voted) return p
                return {
                    ...p,
                    voted: optionId,
                    options: p.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)),
                }
            }),
        )
    }

    const removePost = (postId) => setPosts((list) => list.filter((p) => p.id !== postId))

    const hintId = `${uid}-hint`
    const rise = reduceMotion ? 0 : 12

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <svg
                aria-hidden="true"
                viewBox="-30 -30 320 190"
                className="pointer-events-none absolute -right-16 -top-6 -z-10 w-[460px] text-[#f59e0b] sm:w-[620px]"
            >
                {combCells.map((cell) => (
                    <path
                        key={cell.key}
                        d={HEX}
                        transform={`translate(${cell.x} ${cell.y}) scale(0.92)`}
                        fill={cell.filled ? 'currentColor' : 'none'}
                        fillOpacity={cell.filled ? 0.14 : 0}
                        stroke="currentColor"
                        strokeOpacity="0.22"
                        strokeWidth="1.2"
                    />
                ))}
            </svg>

            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
                <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#fffbeb] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#b45309]">
                        <span className="size-1.5 rounded-full bg-[#f59e0b]" aria-hidden="true" />
                        Hive · Create
                    </p>
                    <h2 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.02] tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                        Say it, show it, or <span className="text-[#f59e0b]">ask the hive.</span>
                    </h2>
                    <p className="mt-5 max-w-lg text-base leading-relaxed text-[#475569]">
                        One composer for every kind of post. Switch tabs freely — each keeps its own draft
                        until you hit Post.
                    </p>

                    <form
                        noValidate
                        className="mt-10 rounded-[28px] border border-[#e2e8f0] bg-white p-4 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.25)] sm:p-6"
                        onSubmit={onSubmit}
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <img
                                src={ME.avatar}
                                alt={`${ME.name}, your profile photo`}
                                loading="lazy"
                                className="size-11 shrink-0 rounded-full object-cover ring-2 ring-[#fde68a]"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-[#0f172a]">{ME.name}</p>
                                <p className="truncate text-xs text-[#64748b]">{ME.handle}</p>
                            </div>
                            <label className="flex items-center gap-2 text-xs font-medium text-[#475569]">
                                <span>Post to</span>
                                <select
                                    value={hive}
                                    className="min-h-10 max-w-[11rem] rounded-full border border-[#e2e8f0] bg-[#f8fafc] px-3 text-sm font-semibold text-[#0f172a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                    onChange={(e) => setHive(e.target.value)}
                                >
                                    {hives.map((h) => (
                                        <option key={h} value={h}>
                                            {h}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div
                            role="tablist"
                            aria-label="Post type"
                            className="mt-5 grid grid-cols-3 gap-1 rounded-full bg-[#f1f5f9] p-1"
                            onKeyDown={onTabKey}
                        >
                            {tabs.map((t) => {
                                const active = tab === t.id
                                const Icon = t.icon
                                return (
                                    <button
                                        key={t.id}
                                        id={`${uid}-tab-${t.id}`}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        aria-controls={`${uid}-panel`}
                                        tabIndex={active ? 0 : -1}
                                        className={cn(
                                            'relative flex min-h-10 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                            active ? 'text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a]',
                                        )}
                                        onClick={() => setTab(t.id)}
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId={`${uid}-pill`}
                                                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                                className="absolute inset-0 rounded-full bg-white shadow-[0_4px_14px_-6px_rgba(15,23,42,0.35)] ring-1 ring-[#fcd34d]"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <Icon className="relative size-4" aria-hidden="true" />
                                        <span className="relative">{t.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <div
                            id={`${uid}-panel`}
                            role="tabpanel"
                            aria-labelledby={`${uid}-tab-${tab}`}
                            className="mt-5"
                        >
                            {tab === 'text' && (
                                <div>
                                    <label htmlFor={`${uid}-text`} className="sr-only">
                                        Post text
                                    </label>
                                    <textarea
                                        id={`${uid}-text`}
                                        rows={5}
                                        value={text}
                                        placeholder="What’s buzzing, Priya?"
                                        aria-describedby={`${uid}-text-count ${hintId}`}
                                        aria-invalid={text.length > TEXT_MAX}
                                        className={cn(
                                            'block w-full resize-none rounded-2xl border bg-[#f8fafc] p-4 text-base leading-relaxed text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-2',
                                            text.length > TEXT_MAX
                                                ? 'border-[#fda4af] focus-visible:outline-[#e11d48]'
                                                : 'border-[#e2e8f0] focus-visible:outline-[#f59e0b]',
                                        )}
                                        onChange={(e) => setText(e.target.value)}
                                    />
                                    <div className="mt-3 flex items-center justify-end">
                                        <Meter id={`${uid}-text-count`} count={text.length} max={TEXT_MAX} />
                                    </div>
                                </div>
                            )}

                            {tab === 'photo' && (
                                <div>
                                    <p id={`${uid}-photo-label`} className="text-sm font-semibold text-[#0f172a]">
                                        Choose from your recent uploads
                                    </p>
                                    <div
                                        role="group"
                                        aria-labelledby={`${uid}-photo-label`}
                                        className="mt-3 grid grid-cols-3 gap-2 sm:gap-3"
                                    >
                                        {photos.map((p) => {
                                            const active = photoId === p.id
                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    aria-pressed={active}
                                                    aria-label={p.alt}
                                                    className={cn(
                                                        'group relative aspect-square overflow-hidden rounded-2xl bg-[#f1f5f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                                        active && 'ring-4 ring-[#f59e0b] ring-offset-2',
                                                    )}
                                                    onClick={() => setPhotoId(active ? null : p.id)}
                                                >
                                                    <img
                                                        src={p.src}
                                                        alt=""
                                                        loading="lazy"
                                                        className={cn(
                                                            'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
                                                            photoId && !active && 'opacity-60',
                                                        )}
                                                    />
                                                    {active && (
                                                        <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-[#f59e0b] text-white shadow">
                                                            <HiCheck className="size-4" aria-hidden="true" />
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <label htmlFor={`${uid}-caption`} className="mt-5 block text-sm font-semibold text-[#0f172a]">
                                        Caption <span className="font-normal text-[#94a3b8]">(optional)</span>
                                    </label>
                                    <textarea
                                        id={`${uid}-caption`}
                                        rows={2}
                                        value={caption}
                                        placeholder="Tell the story behind it…"
                                        aria-describedby={`${uid}-caption-count ${hintId}`}
                                        aria-invalid={caption.length > CAPTION_MAX}
                                        className={cn(
                                            'mt-2 block w-full resize-none rounded-2xl border bg-[#f8fafc] p-4 text-base text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-2',
                                            caption.length > CAPTION_MAX
                                                ? 'border-[#fda4af] focus-visible:outline-[#e11d48]'
                                                : 'border-[#e2e8f0] focus-visible:outline-[#f59e0b]',
                                        )}
                                        onChange={(e) => setCaption(e.target.value)}
                                    />
                                    <div className="mt-3 flex justify-end">
                                        <Meter id={`${uid}-caption-count`} count={caption.length} max={CAPTION_MAX} />
                                    </div>
                                </div>
                            )}

                            {tab === 'poll' && (
                                <div>
                                    <label htmlFor={`${uid}-question`} className="block text-sm font-semibold text-[#0f172a]">
                                        Question
                                    </label>
                                    <input
                                        id={`${uid}-question`}
                                        type="text"
                                        value={question}
                                        maxLength={QUESTION_MAX}
                                        placeholder="e.g. Which Friday talk should we record?"
                                        aria-describedby={`${uid}-question-count ${hintId}`}
                                        className="mt-2 block min-h-12 w-full rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-4 text-base text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                        onChange={(e) => setQuestion(e.target.value)}
                                    />
                                    <div className="mt-2 flex justify-end">
                                        <Meter id={`${uid}-question-count`} count={question.length} max={QUESTION_MAX} />
                                    </div>

                                    <fieldset className="mt-4">
                                        <legend className="text-sm font-semibold text-[#0f172a]">
                                            Options <span className="font-normal text-[#94a3b8]">({options.length}/{MAX_OPTIONS})</span>
                                        </legend>
                                        <ul className="mt-2 space-y-2">
                                            <AnimatePresence initial={false}>
                                                {options.map((o, i) => (
                                                    <motion.li
                                                        key={o.id}
                                                        layout={!reduceMotion}
                                                        initial={{ opacity: 0, y: -rise }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -rise }}
                                                        transition={{ duration: 0.22 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <span
                                                            className="grid size-8 shrink-0 place-items-center rounded-full bg-[#fffbeb] font-mono text-xs font-bold text-[#b45309]"
                                                            aria-hidden="true"
                                                        >
                                                            {String.fromCharCode(65 + i)}
                                                        </span>
                                                        <label htmlFor={`${uid}-${o.id}`} className="sr-only">
                                                            Option {i + 1}
                                                        </label>
                                                        <input
                                                            id={`${uid}-${o.id}`}
                                                            type="text"
                                                            value={o.value}
                                                            maxLength={OPTION_MAX}
                                                            placeholder={`Option ${i + 1}`}
                                                            className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 text-base text-[#0f172a] placeholder:text-[#94a3b8] focus:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                                            onChange={(e) => updateOption(o.id, e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            disabled={options.length <= MIN_OPTIONS}
                                                            aria-label={`Remove option ${i + 1}`}
                                                            className="grid size-10 shrink-0 place-items-center rounded-full text-[#64748b] transition-colors hover:bg-[#fff1f2] hover:text-[#e11d48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#64748b]"
                                                            onClick={() => removeOption(o.id)}
                                                        >
                                                            <HiXMark className="size-5" aria-hidden="true" />
                                                        </button>
                                                    </motion.li>
                                                ))}
                                            </AnimatePresence>
                                        </ul>
                                        <button
                                            type="button"
                                            disabled={options.length >= MAX_OPTIONS}
                                            className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-dashed border-[#f59e0b] px-4 text-sm font-semibold text-[#b45309] transition-colors hover:bg-[#fffbeb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b] disabled:cursor-not-allowed disabled:border-[#cbd5e1] disabled:text-[#94a3b8] disabled:hover:bg-transparent"
                                            onClick={addOption}
                                        >
                                            <HiOutlinePlus className="size-4" aria-hidden="true" />
                                            {options.length >= MAX_OPTIONS ? 'Five options max' : 'Add option'}
                                        </button>
                                    </fieldset>

                                    <div className="mt-5">
                                        <p id={`${uid}-duration`} className="text-sm font-semibold text-[#0f172a]">
                                            Poll closes after
                                        </p>
                                        <div role="group" aria-labelledby={`${uid}-duration`} className="mt-2 flex flex-wrap gap-2">
                                            {durations.map((d) => (
                                                <button
                                                    key={d}
                                                    type="button"
                                                    aria-pressed={duration === d}
                                                    className={cn(
                                                        'min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                                        duration === d
                                                            ? 'border-[#0f172a] bg-[#0f172a] text-white'
                                                            : 'border-[#e2e8f0] text-[#475569] hover:border-[#0f172a]',
                                                    )}
                                                    onClick={() => setDuration(d)}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 border-t border-[#f1f5f9] pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <p
                                id={hintId}
                                aria-live="polite"
                                className={cn(
                                    'flex items-center gap-2 text-sm',
                                    valid ? 'font-semibold text-[#15803d]' : 'text-[#64748b]',
                                )}
                            >
                                <span
                                    className={cn('size-2 shrink-0 rounded-full', valid ? 'bg-[#22c55e]' : 'bg-[#cbd5e1]')}
                                    aria-hidden="true"
                                />
                                {valid ? `Ready to post to ${hive}` : problem}
                            </p>
                            <button
                                type="submit"
                                disabled={!valid}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f59e0b] px-7 text-sm font-bold text-[#0f172a] shadow-[0_12px_24px_-12px_rgba(245,158,11,0.9)] transition-all hover:bg-[#fbbf24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f172a] disabled:cursor-not-allowed disabled:bg-[#e2e8f0] disabled:text-[#94a3b8] disabled:shadow-none"
                            >
                                Post {tab === 'poll' ? 'poll' : tab === 'photo' ? 'photo' : ''}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="min-w-0 lg:pt-4">
                    <div className="flex items-end justify-between gap-4 border-b border-[#e2e8f0] pb-4">
                        <h3 className="text-xl font-bold tracking-tight text-[#0f172a]">Fresh in the hive</h3>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#94a3b8]">
                            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                        </p>
                    </div>

                    <div aria-live="polite" className="min-h-0">
                        <AnimatePresence>
                            {toast && (
                                <motion.p
                                    key="toast"
                                    initial={{ opacity: 0, y: -rise }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-4 flex items-center gap-2 rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white"
                                >
                                    <span className="grid size-6 place-items-center rounded-full bg-[#f59e0b] text-[#0f172a]">
                                        <HiCheck className="size-4" aria-hidden="true" />
                                    </span>
                                    {toast}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <ul className="mt-4 space-y-4">
                        <AnimatePresence initial={false}>
                            {posts.map((post) => {
                                const total = post.type === 'poll' ? post.options.reduce((s, o) => s + o.votes, 0) : 0
                                return (
                                    <motion.li
                                        key={post.id}
                                        layout={!reduceMotion}
                                        initial={{ opacity: 0, y: -rise * 2, scale: reduceMotion ? 1 : 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                    >
                                        <article
                                            className={cn(
                                                'rounded-3xl border bg-white p-4 sm:p-5',
                                                post.mine ? 'border-[#fcd34d] bg-[#fffdf5]' : 'border-[#e2e8f0]',
                                            )}
                                        >
                                            <header className="flex items-center gap-3">
                                                <img
                                                    src={post.avatar}
                                                    alt=""
                                                    loading="lazy"
                                                    className="size-10 shrink-0 rounded-full object-cover"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-semibold text-[#0f172a]">{post.author}</p>
                                                    <p className="truncate text-xs text-[#64748b]">
                                                        in <span className="font-semibold text-[#b45309]">{post.hive}</span> · {post.time}
                                                    </p>
                                                </div>
                                                {post.mine && (
                                                    <button
                                                        type="button"
                                                        aria-label="Delete this post"
                                                        className="grid size-10 shrink-0 place-items-center rounded-full text-[#94a3b8] transition-colors hover:bg-[#fff1f2] hover:text-[#e11d48] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]"
                                                        onClick={() => removePost(post.id)}
                                                    >
                                                        <HiOutlineTrash className="size-4" aria-hidden="true" />
                                                    </button>
                                                )}
                                            </header>

                                            {post.type === 'text' && (
                                                <p className="mt-3 whitespace-pre-line break-words text-[15px] leading-relaxed text-[#1e293b]">
                                                    {post.text}
                                                </p>
                                            )}

                                            {post.type === 'photo' && (
                                                <div className="mt-3">
                                                    <img
                                                        src={post.src}
                                                        alt={post.alt}
                                                        loading="lazy"
                                                        className="aspect-[4/3] w-full rounded-2xl object-cover"
                                                    />
                                                    {post.caption && (
                                                        <p className="mt-3 break-words text-[15px] leading-relaxed text-[#1e293b]">
                                                            {post.caption}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {post.type === 'poll' && (
                                                <div className="mt-3">
                                                    <p className="break-words text-[15px] font-semibold leading-snug text-[#0f172a]">
                                                        {post.question}
                                                    </p>
                                                    <div className="mt-3 space-y-2">
                                                        {post.options.map((o) => {
                                                            const pct = total ? Math.round((o.votes / total) * 100) : 0
                                                            const mineVote = post.voted === o.id
                                                            return (
                                                                <button
                                                                    key={o.id}
                                                                    type="button"
                                                                    aria-pressed={mineVote}
                                                                    disabled={Boolean(post.voted)}
                                                                    className={cn(
                                                                        'relative flex min-h-11 w-full items-center justify-between gap-3 overflow-hidden rounded-xl border px-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f59e0b]',
                                                                        post.voted
                                                                            ? 'cursor-default border-transparent bg-[#f8fafc]'
                                                                            : 'border-[#e2e8f0] hover:border-[#f59e0b]',
                                                                    )}
                                                                    onClick={() => vote(post.id, o.id)}
                                                                >
                                                                    {post.voted && (
                                                                        <motion.span
                                                                            aria-hidden="true"
                                                                            initial={{ width: 0 }}
                                                                            animate={{ width: `${pct}%` }}
                                                                            transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                                                                            className={cn(
                                                                                'absolute inset-y-0 left-0',
                                                                                mineVote ? 'bg-[#fde68a]' : 'bg-[#f1f5f9]',
                                                                            )}
                                                                        />
                                                                    )}
                                                                    <span className="relative flex min-w-0 items-center gap-2 font-medium text-[#0f172a]">
                                                                        {mineVote && <HiCheck className="size-4 shrink-0 text-[#b45309]" aria-hidden="true" />}
                                                                        <span className="truncate">{o.label}</span>
                                                                    </span>
                                                                    {post.voted && (
                                                                        <span className="relative font-mono text-xs font-semibold tabular-nums text-[#475569]">
                                                                            {pct}%
                                                                        </span>
                                                                    )}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                    <p className="mt-3 text-xs text-[#64748b]">
                                                        {total} {total === 1 ? 'vote' : 'votes'} · closes in {post.duration}
                                                        {!post.voted && ' · tap an option to vote'}
                                                    </p>
                                                </div>
                                            )}
                                        </article>
                                    </motion.li>
                                )
                            })}
                        </AnimatePresence>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default TabbedComposerPostCreation
