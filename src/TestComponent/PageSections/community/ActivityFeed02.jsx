// ThreadedDiscussionActivityFeed

// ActivityFeed02 · Social Networks & Communities › Activity / Community Feed

// Description:
// A threaded discussion page for Agora Forums. The opening post "How do you keep
// volunteers coming back after their first repair café?" has a vote column, tags and
// stats, then a nested reply tree with indentation lines, up / down votes, collapsible
// threads and an inline "Reply" box at every level, plus a Best / New sort and a top-level
// comment form. Use it for forums, Q&A communities or long-form discussion feeds.

// Design:
// - Off-white #fafafa canvas, ink #171717, forest #166534 for upvotes, OP badges, links,
//   focus rings and hovered thread lines; muted rose #9f1239 for downvotes; #e5e5e5 rules
// - Opening post is a white rounded-2xl card with a 56px vote column; its title is serif
//   text-2xl → md:text-4xl; meta and breadcrumbs use small mono caps
// - Replies: 32px avatars (28px when nested), a 1px thread line under each avatar that
//   turns forest and thicker on hover (click to collapse), pill action buttons (min 40px)
// - Motion: new replies and expanded threads fade/slide in, the score bumps on vote;
//   reduced motion keeps only fades
// - Responsive: each level indents by its avatar column (about 40px), keeping 200px+ of
//   text at 360px; the opening post's vote row sits under the text on base and becomes a
//   left vote column from sm

// What it does:
// - votes map (-1 / 0 / +1 per id) drives each score; arrows are aria-pressed toggles and
//   clicking the opposite arrow flips the vote
// - Collapse via the [–] button or the thread line hides a reply and its children and
//   shows "n replies hidden"; Best sorts by score, New by age, at every level
// - Reply opens an inline textarea (controlled, 2-500 characters, errors shown inline);
//   posting adds your reply under that comment with an automatic upvote; the top-level
//   form works the same way; relative times tick every 60 s after mount
// - Tag chips and author names link to #agora-* anchors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ThreadedDiscussionActivityFeed from '@/TestComponent/PageSections/community/ActivityFeed02';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <ThreadedDiscussionActivityFeed />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuArrowBigDown, LuArrowBigUp, LuMessageSquare, LuMinus, LuPlus, LuReply } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const ME = {
    name: 'Sofia Reyes',
    img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
}

const people = {
    hannah: { name: 'Hannah Obi', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80' },
    marco: { name: 'Marco Bianchi', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80' },
    priya: { name: 'Priya Nair', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80' },
    ruth: { name: 'Ruth Adeyemi', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80' },
    tobias: { name: 'Tobias Lind', img: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=400&q=80' },
    ken: { name: 'Ken Watanabe', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
}

const initialComments = [
    {
        id: 'a1',
        parent: null,
        by: 'marco',
        minutesAgo: 241,
        score: 142,
        text: 'We started giving every first-timer a “fixer buddy” for their first three sessions. Retention went from roughly 30% to 70% in one season.',
    },
    {
        id: 'a1r1',
        parent: 'a1',
        by: 'hannah',
        op: true,
        minutesAgo: 198,
        score: 38,
        text: 'Did the buddies need any training, or was it informal?',
    },
    {
        id: 'a1r1r1',
        parent: 'a1r1',
        by: 'marco',
        minutesAgo: 185,
        score: 51,
        text: 'Informal, but we wrote a one-page “how to be a buddy” sheet. Rule one: don’t grab the screwdriver.',
    },
    {
        id: 'a1r2',
        parent: 'a1',
        by: 'priya',
        minutesAgo: 122,
        score: 17,
        text: 'Same experience in Leeds. Pairing people matters far more than perks or T-shirts.',
    },
    {
        id: 'a2',
        parent: null,
        by: 'ruth',
        mod: true,
        minutesAgo: 236,
        score: 96,
        text: 'Log every repair with the volunteer’s name on a board by the door. People come back to see “toaster: fixed — Ana” in their handwriting.',
    },
    {
        id: 'a2r1',
        parent: 'a2',
        by: 'tobias',
        minutesAgo: 64,
        score: 12,
        text: 'Ours is a chalkboard and the kids add drawings of each gadget. It has become the most photographed wall in the building.',
    },
    {
        id: 'a3',
        parent: null,
        by: 'ken',
        minutesAgo: 58,
        score: 9,
        text: 'Honest answer: good coffee and a proper lunch break. Nobody wants to fix kettles on an empty stomach.',
    },
]

function rel(minutes) {
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return `${Math.floor(minutes / 1440)}d ago`
}

function validate(text) {
    const clean = text.trim()
    if (clean.length < 2) return 'Write at least 2 characters.'
    if (clean.length > 500) return 'Replies are limited to 500 characters.'
    return ''
}

function VoteButtons({ id, score, vote, onVote, vertical, label }) {
    return (
        <div className={cn('flex items-center', vertical ? 'flex-row gap-1 sm:flex-col sm:gap-0.5' : 'gap-0.5')}>
            <button
                type="button"
                aria-pressed={vote === 1}
                aria-label={`Upvote ${label}`}
                className={cn(
                    'grid size-10 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#166534]',
                    vote === 1 ? 'bg-[#dcfce7] text-[#166534]' : 'text-[#737373] hover:bg-[#f0fdf4] hover:text-[#166534]',
                )}
                onClick={() => onVote(id, 1)}
            >
                <LuArrowBigUp aria-hidden="true" className={cn('size-5', vote === 1 && 'fill-current')} />
            </button>
            <motion.span
                key={score}
                initial={{ y: -3, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
                className={cn(
                    'min-w-8 text-center font-mono text-sm font-bold tabular-nums',
                    vote === 1 && 'text-[#166534]',
                    vote === -1 && 'text-[#9f1239]',
                    vote === 0 && 'text-[#262626]',
                )}
            >
                {score}
            </motion.span>
            <button
                type="button"
                aria-pressed={vote === -1}
                aria-label={`Downvote ${label}`}
                className={cn(
                    'grid size-10 place-items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#166534]',
                    vote === -1 ? 'bg-[#ffe4e6] text-[#9f1239]' : 'text-[#737373] hover:bg-[#fff1f2] hover:text-[#9f1239]',
                )}
                onClick={() => onVote(id, -1)}
            >
                <LuArrowBigDown aria-hidden="true" className={cn('size-5', vote === -1 && 'fill-current')} />
            </button>
        </div>
    )
}

function ReplyBox({ idBase, value, error, onChange, onCancel, onSubmit, target }) {
    return (
        <form noValidate className="mt-3" onSubmit={onSubmit}>
            <label htmlFor={`${idBase}-reply`} className="sr-only">
                Reply to {target}
            </label>
            <textarea
                id={`${idBase}-reply`}
                autoFocus
                rows={3}
                value={value}
                placeholder={`Reply to ${target}…`}
                aria-invalid={Boolean(error)}
                aria-describedby={`${idBase}-reply-msg`}
                className="block w-full resize-y rounded-xl border border-[#d4d4d4] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#166534] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#166534]/15"
                onChange={(event) => onChange(event.target.value)}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p
                    id={`${idBase}-reply-msg`}
                    aria-live="polite"
                    className={cn('text-xs', error ? 'font-semibold text-[#9f1239]' : 'text-[#737373]')}
                >
                    {error || `${value.trim().length}/500`}
                </p>
                <div className="flex gap-2">
                    <button
                        type="button"
                        className="min-h-10 rounded-full px-4 text-sm font-semibold text-[#525252] hover:bg-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="min-h-10 rounded-full bg-[#166534] px-4 text-sm font-semibold text-white hover:bg-[#14532d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
                    >
                        Reply
                    </button>
                </div>
            </div>
        </form>
    )
}

function CommentNode({ comment, depth, ctx }) {
    const reduceMotion = ctx.reduceMotion
    const author = comment.mine ? ME : people[comment.by]
    const children = ctx.childrenOf(comment.id)
    const collapsed = ctx.collapsed[comment.id]
    const vote = ctx.votes[comment.id] ?? 0
    const score = comment.score + vote
    const hidden = ctx.countDescendants(comment.id)
    const idBase = `${ctx.baseId}-${comment.id}`

    return (
        <motion.li
            layout={reduceMotion ? false : 'position'}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <div className="flex gap-2.5 sm:gap-3">
                <div className="relative flex shrink-0 flex-col items-center">
                    <img
                        src={author.img}
                        alt=""
                        loading="lazy"
                        className={cn('rounded-full object-cover', depth === 0 ? 'size-8' : 'size-7')}
                    />
                    {!collapsed && (
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label={`Collapse thread by ${author.name}`}
                            className="group/line absolute bottom-0 top-10 flex w-5 justify-center focus-visible:outline-2 focus-visible:outline-[#166534]"
                            onClick={() => ctx.toggleCollapse(comment.id)}
                        >
                            <span className="block h-full w-px bg-[#d4d4d4] transition-all group-hover/line:w-0.5 group-hover/line:bg-[#166534]" />
                        </button>
                    )}
                </div>

                <div className="min-w-0 flex-1 pb-1">
                    <div className="flex min-h-8 flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
                        <a
                            href={`#agora-user-${comment.mine ? 'sofia' : comment.by}`}
                            className="rounded text-sm font-bold text-[#171717] hover:text-[#166534] focus-visible:outline-2 focus-visible:outline-[#166534]"
                        >
                            {author.name}
                        </a>
                        {comment.op && (
                            <span className="rounded bg-[#166534] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                                OP
                            </span>
                        )}
                        {comment.mod && (
                            <span className="rounded border border-[#166534] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                                Mod
                            </span>
                        )}
                        {comment.mine && (
                            <span className="rounded bg-[#dcfce7] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#166534]">
                                You
                            </span>
                        )}
                        <span className="font-mono text-[#737373]">{rel(ctx.ageOf(comment))}</span>
                        {collapsed && (
                            <span className="font-mono text-[#737373]">
                                · {score} pts
                            </span>
                        )}
                    </div>

                    {collapsed ? (
                        <button
                            type="button"
                            aria-expanded={false}
                            className="mt-1 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 text-xs font-semibold text-[#166534] hover:border-[#166534] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
                            onClick={() => ctx.toggleCollapse(comment.id)}
                        >
                            <LuPlus aria-hidden="true" className="size-3.5" />
                            {hidden > 0 ? `Show thread · ${hidden} ${hidden === 1 ? 'reply' : 'replies'} hidden` : 'Show comment'}
                        </button>
                    ) : (
                        <>
                            <p className="mt-1 text-[15px] leading-relaxed text-[#262626]">{comment.text}</p>
                            <div className="-ml-2 mt-1 flex flex-wrap items-center gap-1">
                                <VoteButtons
                                    id={comment.id}
                                    score={score}
                                    vote={vote}
                                    label={`comment by ${author.name}`}
                                    onVote={ctx.onVote}
                                />
                                <button
                                    type="button"
                                    aria-expanded={ctx.replyTo === comment.id}
                                    className={cn(
                                        'inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#166534]',
                                        ctx.replyTo === comment.id ? 'bg-[#dcfce7] text-[#166534]' : 'text-[#525252] hover:bg-[#f5f5f5]',
                                    )}
                                    onClick={() => ctx.openReply(comment.id)}
                                >
                                    <LuReply aria-hidden="true" className="size-4" />
                                    Reply
                                </button>
                                <button
                                    type="button"
                                    aria-expanded={true}
                                    aria-label={`Collapse thread by ${author.name}`}
                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[#525252] hover:bg-[#f5f5f5] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#166534]"
                                    onClick={() => ctx.toggleCollapse(comment.id)}
                                >
                                    <LuMinus aria-hidden="true" className="size-4" />
                                    <span aria-hidden="true">Collapse</span>
                                </button>
                            </div>

                            <AnimatePresence initial={false}>
                                {ctx.replyTo === comment.id && (
                                    <motion.div
                                        key="reply"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: reduceMotion ? 0 : 0.22 }}
                                        className="overflow-hidden px-0.5 pb-1"
                                    >
                                        <ReplyBox
                                            idBase={idBase}
                                            value={ctx.draft}
                                            error={ctx.error}
                                            target={author.name}
                                            onChange={ctx.setDraft}
                                            onCancel={ctx.closeReply}
                                            onSubmit={(event) => ctx.submitReply(event, comment.id)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {children.length > 0 && (
                                <ul className="mt-3 space-y-4">
                                    {children.map((child) => (
                                        <CommentNode key={child.id} comment={child} depth={depth + 1} ctx={ctx} />
                                    ))}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.li>
    )
}

export function ThreadedDiscussionActivityFeed({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const baseId = useId()
    const [elapsed, setElapsed] = useState(0)
    const [comments, setComments] = useState(initialComments)
    const [votes, setVotes] = useState({ a1: 1 })
    const [collapsed, setCollapsed] = useState({})
    const [sort, setSort] = useState('best')
    const [replyTo, setReplyTo] = useState(null)
    const [draft, setDraft] = useState('')
    const [error, setError] = useState('')
    const [topDraft, setTopDraft] = useState('')
    const [topError, setTopError] = useState('')
    const [announce, setAnnounce] = useState('')

    useEffect(() => {
        const id = setInterval(() => setElapsed((m) => m + 1), 60000)
        return () => clearInterval(id)
    }, [])

    const ageOf = (c) => (c.mine ? elapsed - c.at : c.minutesAgo + elapsed)
    const scoreOf = (c) => c.score + (votes[c.id] ?? 0)

    const childrenOf = (parentId) =>
        comments
            .filter((c) => c.parent === parentId)
            .sort((a, b) => (sort === 'best' ? scoreOf(b) - scoreOf(a) : ageOf(a) - ageOf(b)))

    const countDescendants = (id) => {
        const kids = comments.filter((c) => c.parent === id)
        return kids.reduce((sum, k) => sum + 1 + countDescendants(k.id), 0)
    }

    const onVote = (id, dir) => setVotes((prev) => ({ ...prev, [id]: prev[id] === dir ? 0 : dir }))

    const toggleCollapse = (id) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))

    const openReply = (id) => {
        if (replyTo === id) {
            setReplyTo(null)
            return
        }
        setReplyTo(id)
        setDraft('')
        setError('')
    }

    const closeReply = () => {
        setReplyTo(null)
        setDraft('')
        setError('')
    }

    const addComment = (parent, text) => {
        const id = `me-${parent ?? 'top'}-${comments.length}`
        setComments((prev) => [...prev, { id, parent, mine: true, at: elapsed, score: 0, text: text.trim() }])
        setVotes((prev) => ({ ...prev, [id]: 1 }))
        if (parent) setCollapsed((prev) => ({ ...prev, [parent]: false }))
        setAnnounce('Your reply was posted')
    }

    const submitReply = (event, parent) => {
        event.preventDefault()
        const problem = validate(draft)
        if (problem) {
            setError(problem)
            return
        }
        addComment(parent, draft)
        closeReply()
    }

    const submitTop = (event) => {
        event.preventDefault()
        const problem = validate(topDraft)
        if (problem) {
            setTopError(problem)
            return
        }
        addComment(null, topDraft)
        setTopDraft('')
        setTopError('')
    }

    const ctx = {
        baseId,
        reduceMotion,
        votes,
        collapsed,
        replyTo,
        draft,
        error,
        ageOf,
        childrenOf,
        countDescendants,
        onVote,
        toggleCollapse,
        openReply,
        closeReply,
        submitReply,
        setDraft: (value) => {
            setDraft(value)
            if (error) setError('')
        },
    }

    const topLevel = childrenOf(null)
    const postVote = votes.post ?? 0

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#fafafa] py-12 text-base font-normal text-[#171717] md:py-20', className)}
            {...props}
        >
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#737373]">
                    <a href="#agora-home" className="rounded hover:text-[#166534] focus-visible:outline-2 focus-visible:outline-[#166534]">
                        Agora
                    </a>
                    <span aria-hidden="true" className="px-2">/</span>
                    <a href="#agora-repair-cafes" className="rounded text-[#166534] hover:underline focus-visible:outline-2 focus-visible:outline-[#166534]">
                        c/repair-cafés
                    </a>
                </nav>

                <article className="mt-4 rounded-2xl border border-[#e5e5e5] bg-white p-4 sm:flex sm:gap-5 sm:p-6">
                    <div className="order-last mt-4 border-t border-[#f5f5f5] pt-3 sm:order-none sm:mt-0 sm:border-0 sm:pt-0">
                        <VoteButtons
                            id="post"
                            vertical
                            score={1248 + postVote}
                            vote={postVote}
                            label="post"
                            onVote={onVote}
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <img src={people.hannah.img} alt="" className="size-6 rounded-full object-cover" />
                            <a href="#agora-user-hannah" className="rounded font-bold text-[#171717] hover:text-[#166534] focus-visible:outline-2 focus-visible:outline-[#166534]">
                                Hannah Obi
                            </a>
                            <span className="font-mono text-[#737373]">posted {rel(302 + elapsed)}</span>
                        </div>
                        <h2 className="mt-3 font-serif text-2xl font-semibold leading-tight tracking-tight text-[#171717] sm:text-3xl md:text-4xl">
                            How do you keep volunteers coming back after their first repair café?
                        </h2>
                        <p className="mt-3 text-[15px] leading-relaxed text-[#404040]">
                            We get 20+ new fixers at every launch event, but only a handful return for the second month.
                            What actually worked for your group — mentoring, recognition, food, something else?
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                            {['volunteering', 'community-building', 'retention'].map((tag) => (
                                <a
                                    key={tag}
                                    href={`#agora-tag-${tag}`}
                                    className="rounded-full bg-[#f0fdf4] px-3 py-1 font-mono text-[11px] font-semibold text-[#166534] ring-1 ring-inset ring-[#bbf7d0] hover:bg-[#dcfce7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
                                >
                                    #{tag}
                                </a>
                            ))}
                            <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-[#737373]">
                                <LuMessageSquare aria-hidden="true" className="size-4" />
                                {comments.length + 79} comments · 3.4k views
                            </span>
                        </div>
                    </div>
                </article>

                <form noValidate className="mt-6 flex gap-3" onSubmit={submitTop}>
                    <img src={ME.img} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                        <label htmlFor={`${baseId}-top`} className="sr-only">
                            Add a comment
                        </label>
                        <textarea
                            id={`${baseId}-top`}
                            rows={2}
                            value={topDraft}
                            placeholder="Share what worked for your group…"
                            aria-invalid={Boolean(topError)}
                            aria-describedby={`${baseId}-top-msg`}
                            className="block w-full resize-y rounded-xl border border-[#d4d4d4] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#171717] placeholder:text-[#a3a3a3] focus:border-[#166534] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#166534]/15"
                            onChange={(event) => {
                                setTopDraft(event.target.value)
                                if (topError) setTopError('')
                            }}
                        />
                        <div className="mt-2 flex items-center justify-between gap-3">
                            <p
                                id={`${baseId}-top-msg`}
                                aria-live="polite"
                                className={cn('text-xs', topError ? 'font-semibold text-[#9f1239]' : 'text-[#737373]')}
                            >
                                {topError || 'Be specific — numbers and stories help most.'}
                            </p>
                            <button
                                type="submit"
                                className="min-h-10 shrink-0 rounded-full bg-[#166534] px-5 text-sm font-semibold text-white hover:bg-[#14532d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]"
                            >
                                Comment
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5e5] pb-3">
                    <h3 className="font-serif text-xl font-semibold text-[#171717]">Discussion</h3>
                    <div role="group" aria-label="Sort replies" className="flex items-center gap-1 font-mono text-xs">
                        <span className="mr-1 text-[#737373]">Sort</span>
                        {[
                            { id: 'best', label: 'Best' },
                            { id: 'new', label: 'New' },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                aria-pressed={sort === opt.id}
                                className={cn(
                                    'min-h-10 rounded-full px-3.5 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#166534]',
                                    sort === opt.id ? 'bg-[#166534] text-white' : 'text-[#525252] hover:bg-[#f0fdf4]',
                                )}
                                onClick={() => setSort(opt.id)}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <ul className="mt-6 space-y-6">
                    {topLevel.map((c) => (
                        <CommentNode key={c.id} comment={c} depth={0} ctx={ctx} />
                    ))}
                </ul>
                <p aria-live="polite" className="sr-only">
                    {announce}
                </p>
            </div>
        </section>
    )
}

export default ThreadedDiscussionActivityFeed
