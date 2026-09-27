// WordRevealAboutStory

// AboutStory04 · Corporate & Business › About Us / Story

// Description:
// A single, very large statement for the brand consultancy Northlight Studio that lights up
// word by word as the reader scrolls: "We are Northlight, a studio of twenty-three writers,
// designers and strategists…", with a few key words set in italic serif. Three small caption
// blocks (Practice, People, Proof) and the links "Read the studio manual" / "Start a project"
// sit below. Use it as the manifesto or about block of an agency or consultancy site.

// Design:
// - Black #0a0a0a section, off-white #f2efe8 type; unread words sit at #5f5b54 (about 3:1
//   on black, still legible at this size) and brighten to off-white; no other colour
// - Statement text-[1.9rem] → sm:text-5xl → lg:text-[4.1rem], tight leading and tracking;
//   sans with italic serif accents; mono meta bar and captions with (01)–(03) indices
// - A hairline progress bar and a live "Read 00%" counter track the reveal; a ✦ mark
//   separates the meta bar from the statement
// - Responsive: captions stack on base, 3 columns from md; the meta bar wraps on small
//   screens; the statement keeps full width with a 16px gutter

// What it does:
// - useScroll tracks the statement from "start 85%" to "end 40%" of the viewport; each
//   word maps its own slice of that progress to a colour with useTransform
// - The same progress drives the bar (scaleX) and the rounded percentage in the meta bar
// - With reduced motion every word renders at full brightness and the counter is hidden;
//   the text is always real, selectable text
// - "Read the studio manual" links to #northlight-manual, "Start a project" to #northlight-contact

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import WordRevealAboutStory from '@/TestComponent/PageSections/corporate/AboutStory04';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <WordRevealAboutStory />
//     </main>
// )
// ```

'use client'

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const DIM = '#5f5b54'
const BRIGHT = '#f2efe8'

const statement =
    'We are Northlight, a studio of twenty-three writers, designers and strategists who believe a company’s *name,* *voice* and *mark* should be built like architecture: made to be *lived* *in* for decades, not admired for a quarter. We work slowly at the start so our clients can move quickly for years.'

const words = statement.split(' ').map((raw) => ({
    text: raw.replace(/\*/g, ''),
    accent: raw.startsWith('*'),
}))

const captions = [
    {
        index: '01',
        title: 'Practice',
        text: 'Naming, identity systems and brand voice for companies that plan to still be around in 2050.',
    },
    {
        index: '02',
        title: 'People',
        text: 'Twenty-three people across Oslo and Lisbon. Average tenure: seven years. No account managers.',
    },
    {
        index: '03',
        title: 'Proof',
        text: '140 brands launched since 2011. Nine still use the very first logo we drew for them.',
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2efe8]'

function Word({ word, index, total, progress, reduceMotion }) {
    const start = index / total
    const end = Math.min(1, start + 1.6 / total)
    const color = useTransform(progress, [start, end], [DIM, BRIGHT])

    return (
        <motion.span
            className={cn(word.accent && 'font-serif font-normal italic tracking-normal')}
            style={{ color: reduceMotion ? BRIGHT : color }}
        >
            {word.text}
        </motion.span>
    )
}

export function WordRevealAboutStory({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const statementRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: statementRef, offset: ['start 0.85', 'end 0.4'] })
    const percent = useTransform(scrollYProgress, (value) => `${String(Math.round(value * 100)).padStart(2, '0')}%`)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0a0a0a] py-16 font-sans text-base font-normal text-[#f2efe8] md:py-28',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-[#f2efe8]/15 pb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#f2efe8]/60">
                    <h2 className="font-mono text-[11px] font-normal uppercase tracking-[0.22em] text-[#f2efe8]">
                        (About) Northlight Studio
                    </h2>
                    <p>Oslo · Lisbon · Est. 2011</p>
                    {!reduceMotion && (
                        <p aria-hidden="true" className="flex items-center gap-3">
                            Read <motion.span className="tabular-nums text-[#f2efe8]">{percent}</motion.span>
                        </p>
                    )}
                </div>
                <motion.div
                    aria-hidden="true"
                    className="h-px origin-left bg-[#f2efe8]"
                    style={{ scaleX: reduceMotion ? 1 : scrollYProgress }}
                />

                <p aria-hidden="true" className="mt-12 text-2xl text-[#f2efe8]/70 md:mt-16">
                    ✦
                </p>

                <p
                    ref={statementRef}
                    className="mt-6 text-[1.9rem] font-medium leading-[1.12] tracking-[-0.02em] sm:text-5xl lg:text-[4.1rem]"
                >
                    {words.map((word, index) => (
                        <span key={`${word.text}-${index}`}>
                            <Word
                                word={word}
                                index={index}
                                total={words.length}
                                progress={scrollYProgress}
                                reduceMotion={reduceMotion}
                            />{' '}
                        </span>
                    ))}
                </p>

                <div className="mt-16 grid gap-10 border-t border-[#f2efe8]/15 pt-8 md:mt-24 md:grid-cols-3 md:gap-8">
                    {captions.map((caption) => (
                        <div key={caption.index} className="max-w-xs">
                            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#f2efe8]/50">
                                ({caption.index}) {caption.title}
                            </p>
                            <p className="mt-3 text-sm leading-relaxed text-[#f2efe8]/80">{caption.text}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                    <a
                        href="#northlight-contact"
                        className={cn(
                            'group inline-flex min-h-12 items-center justify-between gap-6 rounded-full bg-[#f2efe8] px-6 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-white sm:justify-start',
                            focusRing,
                        )}
                    >
                        Start a project
                        <HiArrowUpRight
                            aria-hidden="true"
                            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                    <a
                        href="#northlight-manual"
                        className={cn(
                            'inline-flex min-h-12 items-center gap-2 rounded-full border border-[#f2efe8]/30 px-6 text-sm text-[#f2efe8] transition-colors hover:border-[#f2efe8]',
                            focusRing,
                        )}
                    >
                        Read the studio manual (46 pages)
                    </a>
                </div>
            </div>
        </section>
    )
}

export default WordRevealAboutStory
