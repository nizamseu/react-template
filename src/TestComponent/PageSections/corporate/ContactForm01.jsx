// OfficeMapContactForm

// ContactForm01 · Corporate & Business › Contact & Lead Form

// Description:
// The contact block for Meridian Logistics' Chicago headquarters. The heading "Talk to a
// person who can see your freight." sits over a validated enquiry form (quote, tracking,
// carrier or press request) beside a drawn street map of Fulton Market with the office pin,
// the walking route from Morgan station, address, phone lines and desk hours. Use it on a
// contact page of any company with a physical head office or depot people visit.

// Design:
// - Navy #0b1f3a section, deeper #081830 panels, text #e8eef7, signal orange #ff6b1a for
//   the pin, route, active chips, submit button and focus rings; hairlines in #26446e
// - Mono uppercase labels and stop codes (MRD-HQ), sans heading text-4xl → lg:text-6xl
//   with an orange underline stroke; square-ish 6px corners, no shadows, flat panels
// - Map: inline SVG street grid (blocks, Chicago River, I-90/94, the elevated line on Lake
//   St) with a pulsing pin; the orange walking route draws itself when scrolled into view
// - Form: 48px fields on #081830 with a 1px border that turns orange on focus and coral
//   #ff8a73 on error; enquiry types are radio chips; a conditional tracking-number or
//   freight-mode field slides open with AnimatePresence
// - Responsive: the form, then the map and office details, stack on base/md; fields pair
//   up in 2 columns from sm, and at lg the form and map split 1.1fr / 1fr

// What it does:
// - Controlled fields (name, email, company, phone, type, mode, tracking, message, consent)
//   validate on blur and on submit; the first invalid field gets focus and a live summary
//   says how many fields need attention
// - Submit waits 900 ms in a "Sending…" state (a cleared timeout, no network), then shows
//   a confirmation with a reference number; "Send another request" resets the form
// - Pin pulse and route drawing stop for reduced motion; links go to #meridian-directions,
//   #meridian-privacy, #meridian-call-desk and #meridian-call-dispatch

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OfficeMapContactForm from '@/TestComponent/PageSections/corporate/ContactForm01';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <OfficeMapContactForm />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useInView, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiCheck, HiOutlineClock, HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2';
import { LuTrainFront, LuTruck } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]
const MESSAGE_MAX = 600
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TRACKING_RE = /^MRD-?\d{6}$/i

const enquiryTypes = [
    { id: 'quote', label: 'Freight quote' },
    { id: 'track', label: 'Track a shipment' },
    { id: 'carrier', label: 'Become a carrier' },
    { id: 'press', label: 'Press & partners' },
]

const modes = [
    { id: 'road', label: 'Road' },
    { id: 'ocean', label: 'Ocean' },
    { id: 'air', label: 'Air' },
]

const initialValues = {
    name: '',
    email: '',
    company: '',
    phone: '',
    type: 'quote',
    mode: 'road',
    tracking: '',
    message: '',
    consent: false,
}

const fieldOrder = ['name', 'email', 'company', 'phone', 'tracking', 'message', 'consent']

const validate = (v) => {
    const errors = {}
    if (v.name.trim().length < 2) errors.name = 'Please enter your full name.'
    if (!v.email.trim()) errors.email = 'We need an email to reply to.'
    else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'That email address looks incomplete.'
    if (v.type !== 'track' && v.company.trim().length < 2) errors.company = 'Which company is this for?'
    if (v.phone.trim() && v.phone.replace(/[^\d]/g, '').length < 7) errors.phone = 'Phone numbers need at least 7 digits.'
    if (v.type === 'track' && !TRACKING_RE.test(v.tracking.trim())) {
        errors.tracking = 'Tracking numbers look like MRD-482913.'
    }
    if (v.message.trim().length < 20) errors.message = 'Tell us a little more (20 characters or more).'
    if (!v.consent) errors.consent = 'Please agree so we can reply to you.'
    return errors
}

// Street map geometry (viewBox 480 × 360).
const avenues = [70, 150, 215, 280]
const streets = [96, 150, 214, 280]
const streetNames = [
    { y: 96, label: 'W LAKE ST' },
    { y: 150, label: 'W FULTON MARKET' },
    { y: 214, label: 'W RANDOLPH ST' },
    { y: 280, label: 'W WASHINGTON BLVD' },
]
const avenueNames = [
    { x: 70, label: 'N RACINE' },
    { x: 150, label: 'N MORGAN' },
    { x: 280, label: 'N HALSTED' },
]
const xEdges = [0, ...avenues, 322]
const yEdges = [0, ...streets, 360]
const blocks = []
for (let i = 0; i < xEdges.length - 1; i += 1) {
    for (let j = 0; j < yEdges.length - 1; j += 1) {
        const x = xEdges[i] + (i === 0 ? 0 : 7)
        const y = yEdges[j] + (j === 0 ? 0 : 7)
        const w = xEdges[i + 1] - 7 - x
        const h = yEdges[j + 1] - (j === yEdges.length - 2 ? 0 : 7) - y
        blocks.push({ id: `${i}-${j}`, x, y, w, h, hq: i === 2 && j === 1 })
    }
}

const PIN = { x: 184, y: 150 }

function CityMap() {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.4 })
    const reduce = useReducedMotion()

    return (
        <div ref={ref} className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a1c35]">
            <svg
                viewBox="0 0 480 360"
                preserveAspectRatio="xMidYMid slice"
                className="absolute inset-0 h-full w-full"
                role="img"
                aria-label="Street map of Chicago's Fulton Market: Meridian HQ sits on W Fulton Market between N Morgan and N Halsted, a four-minute walk south of Morgan station."
            >
                {blocks.map((b) => (
                    <rect
                        key={b.id}
                        x={b.x}
                        y={b.y}
                        width={b.w}
                        height={b.h}
                        rx="3"
                        fill={b.hq ? '#15335c' : '#0f2748'}
                        stroke={b.hq ? '#ff6b1a' : 'none'}
                        strokeOpacity="0.55"
                        strokeDasharray={b.hq ? '3 3' : undefined}
                    />
                ))}
                <rect x="330" y="0" width="30" height="360" fill="#132c50" />
                <line x1="345" y1="0" x2="345" y2="360" stroke="#2b4d7a" strokeWidth="1.5" strokeDasharray="10 8" />
                <path
                    d="M430 0 C 418 60, 404 110, 404 168 C 404 230, 396 300, 392 360 M404 168 C 430 172, 456 178, 480 176"
                    fill="none"
                    stroke="#163e6d"
                    strokeWidth="20"
                    strokeLinecap="round"
                />
                <path
                    d="M430 0 C 418 60, 404 110, 404 168 C 404 230, 396 300, 392 360"
                    fill="none"
                    stroke="#1d4d84"
                    strokeWidth="1"
                    strokeDasharray="2 6"
                />
                <line x1="0" y1="96" x2="322" y2="96" stroke="#3a5d8c" strokeWidth="3" strokeDasharray="1 5" />
                {streetNames.map((s) => (
                    <text
                        key={s.label}
                        x="10"
                        y={s.y - 11}
                        fill="#7890b3"
                        fontSize="10.5"
                        letterSpacing="1.5"
                        className="font-mono"
                    >
                        {s.label}
                    </text>
                ))}
                {avenueNames.map((a) => (
                    <text
                        key={a.label}
                        x={a.x - 3}
                        y="352"
                        fill="#7890b3"
                        fontSize="10.5"
                        letterSpacing="1.5"
                        transform={`rotate(-90 ${a.x - 3} 352)`}
                        className="font-mono"
                    >
                        {a.label}
                    </text>
                ))}
                <text x="339" y="340" fill="#7890b3" fontSize="10" letterSpacing="1.2" transform="rotate(-90 339 340)" className="font-mono">
                    I-90/94
                </text>
                <text x="418" y="232" fill="#8fb0db" fontSize="10.5" letterSpacing="1.5" transform="rotate(84 418 232)" className="font-mono">
                    CHICAGO RIVER
                </text>

                <motion.path
                    d={`M150 96 V${PIN.y} H${PIN.x}`}
                    fill="none"
                    stroke="#ff6b1a"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={false}
                    animate={{ pathLength: reduce || inView ? 1 : 0 }}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
                />
                <circle cx="150" cy="96" r="8" fill="#0a1c35" stroke="#e8eef7" strokeWidth="2" />
                <circle cx="150" cy="96" r="3" fill="#e8eef7" />

                <g transform="translate(446 30)">
                    <circle r="16" fill="#0b1f3a" stroke="#26446e" />
                    <path d="M0 -10 L5 4 L0 1 L-5 4 Z" fill="#ff6b1a" />
                    <text y="13" textAnchor="middle" fill="#e8eef7" fontSize="8" className="font-mono">
                        N
                    </text>
                </g>
                <g transform="translate(18 30)">
                    <rect width="60" height="4" fill="#e8eef7" />
                    <rect width="30" height="4" fill="#ff6b1a" />
                    <text y="-6" fill="#a9bbd6" fontSize="9.5" className="font-mono">
                        200 m
                    </text>
                </g>

                {!reduce && (
                    <motion.circle
                        cx={PIN.x}
                        cy={PIN.y}
                        fill="#ff6b1a"
                        initial={{ r: 8, opacity: 0.5 }}
                        animate={{ r: [8, 30], opacity: [0.5, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                    />
                )}
                <circle cx={PIN.x} cy={PIN.y} r="9" fill="#ff6b1a" stroke="#0b1f3a" strokeWidth="3" />
                <circle cx={PIN.x} cy={PIN.y} r="3" fill="#0b1f3a" />
            </svg>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute flex -translate-y-1/2 translate-x-3 items-center sm:translate-x-4"
                style={{ left: `${(PIN.x / 480) * 100}%`, top: `${(PIN.y / 360) * 100}%` }}
            >
                <span className="block h-0 w-0 border-y-[6px] border-r-[7px] border-y-transparent border-r-[#ff6b1a]" />
                <div className="whitespace-nowrap rounded-md bg-[#ff6b1a] px-2.5 py-1.5 text-[#0b1f3a] shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] sm:text-[10px]">MRD-HQ</p>
                    <p className="text-xs font-semibold sm:text-sm">Meridian HQ</p>
                </div>
            </div>
            <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[31.25%] top-[26.6%] hidden -translate-x-1/2 -translate-y-[calc(100%+12px)] items-center gap-1.5 whitespace-nowrap rounded-full bg-[#e8eef7] px-2 py-1 text-[10px] font-semibold text-[#0b1f3a] sm:flex"
            >
                <LuTrainFront aria-hidden="true" />
                Morgan
            </div>
        </div>
    )
}

export function OfficeMapContactForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [values, setValues] = useState(initialValues)
    const [touched, setTouched] = useState({})
    const [attempted, setAttempted] = useState(false)
    const [status, setStatus] = useState('idle')
    const [reference, setReference] = useState('')
    const [summary, setSummary] = useState('')
    const fieldRefs = useRef({})
    const timer = useRef(null)
    const focusTarget = useRef(null)

    const errors = validate(values)
    const show = (name) => (touched[name] || attempted) && errors[name]
    const sending = status === 'sending'

    useEffect(() => () => clearTimeout(timer.current), [])

    // AnimatePresence mounts the next view after the old one leaves; focus it on mount.
    const focusOnMount = (target) => (el) => {
        if (el && focusTarget.current === target) {
            focusTarget.current = null
            el.focus()
        }
    }

    const update = (name) => (event) => {
        const { type, checked, value } = event.target
        setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const blur = (name) => () => setTouched((prev) => ({ ...prev, [name]: true }))

    const handleSubmit = (event) => {
        event.preventDefault()
        if (sending) return
        setAttempted(true)
        const invalid = fieldOrder.filter((name) => errors[name])
        if (invalid.length) {
            setSummary(`${invalid.length} ${invalid.length === 1 ? 'field needs' : 'fields need'} attention before we can send this.`)
            const el = fieldRefs.current[invalid[0]]
            if (el) el.focus()
            return
        }
        setSummary('')
        setStatus('sending')
        timer.current = setTimeout(() => {
            const prefix = values.type === 'track' ? 'T' : values.type === 'quote' ? 'Q' : 'G'
            setReference(`MRD-${prefix}-${String(Date.now()).slice(-5)}`)
            focusTarget.current = 'sent'
            setStatus('sent')
        }, 900)
    }

    const reset = () => {
        setValues(initialValues)
        setTouched({})
        setAttempted(false)
        setSummary('')
        focusTarget.current = 'form'
        setStatus('idle')
    }

    const inputClass = (name) =>
        cn(
            'h-12 w-full rounded-md border bg-[#081830] px-4 text-[15px] text-[#e8eef7] placeholder:text-[#6f86a8] transition-colors outline-none focus:border-[#ff6b1a] focus:ring-2 focus:ring-[#ff6b1a]/25',
            show(name) ? 'border-[#ff8a73]' : 'border-[#26446e] hover:border-[#3a5d8c]',
        )

    const labelClass = 'mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-[#a9bbd6]'

    const errorText = (name) =>
        show(name) ? (
            <p id={`${uid}-${name}-error`} className="mt-1.5 text-[13px] text-[#ff8a73]">
                {errors[name]}
            </p>
        ) : null

    const describe = (name, extra) =>
        [show(name) ? `${uid}-${name}-error` : null, extra].filter(Boolean).join(' ') || undefined

    const register = (name) => (el) => {
        fieldRefs.current[name] = el
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0b1f3a] px-4 py-14 text-base font-normal text-[#e8eef7] sm:px-6 sm:py-16 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col gap-6 border-b border-[#26446e] pb-8 md:flex-row md:items-end md:justify-between lg:pb-10">
                        <div className="max-w-3xl">
                            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-[#a9bbd6]">
                                <span aria-hidden="true" className="h-2.5 w-2.5 bg-[#ff6b1a]" />
                                MRD-HQ · Contact the Chicago desk
                            </p>
                            <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-[#f5f8fc] sm:text-5xl lg:text-6xl">
                                Talk to a person who can{' '}
                                <span className="relative whitespace-nowrap">
                                    see your freight.
                                    <svg
                                        aria-hidden="true"
                                        viewBox="0 0 300 12"
                                        preserveAspectRatio="none"
                                        className="absolute -bottom-2 left-0 h-2.5 w-full text-[#ff6b1a]"
                                    >
                                        <path d="M2 8 C 80 2, 200 2, 298 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                    </svg>
                                </span>
                            </h2>
                        </div>
                        <dl className="grid shrink-0 grid-cols-2 gap-6 md:text-right">
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a9bbd6]">Median first reply</dt>
                                <dd className="mt-1 text-2xl font-semibold tabular-nums text-[#f5f8fc]">1 h 48 min</dd>
                            </div>
                            <div>
                                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#a9bbd6]">On-time, 2025</dt>
                                <dd className="mt-1 text-2xl font-semibold tabular-nums text-[#ff6b1a]">98.7%</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
                        <div>
                            <AnimatePresence mode="wait" initial={false}>
                                {status === 'sent' ? (
                                    <motion.div
                                        key="sent"
                                        ref={focusOnMount('sent')}
                                        tabIndex={-1}
                                        role="status"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.45, ease: EASE }}
                                        className="rounded-md border border-[#26446e] bg-[#081830] p-6 outline-none focus-visible:ring-2 focus-visible:ring-[#ff6b1a] sm:p-10"
                                    >
                                        <span className="grid h-14 w-14 place-items-center rounded-full bg-[#ff6b1a] text-2xl text-[#0b1f3a]">
                                            <HiCheck aria-hidden="true" />
                                        </span>
                                        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[#a9bbd6]">
                                            Request logged · {reference}
                                        </p>
                                        <h3 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.02em] text-[#f5f8fc] sm:text-4xl">
                                            Thanks, {values.name.trim().split(' ')[0]}. It’s on the Chicago desk.
                                        </h3>
                                        <p className="mt-4 max-w-md text-[15px] leading-7 text-[#c3d0e3]">
                                            A coordinator will reply to <span className="font-semibold text-[#f5f8fc]">{values.email.trim()}</span>{' '}
                                            within two working hours. Quote {reference} if you call the desk.
                                        </p>
                                        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
                                            {['Logged', 'Routed to a coordinator', 'Reply by email'].map((step, i) => (
                                                <li
                                                    key={step}
                                                    className={cn(
                                                        'flex items-center gap-3 rounded-md border px-3 py-3 text-sm',
                                                        i === 0 ? 'border-[#ff6b1a] text-[#f5f8fc]' : 'border-[#26446e] text-[#a9bbd6]',
                                                    )}
                                                >
                                                    <span className="font-mono text-xs text-[#ff6b1a]">0{i + 1}</span>
                                                    {step}
                                                </li>
                                            ))}
                                        </ol>
                                        <button
                                            type="button"
                                            onClick={reset}
                                            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#3a5d8c] px-5 text-sm font-semibold text-[#e8eef7] transition-colors hover:border-[#ff6b1a] hover:text-[#ff6b1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                        >
                                            Send another request
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        noValidate
                                        aria-labelledby={`${uid}-form-title`}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.45, ease: EASE }}
                                        onSubmit={handleSubmit}
                                    >
                                        <h3 id={`${uid}-form-title`} className="text-xl font-semibold tracking-[-0.01em] text-[#f5f8fc]">
                                            Send the desk a note
                                        </h3>
                                        <p className="mt-1 text-sm text-[#a9bbd6]">All fields are required unless marked optional.</p>

                                        <div className="mt-6">
                                            <p id={`${uid}-type-label`} className={labelClass}>
                                                What do you need?
                                            </p>
                                            <div role="radiogroup" aria-labelledby={`${uid}-type-label`} className="flex flex-wrap gap-2">
                                                {enquiryTypes.map((t) => (
                                                    <label key={t.id} className="relative cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`${uid}-type`}
                                                            value={t.id}
                                                            checked={values.type === t.id}
                                                            onChange={update('type')}
                                                            className="peer sr-only"
                                                        />
                                                        <span className="inline-flex min-h-10 items-center rounded-full border border-[#26446e] px-4 text-sm text-[#c3d0e3] transition-colors peer-checked:border-[#ff6b1a] peer-checked:bg-[#ff6b1a] peer-checked:font-semibold peer-checked:text-[#0b1f3a] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#ff6b1a] hover:border-[#3a5d8c]">
                                                            {t.label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor={`${uid}-name`} className={labelClass}>
                                                    Full name
                                                </label>
                                                <input
                                                    id={`${uid}-name`}
                                                    ref={(el) => {
                                                        register('name')(el)
                                                        focusOnMount('form')(el)
                                                    }}
                                                    type="text"
                                                    autoComplete="name"
                                                    placeholder="Dana Okafor"
                                                    value={values.name}
                                                    aria-invalid={Boolean(show('name'))}
                                                    aria-describedby={describe('name')}
                                                    className={inputClass('name')}
                                                    onChange={update('name')}
                                                    onBlur={blur('name')}
                                                />
                                                {errorText('name')}
                                            </div>
                                            <div>
                                                <label htmlFor={`${uid}-email`} className={labelClass}>
                                                    Work email
                                                </label>
                                                <input
                                                    id={`${uid}-email`}
                                                    ref={register('email')}
                                                    type="email"
                                                    autoComplete="email"
                                                    placeholder="dana@company.com"
                                                    value={values.email}
                                                    aria-invalid={Boolean(show('email'))}
                                                    aria-describedby={describe('email')}
                                                    className={inputClass('email')}
                                                    onChange={update('email')}
                                                    onBlur={blur('email')}
                                                />
                                                {errorText('email')}
                                            </div>
                                            <div>
                                                <label htmlFor={`${uid}-company`} className={labelClass}>
                                                    Company {values.type === 'track' && <span className="normal-case tracking-normal text-[#6f86a8]">(optional)</span>}
                                                </label>
                                                <input
                                                    id={`${uid}-company`}
                                                    ref={register('company')}
                                                    type="text"
                                                    autoComplete="organization"
                                                    placeholder="Lakeshore Print Co."
                                                    value={values.company}
                                                    aria-invalid={Boolean(show('company'))}
                                                    aria-describedby={describe('company')}
                                                    className={inputClass('company')}
                                                    onChange={update('company')}
                                                    onBlur={blur('company')}
                                                />
                                                {errorText('company')}
                                            </div>
                                            <div>
                                                <label htmlFor={`${uid}-phone`} className={labelClass}>
                                                    Phone <span className="normal-case tracking-normal text-[#6f86a8]">(optional)</span>
                                                </label>
                                                <input
                                                    id={`${uid}-phone`}
                                                    ref={register('phone')}
                                                    type="tel"
                                                    autoComplete="tel"
                                                    placeholder="+1 312 555 0147"
                                                    value={values.phone}
                                                    aria-invalid={Boolean(show('phone'))}
                                                    aria-describedby={describe('phone')}
                                                    className={inputClass('phone')}
                                                    onChange={update('phone')}
                                                    onBlur={blur('phone')}
                                                />
                                                {errorText('phone')}
                                            </div>
                                        </div>

                                        <AnimatePresence initial={false} mode="wait">
                                            {values.type === 'track' && (
                                                <motion.div
                                                    key="track"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: EASE }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-5">
                                                        <label htmlFor={`${uid}-tracking`} className={labelClass}>
                                                            Tracking number
                                                        </label>
                                                        <input
                                                            id={`${uid}-tracking`}
                                                            ref={register('tracking')}
                                                            type="text"
                                                            inputMode="text"
                                                            placeholder="MRD-482913"
                                                            value={values.tracking}
                                                            aria-invalid={Boolean(show('tracking'))}
                                                            aria-describedby={describe('tracking', `${uid}-tracking-hint`)}
                                                            className={cn(inputClass('tracking'), 'font-mono uppercase tracking-[0.12em]')}
                                                            onChange={update('tracking')}
                                                            onBlur={blur('tracking')}
                                                        />
                                                        <p id={`${uid}-tracking-hint`} className="mt-1.5 text-[13px] text-[#6f86a8]">
                                                            Printed at the top of your bill of lading.
                                                        </p>
                                                        {errorText('tracking')}
                                                    </div>
                                                </motion.div>
                                            )}
                                            {values.type === 'quote' && (
                                                <motion.div
                                                    key="mode"
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: EASE }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-5">
                                                        <p id={`${uid}-mode-label`} className={labelClass}>
                                                            Freight mode
                                                        </p>
                                                        <div
                                                            role="radiogroup"
                                                            aria-labelledby={`${uid}-mode-label`}
                                                            className="grid grid-cols-3 overflow-hidden rounded-md border border-[#26446e]"
                                                        >
                                                            {modes.map((m, i) => (
                                                                <label key={m.id} className="relative cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        name={`${uid}-mode`}
                                                                        value={m.id}
                                                                        checked={values.mode === m.id}
                                                                        onChange={update('mode')}
                                                                        className="peer sr-only"
                                                                    />
                                                                    <span
                                                                        className={cn(
                                                                            'flex h-11 items-center justify-center gap-2 text-sm text-[#c3d0e3] transition-colors peer-checked:bg-[#e8eef7] peer-checked:font-semibold peer-checked:text-[#0b1f3a] peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-2 peer-focus-visible:outline-[#ff6b1a] hover:bg-[#10284a]',
                                                                            i > 0 && 'border-l border-[#26446e]',
                                                                        )}
                                                                    >
                                                                        {m.id === 'road' && <LuTruck aria-hidden="true" />}
                                                                        {m.label}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="mt-5">
                                            <div className="flex items-baseline justify-between gap-3">
                                                <label htmlFor={`${uid}-message`} className={labelClass}>
                                                    Message
                                                </label>
                                                <span
                                                    id={`${uid}-message-count`}
                                                    className={cn(
                                                        'font-mono text-[11px] tabular-nums',
                                                        values.message.length > MESSAGE_MAX - 60 ? 'text-[#ff6b1a]' : 'text-[#6f86a8]',
                                                    )}
                                                >
                                                    {values.message.length}/{MESSAGE_MAX}
                                                </span>
                                            </div>
                                            <textarea
                                                id={`${uid}-message`}
                                                ref={register('message')}
                                                rows={5}
                                                maxLength={MESSAGE_MAX}
                                                placeholder="Lane, pallet count, ready date, anything we should know…"
                                                value={values.message}
                                                aria-invalid={Boolean(show('message'))}
                                                aria-describedby={describe('message', `${uid}-message-count`)}
                                                className={cn(inputClass('message'), 'h-auto min-h-36 resize-y py-3 leading-6')}
                                                onChange={update('message')}
                                                onBlur={blur('message')}
                                            />
                                            {errorText('message')}
                                        </div>

                                        <div className="mt-5">
                                            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#c3d0e3]">
                                                <input
                                                    ref={register('consent')}
                                                    type="checkbox"
                                                    checked={values.consent}
                                                    aria-invalid={Boolean(show('consent'))}
                                                    aria-describedby={describe('consent')}
                                                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[#ff6b1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                                    onChange={update('consent')}
                                                    onBlur={blur('consent')}
                                                />
                                                <span>
                                                    Meridian may contact me about this request. See our{' '}
                                                    <a
                                                        href="#meridian-privacy"
                                                        className="font-semibold text-[#f5f8fc] underline decoration-[#ff6b1a] underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                                    >
                                                        privacy notice
                                                    </a>
                                                    .
                                                </span>
                                            </label>
                                            {errorText('consent')}
                                        </div>

                                        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <p aria-live="polite" className="text-sm text-[#ff8a73]">
                                                {summary}
                                            </p>
                                            <button
                                                type="submit"
                                                disabled={sending}
                                                aria-busy={sending}
                                                className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-md bg-[#ff6b1a] px-6 text-[15px] font-semibold text-[#0b1f3a] transition-colors hover:bg-[#ff8440] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8eef7] disabled:cursor-wait disabled:opacity-80"
                                            >
                                                {sending ? 'Sending…' : 'Send to the Chicago desk'}
                                                <HiArrowLongRight
                                                    aria-hidden="true"
                                                    className={cn('text-lg transition-transform duration-300', sending ? 'animate-pulse' : 'group-hover:translate-x-1')}
                                                />
                                            </button>
                                        </div>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>

                        <aside aria-label="Meridian headquarters">
                            <div className="overflow-hidden rounded-md border border-[#26446e] bg-[#081830]">
                                <div className="flex items-center justify-between gap-3 border-b border-[#26446e] px-4 py-3 sm:px-5">
                                    <p className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] text-[#a9bbd6] sm:text-[11px] sm:tracking-[0.2em]">41.8866° N · 87.6517° W</p>
                                    <a
                                        href="#meridian-directions"
                                        className="group inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#ff6b1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                    >
                                        Directions
                                        <HiArrowLongRight aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </a>
                                </div>
                                <CityMap />
                                <div className="flex items-center gap-2 border-t border-[#26446e] px-4 py-3 text-[13px] text-[#a9bbd6] sm:px-5">
                                    <LuTrainFront aria-hidden="true" className="shrink-0 text-[#ff6b1a]" />
                                    4-minute walk from Morgan (Green &amp; Pink lines)
                                </div>
                            </div>

                            <dl className="mt-6 grid gap-px overflow-hidden rounded-md border border-[#26446e] bg-[#26446e] sm:grid-cols-2">
                                <div className="bg-[#0b1f3a] p-4 sm:p-5">
                                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a9bbd6]">
                                        <HiOutlineMapPin aria-hidden="true" className="text-sm text-[#ff6b1a]" />
                                        Address
                                    </dt>
                                    <dd className="mt-2 text-[15px] leading-6 text-[#f5f8fc]">
                                        1140 W Fulton Market, 4th floor
                                        <br />
                                        Chicago, IL 60607
                                    </dd>
                                </div>
                                <div className="bg-[#0b1f3a] p-4 sm:p-5">
                                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a9bbd6]">
                                        <HiOutlinePhone aria-hidden="true" className="text-sm text-[#ff6b1a]" />
                                        Phone
                                    </dt>
                                    <dd className="mt-2 text-[15px] leading-6">
                                        <a
                                            href="#meridian-call-desk"
                                            className="block text-[#f5f8fc] hover:text-[#ff6b1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                        >
                                            Desk +1 (312) 555-0198
                                        </a>
                                        <a
                                            href="#meridian-call-dispatch"
                                            className="block text-[#c3d0e3] hover:text-[#ff6b1a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b1a]"
                                        >
                                            Dispatch 24/7 +1 (312) 555-0100
                                        </a>
                                    </dd>
                                </div>
                                <div className="bg-[#0b1f3a] p-4 sm:col-span-2 sm:p-5">
                                    <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#a9bbd6]">
                                        <HiOutlineClock aria-hidden="true" className="text-sm text-[#ff6b1a]" />
                                        Desk hours (Central Time)
                                    </dt>
                                    <dd className="mt-3 grid grid-cols-3 gap-3 text-sm">
                                        {[
                                            ['Mon–Fri', '07:00–19:00'],
                                            ['Saturday', '08:00–13:00'],
                                            ['Sunday', 'Dispatch only'],
                                        ].map(([day, hours]) => (
                                            <span key={day} className="min-w-0">
                                                <span className="block text-[#a9bbd6]">{day}</span>
                                                <span className="block font-mono text-[13px] tabular-nums text-[#f5f8fc]">{hours}</span>
                                            </span>
                                        ))}
                                    </dd>
                                </div>
                            </dl>
                        </aside>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default OfficeMapContactForm
