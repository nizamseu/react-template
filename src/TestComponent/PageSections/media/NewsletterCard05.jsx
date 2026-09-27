// GlassAuroraNewsletterCard

// NewsletterCard05 · Blogs & Digital Media › Newsletter Subscription Card

// Description:
// A night-sky sign-up for Nightfall Notes, a Thursday-evening letter for night owls. A
// frosted glass card floats over drifting aurora light, stars and a mountain horizon, with
// the gradient heading "Quiet thoughts for the last hour of the day.", a pill email form
// ("Subscribe") and delivery chips. Subscribing fires a small star-confetti burst and swaps
// in "You’re on the list." Use it as a closing section on a personal blog or essay site.

// Design:
// - Night #0f172a section; aurora from blurred violet #7c3aed and cyan #06b6d4 blobs plus a
//   skewed cyan ribbon; deterministic star field; SVG ridge silhouette in #0b1222
// - Glass card: rounded-[28px], white/[0.06] fill, backdrop-blur-2xl, white/15 border, inset
//   top highlight and a violet glow shadow; heading gradient white → #c4b5fd → #67e8f9
// - Type: sans text-4xl → sm:text-5xl, font-semibold, tight tracking; small caps chips; the
//   button is a violet → cyan gradient pill with a sparkle icon
// - Motion: aurora blobs drift on long easeInOut loops and some stars twinkle; the burst is
//   30 dots, bars and diamonds flying out from the form; all loops and the burst are off for
//   reduced motion (a soft glow replaces the burst)
// - Responsive: card max-w-2xl centred with p-6 → sm:p-10; the form stacks at base and
//   becomes one pill on sm; chips wrap

// What it does:
// - Controlled email input; submit validates (empty / malformed) with an inline error and
//   aria-invalid; success computes the next Thursday, bumps "22,318 night owls" by one and
//   shows the confirmation (role="status")
// - The burst re-keys on every success and clears itself after 1.4 s (timer cleared on
//   unmount); the local time zone is read in useEffect ("your time" on the server)
// - "Subscribe another address" resets the form; "Read last Thursday’s note" links to
//   #nightfall-notes-88

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GlassAuroraNewsletterCard from '@/TestComponent/PageSections/media/NewsletterCard05';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <GlassAuroraNewsletterCard />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { PiMoonStars, PiSparkleFill } from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const BASE_OWLS = 22318
const COLORS = ['#7c3aed', '#a78bfa', '#06b6d4', '#67e8f9', '#ffffff', '#f0abfc']

function seeded(seed) {
    let s = seed
    return () => {
        s = (s * 16807) % 2147483647
        return s / 2147483647
    }
}

const rand = seeded(88)
const stars = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    left: `${(rand() * 100).toFixed(2)}%`,
    top: `${(rand() * 72).toFixed(2)}%`,
    size: rand() > 0.85 ? 3 : rand() > 0.5 ? 2 : 1,
    twinkle: i % 6 === 0,
    delay: (i % 7) * 0.6,
}))

const particles = Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * Math.PI * 2 + (i % 3) * 0.14
    const distance = 90 + ((i * 47) % 120)
    return {
        id: i,
        x: Math.round(Math.cos(angle) * distance),
        y: Math.round(Math.sin(angle) * distance * 0.8 - 30),
        color: COLORS[i % COLORS.length],
        shape: i % 3,
        rotate: (i * 67) % 360,
        delay: (i % 5) * 0.025,
    }
})

function validate(value) {
    const v = value.trim()
    if (!v) return 'Add your email and we’ll send the next note.'
    if (!EMAIL_RE.test(v)) return 'That email looks incomplete. Try name@example.com'
    return ''
}

export function GlassAuroraNewsletterCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const burstTimer = useRef(null)
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [done, setDone] = useState(null)
    const [burst, setBurst] = useState(0)
    const [zone, setZone] = useState('your time')

    useEffect(() => {
        try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
            if (tz) setZone(`${tz.split('/').pop().replace(/_/g, ' ')} time`)
        } catch {
            // keep the generic label
        }
        return () => clearTimeout(burstTimer.current)
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()
        const message = validate(email)
        setError(message)
        if (message) return
        const now = new Date()
        const thursday = new Date(now)
        thursday.setDate(now.getDate() + ((4 - now.getDay() + 7) % 7 || 7))
        setDone({
            email: email.trim(),
            when: thursday.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
        })
        setBurst((n) => n + 1)
        clearTimeout(burstTimer.current)
        burstTimer.current = setTimeout(() => setBurst(0), 1400)
    }

    const owls = BASE_OWLS + (done ? 1 : 0)
    const drift = (x, y, duration) =>
        reduceMotion ? {} : { animate: { x, y }, transition: { duration, repeat: Infinity, ease: 'easeInOut' } }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0f172a] px-4 pb-28 pt-20 text-base font-normal text-[#e2e8f0] sm:px-6 md:pb-36 md:pt-28 lg:px-8',
                className,
            )}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                <motion.div
                    className="absolute -left-40 -top-32 size-[520px] rounded-full bg-[#7c3aed] opacity-50 blur-[110px]"
                    {...drift([0, 90, -30, 0], [0, 40, -20, 0], 22)}
                />
                <motion.div
                    className="absolute -right-32 top-10 size-[460px] rounded-full bg-[#06b6d4] opacity-35 blur-[100px]"
                    {...drift([0, -70, 20, 0], [0, 30, 60, 0], 26)}
                />
                <motion.div
                    className="absolute left-[10%] top-[18%] h-40 w-[80%] -rotate-12 skew-x-12 bg-linear-to-r from-transparent via-[#22d3ee]/30 to-transparent blur-2xl"
                    {...drift([0, 40, 0], [0, -24, 0], 16)}
                />
                {stars.map((star) => (
                    <motion.span
                        key={star.id}
                        className="absolute rounded-full bg-white opacity-60"
                        style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
                        animate={star.twinkle && !reduceMotion ? { opacity: [0.2, 1, 0.2] } : undefined}
                        transition={{ duration: 3.2, repeat: Infinity, delay: star.delay }}
                    />
                ))}
                <svg
                    viewBox="0 0 1440 160"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 bottom-0 h-24 w-full md:h-36"
                >
                    <path
                        d="M0 160 L0 96 L120 58 L210 92 L330 30 L450 88 L560 64 L690 110 L810 48 L930 96 L1050 70 L1170 104 L1290 40 L1440 86 L1440 160 Z"
                        fill="#111b31"
                    />
                    <path
                        d="M0 160 L0 124 L160 96 L300 128 L420 100 L600 136 L760 98 L900 130 L1080 102 L1240 132 L1440 110 L1440 160 Z"
                        fill="#0b1222"
                    />
                </svg>
            </div>

            <div className="relative mx-auto max-w-2xl">
                <div className="relative rounded-[28px] border border-white/15 bg-white/[0.06] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_40px_120px_-40px_rgba(124,58,237,0.7)] backdrop-blur-2xl sm:p-10">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-linear-to-b from-white/[0.08] to-transparent"
                    />

                    <div className="relative flex flex-wrap items-center justify-between gap-3">
                        <p className="inline-flex items-center gap-2.5 text-sm font-semibold text-white">
                            <span className="grid size-9 place-items-center rounded-full bg-linear-to-br from-[#7c3aed] to-[#06b6d4] text-white shadow-[0_0_24px_rgba(124,58,237,0.6)]">
                                <PiMoonStars aria-hidden="true" className="size-5" />
                            </span>
                            Nightfall Notes
                        </p>
                        <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e2e8f0]/70">
                            Note No. 89 · Thursday
                        </span>
                    </div>

                    <h2 className="relative mt-8 bg-linear-to-r from-white via-[#c4b5fd] to-[#67e8f9] bg-clip-text text-4xl font-semibold leading-[1.05] tracking-tight text-transparent sm:text-5xl">
                        Quiet thoughts for the last hour of the day.
                    </h2>
                    <p className="relative mt-4 max-w-lg text-base leading-relaxed text-[#e2e8f0]/75">
                        Every Thursday at 9 pm: one short essay, one song to fall asleep to and one thing in the
                        night sky worth stepping outside for.
                    </p>

                    <div className="relative mt-8">
                        {burst > 0 && !reduceMotion && (
                            <div key={burst} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-6 z-20">
                                {particles.map((p) => (
                                    <motion.span
                                        key={p.id}
                                        className={cn(
                                            'absolute -ml-1 -mt-1 block',
                                            p.shape === 0 && 'size-2 rounded-full',
                                            p.shape === 1 && 'h-1 w-3 rounded-full',
                                            p.shape === 2 && 'size-2.5 rotate-45 rounded-[2px]',
                                        )}
                                        style={{ backgroundColor: p.color, boxShadow: `0 0 10px ${p.color}` }}
                                        initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                                        animate={{ x: p.x, y: [0, p.y, p.y + 40], opacity: [1, 1, 0], scale: [0, 1.2, 0.6], rotate: p.rotate }}
                                        transition={{ duration: 1.2, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                ))}
                            </div>
                        )}

                        <AnimatePresence mode="wait" initial={false}>
                            {done ? (
                                <motion.div
                                    key="done"
                                    role="status"
                                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="relative rounded-[22px] border border-white/15 bg-white/[0.05] p-5 sm:p-6"
                                >
                                    {reduceMotion && (
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[0_0_60px_rgba(103,232,249,0.35)]"
                                        />
                                    )}
                                    <div className="flex items-start gap-4">
                                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-[#7c3aed] to-[#06b6d4] text-white">
                                            <PiSparkleFill aria-hidden="true" className="size-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <h3 className="text-2xl font-semibold leading-tight tracking-tight text-white">
                                                You’re on the list.
                                            </h3>
                                            <p className="mt-2 text-sm leading-relaxed text-[#e2e8f0]/75 sm:text-base">
                                                Your first note reaches{' '}
                                                <strong className="break-all font-semibold text-white">{done.email}</strong> on{' '}
                                                {done.when} at 21:00, {zone}. Until then, look up.
                                            </p>
                                            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                                                <a
                                                    href="#nightfall-notes-88"
                                                    className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#67e8f9] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#67e8f9]"
                                                >
                                                    Read last Thursday’s note
                                                    <HiArrowRight aria-hidden="true" className="size-4" />
                                                </a>
                                                <button
                                                    type="button"
                                                    className="min-h-10 text-sm font-medium text-[#e2e8f0]/60 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#67e8f9]"
                                                    onClick={() => {
                                                        setDone(null)
                                                        setEmail('')
                                                    }}
                                                >
                                                    Subscribe another address
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    noValidate
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    onSubmit={handleSubmit}
                                >
                                    <label htmlFor={`${uid}-email`} className="sr-only">
                                        Email address
                                    </label>
                                    <div
                                        className={cn(
                                            'flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:border sm:bg-white/[0.07] sm:p-1.5',
                                            error ? 'sm:border-[#f9a8d4]/70' : 'sm:border-white/15',
                                        )}
                                    >
                                        <input
                                            id={`${uid}-email`}
                                            type="email"
                                            inputMode="email"
                                            autoComplete="email"
                                            placeholder="you@nightowl.me"
                                            value={email}
                                            aria-invalid={Boolean(error)}
                                            aria-describedby={`${uid}-error`}
                                            className={cn(
                                                'min-h-12 min-w-0 flex-1 rounded-full border bg-white/[0.07] px-5 text-base text-white placeholder:text-[#e2e8f0]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#67e8f9]/70 sm:border-0 sm:bg-transparent sm:px-4',
                                                error ? 'border-[#f9a8d4]/70' : 'border-white/15',
                                            )}
                                            onChange={(event) => {
                                                setEmail(event.target.value)
                                                if (error) setError(validate(event.target.value))
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#7c3aed] to-[#06b6d4] px-6 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(6,182,212,0.8)] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67e8f9]"
                                        >
                                            <PiSparkleFill
                                                aria-hidden="true"
                                                className="size-4 transition-transform group-hover:rotate-45 motion-reduce:transition-none"
                                            />
                                            Subscribe
                                        </button>
                                    </div>
                                    <p id={`${uid}-error`} aria-live="polite" className="mt-2 min-h-5 px-3 text-sm font-medium text-[#f9a8d4]">
                                        {error}
                                    </p>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>

                    <ul className="relative mt-4 flex flex-wrap gap-2 text-xs text-[#e2e8f0]/80">
                        <li className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                            Thursdays · 21:00 {zone}
                        </li>
                        <li className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">4-minute read</li>
                        <li className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                            <span className="tabular-nums">{owls.toLocaleString('en-US')}</span> night owls
                        </li>
                    </ul>

                    <p className="relative mt-8 border-t border-white/10 pt-5 text-sm leading-relaxed text-[#e2e8f0]/55">
                        This week’s sky: Saturn sits low in the south-east after 22:00, bright enough to see from
                        a city balcony.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default GlassAuroraNewsletterCard
