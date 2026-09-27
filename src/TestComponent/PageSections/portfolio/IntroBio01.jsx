// GiantNameIntroBio

// IntroBio01 · Portfolios & Personal Websites › Intro / Bio

// Description:
// A Swiss-poster style intro for frontend developer Rafi Chowdhury. His name is set
// enormous and edge-to-edge ("RAFI" / "CHOWDHURY"), with a portrait pill, a spinning
// "Available for work" badge, a role line that rotates React / Motion / Design systems,
// Dhaka local time and a short bio with "See selected work" and "Get in touch" CTAs.
// Use it as the first section of a developer portfolio or personal site.

// Design:
// - Off-white #f2f0eb canvas, ink #0a0a0a type and cobalt #1f3fff accents; faint 4 → 12
//   column guide lines behind everything, hairline ink rules around the meta row
// - Name in font-black uppercase at clamp(3rem, 13.5vw, 17rem); "CHOWDHURY" letters are
//   spread with justify-between so the word always runs edge-to-edge of the gutter
// - Meta row 2 cols → md:4 cols (name ©, role, Dhaka time, pulsing availability dot);
//   bottom row stacks on mobile and splits 7 / 5 columns from lg
// - Letters rise out of line masks with a stagger, the badge text spins every 18 s and
//   rotating words slide vertically over a filling cobalt timer bar; all of it is removed
//   for reduced motion
// - Buttons are square-cornered ink blocks (48px tall) that flood cobalt on hover

// What it does:
// - wordIndex cycles through the three specialities every 2.4 s; hovering or focusing the
//   role line pauses it; reduced motion shows all three words statically instead
// - Dhaka time renders a fixed "09:41" on the server, then useEffect formats the real time
//   for Asia/Dhaka and refreshes it every 15 s (interval cleared on unmount)
// - The badge links to #work, "See selected work" to #work and "Get in touch" to #contact

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GiantNameIntroBio from '@/TestComponent/PageSections/portfolio/IntroBio01';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <GiantNameIntroBio />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowDownRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const ROLES = ['React', 'Motion', 'Design systems']
const INITIAL_TIME = '09:41'
const EASE = [0.22, 1, 0.36, 1]

const facts = [
    { value: '7 yrs', label: 'Shipping production UI' },
    { value: '42', label: 'Products launched' },
    { value: '3', label: 'Design systems built' },
]

function MaskedLetters({ word, delay, reduceMotion, className }) {
    return word.split('').map((char, index) => (
        <span key={`${word}-${index}`} className={cn('inline-block overflow-hidden pt-[0.05em]', className)}>
            <motion.span
                className="inline-block"
                initial={reduceMotion ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, delay: delay + index * 0.045, ease: EASE }}
            >
                {char}
            </motion.span>
        </span>
    ))
}

export function GiantNameIntroBio({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const badgeId = `rafi-badge-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
    const [time, setTime] = useState(INITIAL_TIME)
    const [wordIndex, setWordIndex] = useState(0)
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Dhaka',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        })
        const tick = () => setTime(formatter.format(new Date()))
        tick()
        const id = setInterval(tick, 15000)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        if (reduceMotion || paused) return undefined
        const id = setInterval(() => setWordIndex((i) => (i + 1) % ROLES.length), 2400)
        return () => clearInterval(id)
    }, [reduceMotion, paused])

    const hour = Number(time.slice(0, 2))
    const daytime = hour >= 7 && hour < 19

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#f2f0eb] text-base font-normal text-[#0a0a0a] selection:bg-[#1f3fff] selection:text-white',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 grid grid-cols-4 px-4 sm:px-6 md:grid-cols-12 lg:px-10"
            >
                {Array.from({ length: 12 }, (_, i) => (
                    <span
                        key={i}
                        className={cn('border-l border-[#0a0a0a]/[0.06]', i >= 4 && 'hidden md:block', i === 11 && 'border-r')}
                    />
                ))}
            </div>

            <div className="px-4 pb-14 pt-6 sm:px-6 md:pb-20 lg:px-10">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-[#0a0a0a] py-3 text-[10.5px] font-semibold uppercase tracking-[0.1em] sm:text-xs sm:tracking-[0.16em] md:grid-cols-4">
                    <p className="text-[#0a0a0a]">
                        Rafi Chowdhury <span className="text-[#1f3fff]">©2026</span>
                    </p>
                    <p className="text-right text-[#0a0a0a] md:text-left">Frontend Developer</p>
                    <p className="flex items-center gap-1.5 whitespace-nowrap text-[#0a0a0a]">
                        <span>Dhaka, BD</span>
                        <span aria-hidden="true" className="text-[#0a0a0a]/40">/</span>
                        <span className="tabular-nums">{time}</span>
                        <span className="hidden text-[#0a0a0a]/50 sm:inline">GMT+6</span>
                        <span aria-hidden="true" className="text-[#1f3fff]">
                            {daytime ? '☀' : '☾'}
                        </span>
                    </p>
                    <p className="flex items-center justify-end gap-2 whitespace-nowrap text-[#0a0a0a]">
                        <span className="relative flex size-2.5" aria-hidden="true">
                            <span className="absolute inline-flex size-full rounded-full bg-[#1f3fff] opacity-60 motion-safe:animate-ping" />
                            <span className="relative inline-flex size-2.5 rounded-full bg-[#1f3fff]" />
                        </span>
                        Available for work
                    </p>
                </div>

                <h2 className="sr-only text-base font-bold text-[#0a0a0a]">Rafi Chowdhury, frontend developer</h2>
                <div className="mt-8 font-sans text-[clamp(3rem,13.5vw,17rem)] font-black uppercase leading-[0.8] text-[#0a0a0a] md:mt-12">
                    <div className="flex items-center justify-between gap-[0.1em]">
                        <div className="flex items-center">
                            <span aria-hidden="true" className="flex">
                                <MaskedLetters word="Rafi" delay={0.05} reduceMotion={reduceMotion} />
                            </span>
                            <motion.span
                                initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
                                className="group/pill relative ml-[0.1em] inline-block h-[0.62em] w-[1.3em] overflow-hidden rounded-full bg-[#1f3fff]"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=600&q=80"
                                    alt="Rafi Chowdhury in glasses and a striped tee"
                                    className="size-full object-cover object-[50%_30%] grayscale transition duration-700 ease-out group-hover/pill:scale-110 group-hover/pill:grayscale-0"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 bg-[#1f3fff] mix-blend-screen transition-opacity duration-700 group-hover/pill:opacity-0"
                                />
                            </motion.span>
                        </div>

                        <a
                            href="#work"
                            aria-label="Available for work from November 2026 — scroll to selected work"
                            className="group relative grid size-[clamp(3.5rem,0.95em,12rem)] shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3fff]"
                        >
                            <motion.svg
                                viewBox="0 0 100 100"
                                aria-hidden="true"
                                className="absolute inset-0 size-full text-[#0a0a0a]"
                                animate={reduceMotion ? undefined : { rotate: 360 }}
                                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                            >
                                <defs>
                                    <path id={badgeId} d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" />
                                </defs>
                                <text fill="currentColor" fontSize="9" fontWeight="700" className="font-mono uppercase">
                                    <textPath href={`#${badgeId}`} textLength="242" lengthAdjust="spacing">
                                        Available for work · Nov 2026 ·
                                    </textPath>
                                </text>
                            </motion.svg>
                            <span className="relative grid size-[46%] place-items-center rounded-full bg-[#1f3fff] text-white transition-transform duration-500 ease-out group-hover:scale-110">
                                <HiArrowDownRight
                                    aria-hidden="true"
                                    className="size-[45%] transition-transform duration-500 group-hover:rotate-[-45deg]"
                                />
                            </span>
                        </a>
                    </div>
                    <div aria-hidden="true" className="mt-[0.06em] flex justify-between">
                        <MaskedLetters word="Chowdhury" delay={0.2} reduceMotion={reduceMotion} />
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-10 border-t border-[#0a0a0a] pt-8 md:mt-14 lg:grid-cols-12 lg:gap-8">
                    <div
                        className="lg:col-span-7"
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                        onFocus={() => setPaused(true)}
                        onBlur={() => setPaused(false)}
                    >
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f3fff]">
                            (01) — What I do
                        </p>
                        <p className="mt-4 max-w-3xl text-[clamp(1.6rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#0a0a0a]">
                            I build interfaces that feel fast, honest and a little bit alive, with{' '}
                            {reduceMotion ? (
                                <span className="text-[#1f3fff]">React, Motion &amp; Design systems.</span>
                            ) : (
                                <span className="relative inline-grid align-bottom text-[#1f3fff]">
                                    <span className="sr-only">React, Motion and Design systems.</span>
                                    {ROLES.map((role) => (
                                        <span key={role} aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
                                            {role}.
                                        </span>
                                    ))}
                                    <span aria-hidden="true" className="col-start-1 row-start-1 overflow-hidden whitespace-nowrap">
                                        <AnimatePresence mode="wait" initial={false}>
                                            <motion.span
                                                key={ROLES[wordIndex]}
                                                className="inline-block"
                                                initial={{ y: '100%' }}
                                                animate={{ y: '0%' }}
                                                exit={{ y: '-100%' }}
                                                transition={{ duration: 0.45, ease: EASE }}
                                            >
                                                {ROLES[wordIndex]}.
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                    <span aria-hidden="true" className="absolute -bottom-1 left-0 h-[3px] w-full bg-[#1f3fff]/25">
                                        <motion.span
                                            key={`bar-${wordIndex}-${paused}`}
                                            className="block h-full origin-left bg-[#1f3fff]"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: paused ? 0 : 1 }}
                                            transition={{ duration: paused ? 0.2 : 2.4, ease: 'linear' }}
                                        />
                                    </span>
                                </span>
                            )}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2" aria-hidden={!reduceMotion}>
                            {ROLES.map((role, index) => (
                                <span
                                    key={role}
                                    className={cn(
                                        'border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300',
                                        index === wordIndex && !reduceMotion
                                            ? 'border-[#1f3fff] bg-[#1f3fff] text-white'
                                            : 'border-[#0a0a0a]/25 text-[#0a0a0a]/70',
                                    )}
                                >
                                    {String(index + 1).padStart(2, '0')} {role}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 lg:col-span-5 lg:pl-8">
                        <p className="max-w-md text-base leading-relaxed text-[#0a0a0a]/75 md:text-lg">
                            Frontend developer in Dhaka turning product ideas into quick, accessible
                            interfaces. Seven years in, I have led UI for fintech, logistics and
                            open-source mapping — currently freelancing, and open to a senior role from
                            November.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <a
                                href="#work"
                                className="group inline-flex min-h-12 items-center justify-between gap-6 bg-[#0a0a0a] px-5 text-sm font-semibold text-[#f2f0eb] transition-colors duration-300 hover:bg-[#1f3fff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3fff]"
                            >
                                See selected work
                                <HiArrowDownRight
                                    aria-hidden="true"
                                    className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                                />
                            </a>
                            <a
                                href="#contact"
                                className="group inline-flex min-h-12 items-center justify-between gap-6 border border-[#0a0a0a] px-5 text-sm font-semibold text-[#0a0a0a] transition-colors duration-300 hover:border-[#1f3fff] hover:text-[#1f3fff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3fff]"
                            >
                                Get in touch
                                <HiArrowUpRight
                                    aria-hidden="true"
                                    className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                />
                            </a>
                        </div>

                        <dl className="grid grid-cols-3 border-t border-[#0a0a0a]">
                            {facts.map((fact, index) => (
                                <div
                                    key={fact.label}
                                    className={cn(
                                        'flex flex-col-reverse justify-end pt-4',
                                        index > 0 && 'border-l border-[#0a0a0a]/20 pl-3 sm:pl-4',
                                    )}
                                >
                                    <dt className="mt-1 text-[11px] leading-snug text-[#0a0a0a]/60">{fact.label}</dt>
                                    <dd className="text-2xl font-black tracking-[-0.04em] text-[#0a0a0a] sm:text-3xl">
                                        {fact.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GiantNameIntroBio
