// GettingStartedSlider

// Slider01 · Knowledge Bases & Documentation › Animated Slider

// Description:
// A three-step onboarding carousel for Stackdocs: "Install", "Configure" and "Deploy".
// Under "From empty folder to live docs in three steps." each slide pairs a step title
// (e.g. "Install the CLI and scaffold a project"), a checklist and a guide link with an
// animated terminal or config-file panel whose lines stream in, plus a working Copy
// button. Use it on a docs home page or quickstart landing page to walk new users
// through setup.

// Design:
// - Near-black #0b0b0f section with a violet #8b5cf6 glow; the stage is a
//   rounded-[1.75rem] #111117 card split into copy (left) and a #08080b terminal window
//   (right) from lg, stacked below lg; an invisible stack of every slide keeps the
//   height stable
// - Step progress bar above the stage: three numbered steps whose tracks fill violet
//   (done = full, current = autoplay progress); mono labels, tight sans headings
// - Terminal lines stream in with a stagger; commands get a violet prompt and light
//   highlighting (commands, flags, strings, keywords, numbers, comments); the deploy
//   step animates an upload bar. Slides enter/exit direction-aware with a small blur
// - Controls row: counter, play/pause, prev/next (44px). Below sm the checklist is
//   hidden, step labels shrink to text-xs and code/terminal lines wrap instead of
//   scrolling

// What it does:
// - State: [index, direction], hover/focus/drag flags and a play preference. animate()
//   drives a 0 → 1 progress value over 7 s and advances; it pauses on mouse hover,
//   keyboard focus and drags, resumes where it stopped, and is off for
//   prefers-reduced-motion
// - Drag or swipe the stage (70 px, a fast flick, or any >24 px swipe under 250 ms;
//   left = next), ←/→/Home/End on the carousel, prev/next buttons and the step bar
//   change slides; a click that ends a drag is swallowed; the step is announced via an
//   aria-live line
// - Copy writes the slide's commands or config to the clipboard (with a textarea
//   fallback) and shows "Copied" for 1.8 s. Links: #stackdocs-quickstart and one guide
//   per step

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GettingStartedSlider from '@/TestComponent/PageSections/knowledge/Slider01';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <GettingStartedSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiCheck, HiMiniPause, HiMiniPlay, HiOutlineClipboardDocument } from 'react-icons/hi2';
import { LuCircleCheck } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 7
const EASE = [0.22, 1, 0.36, 1]

const slides = [
    {
        id: 'install',
        label: 'Install',
        time: '≈ 1 min',
        title: 'Install the CLI and scaffold a project',
        copy: 'One command creates a docs project with MDX pages, a search index and a dev server. Node 20 or later is all you need.',
        checks: ['Creates /docs, /public and stackdocs.config.ts', 'No global install, runs straight from npm', 'Hot-reloading preview on localhost:4321'],
        href: '#quickstart-install',
        linkLabel: 'Install guide',
        panel: {
            kind: 'terminal',
            title: 'zsh — ~/projects',
            lines: [
                { type: 'cmd', text: 'npm create stackdocs@latest acme-docs' },
                { type: 'ok', text: 'Template › Product docs (MDX)' },
                { type: 'ok', text: 'Package manager › npm' },
                { type: 'out', text: 'Installed 214 packages in 8.4s' },
                { type: 'cmd', text: 'cd acme-docs && npm run dev' },
                { type: 'out', text: 'stackdocs v4.2.0  ready in 612 ms' },
                { type: 'link', text: '➜  Local:   http://localhost:4321/' },
            ],
            clipboard: 'npm create stackdocs@latest acme-docs\ncd acme-docs && npm run dev',
        },
    },
    {
        id: 'configure',
        label: 'Configure',
        time: '≈ 3 min',
        title: 'Point it at your content and make it yours',
        copy: 'Navigation, theme, search and versions live in one typed config file. Save it and the preview reloads instantly.',
        checks: ['Sidebar generated from your /docs folders', 'Local search with a ⌘K palette, no API key', 'Versioned docs straight from Git tags'],
        href: '#quickstart-configure',
        linkLabel: 'Config reference',
        panel: {
            kind: 'code',
            title: 'stackdocs.config.ts',
            code: [
                "import { defineConfig } from 'stackdocs'",
                '',
                'export default defineConfig({',
                "  title: 'Acme Docs',",
                "  theme: { accent: '#8b5cf6', mode: 'dark' },",
                "  sidebar: 'auto', // built from /docs folders",
                "  search: { provider: 'local', hotkey: 'mod+k' },",
                "  versions: ['v2', 'v1'],",
                '  editLink: true,',
                '})',
            ],
        },
    },
    {
        id: 'deploy',
        label: 'Deploy',
        time: '≈ 2 min',
        title: 'Ship it to the edge with one command',
        copy: 'Stackdocs builds static pages, uploads them to 18 edge regions and hands you a preview URL for every branch.',
        checks: ['148 pages built in 11.2 seconds', 'One-click rollbacks from the dashboard', 'Free TLS on *.stackdocs.app or your own domain'],
        href: '#quickstart-deploy',
        linkLabel: 'Deploy guide',
        panel: {
            kind: 'terminal',
            title: 'zsh — ~/projects/acme-docs',
            lines: [
                { type: 'cmd', text: 'npx stackdocs deploy --prod' },
                { type: 'out', text: '→ Building 148 pages          done 11.2s' },
                { type: 'out', text: '→ Uploading to 18 regions     done  3.9s' },
                { type: 'out', text: '→ Purging edge cache          done  0.4s' },
                { type: 'bar', text: 'Upload' },
                { type: 'ok', text: 'Live at https://acme-docs.stackdocs.app' },
            ],
            clipboard: 'npx stackdocs deploy --prod',
        },
    },
]

const total = slides.length
const pad = (n) => String(n).padStart(2, '0')

// Tiny highlighter: sticky regexes per language, first match wins.
const RULES = {
    ts: [
        ['comment', /\/\/.*/y],
        ['string', /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/y],
        ['number', /\b\d+(?:\.\d+)?\b/y],
        ['word', /[A-Za-z_$][\w$]*/y],
    ],
    sh: [
        ['comment', /#.*/y],
        ['string', /'[^']*'|"[^"]*"/y],
        ['flag', /--?[A-Za-z][\w-]*/y],
        ['number', /\b\d+(?:\.\d+)?\b/y],
        ['word', /[A-Za-z_][\w@./:-]*/y],
    ],
}
const KEYWORDS = new Set(['import', 'from', 'export', 'default', 'const', 'let', 'return', 'await', 'async', 'new', 'function'])
const CONSTANTS = new Set(['true', 'false', 'null', 'undefined'])

function tokenize(line, lang) {
    const rules = RULES[lang]
    const tokens = []
    let plain = ''
    let expectCommand = true
    let i = 0
    const flush = () => {
        if (plain) tokens.push({ type: 'plain', text: plain })
        plain = ''
    }
    while (i < line.length) {
        let matched = null
        for (const [type, re] of rules) {
            re.lastIndex = i
            const m = re.exec(line)
            if (m && m[0]) {
                matched = { type, text: m[0] }
                break
            }
        }
        if (!matched) {
            plain += line[i]
            if (lang === 'sh' && (line[i] === '&' || line[i] === '|')) expectCommand = true
            i += 1
            continue
        }
        flush()
        let { type } = matched
        if (type === 'word') {
            const rest = line.slice(i + matched.text.length)
            if (lang === 'sh') {
                if (expectCommand) type = 'command'
                else type = /@|^https?:/.test(matched.text) ? 'string' : 'plain'
                expectCommand = false
            } else if (KEYWORDS.has(matched.text)) type = 'keyword'
            else if (CONSTANTS.has(matched.text)) type = 'number'
            else if (/^\s*\(/.test(rest)) type = 'fn'
            else if (/^\s*:/.test(rest)) type = 'prop'
            else type = 'plain'
        }
        tokens.push({ type, text: matched.text })
        i += matched.text.length
    }
    flush()
    return tokens
}

const tokenClass = {
    plain: 'text-[#e4e4ea]',
    comment: 'italic text-[#6b6b7b]',
    string: 'text-[#f0abfc]',
    number: 'text-[#fcd34d]',
    keyword: 'text-[#c4b5fd]',
    fn: 'text-[#93c5fd]',
    prop: 'text-[#a5b4fc]',
    flag: 'text-[#fcd34d]',
    command: 'font-semibold text-[#c4b5fd]',
}

function Highlighted({ line, lang }) {
    return tokenize(line, lang).map((token, i) => (
        <span key={`${i}-${token.text}`} className={tokenClass[token.type]}>
            {token.text}
        </span>
    ))
}

function legacyCopy(text) {
    try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        return ok
    } catch {
        return false
    }
}

const slideVariants = {
    enter: (dir) => ({ x: dir < 0 ? -56 : 56, opacity: 0, filter: 'blur(6px)' }),
    center: {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        transition: { duration: 0.6, ease: EASE, staggerChildren: 0.06 },
    },
    exit: (dir) => ({ x: dir < 0 ? 56 : -56, opacity: 0, filter: 'blur(6px)', transition: { duration: 0.35, ease: 'easeIn' } }),
}

const rise = {
    enter: { y: 14, opacity: 0 },
    center: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
}

const linesGroup = {
    enter: {},
    center: { transition: { staggerChildren: 0.22, delayChildren: 0.35 } },
    exit: {},
}

const lineIn = {
    enter: { opacity: 0, x: -8 },
    center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0 },
}

const typeIn = {
    enter: { clipPath: 'inset(0 100% 0 0)' },
    center: { clipPath: 'inset(0 0% 0 0)', transition: { duration: 0.7, ease: 'linear' } },
    exit: {},
}

function TerminalLine({ line, live }) {
    const Wrapper = live ? motion.div : 'div'
    const motionProps = live ? { variants: lineIn } : {}
    if (line.type === 'bar') {
        return (
            <Wrapper {...motionProps} className="flex items-center gap-3 py-1 pl-4">
                <span className="text-[#6b6b7b]">{line.text}</span>
                <span className="relative h-1.5 w-40 max-w-[50%] overflow-hidden rounded-full bg-white/10">
                    {live ? (
                        <motion.span
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.6, delay: 1.1, ease: EASE }}
                            className="absolute inset-0 origin-left rounded-full bg-[#8b5cf6]"
                        />
                    ) : (
                        <span className="absolute inset-0 rounded-full bg-[#8b5cf6]" />
                    )}
                </span>
                <span className="text-[#c4b5fd]">100%</span>
            </Wrapper>
        )
    }
    if (line.type === 'cmd') {
        return (
            <Wrapper {...motionProps} className="flex gap-2">
                <span className="shrink-0 select-none text-[#8b5cf6]">$</span>
                {live ? (
                    <motion.span variants={typeIn} className="block min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]">
                        <Highlighted line={line.text} lang="sh" />
                    </motion.span>
                ) : (
                    <span className="block min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]">
                        <Highlighted line={line.text} lang="sh" />
                    </span>
                )}
            </Wrapper>
        )
    }
    return (
        <Wrapper
            {...motionProps}
            className={cn(
                'whitespace-pre-wrap pl-4 [overflow-wrap:anywhere]',
                line.type === 'out' && 'text-[#8f8fa3]',
                line.type === 'link' && 'text-[#c4b5fd]',
                line.type === 'ok' && 'text-[#e4e4ea]',
            )}
        >
            {line.type === 'ok' && <span className="mr-2 text-[#86efac]">✔</span>}
            {line.text}
        </Wrapper>
    )
}

function SlidePanel({ slide, live, copied, onCopy }) {
    const reduce = useReducedMotion()
    const { panel } = slide
    const Group = live ? motion.div : 'div'
    const groupProps = live ? { variants: linesGroup } : {}
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#08080b] shadow-[0_30px_80px_-30px_rgba(139,92,246,0.45)]">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
                <span aria-hidden="true" className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-white/20" />
                    <span className="size-2.5 rounded-full bg-white/20" />
                    <span className="size-2.5 rounded-full bg-white/20" />
                </span>
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-white/50">{panel.title}</span>
                {live ? (
                    <button
                        type="button"
                        aria-label={copied ? 'Copied to clipboard' : `Copy ${panel.kind === 'code' ? 'config file' : 'commands'}`}
                        className={cn(
                            'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 font-mono text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]',
                            copied ? 'bg-[#8b5cf6] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white',
                        )}
                        onClick={onCopy}
                    >
                        {copied ? <HiCheck aria-hidden="true" className="size-3.5" /> : <HiOutlineClipboardDocument aria-hidden="true" className="size-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                ) : (
                    <span className="inline-flex min-h-10 items-center px-3 font-mono text-[11px]">Copy</span>
                )}
            </div>
            <div className="min-h-0 flex-1 overflow-hidden p-4 font-mono text-[12px] leading-6 sm:p-5 sm:text-[13px]">
                {panel.kind === 'terminal' ? (
                    <Group {...groupProps}>
                        {panel.lines.map((line) => (
                            <TerminalLine key={line.text} line={line} live={live} />
                        ))}
                        {live ? (
                            <motion.div variants={lineIn} className="mt-1 flex items-center gap-2">
                                <span className="text-[#8b5cf6]">$</span>
                                <motion.span
                                    aria-hidden="true"
                                    animate={reduce ? { opacity: 1 } : { opacity: [1, 0, 1] }}
                                    transition={reduce ? { duration: 0 } : { duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="inline-block h-4 w-2 bg-[#c4b5fd]"
                                />
                            </motion.div>
                        ) : (
                            <div className="mt-1 h-6" />
                        )}
                    </Group>
                ) : (
                    <Group {...groupProps}>
                        {panel.code.map((line, i) => {
                            const Row = live ? motion.div : 'div'
                            return (
                                <Row key={`${i}-${line}`} {...(live ? { variants: lineIn } : {})} className="flex">
                                    <span aria-hidden="true" className="w-7 shrink-0 select-none pr-3 text-right text-white/20 sm:w-8 sm:pr-4">
                                        {i + 1}
                                    </span>
                                    <span className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]">
                                        {line ? <Highlighted line={line} lang="ts" /> : ' '}
                                    </span>
                                </Row>
                            )
                        })}
                    </Group>
                )}
            </div>
        </div>
    )
}

function SlideBody({ slide, index, live, copied, onCopy }) {
    const Item = live ? motion.div : 'div'
    const itemProps = live ? { variants: rise } : {}
    return (
        <div className="grid h-full gap-6 p-5 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:p-10">
            <div className="flex flex-col">
                <Item {...itemProps} className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
                    <span className="text-[#a78bfa]">
                        Step {pad(index + 1)} / {pad(total)}
                    </span>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 normal-case tracking-normal text-white/70">{slide.time}</span>
                </Item>
                <Item {...itemProps}>
                    <h3 className="mt-4 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">{slide.title}</h3>
                </Item>
                <Item {...itemProps}>
                    <p className="mt-4 max-w-md text-sm leading-6 text-white/65 sm:text-[15px] sm:leading-7">{slide.copy}</p>
                </Item>
                <Item {...itemProps} className="hidden sm:block">
                    <ul className="mt-6 space-y-2.5">
                        {slide.checks.map((check) => (
                            <li key={check} className="flex items-start gap-2.5 text-sm text-white/80">
                                <LuCircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[#a78bfa]" />
                                {check}
                            </li>
                        ))}
                    </ul>
                </Item>
                <Item {...itemProps} className="mt-5 sm:mt-7 lg:mt-auto lg:pt-8">
                    {live ? (
                        <a
                            href={slide.href}
                            draggable={false}
                            className="group inline-flex min-h-10 items-center gap-2 rounded-md text-sm font-semibold text-[#c4b5fd] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6]"
                        >
                            {slide.linkLabel}
                            <HiArrowLongRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                        </a>
                    ) : (
                        <span className="inline-flex min-h-10 items-center text-sm font-semibold">{slide.linkLabel}</span>
                    )}
                </Item>
            </div>
            <Item {...itemProps} className="min-w-0">
                <SlidePanel slide={slide} live={live} copied={copied} onCopy={onCopy} />
            </Item>
        </div>
    )
}

export function GettingStartedSlider({
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
    const [copyState, setCopyState] = useState(null)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const stageRef = useRef(null)
    const panning = useRef(false)
    const moved = useRef(false)
    const panAt = useRef(0)
    const snapBack = useRef(null)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const slide = slides[index]

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
    }, [])

    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    useEffect(() => {
        if (!copyState) return undefined
        const id = setTimeout(() => setCopyState(null), 1800)
        return () => clearTimeout(id)
    }, [copyState])

    useEffect(() => () => snapBack.current?.stop(), [])

    const copySlide = async () => {
        const text = slide.panel.clipboard ?? slide.panel.code.join('\n')
        let ok = false
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text)
                ok = true
            }
        } catch {
            ok = false
        }
        if (!ok) ok = legacyCopy(text)
        setCopyState({ id: slide.id, ok, at: Date.now() })
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
        setFocused(true)
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
        snapBack.current?.stop()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        dragX.set(info.offset.x * 0.4)
    }

    const handlePanEnd = (_, info) => {
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        // Pan velocity reads low when the frame loop was idle, so a short, quick swipe
        // (< 250 ms, > 24 px) also counts as a flick in the drag direction.
        const flick = performance.now() - panAt.current < 250 && Math.abs(offset.x) > 24
        if (offset.x < -70 || (offset.x < -10 && (velocity.x < -400 || flick))) paginate(1)
        else if (offset.x > 70 || (offset.x > 10 && (velocity.x > 400 || flick))) paginate(-1)
        snapBack.current = animate(dragX, 0, { type: 'spring', stiffness: 320, damping: 34 })
    }

    const copied = copyState?.id === slide.id && copyState.ok

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0b0b0f] px-4 py-16 text-base font-normal text-[#ededf2] sm:px-6 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute -left-40 -top-40 -z-10 size-[36rem] rounded-full bg-[#8b5cf6] opacity-[0.16] blur-[140px]" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:100%_40px] [mask-image:linear-gradient(to_bottom,black,transparent_60%)]"
            />

            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#a78bfa]">
                                <span className="grid size-6 place-items-center rounded-md bg-[#8b5cf6] text-[10px] font-bold tracking-normal text-[#0b0b0f]">
                                    S/
                                </span>
                                Stackdocs quickstart
                            </p>
                            <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                                From empty folder to{' '}
                                <span className="bg-linear-to-r from-[#c4b5fd] to-[#8b5cf6] bg-clip-text text-transparent">live docs</span> in
                                three steps.
                            </h2>
                        </div>
                        <div className="flex flex-col gap-2 lg:items-end">
                            <p className="font-mono text-xs text-white/50">≈ 6 minutes · CLI v4.2 · Node 20+</p>
                            <a
                                href="#stackdocs-quickstart"
                                className="group inline-flex min-h-10 items-center gap-2 self-start rounded-md text-sm font-semibold text-white transition-colors hover:text-[#c4b5fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] lg:self-auto"
                            >
                                Read the full quickstart
                                <HiArrowLongRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Stackdocs getting started steps"
                        className="mt-10"
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
                        <ol aria-label="Steps" className="grid grid-cols-3 gap-2 sm:gap-4">
                            {slides.map((item, i) => {
                                const done = i < index
                                const current = i === index
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            aria-label={`Step ${i + 1}: ${item.label}`}
                                            aria-current={current ? 'step' : undefined}
                                            className="group flex min-h-12 w-full flex-col gap-2.5 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6]"
                                            onClick={() => goTo(i)}
                                        >
                                            <span className="flex items-center gap-2 sm:gap-2.5">
                                                <span
                                                    className={cn(
                                                        'grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] transition-colors duration-300 sm:size-7 sm:text-[11px]',
                                                        current && 'border-[#8b5cf6] bg-[#8b5cf6] text-white',
                                                        done && 'border-[#8b5cf6]/60 bg-[#8b5cf6]/15 text-[#c4b5fd]',
                                                        !current && !done && 'border-white/15 text-white/50 group-hover:border-white/40',
                                                    )}
                                                >
                                                    {done ? <HiCheck aria-hidden="true" className="size-3.5" /> : pad(i + 1)}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'truncate text-xs font-semibold transition-colors sm:text-sm',
                                                        current ? 'text-white' : 'text-white/50 group-hover:text-white/80',
                                                    )}
                                                >
                                                    {item.label}
                                                </span>
                                            </span>
                                            <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                                                <motion.span
                                                    className="absolute inset-0 origin-left rounded-full bg-[#8b5cf6]"
                                                    style={{ scaleX: current ? (autoplayOn ? progress : 1) : done ? 1 : 0 }}
                                                />
                                            </span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ol>

                        <motion.div
                            ref={stageRef}
                            role="group"
                            tabIndex={0}
                            aria-label="Steps, drag or use the left and right arrow keys to browse"
                            className={cn(
                                'relative mt-6 grid touch-pan-y select-none overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111117] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6]',
                                dragging ? 'cursor-grabbing' : 'cursor-grab',
                            )}
                            onPointerDownCapture={() => {
                                moved.current = false
                            }}
                            onClickCapture={(event) => {
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
                            {/* Invisible stack of every slide keeps the stage height stable. */}
                            {slides.map((item, i) => (
                                <div key={item.id} inert aria-hidden="true" className="invisible col-start-1 row-start-1">
                                    <SlideBody slide={item} index={i} live={false} />
                                </div>
                            ))}

                            <motion.div className="absolute inset-0" style={{ x: dragX }}>
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={slide.id}
                                        role="group"
                                        aria-roledescription="slide"
                                        aria-label={`${index + 1} of ${total}: ${slide.label}`}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        className="absolute inset-0"
                                    >
                                        <SlideBody live slide={slide} index={index} copied={copied} onCopy={copySlide} />
                                    </motion.div>
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                            <p className="font-mono text-sm tabular-nums text-white/50">
                                <span className="text-white">{pad(index + 1)}</span> / {pad(total)}
                                <span aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                                    Step {index + 1} of {total}: {slide.label}
                                </span>
                                <span aria-live="polite" className="sr-only">
                                    {copyState ? (copyState.ok ? 'Copied to clipboard' : 'Copy failed') : ''}
                                </span>
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                    className="grid size-11 place-items-center rounded-full text-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                                    onClick={() => setPlayPref(!autoplayOn)}
                                >
                                    {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                </button>
                                <button
                                    type="button"
                                    aria-label="Previous step"
                                    className="grid size-11 place-items-center rounded-full border border-white/15 text-lg transition-colors hover:border-[#8b5cf6] hover:bg-[#8b5cf6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                                    onClick={() => paginate(-1)}
                                >
                                    <HiArrowLongLeft aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next step"
                                    className="grid size-11 place-items-center rounded-full border border-white/15 text-lg transition-colors hover:border-[#8b5cf6] hover:bg-[#8b5cf6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                                    onClick={() => paginate(1)}
                                >
                                    <HiArrowLongRight aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default GettingStartedSlider
