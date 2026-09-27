// MonochromeMosaicLatestPosts

// LatestPosts05 · Blogs & Digital Media › Latest Posts Grid / Feed

// Description:
// A gallery-like latest-stories mosaic for the fictional design magazine Frame & Form. Under
// "The latest, in black and white." six stories sit in an asymmetric 12-column mosaic: one
// large architecture feature, three photo tiles in grayscale that turn to colour on hover or
// focus, a black essay tile and a red interview tile. A Mosaic / Index switch swaps the grid
// for a numbered list. Use it as the front of a design, architecture or photography magazine.

// Design:
// - White #ffffff background, black #0a0a0a type and tiles, signal red #e63946 for the
//   interview tile, category labels, numbers, the active view button and focus rings
// - Mosaic: grid-cols-1 → md:grid-cols-6 → lg:grid-cols-12 with auto-rows-[200px] from md;
//   the lead spans 7×3 on lg, others 5×2, 4×2, 3×2, 5×1; tiles are square-cornered with
//   2px gaps like a contact sheet; below md photo tiles are 340px tall and text tiles grow
//   from a 240px minimum
// - Photos: grayscale by default, colour + scale 1.06 on hover/focus over 700ms, with a
//   black-to-transparent scrim; tile text is white, headlines in tight sans black
// - Index view: numbered rows (red mono 01–06), large titles, category/author columns and a
//   small grayscale thumbnail from sm up
// - Header: wordmark with a red serif-italic ampersand, text-4xl → lg:text-7xl heading and a
//   segmented Mosaic / Index control; views cross-fade (instant for reduced motion)

// What it does:
// - view state ("mosaic" | "index") switches the layout; buttons use aria-pressed
// - Every tile and row is a link to #frame-and-form-<id>; colour/zoom react to both hover and
//   keyboard focus (group-focus-visible)
// - "All stories" links to #frame-and-form-archive

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MonochromeMosaicLatestPosts from '@/TestComponent/PageSections/media/LatestPosts05';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <MonochromeMosaicLatestPosts />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight, HiOutlineListBullet, HiOutlineSquares2X2 } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const img = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

const stories = [
    {
        id: 'curved-facade',
        kind: 'photo',
        category: 'Architecture',
        title: 'The quiet radicalism of the curved facade',
        excerpt: 'How a generation of Porto architects learned to bend concrete without shouting about it.',
        author: 'Inês Albuquerque',
        read: 12,
        photo: '1493397212122-2b85dda8106b',
        width: 1400,
        alt: 'White curved building facade against a blue sky',
        span: 'md:col-span-6 md:row-span-2 lg:col-span-7 lg:row-span-3',
        large: true,
    },
    {
        id: 'stool-forty-years',
        kind: 'photo',
        category: 'Objects',
        title: 'One stool, forty years: the life of a design classic',
        author: 'Henrik Sjöberg',
        read: 7,
        photo: '1503602642458-232111445657',
        alt: 'Simple wooden stool photographed against a blue wall',
        span: 'md:col-span-3 md:row-span-2 lg:col-span-5 lg:row-span-2',
    },
    {
        id: 'against-minimalism',
        kind: 'essay',
        category: 'Essay',
        title: 'Against minimalism, respectfully',
        excerpt: 'Empty rooms photograph beautifully. Living in them is another matter.',
        author: 'Clara Nweke',
        read: 9,
        span: 'md:col-span-3 md:row-span-2 lg:col-span-5 lg:row-span-1',
    },
    {
        id: 'pendant-season',
        kind: 'photo',
        category: 'Lighting',
        title: 'Pendant season: 12 lamps that earn their ceiling hook',
        author: 'Ola Brandt',
        read: 6,
        photo: '1513506003901-1e6a229e2d15',
        alt: 'White pendant lamp hanging in front of a teal wall',
        span: 'md:col-span-3 md:row-span-2 lg:col-span-4 lg:row-span-2',
    },
    {
        id: 'grid-promise',
        kind: 'interview',
        category: 'Interview',
        title: '“A grid is a promise to the reader.”',
        excerpt: 'Typographer Mae Lindgren on 30 years of magazine layouts.',
        author: 'Jonas Weil',
        read: 8,
        span: 'md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2',
    },
    {
        id: 'copenhagen-38',
        kind: 'photo',
        category: 'Interiors',
        title: 'A 38 m² Copenhagen flat that lives like 80',
        author: 'Sofie Kjær',
        read: 10,
        photo: '1524758631624-e2822e304c36',
        alt: 'Bright living room with modern chairs and a floor lamp',
        span: 'md:col-span-6 md:row-span-2 lg:col-span-5 lg:row-span-2',
    },
]

const views = [
    { id: 'mosaic', label: 'Mosaic', Icon: HiOutlineSquares2X2 },
    { id: 'index', label: 'Index', Icon: HiOutlineListBullet },
]

const tileFocus =
    'focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#e63946]'

function PhotoTile({ story }) {
    return (
        <a
            href={`#frame-and-form-${story.id}`}
            className={cn('group relative flex h-[340px] flex-col justify-end overflow-hidden bg-[#0a0a0a] md:h-auto', tileFocus)}
        >
            <img
                src={img(story.photo, story.width)}
                alt={story.alt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.06] group-hover:grayscale-0 group-focus-visible:scale-[1.06] group-focus-visible:grayscale-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100"
            />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/85 via-[#0a0a0a]/20 to-transparent" />
            <span
                aria-hidden="true"
                className="absolute right-4 top-4 flex size-10 items-center justify-center bg-white text-[#0a0a0a] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
            >
                <HiArrowUpRight className="size-5" />
            </span>
            <div className={cn('relative p-5 sm:p-6', story.large && 'lg:p-10')}>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#e63946]">{story.category}</p>
                <h3
                    className={cn(
                        'mt-2 font-black leading-[1.02] tracking-tight text-white',
                        story.large ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-xl sm:text-2xl',
                    )}
                >
                    {story.title}
                </h3>
                {story.excerpt && (
                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">{story.excerpt}</p>
                )}
                <p className="mt-3 text-xs font-medium text-white/65">
                    {story.author} · {story.read} min
                </p>
            </div>
        </a>
    )
}

function TextTile({ story }) {
    const interview = story.kind === 'interview'
    return (
        <a
            href={`#frame-and-form-${story.id}`}
            className={cn(
                'group relative flex min-h-[240px] flex-col justify-between gap-4 overflow-hidden p-5 transition-colors sm:p-6 md:min-h-0 lg:p-5',
                interview ? 'bg-[#e63946] text-white hover:bg-[#d62f3c]' : 'bg-[#0a0a0a] text-white hover:bg-[#1c1c1c]',
                tileFocus,
                interview && 'focus-visible:outline-[#0a0a0a]',
            )}
        >
            <p
                className={cn(
                    'flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.25em]',
                    interview ? 'text-white' : 'text-[#e63946]',
                )}
            >
                {story.category}
                <HiArrowUpRight
                    aria-hidden="true"
                    className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
            </p>
            <div>
                <h3
                    className={cn(
                        'font-black leading-[1.05] tracking-tight text-white',
                        interview ? 'font-serif text-2xl italic sm:text-[1.7rem]' : 'text-2xl sm:text-3xl lg:text-2xl',
                    )}
                >
                    {story.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{story.excerpt}</p>
                <p className="mt-3 text-xs font-medium text-white/70">
                    {story.author} · {story.read} min
                </p>
            </div>
        </a>
    )
}

export function MonochromeMosaicLatestPosts({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [view, setView] = useState('mosaic')

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white py-16 text-base font-normal text-[#0a0a0a] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 border-b border-[#0a0a0a] pb-3">
                    <p className="text-lg font-black tracking-tight text-[#0a0a0a]">
                        Frame <span className="font-serif font-normal italic text-[#e63946]">&amp;</span> Form
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0a0a0a]/60">
                        Issue 12 · Autumn 2026
                    </p>
                </div>

                <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl font-black leading-[0.95] tracking-tighter text-[#0a0a0a] sm:text-6xl lg:text-7xl">
                            The latest, in black and white<span className="text-[#e63946]">.</span>
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-[#0a0a0a]/65">
                            Six new stories on buildings, objects and the people who make them. Hover or tab onto a
                            photo to bring it into colour.
                        </p>
                    </div>
                    <div role="group" aria-label="Layout" className="flex shrink-0 self-start border border-[#0a0a0a] md:self-auto">
                        {views.map(({ id, label, Icon }) => (
                            <button
                                key={id}
                                type="button"
                                aria-pressed={view === id}
                                className={cn(
                                    'inline-flex min-h-11 items-center gap-2 px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e63946]',
                                    view === id ? 'bg-[#0a0a0a] text-white' : 'bg-white text-[#0a0a0a] hover:bg-[#0a0a0a]/5',
                                )}
                                onClick={() => setView(id)}
                            >
                                <Icon aria-hidden="true" className={cn('size-4', view === id && 'text-[#e63946]')} />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    {view === 'mosaic' ? (
                        <motion.ul
                            key="mosaic"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.3 }}
                            className="mt-10 grid grid-cols-1 gap-0.5 bg-white md:auto-rows-[200px] md:grid-cols-6 lg:grid-cols-12"
                        >
                            {stories.map((story) => (
                                <li key={story.id} className={cn('flex flex-col [&>a]:flex-1', story.span)}>
                                    {story.kind === 'photo' ? <PhotoTile story={story} /> : <TextTile story={story} />}
                                </li>
                            ))}
                        </motion.ul>
                    ) : (
                        <motion.ol
                            key="index"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.3 }}
                            className="mt-10 border-t border-[#0a0a0a]"
                        >
                            {stories.map((story, index) => (
                                <li key={story.id} className="border-b border-[#0a0a0a]/15">
                                    <a
                                        href={`#frame-and-form-${story.id}`}
                                        className="group grid grid-cols-[2.5rem_1fr] items-center gap-x-4 gap-y-2 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e63946] sm:grid-cols-[3rem_1fr_10rem_6rem] sm:gap-x-6"
                                    >
                                        <span className="font-mono text-sm font-bold text-[#e63946]">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-xl font-black leading-tight tracking-tight text-[#0a0a0a] transition-transform duration-300 group-hover:translate-x-1 sm:text-3xl motion-reduce:group-hover:translate-x-0">
                                                {story.title}
                                            </span>
                                            <span className="mt-1 block text-xs text-[#0a0a0a]/60 sm:hidden">
                                                {story.category} · {story.author}
                                            </span>
                                        </span>
                                        <span className="hidden text-xs leading-snug text-[#0a0a0a]/60 sm:block">
                                            <span className="block font-bold uppercase tracking-[0.2em] text-[#0a0a0a]">{story.category}</span>
                                            {story.author} · {story.read} min
                                        </span>
                                        <span className="hidden aspect-[4/3] overflow-hidden bg-[#0a0a0a] sm:block">
                                            {story.photo ? (
                                                <img
                                                    src={img(story.photo, 400)}
                                                    alt=""
                                                    loading="lazy"
                                                    className="size-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-focus-visible:grayscale-0"
                                                />
                                            ) : (
                                                <span
                                                    className={cn(
                                                        'flex size-full items-center justify-center font-serif text-3xl italic text-white',
                                                        story.kind === 'interview' ? 'bg-[#e63946]' : 'bg-[#0a0a0a]',
                                                    )}
                                                >
                                                    “
                                                </span>
                                            )}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </motion.ol>
                    )}
                </AnimatePresence>

                <div className="mt-8 flex justify-end">
                    <a
                        href="#frame-and-form-archive"
                        className="group inline-flex min-h-11 items-center gap-3 border-b-2 border-[#0a0a0a] text-sm font-black uppercase tracking-[0.2em] text-[#0a0a0a] transition-colors hover:border-[#e63946] hover:text-[#e63946] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e63946]"
                    >
                        All stories
                        <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default MonochromeMosaicLatestPosts
