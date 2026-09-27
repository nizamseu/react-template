// ClipMomentsActivityFeed

// ActivityFeed04 · Social Networks & Communities › Activity / Community Feed

// Description:
// A dark short-video feed for Clipyard. Under "Moments worth the replay." four vertical
// clip cards (a warehouse DJ set, 60-second chilli crisp, a sunset yoga flow, a no-look
// layup) each show a poster, creator, caption and sound line, a "Playing" state with a
// looping progress bar, a mute toggle and a right-side rail with follow, like, comment
// and save. Comments open in a sheet inside the card. Use it for reels or clip feeds.

// Design:
// - Near-black #0a0a0a canvas, white text, zinc #a1a1aa meta, cyan #22d3ee for the
//   Playing chip, progress bar, liked state, follow badge and focus rings
// - Cards are 9:16, rounded-[28px], with top and bottom black gradients; rail buttons
//   are 44px glass circles (white/10 + blur) with counts beneath in text-xs bold
// - Heading text-4xl → lg:text-6xl font-black tight with a cyan outlined word; mono
//   duration chips and a spinning disc icon on the sound line while a clip plays
// - Motion: the playing poster slowly zooms (Ken Burns), equalizer bars bounce, hearts
//   pop, the comment sheet slides up; all static or faded with reduced motion
// - Responsive: base → md is a horizontal snap row (cards 78vw, max 300px); lg shows a
//   4-column grid

// What it does:
// - playingId allows one clip at a time; tapping a card plays or pauses it; a 100 ms
//   interval advances progress and loops the clip (cleared on pause and unmount)
// - Mute is shared by all cards (aria-pressed); it only swaps the icon and label because
//   posters stand in for video
// - Rail: Follow adds you as a follower (badge turns into a check), Like and Save toggle
//   with counts (aria-pressed), Comment opens the card's sheet: focus moves to its
//   input, Escape or close returns focus, and the controlled form (1-150 characters)
//   appends your comment and bumps the count
// - Creator names link to #clipyard-<handle>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ClipMomentsActivityFeed from '@/TestComponent/PageSections/community/ActivityFeed04';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <ClipMomentsActivityFeed />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    LuBookmark,
    LuCheck,
    LuDisc3,
    LuHeart,
    LuMessageCircle,
    LuPause,
    LuPlay,
    LuPlus,
    LuSend,
    LuVolume2,
    LuVolumeX,
    LuX,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const ME_AVATAR = img('1535713875002-d1d0cf377fde', 400)

const clips = [
    {
        id: 'warehouse',
        handle: 'dj.meridian',
        avatar: img('1544723795-3fb6469f5b39', 400),
        poster: img('1493225457124-a3eb161ffa5f', 900),
        alt: 'Performer on a smoky stage lit by coloured spotlights',
        caption: 'Closing set at Warehouse 9. Wait for the drop at 0:18.',
        tags: ['#liveset', '#techno'],
        sound: 'Meridian · Low Tide (live edit)',
        seconds: 24,
        likes: 48210,
        saves: 3120,
        comments: [
            { id: 'w1', user: 'nightbus.ana', text: 'Was there. My ears are still ringing.' },
            { id: 'w2', user: 'kofi.m', text: 'Track ID please!!' },
        ],
        commentCount: 1204,
    },
    {
        id: 'chilli',
        handle: 'chef.amara',
        avatar: img('1573497019940-1c28c88b4f3e', 400),
        poster: img('1551218808-94e220e084d2', 900),
        alt: 'Chef chopping vegetables on a wooden board',
        caption: '60-second chilli crisp. Save it before you forget.',
        tags: ['#recipe', '#quickeats'],
        sound: 'original sound · chef.amara',
        seconds: 58,
        likes: 21730,
        saves: 8840,
        comments: [
            { id: 'c1', user: 'hungry.hugo', text: 'Made it tonight, the shallots are the secret.' },
            { id: 'c2', user: 'lea.cooks', text: 'Could I swap the peanuts for sesame?' },
        ],
        commentCount: 640,
    },
    {
        id: 'flow',
        handle: 'sol.flow',
        avatar: img('1500917293891-ef795e70e1f6', 400),
        poster: img('1544367567-0f2fcb009e0b', 900),
        alt: 'Silhouette of a person in a yoga pose against a sunset',
        caption: 'Sunset flow: five poses to unwind after a long screen day.',
        tags: ['#yoga', '#slowliving'],
        sound: 'Tidewater · Amber Hour',
        seconds: 31,
        likes: 9420,
        saves: 2210,
        comments: [{ id: 'f1', user: 'mira.b', text: 'Pose three fixed my back, thank you.' }],
        commentCount: 212,
    },
    {
        id: 'layup',
        handle: 'hoops.theo',
        avatar: img('1506277886164-e25aa3f4ef7f', 400),
        poster: img('1546519638-68e109498ffc', 900),
        alt: 'Basketball hoop and backboard against the sky',
        caption: 'No-look layup, attempt 47. We got there.',
        tags: ['#hoops', '#practice'],
        sound: 'Court Kings · Buzzer',
        seconds: 15,
        likes: 33140,
        saves: 1180,
        comments: [
            { id: 'l1', user: 'coach.rae', text: 'Footwork on 46 was cleaner, just saying.' },
            { id: 'l2', user: 'jj.buckets', text: 'The celebration is the best part' },
        ],
        commentCount: 980,
    },
]

function compact(n) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 10000) return `${Math.round(n / 1000)}k`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
    return String(n)
}

const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

function ClipCard({ clip, playing, progress, muted, onTogglePlay, onToggleMute, reduceMotion, baseId }) {
    const [liked, setLiked] = useState(false)
    const [saved, setSaved] = useState(false)
    const [following, setFollowing] = useState(false)
    const [sheet, setSheet] = useState(false)
    const [comments, setComments] = useState(clip.comments)
    const [draft, setDraft] = useState('')
    const [error, setError] = useState('')
    const commentBtnRef = useRef(null)
    const inputRef = useRef(null)
    const sheetId = `${baseId}-${clip.id}-sheet`

    useEffect(() => {
        if (!sheet) return undefined
        inputRef.current?.focus()
        const onKey = (event) => {
            if (event.key !== 'Escape') return
            setSheet(false)
            commentBtnRef.current?.focus()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [sheet])

    const closeSheet = () => {
        setSheet(false)
        commentBtnRef.current?.focus()
    }

    const submit = (event) => {
        event.preventDefault()
        const text = draft.trim()
        if (!text) {
            setError('Say something first.')
            return
        }
        if (text.length > 150) {
            setError('Keep it under 150 characters.')
            return
        }
        setComments((prev) => [...prev, { id: `me-${prev.length}`, user: 'you', text, mine: true }])
        setDraft('')
        setError('')
    }

    const railBtn =
        'grid size-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]'

    return (
        <article className="relative aspect-[9/16] w-full overflow-hidden rounded-[28px] bg-[#18181b] ring-1 ring-white/10">
            <motion.img
                src={clip.poster}
                alt={clip.alt}
                loading="lazy"
                draggable={false}
                animate={{ scale: playing && !reduceMotion ? 1.12 : 1 }}
                transition={{ duration: playing ? clip.seconds : 0.6, ease: 'linear' }}
                className="absolute inset-0 size-full select-none object-cover"
            />
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-black/70 to-transparent" />
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            <button
                type="button"
                aria-pressed={playing}
                aria-label={`${playing ? 'Pause' : 'Play'} clip by ${clip.handle}`}
                className="absolute inset-0 z-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#22d3ee]"
                onClick={onTogglePlay}
            >
                <AnimatePresence>
                    {!playing && (
                        <motion.span
                            key="play"
                            aria-hidden="true"
                            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.2 }}
                            className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/40 ring-1 ring-white/30 backdrop-blur-md"
                        >
                            <LuPlay className="ml-1 size-7 fill-white text-white" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3.5">
                {playing ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#22d3ee] py-1 pl-2.5 pr-3 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a0a0a]">
                        <span aria-hidden="true" className="flex h-3 items-end gap-[2px]">
                            {[0, 1, 2].map((bar) => (
                                <motion.span
                                    key={bar}
                                    className="w-[3px] rounded-full bg-[#0a0a0a]"
                                    initial={{ height: '40%' }}
                                    animate={reduceMotion ? { height: '70%' } : { height: ['30%', '100%', '45%', '85%', '30%'] }}
                                    transition={reduceMotion ? { duration: 0 } : { duration: 0.9, repeat: Infinity, delay: bar * 0.15 }}
                                />
                            ))}
                        </span>
                        Playing
                    </span>
                ) : (
                    <span className="rounded-full bg-black/50 px-2.5 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur">
                        {clock(clip.seconds)}
                    </span>
                )}
                <button
                    type="button"
                    aria-pressed={!muted}
                    aria-label={muted ? 'Unmute clips' : 'Mute clips'}
                    className="pointer-events-auto grid size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                    onClick={onToggleMute}
                >
                    {muted ? <LuVolumeX aria-hidden="true" className="size-5" /> : <LuVolume2 aria-hidden="true" className="size-5 text-[#22d3ee]" />}
                </button>
            </div>

            <ul className="absolute bottom-24 right-2.5 z-10 flex flex-col items-center gap-3.5 text-center">
                <li className="relative mb-1">
                    <a
                        href={`#clipyard-${clip.handle}`}
                        className="block rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                    >
                        <img src={clip.avatar} alt={`${clip.handle}’s profile`} loading="lazy" className="size-11 rounded-full object-cover ring-2 ring-white" />
                    </a>
                    <button
                        type="button"
                        aria-pressed={following}
                        aria-label={following ? `Unfollow ${clip.handle}` : `Follow ${clip.handle}`}
                        className={cn(
                            'absolute -bottom-2.5 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full ring-2 ring-[#0a0a0a] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#22d3ee]',
                            following ? 'bg-white text-[#0a0a0a]' : 'bg-[#22d3ee] text-[#0a0a0a]',
                        )}
                        onClick={() => setFollowing((v) => !v)}
                    >
                        {following ? <LuCheck aria-hidden="true" className="size-3.5" /> : <LuPlus aria-hidden="true" className="size-3.5" />}
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        aria-pressed={liked}
                        aria-label={`${liked ? 'Unlike' : 'Like'} clip, ${compact(clip.likes + (liked ? 1 : 0))} likes`}
                        className={railBtn}
                        onClick={() => setLiked((v) => !v)}
                    >
                        <motion.span
                            key={liked ? 'on' : 'off'}
                            initial={{ scale: reduceMotion ? 1 : 0.4 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 600, damping: 12 }}
                            className="grid"
                        >
                            <LuHeart aria-hidden="true" className={cn('size-6', liked && 'fill-[#22d3ee] text-[#22d3ee]')} />
                        </motion.span>
                    </button>
                    <span aria-hidden="true" className="mt-1 block text-xs font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                        {compact(clip.likes + (liked ? 1 : 0))}
                    </span>
                </li>
                <li>
                    <button
                        ref={commentBtnRef}
                        type="button"
                        aria-expanded={sheet}
                        aria-controls={sheetId}
                        aria-label={`Comments, ${clip.commentCount + comments.length - clip.comments.length}`}
                        className={cn(railBtn, sheet && 'bg-[#22d3ee] text-[#0a0a0a] hover:bg-[#22d3ee]')}
                        onClick={() => (sheet ? closeSheet() : setSheet(true))}
                    >
                        <LuMessageCircle aria-hidden="true" className="size-6" />
                    </button>
                    <span aria-hidden="true" className="mt-1 block text-xs font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                        {compact(clip.commentCount + comments.length - clip.comments.length)}
                    </span>
                </li>
                <li>
                    <button
                        type="button"
                        aria-pressed={saved}
                        aria-label={saved ? 'Remove from saved' : 'Save clip'}
                        className={railBtn}
                        onClick={() => setSaved((v) => !v)}
                    >
                        <LuBookmark aria-hidden="true" className={cn('size-6', saved && 'fill-white')} />
                    </button>
                    <span aria-hidden="true" className="mt-1 block text-xs font-bold text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]">
                        {compact(clip.saves + (saved ? 1 : 0))}
                    </span>
                </li>
            </ul>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 pr-16">
                <a
                    href={`#clipyard-${clip.handle}`}
                    className="pointer-events-auto rounded text-sm font-bold text-white hover:underline focus-visible:outline-2 focus-visible:outline-[#22d3ee]"
                >
                    @{clip.handle}
                </a>
                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-white/90">
                    {clip.caption} <span className="font-semibold text-[#67e8f9]">{clip.tags.join(' ')}</span>
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-white/75">
                    <LuDisc3
                        aria-hidden="true"
                        className={cn('size-4 shrink-0', playing && 'animate-spin [animation-duration:2.4s] motion-reduce:animate-none')}
                    />
                    <span className="truncate">{clip.sound}</span>
                </p>
            </div>

            <div
                role="progressbar"
                aria-label={`Progress of clip by ${clip.handle}`}
                aria-valuemin={0}
                aria-valuemax={clip.seconds}
                aria-valuenow={Math.round(progress * clip.seconds)}
                className="absolute inset-x-0 bottom-0 z-10 h-1 bg-white/15"
            >
                <div className="h-full bg-[#22d3ee]" style={{ width: `${progress * 100}%` }} />
            </div>

            <AnimatePresence>
                {sheet && (
                    <motion.div
                        id={sheetId}
                        key="sheet"
                        role="dialog"
                        aria-label={`Comments on clip by ${clip.handle}`}
                        initial={{ y: reduceMotion ? 0 : '100%', opacity: reduceMotion ? 0 : 1 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: reduceMotion ? 0 : '100%', opacity: reduceMotion ? 0 : 1 }}
                        transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 400, damping: 40 }}
                        className="absolute inset-x-0 bottom-0 z-20 flex h-[68%] flex-col rounded-t-3xl bg-[#111113]/95 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between border-b border-white/10 py-2 pl-4 pr-2">
                            <p className="text-sm font-bold text-white">
                                {compact(clip.commentCount + comments.length - clip.comments.length)} comments
                            </p>
                            <button
                                type="button"
                                aria-label="Close comments"
                                className="grid size-10 place-items-center rounded-full text-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#22d3ee]"
                                onClick={closeSheet}
                            >
                                <LuX aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                        <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-3">
                            {comments.map((c) => (
                                <li key={c.id} className="text-[13px] leading-snug">
                                    <span className={cn('font-bold', c.mine ? 'text-[#22d3ee]' : 'text-white')}>
                                        {c.mine ? 'You' : `@${c.user}`}
                                    </span>{' '}
                                    <span className="text-white/80">{c.text}</span>
                                </li>
                            ))}
                        </ul>
                        <form noValidate className="border-t border-white/10 p-3" onSubmit={submit}>
                            <div className="flex items-center gap-2">
                                <img src={ME_AVATAR} alt="" className="size-8 shrink-0 rounded-full object-cover" />
                                <label htmlFor={`${sheetId}-input`} className="sr-only">
                                    Add a comment
                                </label>
                                <input
                                    ref={inputRef}
                                    id={`${sheetId}-input`}
                                    value={draft}
                                    autoComplete="off"
                                    placeholder="Add a comment…"
                                    aria-invalid={Boolean(error)}
                                    aria-describedby={`${sheetId}-msg`}
                                    className="h-10 min-w-0 flex-1 rounded-full bg-white/10 px-3.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
                                    onChange={(event) => {
                                        setDraft(event.target.value)
                                        if (error) setError('')
                                    }}
                                />
                                <button
                                    type="submit"
                                    aria-label="Send comment"
                                    className="grid size-10 shrink-0 place-items-center rounded-full bg-[#22d3ee] text-[#0a0a0a] hover:bg-[#67e8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                                >
                                    <LuSend aria-hidden="true" className="size-4" />
                                </button>
                            </div>
                            <p id={`${sheetId}-msg`} aria-live="polite" className={cn('mt-1 min-h-4 pl-10 text-[11px]', error ? 'text-[#fca5a5]' : 'text-white/40')}>
                                {error || `${draft.trim().length}/150`}
                            </p>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </article>
    )
}

export function ClipMomentsActivityFeed({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const baseId = useId()
    const [playingId, setPlayingId] = useState(null)
    const [progress, setProgress] = useState({})
    const [muted, setMuted] = useState(true)

    useEffect(() => {
        if (!playingId) return undefined
        const clip = clips.find((c) => c.id === playingId)
        const stepSize = 0.1 / clip.seconds
        const id = setInterval(() => {
            setProgress((prev) => {
                const next = (prev[playingId] ?? 0) + stepSize
                return { ...prev, [playingId]: next >= 1 ? 0 : next }
            })
        }, 100)
        return () => clearInterval(id)
    }, [playingId])

    const playing = clips.find((c) => c.id === playingId)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#0a0a0a] py-12 text-base font-normal text-white md:py-20', className)}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,211,238,0.22),transparent)] blur-2xl"
            />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#22d3ee]">
                            <span aria-hidden="true" className="grid size-5 place-items-center rounded-md bg-[#22d3ee] text-[#0a0a0a]">
                                <LuPlay className="size-3 fill-current" />
                            </span>
                            Clipyard · For you
                        </p>
                        <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                            Moments worth
                            <br />
                            the{' '}
                            <span className="text-transparent [-webkit-text-stroke:1.5px_#22d3ee]">replay.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#a1a1aa]">
                        <span
                            className={cn(
                                'inline-flex min-h-10 items-center gap-2 rounded-full border px-4 font-mono text-xs',
                                playing ? 'border-[#22d3ee]/60 text-[#22d3ee]' : 'border-white/15 text-[#a1a1aa]',
                            )}
                            aria-live="polite"
                        >
                            {playing ? (
                                <LuPlay aria-hidden="true" className="size-3.5 fill-current" />
                            ) : (
                                <LuPause aria-hidden="true" className="size-3.5" />
                            )}
                            {playing ? `Now playing @${playing.handle}` : 'Tap a clip to play'}
                        </span>
                        <span className="hidden font-mono text-xs sm:inline">{muted ? 'Sound off' : 'Sound on'}</span>
                    </div>
                </div>

                <ul className="-mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
                    {clips.map((clip) => (
                        <li key={clip.id} className="w-[78vw] max-w-[300px] shrink-0 snap-center lg:w-auto lg:max-w-none">
                            <ClipCard
                                clip={clip}
                                baseId={baseId}
                                playing={playingId === clip.id}
                                progress={progress[clip.id] ?? 0}
                                muted={muted}
                                reduceMotion={reduceMotion}
                                onTogglePlay={() => setPlayingId((cur) => (cur === clip.id ? null : clip.id))}
                                onToggleMute={() => setMuted((m) => !m)}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}

export default ClipMomentsActivityFeed
