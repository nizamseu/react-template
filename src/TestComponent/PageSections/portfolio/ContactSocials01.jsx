// GiantEmailContactSocials

// ContactSocials01 · Portfolios & Personal Websites › Contact / Socials

// Description:
// A full-bleed cobalt sign-off for frontend developer Rafi Chowdhury. After the prompt
// "Got an interface that should feel instant? Say hello." the address hello@rafi.dev is
// set edge to edge with a letter-roll hover, next to a "Copy address" button that confirms
// with "Copied!". Below sit Rafi’s live local time in Dhaka, his reply hours and a row of
// social profiles (GitHub, LinkedIn, X, Dribbble, CodePen). Use it as the closing section
// or footer of a developer portfolio.

// Design:
// - Single column on a max-w-7xl grid: eyebrow + availability pill, prompt, giant address,
//   copy row, then a bottom band md:grid-cols-[1fr_1fr_1.4fr] (time / hours / socials)
// - Cobalt #1f3fff background, white #ffffff text, periwinkle #c9d2ff for the rolled-in
//   letters and the availability dot glow; a 40rem white/4% "@" watermark bottom-right
// - Address in heavy sans at text-[clamp(2.3rem,14.5vw,14rem)], tracking -0.045em, split
//   into two no-wrap chunks so it can only break after the "@"; mono eyebrow, clock and
//   handles
// - Hovering or focusing the address rolls each letter up with an 18 ms stagger and draws
//   a white underline; social rows invert to white-on-cobalt; no transitions for reduced
//   motion
// - Responsive: base stacks everything (the address wraps after "@" only if it can’t fit);
//   sm puts the copy button and note side by side; md splits the bottom band into three
//   columns; lg larger prompt type and spacing

// What it does:
// - "Copy address" writes hello@rafi.dev with navigator.clipboard, falling back to a hidden
//   textarea + execCommand('copy'); the label shows "Copied!" or "Copy failed" for 2.2 s
//   (timeout cleared on re-click/unmount) and an aria-live region announces the result
// - The clock renders a fixed 10:24:36 AM on the server, then a 1 s interval (cleared on
//   unmount) shows Dhaka time (UTC+6, no DST) and a status line based on hour and weekday
// - The giant address links to #email (swap in mailto: for production); social rows link
//   to #github, #linkedin, #x, #dribbble, #codepen and "Back to top" to #top

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GiantEmailContactSocials from '@/TestComponent/PageSections/portfolio/ContactSocials01';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <GiantEmailContactSocials />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { FaCodepen, FaDribbble, FaGithub, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6';
import { HiArrowUp, HiArrowUpRight, HiCheck, HiOutlineClipboardDocument } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EMAIL = 'hello@rafi.dev'
const EMAIL_CHUNKS = ['hello@', 'rafi.dev']
const DHAKA_OFFSET = 6 * 3600e3
const INITIAL_TIME = { hours: 10, minutes: 24, seconds: 36, weekday: 2 }

const socials = [
    { id: 'github', label: 'GitHub', handle: '@rafi-codes', icon: FaGithub },
    { id: 'linkedin', label: 'LinkedIn', handle: 'in/rafichowdhury', icon: FaLinkedinIn },
    { id: 'x', label: 'X', handle: '@rafi_ui', icon: FaXTwitter },
    { id: 'dribbble', label: 'Dribbble', handle: 'rafi-motion', icon: FaDribbble },
    { id: 'codepen', label: 'CodePen', handle: 'rafichowdhury', icon: FaCodepen },
]

const pad = (n) => String(n).padStart(2, '0')

function readDhakaTime() {
    const shifted = new Date(Date.now() + DHAKA_OFFSET)
    return {
        hours: shifted.getUTCHours(),
        minutes: shifted.getUTCMinutes(),
        seconds: shifted.getUTCSeconds(),
        weekday: shifted.getUTCDay(),
    }
}

function statusFor({ hours, weekday }) {
    if (weekday === 5 || weekday === 6) return 'Weekend in Dhaka — I’ll reply on Sunday'
    if (hours >= 10 && hours < 19) return 'At the desk — replies within a few hours'
    if (hours >= 19 && hours < 23) return 'Evening in Dhaka — reply by tomorrow, 11:00'
    if (hours >= 7 && hours < 10) return 'Morning chai — online from 10:00'
    return 'Asleep in Dhaka — reply by 11:00 GMT+6'
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

export function GiantEmailContactSocials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [time, setTime] = useState(INITIAL_TIME)
    const [copyState, setCopyState] = useState('idle')

    useEffect(() => {
        const tick = () => setTime(readDhakaTime())
        tick()
        const id = setInterval(tick, 1000)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        if (copyState === 'idle') return undefined
        const id = setTimeout(() => setCopyState('idle'), 2200)
        return () => clearTimeout(id)
    }, [copyState])

    const copyEmail = async () => {
        let ok = false
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(EMAIL)
                ok = true
            }
        } catch {
            ok = false
        }
        if (!ok) ok = legacyCopy(EMAIL)
        setCopyState(ok ? 'copied' : 'failed')
    }

    const hour12 = time.hours % 12 === 0 ? 12 : time.hours % 12
    const period = time.hours < 12 ? 'AM' : 'PM'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#1f3fff] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-[0.28em] -right-[0.08em] -z-10 select-none text-[40rem] font-semibold leading-none text-white/[0.04]"
            >
                @
            </span>

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/70">(07) — Contact</p>
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white ring-1 ring-white/20">
                        <span className="relative flex size-2">
                            <span className="absolute inset-0 animate-ping rounded-full bg-[#c9d2ff] motion-reduce:animate-none" />
                            <span className="relative size-2 rounded-full bg-white" />
                        </span>
                        Booking projects from November 2026
                    </p>
                </div>

                <h2 className="mt-14 max-w-3xl text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl lg:mt-20 lg:text-5xl">
                    Got an interface that should feel instant? <span className="text-[#c9d2ff]">Say hello.</span>
                </h2>

                <a
                    href="#email"
                    aria-label={`Email Rafi at ${EMAIL}`}
                    className="group/email mt-8 block w-fit max-w-full rounded-lg focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white lg:mt-10"
                >
                    <span
                        aria-hidden="true"
                        className="flex flex-wrap text-[clamp(2.3rem,14.5vw,14rem)] font-semibold leading-[1.15] tracking-[-0.045em] text-white"
                    >
                        {EMAIL_CHUNKS.map((chunk, chunkIndex) => (
                            <span key={chunk} className="whitespace-nowrap">
                                {chunk.split('').map((char, index) => {
                                    const order = (chunkIndex === 0 ? 0 : EMAIL_CHUNKS[0].length) + index
                                    const delay = `${order * 18}ms`
                                    return (
                                        <span
                                            key={`${chunk}-${index}`}
                                            className="relative inline-block overflow-hidden align-top"
                                        >
                                            <span
                                                style={{ transitionDelay: delay }}
                                                className="block transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/email:-translate-y-full group-focus-visible/email:-translate-y-full motion-reduce:transition-none"
                                            >
                                                {char}
                                            </span>
                                            <span
                                                style={{ transitionDelay: delay }}
                                                className="absolute left-0 top-full block text-[#c9d2ff] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/email:-translate-y-full group-focus-visible/email:-translate-y-full motion-reduce:transition-none"
                                            >
                                                {char}
                                            </span>
                                        </span>
                                    )
                                })}
                            </span>
                        ))}
                    </span>
                    <span aria-hidden="true" className="relative mt-2 block h-[3px] w-full bg-white/25">
                        <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover/email:scale-x-100 group-focus-visible/email:scale-x-100 motion-reduce:transition-none" />
                    </span>
                </a>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <button
                        type="button"
                        className={cn(
                            'inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full px-6 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white',
                            copyState === 'copied'
                                ? 'bg-[#0b0b0f] text-white'
                                : 'bg-white text-[#1f3fff] hover:bg-[#c9d2ff]',
                        )}
                        onClick={copyEmail}
                    >
                        {copyState === 'copied' ? (
                            <HiCheck aria-hidden="true" className="size-4" />
                        ) : (
                            <HiOutlineClipboardDocument aria-hidden="true" className="size-4" />
                        )}
                        {copyState === 'copied' ? 'Copied!' : copyState === 'failed' ? 'Copy failed' : 'Copy address'}
                    </button>
                    <p className="text-sm text-white/70">Usually replies within 24 hours, Sunday to Thursday.</p>
                    <p aria-live="polite" className="sr-only">
                        {copyState === 'copied'
                            ? `${EMAIL} copied to clipboard`
                            : copyState === 'failed'
                              ? 'Could not copy the address'
                              : ''}
                    </p>
                </div>

                <div className="mt-16 grid gap-10 border-t border-white/20 pt-10 md:grid-cols-[1fr_1fr_1.4fr] md:gap-8 lg:mt-24">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">
                            Local time — Dhaka, BD
                        </p>
                        <p className="mt-3 font-mono text-4xl font-medium tabular-nums tracking-tight text-white sm:text-5xl">
                            {pad(hour12)}:{pad(time.minutes)}
                            <span className="text-white/50">:{pad(time.seconds)}</span>
                            <span className="ml-2 text-base text-white/70">{period}</span>
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
                            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#c9d2ff]" />
                            {statusFor(time)}
                        </p>
                    </div>

                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">Office hours</p>
                        <p className="mt-3 text-2xl font-medium tracking-tight text-white">Sun–Thu, 10:00–19:00</p>
                        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
                            GMT+6. Overlaps five hours with Central Europe; async-friendly for the Americas.
                        </p>
                    </div>

                    <nav aria-label="Rafi’s social profiles">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/60">Elsewhere</p>
                        <ul className="mt-2">
                            {socials.map((social) => {
                                const Icon = social.icon
                                return (
                                    <li key={social.id} className="border-b border-white/15">
                                        <a
                                            href={`#${social.id}`}
                                            className="group/row flex min-h-12 items-center gap-3 rounded-sm px-2 transition-colors duration-200 hover:bg-white hover:text-[#1f3fff] focus-visible:bg-white focus-visible:text-[#1f3fff] focus-visible:outline-none"
                                        >
                                            <Icon aria-hidden="true" className="size-4 shrink-0" />
                                            <span className="text-sm font-semibold">{social.label}</span>
                                            <span className="ml-auto truncate font-mono text-xs text-current opacity-70">
                                                {social.handle}
                                            </span>
                                            <HiArrowUpRight
                                                aria-hidden="true"
                                                className="size-4 shrink-0 transition-transform duration-300 group-hover/row:rotate-45"
                                            />
                                        </a>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </div>

                <div className="mt-16 flex flex-col gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>© 2026 Rafi Chowdhury · Built with React, Tailwind &amp; too much chai</p>
                    <a
                        href="#top"
                        className="inline-flex min-h-10 items-center gap-2 self-start text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:self-auto"
                    >
                        Back to top
                        <HiArrowUp aria-hidden="true" className="size-3.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default GiantEmailContactSocials
