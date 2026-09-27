// OfficeSwitcherContactForm

// ContactForm03 · Corporate & Business › Contact & Lead Form

// Description:
// Arcadia Advisory's contact section, "Three offices. One conversation." Tabs for London,
// Dhaka and New York switch the address, phone, office lead, working week, a live analog
// and digital local clock with an open/closed badge, and a small drawn map with a gold pin.
// Below, a validated enquiry form is addressed to the chosen office and ends in a thank-you
// note naming who will reply. Use it on the contact page of any firm with several offices.

// Design:
// - Ivory #faf8f3 section, ink #16140f, gold #b68d40 for the active-tab rule, pins, clock
//   hand and focus rings; hairlines #e3dccd, map paper #f1ece1, water #e4dccb
// - Serif display heading (text-4xl → lg:text-7xl) and serif city tabs; mono small caps for
//   times, codes and labels; square corners, 1px rules, no shadows: an annual-report feel
// - Tab rule slides between cities (layoutId); clock hands swing to the new local time;
//   the office panel cross-fades; transforms are dropped under reduced motion
// - Form fields are white boxes with a bottom rule that turns into a gold underline on
//   focus (rust #a4361f on error); the black submit button fills gold on hover
// - Responsive: tabs are a 3-column strip at every size (times hide under sm); the panel
//   stacks, then splits 1fr / 1.1fr at md; form fields pair up from sm

// What it does:
// - office (index) changes on tab click or ←/→/Home/End (roving tabIndex); the form's "Send
//   to" select is the same state, so picking an office in either place updates both
// - Local times use Intl.DateTimeFormat with each office's time zone. The server renders
//   "--:--"; after mount a timeout aligns to the next minute, then a 60 s interval keeps
//   all three clocks current (both cleared on unmount)
// - Controlled form with blur/submit validation (phone becomes required when "Call me" is
//   picked); submit shows a thank-you panel (no network) and "Write again" resets it

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OfficeSwitcherContactForm from '@/TestComponent/PageSections/corporate/ContactForm03';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <OfficeSwitcherContactForm />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { HiArrowLongRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const offices = [
    {
        id: 'london',
        city: 'London',
        code: 'LDN',
        zone: 'Europe/London',
        address: ['28 Hanover Square, 4th floor', 'Mayfair, London W1S 1HT', 'United Kingdom'],
        phone: '+44 20 7946 0958',
        lead: 'Eleanor Marsh',
        leadRole: 'Managing Partner, Europe',
        days: [1, 2, 3, 4, 5],
        open: [9, 0],
        close: [18, 0],
        week: 'Mon–Fri · 09:00–18:00',
        transit: '3 min from Oxford Circus (Central, Victoria, Bakerloo)',
    },
    {
        id: 'dhaka',
        city: 'Dhaka',
        code: 'DAC',
        zone: 'Asia/Dhaka',
        address: ['Level 11, Gulshan Avenue Tower', 'Plot 52, Gulshan-2, Dhaka 1212', 'Bangladesh'],
        phone: '+880 2 5505 1180',
        lead: 'Farhan Rahman',
        leadRole: 'Partner, South Asia',
        days: [0, 1, 2, 3, 4],
        open: [9, 30],
        close: [18, 30],
        week: 'Sun–Thu · 09:30–18:30',
        transit: '10 min from Hazrat Shahjalal Airport by the Banani flyover',
    },
    {
        id: 'new-york',
        city: 'New York',
        code: 'NYC',
        zone: 'America/New_York',
        address: ['1120 Avenue of the Americas, 17th fl.', 'New York, NY 10036', 'United States'],
        phone: '+1 (212) 555-0142',
        lead: 'Julia Okafor',
        leadRole: 'Partner, Americas',
        days: [1, 2, 3, 4, 5],
        open: [8, 30],
        close: [18, 0],
        week: 'Mon–Fri · 08:30–18:00',
        transit: 'Across from Bryant Park, 42 St–Bryant Park station',
    },
]

const topics = [
    'Strategy & growth',
    'Transactions & due diligence',
    'Restructuring',
    'Board & governance',
    'Careers at Arcadia',
]

const WEEKDAY = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

// Returns local hour, minute and weekday for an office, or null before mount.
const localTime = (now, office) => {
    if (!now) return null
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: office.zone,
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'short',
        hourCycle: 'h23',
    }).formatToParts(now)
    const get = (type) => parts.find((p) => p.type === type)?.value
    const h = Number(get('hour')) % 24
    const m = Number(get('minute'))
    const day = WEEKDAY[get('weekday')] ?? 1
    const mins = h * 60 + m
    const openNow =
        office.days.includes(day) &&
        mins >= office.open[0] * 60 + office.open[1] &&
        mins < office.close[0] * 60 + office.close[1]
    return { h, m, label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`, openNow }
}

function OfficeMap({ id }) {
    const water = '#e4dccb'
    const road = '#ddd4c2'
    if (id === 'london') {
        return (
            <g>
                <path d="M0 150 C 60 120, 90 176, 150 160 S 230 110, 270 132 S 330 170, 360 150" fill="none" stroke={water} strokeWidth="18" />
                <rect x="36" y="42" width="64" height="44" fill="#e6e2cf" />
                <text x="68" y="68" textAnchor="middle" fontSize="9" fill="#8a8070" className="font-serif italic">
                    Hyde Park
                </text>
                {[70, 108, 200].map((y) => (
                    <line key={y} x1="0" y1={y - 40} x2="360" y2={y - 10} stroke={road} strokeWidth="3" />
                ))}
                {[130, 190, 250, 300].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x - 18} y2="200" stroke={road} strokeWidth="3" />
                ))}
                <text x="240" y="165" fontSize="10" fill="#8a8070" className="font-serif italic">
                    River Thames
                </text>
            </g>
        )
    }
    if (id === 'dhaka') {
        return (
            <g>
                <path d="M110 0 C 130 40, 118 70, 150 96 S 170 150, 150 200" fill="none" stroke={water} strokeWidth="14" />
                <path d="M210 0 C 222 50, 250 60, 238 110 S 262 170, 250 200" fill="none" stroke={water} strokeWidth="12" />
                <path d="M0 180 C 80 170, 140 196, 360 176" fill="none" stroke={water} strokeWidth="10" />
                {[40, 85, 130].map((y) => (
                    <line key={y} x1="0" y1={y} x2="360" y2={y + 8} stroke={road} strokeWidth="3" />
                ))}
                {[60, 180, 300].map((x) => (
                    <line key={x} x1={x} y1="0" x2={x + 6} y2="200" stroke={road} strokeWidth="3" />
                ))}
                <text x="120" y="160" fontSize="9" fill="#8a8070" className="font-serif italic" transform="rotate(-70 120 160)">
                    Gulshan Lake
                </text>
                <text x="268" y="192" fontSize="9" fill="#8a8070" className="font-serif italic">
                    Banani
                </text>
            </g>
        )
    }
    return (
        <g>
            <rect x="0" y="0" width="360" height="200" fill={water} />
            <path d="M120 200 L 150 150 L 196 60 L 250 0 L 330 0 L 300 60 L 250 150 L 214 200 Z" fill="#f1ece1" />
            <path d="M226 40 L 262 40 L 238 92 L 204 92 Z" fill="#e6e2cf" />
            {[70, 100, 130, 160].map((y) => (
                <line key={y} x1={140} y1={y} x2={300} y2={y} stroke={road} strokeWidth="2.5" />
            ))}
            <line x1="176" y1="200" x2="282" y2="0" stroke={road} strokeWidth="2.5" />
            <text x="60" y="110" fontSize="10" fill="#8a8070" className="font-serif italic">
                Hudson River
            </text>
            <text x="286" y="130" fontSize="10" fill="#8a8070" className="font-serif italic">
                East River
            </text>
            <text x="236" y="70" fontSize="8" fill="#8a8070" textAnchor="middle" className="font-serif italic">
                Central Park
            </text>
        </g>
    )
}

const pins = { london: { x: 176, y: 88 }, dhaka: { x: 196, y: 70 }, 'new-york': { x: 206, y: 118 } }

// Pick the angle closest to the previous one so hands never spin the long way round.
const nearest = (prev, target) => prev + ((((target - prev) % 360) + 540) % 360) - 180

function Clock({ time }) {
    const h = time ? time.h : 10
    const m = time ? time.m : 10
    const angles = useRef({ hour: 305, minute: 60 })
    const hour = nearest(angles.current.hour, (h % 12) * 30 + m * 0.5)
    const minute = nearest(angles.current.minute, m * 6)
    useEffect(() => {
        angles.current = { hour, minute }
    }, [hour, minute])
    const spring = { type: 'spring', stiffness: 70, damping: 14 }

    return (
        <span aria-hidden="true" className="relative block h-16 w-16 shrink-0 rounded-full border-[1.5px] border-[#16140f] bg-white">
            {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 30}deg)` }}>
                    <span
                        className={cn(
                            'absolute left-1/2 top-[3px] -translate-x-1/2 bg-[#16140f]',
                            i % 3 === 0 ? 'h-[6px] w-[2px]' : 'h-[3px] w-px',
                        )}
                    />
                </span>
            ))}
            <motion.span
                className="absolute bottom-1/2 left-1/2 -ml-[1.5px] h-[15px] w-[3px] origin-bottom rounded-full bg-[#16140f]"
                initial={false}
                animate={{ rotate: hour }}
                transition={spring}
            />
            <motion.span
                className="absolute bottom-1/2 left-1/2 -ml-px h-[23px] w-[2px] origin-bottom rounded-full bg-[#b68d40]"
                initial={false}
                animate={{ rotate: minute }}
                transition={spring}
            />
            <span className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b68d40]" />
        </span>
    )
}

const blank = { name: '', email: '', company: '', topic: '', reply: 'email', phone: '', message: '' }
const order = ['name', 'email', 'company', 'topic', 'phone', 'message']

const validate = (v) => {
    const e = {}
    if (v.name.trim().length < 2) e.name = 'Please tell us your name.'
    if (!EMAIL_RE.test(v.email.trim())) e.email = 'A valid email, please: we reply from a named partner’s inbox.'
    if (v.company.trim().length < 2) e.company = 'Which organisation do you represent?'
    if (!v.topic) e.topic = 'Choose the closest topic.'
    if (v.reply === 'phone' && v.phone.replace(/[^\d]/g, '').length < 8) e.phone = 'Add a number with country code so we can call.'
    if (v.message.trim().length < 20) e.message = 'A couple of sentences helps us route this (20+ characters).'
    return e
}

export function OfficeSwitcherContactForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const [active, setActive] = useState(0)
    const [now, setNow] = useState(null)
    const [values, setValues] = useState(blank)
    const [touched, setTouched] = useState({})
    const [attempted, setAttempted] = useState(false)
    const [sent, setSent] = useState(null)
    const tabRefs = useRef([])
    const fieldRefs = useRef({})
    const focusNext = useRef(null)

    const office = offices[active]
    const errors = validate(values)
    const show = (name) => (touched[name] || attempted) && errors[name]

    // Tick the clocks on the minute boundary, then every 60 s.
    useEffect(() => {
        let interval
        setNow(new Date())
        const first = setTimeout(() => {
            setNow(new Date())
            interval = setInterval(() => setNow(new Date()), 60000)
        }, 60000 - (Date.now() % 60000) + 50)
        return () => {
            clearTimeout(first)
            clearInterval(interval)
        }
    }, [])

    const selectTab = (i, focus = false) => {
        setActive(i)
        if (focus && tabRefs.current[i]) tabRefs.current[i].focus()
    }

    const onTabKey = (event) => {
        const last = offices.length - 1
        const map = {
            ArrowRight: active === last ? 0 : active + 1,
            ArrowLeft: active === 0 ? last : active - 1,
            Home: 0,
            End: last,
        }
        if (!(event.key in map)) return
        event.preventDefault()
        selectTab(map[event.key], true)
    }

    const update = (name) => (event) => setValues((prev) => ({ ...prev, [name]: event.target.value }))
    const blur = (name) => () => setTouched((prev) => ({ ...prev, [name]: true }))

    const handleSubmit = (event) => {
        event.preventDefault()
        setAttempted(true)
        const first = order.find((k) => errors[k])
        if (first) {
            if (fieldRefs.current[first]) fieldRefs.current[first].focus()
            return
        }
        focusNext.current = 'sent'
        setSent({ name: values.name.trim().split(' ')[0], office: active, reply: values.reply })
    }

    const reset = () => {
        setValues(blank)
        setTouched({})
        setAttempted(false)
        focusNext.current = 'form'
        setSent(null)
    }

    // AnimatePresence mounts the next view after the old one leaves; focus it on mount.
    const focusOnMount = (target) => (el) => {
        if (el && focusNext.current === target) {
            focusNext.current = null
            el.focus()
        }
    }

    const register = (name) => (el) => {
        fieldRefs.current[name] = el
    }

    const labelClass = 'mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] text-[#6e6657]'
    const fieldClass = (name) =>
        cn(
            'w-full border-0 border-b bg-white px-3 text-[15px] text-[#16140f] placeholder:text-[#a79e8d] outline-none transition-[border-color,box-shadow] focus:border-[#b68d40] focus:shadow-[0_2px_0_0_#b68d40]',
            show(name) ? 'border-[#a4361f]' : 'border-[#cfc6b3] hover:border-[#16140f]',
        )
    const errorText = (name) =>
        show(name) ? (
            <p id={`${uid}-${name}-e`} className="mt-2 text-[13px] text-[#a4361f]">
                {errors[name]}
            </p>
        ) : null
    const described = (name) => (show(name) ? `${uid}-${name}-e` : undefined)

    const times = offices.map((o) => localTime(now, o))
    const time = times[active]
    const pin = pins[office.id]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#faf8f3] px-4 py-14 text-base font-normal text-[#16140f] sm:px-6 sm:py-16 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                        <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#b68d40]">Arcadia Advisory · Contact</p>
                            <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#16140f] sm:text-6xl lg:text-7xl">
                                Three offices.
                                <br />
                                <span className="italic text-[#b68d40]">One conversation.</span>
                            </h2>
                        </div>
                        <p className="max-w-md text-[15px] leading-7 text-[#4f4a40] lg:justify-self-end">
                            Every enquiry is read by a partner in the office you choose, and answered within one working
                            day, their time. No call centres, no forms that go nowhere.
                        </p>
                    </div>

                    <div
                        role="tablist"
                        aria-label="Arcadia offices"
                        className="mt-12 grid grid-cols-3 border-y border-[#e3dccd]"
                        onKeyDown={onTabKey}
                    >
                        {offices.map((o, i) => {
                            const selected = i === active
                            const t = times[i]
                            return (
                                <button
                                    key={o.id}
                                    ref={(el) => {
                                        tabRefs.current[i] = el
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`${uid}-tab-${o.id}`}
                                    aria-selected={selected}
                                    aria-controls={`${uid}-panel`}
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => selectTab(i)}
                                    className={cn(
                                        'group relative min-h-16 px-2 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#b68d40] sm:px-5 sm:py-6',
                                        i > 0 && 'border-l border-[#e3dccd]',
                                        selected ? 'bg-white' : 'hover:bg-white/60',
                                    )}
                                >
                                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#6e6657]">
                                        {o.code}
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                'h-1.5 w-1.5 rounded-full',
                                                t ? (t.openNow ? 'bg-[#4d7c3a]' : 'bg-[#c9bfae]') : 'bg-transparent',
                                            )}
                                        />
                                    </span>
                                    <span
                                        className={cn(
                                            'mt-1 block truncate font-serif text-xl leading-tight sm:text-3xl lg:text-4xl',
                                            selected ? 'text-[#16140f]' : 'text-[#8a8070] group-hover:text-[#16140f]',
                                        )}
                                    >
                                        {o.city}
                                    </span>
                                    <span className="mt-1 hidden font-mono text-xs tabular-nums text-[#6e6657] sm:block">
                                        {t ? t.label : '--:--'} local
                                    </span>
                                    {selected && (
                                        <motion.span
                                            layoutId={`${uid}-tab-rule`}
                                            aria-hidden="true"
                                            className="absolute inset-x-0 -bottom-px h-[3px] bg-[#b68d40]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                                        />
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    <div
                        id={`${uid}-panel`}
                        role="tabpanel"
                        aria-labelledby={`${uid}-tab-${office.id}`}
                        className="border-b border-[#e3dccd] bg-white"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={office.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.35, ease: EASE }}
                                className="grid md:grid-cols-[1fr_1.1fr]"
                            >
                                <div className="flex flex-col gap-7 p-5 sm:p-8 lg:p-10">
                                    <div className="flex items-center gap-4">
                                        <Clock time={time} />
                                        <div>
                                            <p className="font-serif text-3xl tabular-nums text-[#16140f]">
                                                {time ? time.label : '--:--'}
                                                <span className="ml-2 font-mono text-xs uppercase tracking-[0.18em] text-[#6e6657]">
                                                    in {office.city}
                                                </span>
                                            </p>
                                            <p className="mt-1 flex items-center gap-2 text-sm text-[#4f4a40]">
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'h-2 w-2 rounded-full',
                                                        time ? (time.openNow ? 'bg-[#4d7c3a]' : 'bg-[#c9bfae]') : 'bg-[#e3dccd]',
                                                    )}
                                                />
                                                {time ? (time.openNow ? 'Office open now' : 'Closed, we’ll reply next working day') : 'Checking office hours…'}
                                            </p>
                                        </div>
                                    </div>
                                    <dl className="grid gap-5 text-[15px] leading-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
                                        <div>
                                            <dt className={labelClass}>Address</dt>
                                            <dd className="text-[#16140f]">
                                                {office.address.map((line) => (
                                                    <span key={line} className="block">
                                                        {line}
                                                    </span>
                                                ))}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className={labelClass}>Office lead</dt>
                                            <dd className="text-[#16140f]">
                                                <span className="block font-serif text-lg">{office.lead}</span>
                                                <span className="block text-sm text-[#6e6657]">{office.leadRole}</span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className={labelClass}>Telephone</dt>
                                            <dd>
                                                <a
                                                    href={`#arcadia-call-${office.id}`}
                                                    className="text-[#16140f] underline decoration-[#b68d40] underline-offset-4 hover:text-[#b68d40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                                                >
                                                    {office.phone}
                                                </a>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className={labelClass}>Working week</dt>
                                            <dd className="font-mono text-sm text-[#16140f]">{office.week}</dd>
                                        </div>
                                    </dl>
                                </div>
                                <div className="border-t border-[#e3dccd] p-5 sm:p-8 md:border-l md:border-t-0 lg:p-10">
                                    <div className="relative aspect-[9/5] w-full overflow-hidden bg-[#f1ece1]">
                                        <svg
                                            viewBox="0 0 360 200"
                                            className="absolute inset-0 h-full w-full"
                                            role="img"
                                            aria-label={`Map of the area around Arcadia's ${office.city} office. ${office.transit}.`}
                                        >
                                            <OfficeMap id={office.id} />
                                            <circle cx={pin.x} cy={pin.y} r="16" fill="#b68d40" opacity="0.18" />
                                            <path
                                                d={`M${pin.x} ${pin.y + 2} l-8 -12 a9.5 9.5 0 1 1 16 0 z`}
                                                fill="#16140f"
                                            />
                                            <circle cx={pin.x} cy={pin.y - 14} r="3.5" fill="#b68d40" />
                                        </svg>
                                        <span className="absolute left-3 top-3 bg-[#16140f] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#faf8f3]">
                                            Arcadia · {office.code}
                                        </span>
                                    </div>
                                    <p className="mt-4 text-sm leading-6 text-[#4f4a40]">{office.transit}.</p>
                                    <a
                                        href={`#arcadia-directions-${office.id}`}
                                        className="group mt-2 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#16140f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                                    >
                                        Directions to {office.city}
                                        <HiArrowLongRight aria-hidden="true" className="text-[#b68d40] transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="mt-14 grid gap-8 lg:mt-20 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
                        <div>
                            <h3 className="font-serif text-3xl font-normal leading-tight text-[#16140f] sm:text-4xl">Write to {office.city}</h3>
                            <p className="mt-3 max-w-sm text-[15px] leading-7 text-[#4f4a40]">
                                {office.lead} or a member of the {office.city} partnership will reply personally. For press,
                                use the London office.
                            </p>
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            {sent ? (
                                <motion.div
                                    key="sent"
                                    ref={focusOnMount('sent')}
                                    tabIndex={-1}
                                    role="status"
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: EASE }}
                                    className="border-t-[3px] border-[#b68d40] bg-white p-6 outline-none focus-visible:ring-2 focus-visible:ring-[#b68d40] sm:p-10"
                                >
                                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#b68d40]">
                                        Received · {offices[sent.office].code}
                                    </p>
                                    <p className="mt-3 font-serif text-3xl leading-tight text-[#16140f] sm:text-4xl">
                                        Thank you, {sent.name}.
                                    </p>
                                    <p className="mt-4 max-w-lg text-[15px] leading-7 text-[#4f4a40]">
                                        {offices[sent.office].lead} in our {offices[sent.office].city} office will{' '}
                                        {sent.reply === 'phone' ? 'call you' : 'write to you'} within one working day,{' '}
                                        {offices[sent.office].city} time ({offices[sent.office].week}).
                                    </p>
                                    <button
                                        type="button"
                                        onClick={reset}
                                        className="mt-8 inline-flex h-12 items-center border border-[#16140f] px-6 text-sm font-semibold text-[#16140f] transition-colors hover:bg-[#16140f] hover:text-[#faf8f3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                                    >
                                        Write again
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="form"
                                    noValidate
                                    aria-label={`Enquiry to the ${office.city} office`}
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: EASE }}
                                    className="grid gap-6 sm:grid-cols-2"
                                    onSubmit={handleSubmit}
                                >
                                    <div>
                                        <label htmlFor={`${uid}-name`} className={labelClass}>
                                            Name
                                        </label>
                                        <input
                                            id={`${uid}-name`}
                                            ref={(el) => {
                                                register('name')(el)
                                                focusOnMount('form')(el)
                                            }}
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Amelia Hart"
                                            value={values.name}
                                            aria-invalid={Boolean(show('name'))}
                                            aria-describedby={described('name')}
                                            className={cn(fieldClass('name'), 'h-12')}
                                            onChange={update('name')}
                                            onBlur={blur('name')}
                                        />
                                        {errorText('name')}
                                    </div>
                                    <div>
                                        <label htmlFor={`${uid}-email`} className={labelClass}>
                                            Email
                                        </label>
                                        <input
                                            id={`${uid}-email`}
                                            ref={register('email')}
                                            type="email"
                                            autoComplete="email"
                                            placeholder="amelia@harthold.co.uk"
                                            value={values.email}
                                            aria-invalid={Boolean(show('email'))}
                                            aria-describedby={described('email')}
                                            className={cn(fieldClass('email'), 'h-12')}
                                            onChange={update('email')}
                                            onBlur={blur('email')}
                                        />
                                        {errorText('email')}
                                    </div>
                                    <div>
                                        <label htmlFor={`${uid}-company`} className={labelClass}>
                                            Organisation
                                        </label>
                                        <input
                                            id={`${uid}-company`}
                                            ref={register('company')}
                                            type="text"
                                            autoComplete="organization"
                                            placeholder="Hart Holdings plc"
                                            value={values.company}
                                            aria-invalid={Boolean(show('company'))}
                                            aria-describedby={described('company')}
                                            className={cn(fieldClass('company'), 'h-12')}
                                            onChange={update('company')}
                                            onBlur={blur('company')}
                                        />
                                        {errorText('company')}
                                    </div>
                                    <div>
                                        <label htmlFor={`${uid}-office`} className={labelClass}>
                                            Send to
                                        </label>
                                        <select
                                            id={`${uid}-office`}
                                            value={office.id}
                                            className={cn(fieldClass('office'), 'h-12 cursor-pointer')}
                                            onChange={(e) => setActive(offices.findIndex((o) => o.id === e.target.value))}
                                        >
                                            {offices.map((o) => (
                                                <option key={o.id} value={o.id}>
                                                    {o.city} · {o.lead}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor={`${uid}-topic`} className={labelClass}>
                                            Topic
                                        </label>
                                        <select
                                            id={`${uid}-topic`}
                                            ref={register('topic')}
                                            value={values.topic}
                                            aria-invalid={Boolean(show('topic'))}
                                            aria-describedby={described('topic')}
                                            className={cn(fieldClass('topic'), 'h-12 cursor-pointer', !values.topic && 'text-[#a79e8d]')}
                                            onChange={update('topic')}
                                            onBlur={blur('topic')}
                                        >
                                            <option value="" disabled>
                                                Choose a topic
                                            </option>
                                            {topics.map((t) => (
                                                <option key={t} value={t} className="text-[#16140f]">
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                        {errorText('topic')}
                                    </div>
                                    <div>
                                        <p id={`${uid}-reply-label`} className={labelClass}>
                                            Preferred reply
                                        </p>
                                        <div role="radiogroup" aria-labelledby={`${uid}-reply-label`} className="grid h-12 grid-cols-2 border border-[#cfc6b3]">
                                            {[
                                                ['email', 'Email me'],
                                                ['phone', 'Call me'],
                                            ].map(([val, text], i) => (
                                                <label key={val} className={cn('relative cursor-pointer', i > 0 && 'border-l border-[#cfc6b3]')}>
                                                    <input
                                                        type="radio"
                                                        name={`${uid}-reply`}
                                                        value={val}
                                                        checked={values.reply === val}
                                                        onChange={update('reply')}
                                                        className="peer sr-only"
                                                    />
                                                    <span className="flex h-full items-center justify-center text-sm text-[#4f4a40] transition-colors peer-checked:bg-[#16140f] peer-checked:text-[#faf8f3] peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-4 peer-focus-visible:outline-[#b68d40]">
                                                        {text}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    {values.reply === 'phone' && (
                                        <div className="sm:col-span-2">
                                            <label htmlFor={`${uid}-phone`} className={labelClass}>
                                                Phone, with country code
                                            </label>
                                            <input
                                                id={`${uid}-phone`}
                                                ref={register('phone')}
                                                type="tel"
                                                autoComplete="tel"
                                                placeholder="+44 7700 900418"
                                                value={values.phone}
                                                aria-invalid={Boolean(show('phone'))}
                                                aria-describedby={described('phone')}
                                                className={cn(fieldClass('phone'), 'h-12')}
                                                onChange={update('phone')}
                                                onBlur={blur('phone')}
                                            />
                                            {errorText('phone')}
                                        </div>
                                    )}
                                    <div className="sm:col-span-2">
                                        <label htmlFor={`${uid}-message`} className={labelClass}>
                                            How can we help?
                                        </label>
                                        <textarea
                                            id={`${uid}-message`}
                                            ref={register('message')}
                                            rows={5}
                                            maxLength={1200}
                                            placeholder="We are weighing a carve-out of our logistics division and would like a second opinion before the board meets in November…"
                                            value={values.message}
                                            aria-invalid={Boolean(show('message'))}
                                            aria-describedby={described('message')}
                                            className={cn(fieldClass('message'), 'min-h-36 resize-y py-3 leading-6')}
                                            onChange={update('message')}
                                            onBlur={blur('message')}
                                        />
                                        {errorText('message')}
                                    </div>
                                    <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                                        <p className="text-[13px] leading-6 text-[#6e6657]">
                                            Replies come from a named partner; we never share your details.
                                        </p>
                                        <button
                                            type="submit"
                                            className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-[#16140f] px-7 text-sm font-semibold text-[#faf8f3] transition-colors hover:bg-[#b68d40] hover:text-[#16140f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b68d40]"
                                        >
                                            Send to {office.city}
                                            <HiArrowLongRight aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1" />
                                        </button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default OfficeSwitcherContactForm
