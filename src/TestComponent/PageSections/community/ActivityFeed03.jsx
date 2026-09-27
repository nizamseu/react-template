// StoryGridActivityFeed

// ActivityFeed03 · Social Networks & Communities › Activity / Community Feed

// Description:
// A black, photo-first feed for Snapshot, a travel photo community. A scrollable row of
// story avatars with orange-to-pink rings (rings turn grey once seen) sits above a
// "Fresh from people you follow" 3-column grid of nine photos with one featured tile.
// Tapping a story or a photo opens a full-screen lightbox with caption, location, a like
// toggle, arrows, swipe and keyboard control. Use it for explore pages or profile grids.

// Design:
// - Pure black #000 canvas, white text, zinc #a1a1aa meta; story rings are a
//   #f97316 → #ef4444 → #db2777 gradient, seen rings #3f3f46; likes turn #db2777
// - Wordmark "snapshot" in font-black lowercase with a gradient dot; heading text-4xl →
//   md:text-6xl tight; story avatars 64px (72px from sm) with a 3px ring and a black gap
// - Grid: grid-cols-3 with 2px gaps (6px from sm), square tiles, first tile spans 2×2;
//   hover shows a black/45 overlay with like and comment counts
// - Lightbox: black/95 backdrop, rounded-2xl card (photo 4:5 + side panel from md, 9:16
//   story card), round white/10 arrow buttons; the photo slides in from the side
// - Responsive: stories scroll horizontally with snap on every size; the lightbox stacks
//   photo over caption below md and sits side by side from md

// What it does:
// - seen map greys a story ring after it is opened; unseen stories stay first and seen
//   ones slide to the end (layout animation); "Your story" links to #snapshot-new-story
// - viewer state { kind: photo | story, index } drives the lightbox (role="dialog",
//   aria-modal): Arrow keys / buttons / horizontal drag move between items, Escape or the
//   close button closes it, focus moves to the close button and back to the opener
// - Like in the lightbox toggles per photo or story (aria-pressed, count ±1); an
//   aria-live line announces "Photo 3 of 9"
// - Grid tiles are buttons; usernames link to #snapshot-<username>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StoryGridActivityFeed from '@/TestComponent/PageSections/community/ActivityFeed03';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <StoryGridActivityFeed />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuChevronLeft, LuChevronRight, LuHeart, LuMapPin, LuMessageCircle, LuPlus, LuX } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const stories = [
    { id: 's1', user: 'noa.frames', avatar: img('1534528741775-53994a69daeb', 400), photo: img('1503899036084-c55cdd92da26'), alt: 'Neon signs glowing over a narrow Tokyo street at night', caption: 'Shinjuku after the rain', time: '1h', likes: 312 },
    { id: 's2', user: 'kai.walks', avatar: img('1539571696357-5a69c17a67c6', 400), photo: img('1493976040374-85c8e12f0c0e'), alt: 'Kyoto street leading to a wooden pagoda', caption: 'Sannenzaka at 6 am, nobody around', time: '2h', likes: 204 },
    { id: 's3', user: 'maren.k', avatar: img('1517841905240-472988babdf9', 400), photo: img('1476514525535-07fb3b4ae5f1'), alt: 'Wooden rowboat on a still alpine lake below mountains', caption: 'Braies before the crowds', time: '3h', likes: 488 },
    { id: 's4', user: 'eli.north', avatar: img('1570295999919-56ceb5ecca61', 400), photo: img('1517411032315-54ef2cb783bb'), alt: 'Green aurora rippling across a night sky', caption: 'Stayed up till 2 for this', time: '4h', likes: 931 },
    { id: 's5', user: 'zara.lens', avatar: img('1438761681033-6461ffad8d80', 400), photo: img('1514525253161-7a46d19cd819'), alt: 'Festival crowd under bright stage lights', caption: 'Front row, no regrets', time: '5h', likes: 177 },
    { id: 's6', user: 'theo.eats', avatar: img('1544723795-3fb6469f5b39', 400), photo: img('1414235077428-338989a2e8c0'), alt: 'Fine-dining plate on a dark restaurant table', caption: 'Nine courses in Lisbon', time: '7h', likes: 142 },
    { id: 's7', user: 'lina.sea', avatar: img('1554151228-14d9def656e4', 400), photo: img('1533105079780-92b9be482077'), alt: 'White houses on a hill above a blue sea', caption: 'Milos, day three', time: '9h', likes: 266 },
    { id: 's8', user: 'rio.peaks', avatar: img('1544005313-94ddf0286df2', 400), photo: img('1492691527719-9d1e07e534b4'), alt: 'Photographer standing on a mountain ridge', caption: 'Summit selfie, sort of', time: '11h', likes: 390 },
]

const photos = [
    { id: 'p1', user: 'lina.sea', src: img('1516483638261-f4dbaf036963', 1200), alt: 'Colourful cliffside village above the sea', caption: 'Every house a different colour, every window a view.', place: 'Manarola, Italy', likes: 4821, comments: 136 },
    { id: 'p2', user: 'maren.k', src: img('1501785888041-af3ef285b470'), alt: 'Turquoise lake with a small boat and mountains', caption: 'Water this colour should be illegal.', place: 'Lake Louise, Canada', likes: 2310, comments: 58 },
    { id: 'p3', user: 'theo.eats', src: img('1509042239860-f550ce710b93'), alt: 'Latte art cups on a cafe table with plants', caption: 'Flat white flight. Rated all four.', place: 'Melbourne, Australia', likes: 987, comments: 41 },
    { id: 'p4', user: 'noa.frames', src: img('1514565131-fce0801e5785'), alt: 'City skyline glowing at dusk', caption: 'Blue hour from the 40th floor.', place: 'New York, USA', likes: 3204, comments: 77 },
    { id: 'p5', user: 'kai.walks', src: img('1528127269322-539801943592'), alt: 'Boats among limestone karsts in Ha Long Bay', caption: 'Kayaked between these at sunrise.', place: 'Ha Long Bay, Vietnam', likes: 2766, comments: 64 },
    { id: 'p6', user: 'zara.lens', src: img('1499856871958-5b9627545d1a'), alt: 'Paris bridge and river at dusk', caption: 'Pont Alexandre III doing its thing.', place: 'Paris, France', likes: 1893, comments: 29 },
    { id: 'p7', user: 'rio.peaks', src: img('1433086966358-54859d0ed716'), alt: 'Waterfall with a wooden footbridge in a forest', caption: 'Twenty minutes off the trail. Worth it.', place: 'Plitvice, Croatia', likes: 1450, comments: 22 },
    { id: 'p8', user: 'eli.north', src: img('1519501025264-65ba15a82390'), alt: 'City street with traffic lights at dusk', caption: 'Downtown going pink.', place: 'Toronto, Canada', likes: 1102, comments: 18 },
    { id: 'p9', user: 'lina.sea', src: img('1510414842594-a61c69b5ae57'), alt: 'Rocky cove with clear turquoise water', caption: 'Swam here twice before breakfast.', place: 'Mallorca, Spain', likes: 2045, comments: 51 },
]

const avatarOf = (user) => stories.find((s) => s.user === user)?.avatar

export function StoryGridActivityFeed({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const baseId = useId()
    const [seen, setSeen] = useState({ s6: true })
    const [viewer, setViewer] = useState(null)
    const [direction, setDirection] = useState(1)
    const [liked, setLiked] = useState({})
    const closeRef = useRef(null)
    const dialogRef = useRef(null)
    const openerRef = useRef(null)

    const list = viewer?.kind === 'story' ? stories : photos
    const item = viewer ? list[viewer.index] : null
    const orderedStories = [...stories].sort((a, b) => Number(Boolean(seen[a.id])) - Number(Boolean(seen[b.id])))

    const open = (kind, index, event) => {
        openerRef.current = event.currentTarget
        setDirection(1)
        setViewer({ kind, index })
        if (kind === 'story') setSeen((prev) => ({ ...prev, [stories[index].id]: true }))
    }

    const close = () => {
        setViewer(null)
        openerRef.current?.focus()
    }

    const step = (dir) => {
        if (!viewer) return
        const next = (viewer.index + dir + list.length) % list.length
        setDirection(dir)
        setViewer({ kind: viewer.kind, index: next })
        if (viewer.kind === 'story') setSeen((prev) => ({ ...prev, [stories[next].id]: true }))
    }

    const isOpen = viewer !== null

    useEffect(() => {
        if (isOpen) closeRef.current?.focus()
    }, [isOpen])

    useEffect(() => {
        if (!viewer) return undefined
        const onKey = (event) => {
            if (event.key === 'Escape') {
                setViewer(null)
                openerRef.current?.focus()
                return
            }
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
            const dir = event.key === 'ArrowRight' ? 1 : -1
            const src = viewer.kind === 'story' ? stories : photos
            const next = (viewer.index + dir + src.length) % src.length
            setDirection(dir)
            setViewer({ kind: viewer.kind, index: next })
            if (viewer.kind === 'story') setSeen((prev) => ({ ...prev, [stories[next].id]: true }))
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [viewer])

    const trapFocus = (event) => {
        if (event.key !== 'Tab') return
        const focusables = Array.from(dialogRef.current?.querySelectorAll('button, a[href]') ?? [])
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first?.focus()
        }
    }

    const likeCount = (it) => it.likes + (liked[it.id] ? 1 : 0)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-black py-12 text-base font-normal text-white md:py-20', className)}
            {...props}
        >
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <p className="flex items-center gap-1.5 text-xl font-black lowercase tracking-[-0.04em] text-white">
                            snapshot
                            <span aria-hidden="true" className="size-2 rounded-full bg-linear-to-br from-[#f97316] to-[#db2777]" />
                        </p>
                        <h2 className="mt-5 text-4xl font-bold leading-[0.95] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
                            Fresh from people
                            <br />
                            <span className="bg-linear-to-r from-[#f97316] to-[#db2777] bg-clip-text text-transparent">you follow.</span>
                        </h2>
                    </div>
                    <p className="hidden max-w-[16rem] text-right text-sm leading-relaxed text-[#a1a1aa] md:block">
                        {stories.length - Object.values(seen).filter(Boolean).length} new stories · 9 photos since your last visit
                    </p>
                </div>

                <div className="-mx-4 mt-10 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
                    <ul className="flex snap-x gap-4 sm:gap-5" aria-label="Stories">
                        <li className="snap-start">
                            <a
                                href="#snapshot-new-story"
                                className="group flex w-16 flex-col items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f97316] sm:w-[72px]"
                            >
                                <span className="relative grid size-16 place-items-center rounded-full border border-dashed border-[#52525b] sm:size-[72px]">
                                    <img src={img('1524504388940-b1c1722653e1', 400)} alt="" loading="lazy" className="size-[54px] rounded-full object-cover opacity-80 sm:size-[62px]" />
                                    <span className="absolute -bottom-0.5 -right-0.5 grid size-6 place-items-center rounded-full bg-linear-to-br from-[#f97316] to-[#db2777] ring-[3px] ring-black">
                                        <LuPlus aria-hidden="true" className="size-3.5 text-white" />
                                    </span>
                                </span>
                                <span className="w-full truncate text-center text-[11px] text-[#a1a1aa]">Your story</span>
                            </a>
                        </li>
                        {orderedStories.map((story) => {
                            const index = stories.indexOf(story)
                            const isSeen = Boolean(seen[story.id])
                            return (
                                <motion.li key={story.id} layout={!reduceMotion} transition={{ duration: 0.4 }} className="snap-start">
                                    <button
                                        type="button"
                                        aria-label={`${isSeen ? 'Seen story' : 'New story'} from ${story.user}, ${story.time} ago`}
                                        className="group flex w-16 flex-col items-center gap-2 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f97316] sm:w-[72px]"
                                        onClick={(event) => open('story', index, event)}
                                    >
                                        <span
                                            className={cn(
                                                'grid size-16 place-items-center rounded-full p-[3px] transition-transform duration-300 group-hover:scale-105 group-active:scale-95 motion-reduce:transition-none sm:size-[72px]',
                                                isSeen ? 'bg-[#3f3f46]' : 'bg-linear-to-tr from-[#f97316] via-[#ef4444] to-[#db2777]',
                                            )}
                                        >
                                            <span className="grid size-full place-items-center rounded-full bg-black p-[3px]">
                                                <img
                                                    src={story.avatar}
                                                    alt=""
                                                    loading="lazy"
                                                    className={cn('size-full rounded-full object-cover', isSeen && 'opacity-70')}
                                                />
                                            </span>
                                        </span>
                                        <span className={cn('w-full truncate text-center text-[11px]', isSeen ? 'text-[#71717a]' : 'text-white')}>
                                            {story.user}
                                        </span>
                                    </button>
                                </motion.li>
                            )
                        })}
                    </ul>
                </div>

                <ul className="mt-8 grid grid-cols-3 gap-0.5 sm:gap-1.5" aria-label="Photos">
                    {photos.map((photo, index) => (
                        <li key={photo.id} className={cn(index === 0 && 'col-span-2 row-span-2')}>
                            <button
                                type="button"
                                aria-label={`Open photo by ${photo.user}: ${photo.alt}`}
                                className="group relative block aspect-square w-full overflow-hidden bg-[#18181b] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#f97316] sm:rounded-md"
                                onClick={(event) => open('photo', index, event)}
                            >
                                <img
                                    src={photo.src}
                                    alt=""
                                    loading="lazy"
                                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 flex items-center justify-center gap-5 bg-black/45 text-sm font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        <LuHeart className="size-5 fill-white" />
                                        {likeCount(photo).toLocaleString('en-US')}
                                    </span>
                                    <span className="hidden items-center gap-1.5 sm:inline-flex">
                                        <LuMessageCircle className="size-5 fill-white" />
                                        {photo.comments}
                                    </span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <p aria-live="polite" className="sr-only">
                {viewer ? `${viewer.kind === 'story' ? 'Story' : 'Photo'} ${viewer.index + 1} of ${list.length}` : ''}
            </p>

            <AnimatePresence>
                {viewer && item && (
                    <motion.div
                        key="lightbox"
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`${baseId}-lb-title`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/95 px-4 py-16 backdrop-blur-sm"
                        onKeyDown={trapFocus}
                        onClick={(event) => {
                            if (event.target === event.currentTarget) close()
                        }}
                    >
                        <p className="absolute left-4 top-5 font-mono text-xs tracking-widest text-[#a1a1aa]">
                            {String(viewer.index + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}
                        </p>
                        <button
                            ref={closeRef}
                            type="button"
                            aria-label="Close viewer"
                            className="absolute right-3 top-3 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                            onClick={close}
                        >
                            <LuX aria-hidden="true" className="size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label={`Previous ${viewer.kind}`}
                            className="absolute left-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] sm:left-5"
                            onClick={() => step(-1)}
                        >
                            <LuChevronLeft aria-hidden="true" className="size-6" />
                        </button>
                        <button
                            type="button"
                            aria-label={`Next ${viewer.kind}`}
                            className="absolute right-2 top-1/2 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316] sm:right-5"
                            onClick={() => step(1)}
                        >
                            <LuChevronRight aria-hidden="true" className="size-6" />
                        </button>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={`${viewer.kind}-${item.id}`}
                                initial={{ opacity: 0, x: reduceMotion ? 0 : direction * 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: reduceMotion ? 0 : direction * -40 }}
                                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.5}
                                onDragEnd={(event, info) => {
                                    if (info.offset.x < -70) step(1)
                                    else if (info.offset.x > 70) step(-1)
                                }}
                                className={cn(
                                    'w-full cursor-grab overflow-hidden rounded-2xl bg-[#0a0a0a] ring-1 ring-white/10 active:cursor-grabbing',
                                    viewer.kind === 'photo' ? 'max-w-4xl md:grid md:grid-cols-[1.25fr_1fr]' : 'max-w-[min(100%,380px)]',
                                )}
                            >
                                <div className={cn('relative', viewer.kind === 'photo' ? 'aspect-[4/5] md:aspect-auto md:min-h-[480px]' : 'aspect-[9/16] max-h-[76vh]')}>
                                    <img
                                        src={viewer.kind === 'photo' ? item.src : item.photo}
                                        alt={item.alt}
                                        draggable={false}
                                        className="absolute inset-0 size-full select-none object-cover"
                                    />
                                    {viewer.kind === 'story' && (
                                        <div className="absolute inset-x-0 top-0 flex items-center gap-2.5 bg-linear-to-b from-black/70 to-transparent p-4">
                                            <span className="grid size-9 place-items-center rounded-full bg-linear-to-tr from-[#f97316] to-[#db2777] p-[2px]">
                                                <img src={item.avatar} alt="" className="size-full rounded-full border-2 border-black object-cover" />
                                            </span>
                                            <span id={`${baseId}-lb-title`} className="text-sm font-semibold text-white">
                                                {item.user}
                                            </span>
                                            <span className="text-xs text-white/70">{item.time}</span>
                                        </div>
                                    )}
                                    {viewer.kind === 'story' && (
                                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/80 to-transparent p-4 pt-12">
                                            <p className="text-base font-semibold leading-snug text-white">{item.caption}</p>
                                            <button
                                                type="button"
                                                aria-pressed={Boolean(liked[item.id])}
                                                aria-label={`Like story from ${item.user}`}
                                                className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 backdrop-blur focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
                                                onClick={() => setLiked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                                            >
                                                <LuHeart aria-hidden="true" className={cn('size-5', liked[item.id] ? 'fill-[#db2777] text-[#db2777]' : 'text-white')} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {viewer.kind === 'photo' && (
                                    <div className="flex flex-col p-5 sm:p-6">
                                        <div className="flex items-center gap-3">
                                            <img src={avatarOf(item.user)} alt="" className="size-10 rounded-full object-cover ring-2 ring-[#db2777]" />
                                            <div className="min-w-0">
                                                <a
                                                    id={`${baseId}-lb-title`}
                                                    href={`#snapshot-${item.user}`}
                                                    className="block truncate rounded text-sm font-bold text-white hover:underline focus-visible:outline-2 focus-visible:outline-[#f97316]"
                                                >
                                                    {item.user}
                                                </a>
                                                <p className="flex items-center gap-1 text-xs text-[#a1a1aa]">
                                                    <LuMapPin aria-hidden="true" className="size-3.5" />
                                                    {item.place}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-5 text-lg leading-snug text-white">{item.caption}</p>
                                        <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4 md:mt-auto">
                                            <button
                                                type="button"
                                                aria-pressed={Boolean(liked[item.id])}
                                                className={cn(
                                                    'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]',
                                                    liked[item.id] ? 'bg-[#db2777] text-white' : 'bg-white/10 text-white hover:bg-white/15',
                                                )}
                                                onClick={() => setLiked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                                            >
                                                <motion.span
                                                    key={liked[item.id] ? 'on' : 'off'}
                                                    initial={{ scale: reduceMotion ? 1 : 0.5 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: 'spring', stiffness: 600, damping: 14 }}
                                                    className="grid"
                                                >
                                                    <LuHeart aria-hidden="true" className={cn('size-5', liked[item.id] && 'fill-white')} />
                                                </motion.span>
                                                {likeCount(item).toLocaleString('en-US')}
                                            </button>
                                            <span className="inline-flex items-center gap-1.5 text-sm text-[#a1a1aa]">
                                                <LuMessageCircle aria-hidden="true" className="size-5" />
                                                {item.comments} comments
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default StoryGridActivityFeed
