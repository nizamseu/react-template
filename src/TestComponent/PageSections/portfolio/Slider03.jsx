// BeforeCodeAfterSlider

// Slider03 · Portfolios & Personal Websites › Animated Slider

// Description:
// "Before, code, after." slider for frontend developer Rafi Chowdhury. Each of five slides
// pairs a design frame from client work (Tidewater Hotels hero, Northwind Coffee product
// card, Kestrel Analytics sparkline, Fieldnotes reading mode, Marlowe Architects gallery)
// with the React snippet that built it, plus an "After · Live" link to the shipped page. Use
// it on a developer portfolio to show design fidelity and code quality side by side.

// Design:
// - White section, ink #0b0b12 type, cobalt #1f3fff accents; the "Before" panel is a
//   dotted #f3f4f8 canvas with a Figma-style selected frame (cobalt outline, corner handles,
//   size pill) and mock UI text over the photo; the "Code" panel is solid cobalt with
//   highlighted mono code (white keywords, #ffd479 strings, #a9b8ff attributes) and, when
//   side by side, a footer of ship stats (e.g. "LCP 1.1 s", "Shipped Mar 2026").
// - Stage has a fixed height from its container width (620 px → 660 px from 640 px → 520 px
//   from 768 px, where the panels sit side by side), so slides never change the height;
//   code runs 11 px → 13 px from a 1024 px container.
// - Motion: vertical wipe — the incoming slide is revealed with a clip-path from the top
//   (next) or bottom (previous), design panel first and code 0.12 s later, each with a glowing
//   edge line; code lines slide in with a stagger and the old slide dims underneath.
// - Controls: square file tabs 01–05 (file names from a 900 px container) with a 7 s
//   autoplay bar, counter, play/pause and square prev/next buttons.

// What it does:
// - State: [index, direction], hover/focus/drag flags, a play/pause preference and which
//   snippet was just copied. animate() fills a 0 → 1 progress value over 7 s and then
//   advances; it pauses on mouse hover, keyboard focus and drag, resumes where it stopped,
//   is stopped on unmount and is off for prefers-reduced-motion (slides cross-fade there).
// - Drag or swipe the stage (60 px or a quick flick; left = next, right = previous), use
//   ←/→/Home/End while it has focus, the buttons or the file tabs. A click that ends a drag
//   is swallowed. "Copy" writes the snippet to the clipboard and shows "Copied" for 1.6 s.
// - Links: "After · Live" → #live-<slide-id>, "Browse all components" → #rafi-components.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BeforeCodeAfterSlider from '@/TestComponent/PageSections/portfolio/Slider03';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <BeforeCodeAfterSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiMiniPause, HiMiniPlay } from 'react-icons/hi2';
import { LuCheck, LuCopy, LuFrame } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 7
const WIPE = 0.9
const EASE = [0.76, 0, 0.24, 1]
const EASE_OUT = [0.22, 1, 0.36, 1]

// Tiny JSX highlighter: comment, string, tag, keyword, number, attribute.
const TOKEN =
    /(\/\/.*$)|(`[^`]*`|'[^']*'|"[^"]*")|(<\/?[A-Za-z][\w.]*|(?<!=)\/?>)|\b(export|function|return|const|let|new|null|true|false)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_][\w-]*)(?==[^=>])/g
const KINDS = ['comment', 'string', 'tag', 'keyword', 'number', 'attr']

const tokenClass = {
    plain: 'text-[#dfe5ff]',
    comment: 'italic text-[#b8c2ff]',
    string: 'text-[#ffd479]',
    tag: 'text-white',
    keyword: 'font-semibold text-white',
    number: 'text-[#ffd479]',
    attr: 'text-[#a9b8ff]',
}

const highlight = (line) => {
    const parts = []
    let last = 0
    for (const match of line.matchAll(TOKEN)) {
        if (match.index > last) parts.push(['plain', line.slice(last, match.index)])
        parts.push([KINDS[match.slice(1).findIndex((group) => group !== undefined)], match[0]])
        last = match.index + match[0].length
    }
    if (last < line.length) parts.push(['plain', line.slice(last)])
    return parts
}

const shots = [
    {
        id: 'tidewater-hero',
        file: 'Hero.jsx',
        stats: ['LCP 1.1 s', 'CLS 0.00', 'Shipped Mar 2026'],
        project: 'Tidewater Hotels',
        title: 'Booking hero with live rates',
        frame: 'Hero / Desktop',
        size: '1440 × 900',
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
        alt: 'Resort pool reflecting a lit terrace restaurant at dusk',
        mock: { kicker: 'Tidewater · Amalfi coast', heading: 'Nights by the water', cta: 'From €240 / night' },
        code: `export function Hero({ rate }) {
  return (
    <section className="h-[88vh]">
      <img src={pool} alt="" />
      <motion.h1
        initial={{ y: 40 }}
        animate={{ y: 0 }}>
        Nights by the water
      </motion.h1>
      <Rate from={rate} night />
    </section>
  )
}`,
    },
    {
        id: 'northwind-card',
        file: 'BagCard.jsx',
        stats: ['2.1 kB gzip', '60 fps hover', 'Shipped Nov 2025'],
        project: 'Northwind Coffee',
        title: 'Product card with a hover lift',
        frame: 'Card / Shop grid',
        size: '360 × 480',
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
        alt: 'Close-up of freshly roasted dark coffee beans',
        mock: { kicker: 'Single origin · 250 g', heading: 'Ethiopia Guji', cta: 'Add to cart · $18' },
        code: `export function BagCard({ bag }) {
  // lifts 6px on hover, no reflow
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="rounded-3xl p-4">
      <img {...bag.image} />
      <h3>{bag.origin}</h3>
      <p>{bag.notes.join(' · ')}</p>
      <AddToCart price={bag.price} />
    </motion.article>
  )
}`,
    },
    {
        id: 'kestrel-sparkline',
        file: 'Sparkline.jsx',
        stats: ['0 deps', '0.6 kB gzip', 'Shipped Aug 2025'],
        project: 'Kestrel Analytics',
        title: 'Sparkline for the weekly report',
        frame: 'Widget / Dashboard',
        size: '320 × 120',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        alt: 'Dark analytics dashboard with line and bar charts on a screen',
        mock: { kicker: 'Weekly sessions', heading: '48,210', cta: '▲ 12.4% vs last week' },
        code: `export function Sparkline({ data }) {
  const dx = 120 / (data.length - 1)
  const pts = data.map((v, i) =>
    \`\${i * dx},\${32 - v * 28}\`)
  return (
    <svg viewBox="0 0 120 32">
      <polyline fill="none"
        points={pts.join(' ')}
        stroke="currentColor" />
    </svg>
  )
}`,
    },
    {
        id: 'fieldnotes-mode',
        file: 'ModeSwitch.jsx',
        stats: ['WCAG AA', '0.4 kB gzip', 'Shipped May 2025'],
        project: 'Fieldnotes',
        title: 'Paper / ink reading mode',
        frame: 'Toggle / Reader',
        size: '390 × 844',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
        alt: 'Hand writing in a paper notebook next to a cup of coffee',
        mock: { kicker: 'Reading mode', heading: 'Paper or ink?', cta: 'Switch to ink' },
        code: `const modes = ['paper', 'ink']

export function ModeSwitch() {
  const [mode, setMode] = useState(0)
  useEffect(() => {
    document.body.dataset.mode =
      modes[mode]
  }, [mode])
  const flip = () => setMode(1 - mode)
  return <button onClick={flip}>
    {modes[mode]} mode
  </button>
}`,
    },
    {
        id: 'marlowe-gallery',
        file: 'Gallery.jsx',
        stats: ['CSS-only snap', 'Lighthouse 100', 'Shipped Jan 2025'],
        project: 'Marlowe Architects',
        title: 'Scroll-snap project gallery',
        frame: 'Gallery / Desktop',
        size: '1440 × 1024',
        image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80',
        alt: 'Angular white modern building facade against a pale sky',
        mock: { kicker: 'Marlowe Architects', heading: 'Harbour House, 2025', cta: 'Project 03 / 12' },
        code: `export function Gallery({ shots }) {
  const snap = 'snap-x snap-mandatory'
  return (
    <ul className={\`flex \${snap}\`}>
      {shots.map((s) => (
        <li key={s.id}
          className="snap-start">
          <img {...s.img} />
        </li>
      ))}
    </ul>
  )
}`,
    },
].map((shot) => ({ ...shot, lines: shot.code.split('\n').map(highlight) }))

const total = shots.length
const pad = (n) => String(n).padStart(2, '0')

const slideLayer = {
    enter: { zIndex: 2, opacity: 1 },
    center: { zIndex: 2, opacity: 1 },
    exit: { zIndex: 1, opacity: 0.3, transition: { duration: WIPE + 0.15, ease: 'linear' } },
}

const slideFade = {
    enter: { zIndex: 2, opacity: 0 },
    center: { zIndex: 2, opacity: 1, transition: { duration: 0.4 } },
    exit: { zIndex: 1, opacity: 0, transition: { duration: 0.4 } },
}

// Vertical wipe: next reveals top → bottom, previous bottom → top.
const panelWipe = (delay) => ({
    enter: (dir) => ({ clipPath: dir < 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }),
    center: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: WIPE, ease: EASE, delay } },
    exit: { clipPath: 'inset(0% 0% 0% 0%)' },
})

// The glowing line that rides the wipe's leading edge, then fades.
const wipeEdge = (delay) => ({
    enter: (dir) => ({ top: dir < 0 ? '100%' : '0%', y: dir < 0 ? '0%' : '-100%', opacity: 1 }),
    center: (dir) => ({
        top: dir < 0 ? '0%' : '100%',
        opacity: 0,
        transition: {
            top: { duration: WIPE, ease: EASE, delay },
            opacity: { duration: 0.2, delay: delay + WIPE - 0.1 },
        },
    }),
    exit: { opacity: 0 },
})

const designWipe = panelWipe(0)
const codeWipe = panelWipe(0.12)
const designEdge = wipeEdge(0)
const codeEdge = wipeEdge(0.12)

const codeBody = {
    enter: {},
    center: { transition: { staggerChildren: 0.03, delayChildren: 0.3 } },
    exit: {},
}

const lineIn = {
    enter: { opacity: 0, x: -10 },
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE_OUT } },
    exit: {},
}

const handles = ['-left-1 -top-1', '-right-1 -top-1', '-bottom-1 -left-1', '-bottom-1 -right-1']

export function BeforeCodeAfterSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [[index, direction], setPage] = useState([0, 0])
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const [copied, setCopied] = useState(null)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const stageRef = useRef(null)
    const moved = useRef(false)
    const panning = useRef(false)
    const panAt = useRef(0)
    const snapBack = useRef(null)
    const copyTimer = useRef(null)

    // Read the motion preference only after mount so server and client markup match.
    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const shot = shots[index]

    const paginate = useCallback(
        (dir) => {
            progress.jump(0)
            setPage(([current]) => [(current + dir + total) % total, dir])
        },
        [progress],
    )

    const goTo = (target) => {
        if (target === index) return
        progress.jump(0)
        setPage([target, target > index ? 1 : -1])
    }

    useEffect(() => {
        setHydrated(true)
        const snap = snapBack
        const timer = copyTimer
        return () => {
            if (snap.current) snap.current.stop()
            window.clearTimeout(timer.current)
        }
    }, [])

    // Autoplay: fill progress 0 → 1, resuming from where it stopped after a pause.
    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    // Warm the cache for the next design frame.
    useEffect(() => {
        const preload = new window.Image()
        preload.src = shots[(index + 1) % total].image
    }, [index])

    const copyCode = (item) => {
        const done = () => {
            setCopied(item.id)
            window.clearTimeout(copyTimer.current)
            copyTimer.current = window.setTimeout(() => setCopied(null), 1600)
        }
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(item.code).then(done, () => {})
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
        // A focused link or Copy button in the leaving slide would vanish; keep focus alive.
        const stage = stageRef.current
        if (stage && stage !== event.target && stage.contains(event.target)) stage.focus({ preventScroll: true })
    }

    const handleFocus = (event) => {
        let visible = true
        try {
            visible = event.target.matches(':focus-visible')
        } catch {
            visible = true
        }
        if (visible) setFocused(true)
    }

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
    }

    // framer-motion calls onPan synchronously but defers onPanStart to the next frame,
    // so whichever handler runs first sets up the drag.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        panAt.current = performance.now()
        if (snapBack.current) snapBack.current.stop()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        dragX.set(Math.max(-24, Math.min(24, info.offset.x * 0.15)))
    }

    const handlePanEnd = (_, info) => {
        beginPan()
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        // Pan velocity reads low when the frame loop was idle (autoplay paused on hover), so a
        // short, quick swipe (< 250 ms, > 24 px) also counts as a flick in the drag direction.
        const flick = performance.now() - panAt.current < 250 && Math.abs(offset.x) > 24
        const horizontal = Math.abs(offset.x) > Math.abs(offset.y)
        if (horizontal && (offset.x < -60 || (offset.x < -10 && (velocity.x < -400 || flick)))) paginate(1)
        else if (horizontal && (offset.x > 60 || (offset.x > 10 && (velocity.x > 400 || flick)))) paginate(-1)
        snapBack.current = animate(dragX, 0, { type: 'spring', stiffness: 320, damping: 34 })
    }

    const squareButton =
        'grid h-11 w-11 shrink-0 place-items-center border text-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]'
    const showEdges = !reduce && direction !== 0

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-14 text-base font-normal text-[#0b0b12] sm:px-6 sm:py-16 lg:px-10 lg:py-20',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-12">
                        <div>
                            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#1f3fff]">
                                <span aria-hidden="true" className="h-2 w-2 bg-[#1f3fff]" />
                                Rafi Chowdhury · Frontend developer
                            </p>
                            <h2 className="mt-4 text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.045em] text-[#0b0b12] sm:text-6xl lg:text-7xl">
                                Before, code, <span className="text-[#1f3fff]">after.</span>
                            </h2>
                        </div>
                        <div>
                            <p className="text-sm leading-6 text-[#0b0b12]/70">
                                Five components from client work, each shown as the Figma frame it started from and
                                the code that shipped it.
                            </p>
                            <a
                                href="#rafi-components"
                                className="group mt-3 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#0b0b12] underline decoration-[#1f3fff] decoration-2 underline-offset-[6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]"
                            >
                                Browse all components
                                <HiArrowLongRight
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Rafi Chowdhury, design and code pairs"
                        className="@container mt-10 sm:mt-12"
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse') setHovered(true)
                        }}
                        onPointerLeave={(event) => {
                            if (event.pointerType === 'mouse') setHovered(false)
                        }}
                    >
                        <motion.div
                            ref={stageRef}
                            role="group"
                            tabIndex={0}
                            aria-label="Slides, drag or use the left and right arrow keys to browse"
                            className={cn(
                                'relative isolate h-[620px] touch-pan-y select-none overflow-hidden border border-[#0b0b12] bg-[#f3f4f8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3fff] @min-[640px]:h-[660px] @3xl:h-[520px]',
                                dragging ? 'cursor-grabbing' : 'cursor-grab',
                            )}
                            onPointerDownCapture={() => {
                                moved.current = false
                            }}
                            onKeyDownCapture={() => {
                                moved.current = false
                            }}
                            onClickCapture={(event) => {
                                // Swallow only the click that ends a drag.
                                if (moved.current) {
                                    moved.current = false
                                    event.preventDefault()
                                    event.stopPropagation()
                                }
                            }}
                            onPanStart={beginPan}
                            onPan={handlePan}
                            onPanEnd={handlePanEnd}
                        >
                            <motion.div className="absolute inset-0" style={{ x: dragX }}>
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={shot.id}
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${index + 1} of ${total}: ${shot.project}, ${shot.title}`}
                                        custom={direction}
                                        variants={reduce ? slideFade : slideLayer}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0 grid grid-rows-[272px_minmax(0,1fr)] @min-[640px]:grid-rows-[300px_minmax(0,1fr)] @3xl:grid-cols-2 @3xl:grid-rows-1"
                                    >
                                        <motion.div
                                            custom={direction}
                                            variants={reduce ? undefined : designWipe}
                                            className="relative flex min-h-0 flex-col gap-3 bg-[#f3f4f8] bg-[radial-gradient(#d3d8e8_1px,transparent_1px)] bg-[size:14px_14px] p-4 @min-[640px]:p-6 @3xl:border-r @3xl:border-[#0b0b12] @3xl:p-8"
                                        >
                                            <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0b0b12]/60">
                                                <span className="flex min-w-0 items-center gap-2">
                                                    <LuFrame aria-hidden="true" className="shrink-0 text-sm text-[#1f3fff]" />
                                                    <span className="font-semibold text-[#1f3fff]">Before</span>
                                                    <span className="truncate">· {shot.frame}</span>
                                                </span>
                                                <span className="hidden shrink-0 tabular-nums @min-[400px]:inline">
                                                    Figma
                                                </span>
                                            </div>

                                            <div className="relative min-h-0 flex-1">
                                                <div className="absolute inset-0 overflow-hidden bg-[#dfe3ee]">
                                                    <motion.img
                                                        src={shot.image}
                                                        alt={shot.alt}
                                                        loading="lazy"
                                                        draggable={false}
                                                        initial={reduce ? false : { scale: 1.12 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ duration: 1.4, ease: EASE_OUT }}
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-black/0" />
                                                    <div className="absolute inset-x-0 bottom-0 p-3 text-white @min-[640px]:p-5">
                                                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/75">
                                                            {shot.mock.kicker}
                                                        </p>
                                                        <p className="mt-1 text-xl font-semibold leading-tight tracking-[-0.02em] @min-[640px]:text-2xl @3xl:text-3xl">
                                                            {shot.mock.heading}
                                                        </p>
                                                        <span className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#0b0b12]">
                                                            {shot.mock.cta}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span
                                                    aria-hidden="true"
                                                    className="pointer-events-none absolute -inset-px border border-[#1f3fff]"
                                                />
                                                {handles.map((spot) => (
                                                    <span
                                                        key={spot}
                                                        aria-hidden="true"
                                                        className={cn(
                                                            'pointer-events-none absolute h-2 w-2 border border-[#1f3fff] bg-white',
                                                            spot,
                                                        )}
                                                    />
                                                ))}
                                                <span className="pointer-events-none absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1f3fff] px-1.5 py-0.5 font-mono text-[10px] tabular-nums leading-none text-white">
                                                    {shot.size}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between gap-3 pt-1">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-[#0b0b12]">
                                                        {shot.project}
                                                    </p>
                                                    <p className="truncate text-xs text-[#0b0b12]/60">{shot.title}</p>
                                                </div>
                                                <a
                                                    href={`#live-${shot.id}`}
                                                    draggable={false}
                                                    className="group inline-flex h-10 shrink-0 items-center gap-1.5 border border-[#0b0b12] bg-white px-3 text-xs font-semibold text-[#0b0b12] transition-colors hover:border-[#1f3fff] hover:bg-[#1f3fff] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f3fff]"
                                                >
                                                    After · Live
                                                    <HiArrowUpRight
                                                        aria-hidden="true"
                                                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                    />
                                                </a>
                                            </div>

                                            {showEdges && (
                                                <motion.span
                                                    aria-hidden="true"
                                                    custom={direction}
                                                    variants={designEdge}
                                                    className="pointer-events-none absolute inset-x-0 z-10 h-[3px] bg-[#1f3fff] shadow-[0_0_18px_4px_rgba(31,63,255,0.35)]"
                                                />
                                            )}
                                        </motion.div>

                                        <motion.div
                                            custom={direction}
                                            variants={reduce ? undefined : codeWipe}
                                            className="relative flex min-h-0 flex-col bg-[#1f3fff] text-white"
                                        >
                                            <div className="flex h-11 shrink-0 items-center justify-between gap-3 border-b border-white/15 pl-4 pr-1.5 @min-[640px]:pl-6">
                                                <p className="flex min-w-0 items-center gap-2 font-mono text-[11px]">
                                                    <span className="font-semibold uppercase tracking-[0.16em] text-white">
                                                        Code
                                                    </span>
                                                    <span className="text-white/40">/</span>
                                                    <span className="truncate text-white/85">{shot.file}</span>
                                                </p>
                                                <div className="flex shrink-0 items-center gap-1">
                                                    <span className="hidden font-mono text-[10px] text-white/60 @min-[400px]:inline">
                                                        {shot.lines.length} lines · JSX
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="inline-flex h-10 items-center gap-1.5 px-3 font-mono text-[11px] text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white"
                                                        onClick={() => copyCode(shot)}
                                                    >
                                                        {copied === shot.id ? (
                                                            <LuCheck aria-hidden="true" />
                                                        ) : (
                                                            <LuCopy aria-hidden="true" />
                                                        )}
                                                        <span aria-live="polite">
                                                            {copied === shot.id ? 'Copied' : 'Copy'}
                                                        </span>
                                                        <span className="sr-only"> {shot.file}</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <motion.pre
                                                variants={reduce ? undefined : codeBody}
                                                className="min-h-0 flex-1 overflow-hidden p-4 font-mono text-[11px] leading-5 @min-[640px]:px-6 @min-[640px]:py-5 @5xl:text-[13px] @5xl:leading-6"
                                            >
                                                <code className="block">
                                                    {shot.lines.map((tokens, n) => (
                                                        <motion.span
                                                            key={n}
                                                            variants={reduce ? undefined : lineIn}
                                                            className="flex gap-4"
                                                        >
                                                            <span
                                                                aria-hidden="true"
                                                                className="w-5 shrink-0 select-none text-right tabular-nums text-white/35"
                                                            >
                                                                {n + 1}
                                                            </span>
                                                            <span className="whitespace-pre">
                                                                {tokens.map(([kind, text], j) => (
                                                                    <span key={j} className={tokenClass[kind]}>
                                                                        {text}
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        </motion.span>
                                                    ))}
                                                </code>
                                            </motion.pre>
                                            <ul className="hidden h-10 shrink-0 items-center gap-5 overflow-hidden border-t border-white/15 px-6 font-mono text-[10px] uppercase tracking-[0.14em] text-white/75 @3xl:flex">
                                                {shot.stats.map((stat, i) => (
                                                    <li
                                                        key={stat}
                                                        className={cn(
                                                            'flex items-center gap-2 whitespace-nowrap',
                                                            i === 2 && 'hidden @5xl:flex',
                                                        )}
                                                    >
                                                        <span aria-hidden="true" className="h-1 w-1 bg-white/70" />
                                                        {stat}
                                                    </li>
                                                ))}
                                            </ul>

                                            {showEdges && (
                                                <motion.span
                                                    aria-hidden="true"
                                                    custom={direction}
                                                    variants={codeEdge}
                                                    className="pointer-events-none absolute inset-x-0 z-10 h-[3px] bg-white shadow-[0_0_18px_4px_rgba(255,255,255,0.45)]"
                                                />
                                            )}
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        <div className="mt-4 flex flex-col gap-3 @min-[640px]:flex-row @min-[640px]:items-center @min-[640px]:gap-5">
                            <div
                                role="group"
                                aria-label="Choose a component"
                                className="grid min-w-0 flex-1 grid-cols-5 border border-[#0b0b12]/15"
                            >
                                {shots.map((item, i) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-label={`Show ${item.file}: ${item.title}`}
                                        aria-current={i === index ? 'true' : undefined}
                                        className={cn(
                                            'group relative flex h-12 min-w-0 items-center gap-2 border-l border-[#0b0b12]/15 px-2 text-left font-mono text-[11px] transition-colors first:border-l-0 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#1f3fff] @min-[640px]:px-3',
                                            i === index
                                                ? 'bg-[#1f3fff]/[0.06] text-[#0b0b12]'
                                                : 'text-[#0b0b12]/55 hover:bg-[#0b0b12]/[0.03] hover:text-[#0b0b12]',
                                        )}
                                        onClick={() => goTo(i)}
                                    >
                                        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-[#1f3fff]/10">
                                            {i === index && (
                                                <motion.span
                                                    className="absolute inset-0 origin-left bg-[#1f3fff]"
                                                    style={{ scaleX: autoplayOn ? progress : 1 }}
                                                />
                                            )}
                                        </span>
                                        <span className="tabular-nums text-[#1f3fff]">{pad(i + 1)}</span>
                                        <span className="hidden truncate @min-[900px]:block">{item.file}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <p className="font-mono text-xs tabular-nums text-[#0b0b12]/60">
                                    <span className="text-[#0b0b12]">{pad(index + 1)}</span> / {pad(total)}
                                </p>
                                <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                                    Slide {index + 1} of {total}: {shot.project}, {shot.title}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                        className={cn(
                                            squareButton,
                                            'border-transparent text-[#0b0b12]/80 hover:bg-[#0b0b12]/5 hover:text-[#0b0b12]',
                                        )}
                                        onClick={() => setPlayPref(!autoplayOn)}
                                    >
                                        {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Previous slide"
                                        className={cn(
                                            squareButton,
                                            'border-[#0b0b12] text-[#0b0b12] hover:border-[#1f3fff] hover:bg-[#1f3fff] hover:text-white',
                                        )}
                                        onClick={() => paginate(-1)}
                                    >
                                        <HiArrowLongLeft aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next slide"
                                        className={cn(
                                            squareButton,
                                            'border-[#0b0b12] bg-[#0b0b12] text-white hover:border-[#1f3fff] hover:bg-[#1f3fff]',
                                        )}
                                        onClick={() => paginate(1)}
                                    >
                                        <HiArrowLongRight aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default BeforeCodeAfterSlider
