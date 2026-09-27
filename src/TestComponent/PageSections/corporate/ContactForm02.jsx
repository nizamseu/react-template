// StepwiseLeadForm

// ContactForm02 · Corporate & Business › Contact & Lead Form

// Description:
// A three-step project brief for Brightbridge Digital: "Tell us what you’re building." Step
// one picks services (strategy, UX & UI, web, mobile, data & AI, growth), step two sets a
// budget band and timeline, step three collects name, email, company, website and a short
// description, then a success screen recaps the brief and "What happens next". Use it as
// the lead form on an agency, studio or consultancy contact page.

// Design:
// - Cream #fff8f0 section, ink #1f1633, purple #6d28d9 for selection, progress and the
//   primary button, lilac #efe6fb tints; the form sits on a #fffdf9 card with a #eadfce
//   border, 28px radius and a soft purple shadow
// - Left column: display heading (text-4xl → lg:text-6xl, italic serif accent word), a
//   vertical step list that fills in with the answers so far, and a client quote card
// - Selectable cards: services are checkbox tiles with icons, budgets are radio tiles with a
//   label and a scope line, timelines are pill radios; selected tiles turn purple-ringed
// - Motion: steps slide ±48px and fade in the travel direction, the progress bar springs
//   to 33 / 66 / 100%, the success check pops in; fades only under reduced motion
// - Responsive: columns stack on base/md with the step list as a compact row; lg splits
//   0.8fr / 1.2fr; tiles go 1 → 2 columns from sm; buttons stay 44px+ tall

// What it does:
// - step (0–2) and one controlled values object; Next validates only the current step,
//   shows inline messages and focuses the first problem; Back never validates
// - Each step change moves focus to the step heading so keyboard and screen reader users
//   land in the right place; a live region announces "Step 2 of 3"
// - Submitting step 3 shows the success screen (no network) with a BB-reference and a recap;
//   "Start a new brief" clears everything. Links go to #brightbridge-work and
//   #brightbridge-privacy

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StepwiseLeadForm from '@/TestComponent/PageSections/corporate/ContactForm02';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <StepwiseLeadForm />
//     </main>
// )
// ```

'use client'

import { useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiCheck } from 'react-icons/hi2';
import { LuBrainCircuit, LuCode, LuCompass, LuPenTool, LuSmartphone, LuTrendingUp } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const EASE = [0.22, 1, 0.36, 1]
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const URL_RE = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i

const services = [
    { id: 'strategy', label: 'Product strategy', note: 'Discovery, roadmaps, pricing', icon: LuCompass },
    { id: 'design', label: 'UX & UI design', note: 'Research, flows, design systems', icon: LuPenTool },
    { id: 'web', label: 'Web platforms', note: 'Next.js, headless CMS, commerce', icon: LuCode },
    { id: 'mobile', label: 'Mobile apps', note: 'iOS, Android, React Native', icon: LuSmartphone },
    { id: 'data', label: 'Data & AI', note: 'Dashboards, search, assistants', icon: LuBrainCircuit },
    { id: 'growth', label: 'Growth marketing', note: 'SEO, CRO, lifecycle email', icon: LuTrendingUp },
]

const budgets = [
    { id: 'b1', label: '$15k – $30k', scope: 'A 3-week discovery sprint' },
    { id: 'b2', label: '$30k – $75k', scope: 'An MVP or a focused redesign' },
    { id: 'b3', label: '$75k – $150k', scope: 'A full product release' },
    { id: 'b4', label: '$150k +', scope: 'A multi-team programme' },
]

const timelines = [
    { id: 'asap', label: 'This month' },
    { id: 'q1', label: '1–3 months' },
    { id: 'q2', label: '3–6 months' },
    { id: 'flex', label: 'Flexible' },
]

const steps = [
    { id: 'service', label: 'Service', title: 'Which services do you need?', hint: 'Pick as many as apply.' },
    { id: 'budget', label: 'Budget', title: 'What budget and timeline are you working with?', hint: 'A range is fine, we’ll refine it together.' },
    { id: 'details', label: 'Details', title: 'Where should we send the proposal?', hint: 'We reply within one working day.' },
]

const empty = {
    services: [],
    budget: '',
    timeline: '',
    name: '',
    email: '',
    company: '',
    website: '',
    about: '',
}

const validateStep = (step, v) => {
    const e = {}
    if (step === 0 && v.services.length === 0) e.services = 'Choose at least one service to continue.'
    if (step === 1) {
        if (!v.budget) e.budget = 'Pick the budget band that fits best.'
        if (!v.timeline) e.timeline = 'Tell us roughly when you’d like to start.'
    }
    if (step === 2) {
        if (v.name.trim().length < 2) e.name = 'Please add your name.'
        if (!EMAIL_RE.test(v.email.trim())) e.email = 'Enter an email we can reply to, like maya@studio.com.'
        if (v.company.trim().length < 2) e.company = 'Which company or project is this for?'
        if (v.website.trim() && !URL_RE.test(v.website.trim())) e.website = 'That doesn’t look like a web address.'
        if (v.about.trim().length < 30) e.about = `A sentence or two, please (${Math.max(0, 30 - v.about.trim().length)} more characters).`
    }
    return e
}

const order = ['services', 'budget', 'timeline', 'name', 'email', 'company', 'website', 'about']

const labelFor = (list, id) => list.find((x) => x.id === id)?.label

export function StepwiseLeadForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const reduce = useReducedMotion()
    const [[step, direction], setStep] = useState([0, 1])
    const [values, setValues] = useState(empty)
    const [errors, setErrors] = useState({})
    const [done, setDone] = useState(false)
    const [reference, setReference] = useState('')
    const navigated = useRef(null)
    const refs = useRef({})

    // AnimatePresence mounts the next step only after the old one has left, so focus is
    // moved from the ref callback of the element that just mounted.
    const focusOnMount = (target) => (el) => {
        if (el && navigated.current === target) {
            navigated.current = null
            el.focus()
        }
    }

    const set = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
    }

    const toggleService = (id) => {
        const next = values.services.includes(id) ? values.services.filter((s) => s !== id) : [...values.services, id]
        set('services', next)
    }

    const focusFirst = (e) => {
        const first = order.find((k) => e[k])
        const el = first && refs.current[first]
        if (el) el.focus()
    }

    const goNext = () => {
        const e = validateStep(step, values)
        setErrors(e)
        if (Object.values(e).some(Boolean)) {
            focusFirst(e)
            return
        }
        navigated.current = step < steps.length - 1 ? steps[step + 1].id : 'done'
        if (step < steps.length - 1) {
            setStep([step + 1, 1])
        } else {
            setReference(`BB-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`)
            setDone(true)
        }
    }

    const goBack = () => {
        if (step === 0) return
        navigated.current = steps[step - 1].id
        setErrors({})
        setStep([step - 1, -1])
    }

    const restart = () => {
        navigated.current = steps[0].id
        setValues(empty)
        setErrors({})
        setDone(false)
        setStep([0, -1])
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        goNext()
    }

    const progress = done ? 1 : (step + 1) / steps.length
    const current = steps[step]
    const shift = reduce ? 0 : 48

    const summaries = [
        values.services.length ? values.services.map((id) => labelFor(services, id)).join(', ') : null,
        values.budget || values.timeline
            ? [labelFor(budgets, values.budget), labelFor(timelines, values.timeline)].filter(Boolean).join(' · ')
            : null,
        values.name.trim() ? [values.name.trim(), values.company.trim()].filter(Boolean).join(', ') : null,
    ]

    const errorMsg = (name) =>
        errors[name] ? (
            <p id={`${uid}-${name}-err`} className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-[#b42318]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#b42318]" />
                {errors[name]}
            </p>
        ) : null

    const inputClass = (name) =>
        cn(
            'h-12 w-full rounded-2xl border bg-white px-4 text-[15px] text-[#1f1633] placeholder:text-[#a79fb5] outline-none transition-[border-color,box-shadow] focus:border-[#6d28d9] focus:shadow-[0_0_0_4px_rgba(109,40,217,0.14)]',
            errors[name] ? 'border-[#b42318]' : 'border-[#e4d8c6] hover:border-[#cbb9e9]',
        )

    const fieldLabel = 'mb-2 block text-sm font-semibold text-[#1f1633]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#fff8f0] px-4 py-14 text-base font-normal text-[#1f1633] sm:px-6 sm:py-16 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-[#efe6fb] blur-3xl"
            />
            <MotionConfig reducedMotion="user">
                <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div className="lg:sticky lg:top-10 lg:self-start">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[#e4d8c6] bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#6d28d9]">
                            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#6d28d9]" />
                            Brightbridge Digital · New projects
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#1f1633] sm:text-5xl lg:text-6xl">
                            Tell us what you’re{' '}
                            <span className="font-serif font-normal italic text-[#6d28d9]">building.</span>
                        </h2>
                        <p className="mt-5 max-w-md text-[15px] leading-7 text-[#5b5170]">
                            Three quick steps, about two minutes. A partner, not a salesperson, reads every brief and
                            answers with a scoped plan.
                        </p>

                        <ol className="mt-8 flex gap-2 lg:mt-10 lg:flex-col lg:gap-0">
                            {steps.map((s, i) => {
                                const complete = done || i < step
                                const active = !done && i === step
                                return (
                                    <li
                                        key={s.id}
                                        aria-current={active ? 'step' : undefined}
                                        className="relative min-w-0 flex-1 lg:flex lg:gap-4 lg:pb-7 lg:last:pb-0"
                                    >
                                        {i < steps.length - 1 && (
                                            <span
                                                aria-hidden="true"
                                                className={cn(
                                                    'absolute left-[15px] top-9 hidden h-[calc(100%-2.5rem)] w-px lg:block',
                                                    complete ? 'bg-[#6d28d9]' : 'bg-[#e4d8c6]',
                                                )}
                                            />
                                        )}
                                        <span
                                            className={cn(
                                                'grid h-8 w-8 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors',
                                                complete && 'border-[#6d28d9] bg-[#6d28d9] text-white',
                                                active && 'border-[#6d28d9] bg-white text-[#6d28d9] ring-4 ring-[#6d28d9]/15',
                                                !complete && !active && 'border-[#e4d8c6] bg-white text-[#8a7fa0]',
                                            )}
                                        >
                                            {complete ? <HiCheck aria-hidden="true" /> : `0${i + 1}`}
                                        </span>
                                        <span className="mt-2 block min-w-0 lg:mt-0">
                                            <span
                                                className={cn(
                                                    'block text-xs font-semibold uppercase tracking-[0.14em] lg:text-sm lg:normal-case lg:tracking-normal',
                                                    active || complete ? 'text-[#1f1633]' : 'text-[#8a7fa0]',
                                                )}
                                            >
                                                {s.label}
                                                <span className="sr-only">{complete ? ' (done)' : active ? ' (current step)' : ''}</span>
                                            </span>
                                            <span className="mt-0.5 hidden truncate text-sm text-[#5b5170] lg:block">
                                                {summaries[i] || <span className="text-[#a79fb5]">Not answered yet</span>}
                                            </span>
                                        </span>
                                    </li>
                                )
                            })}
                        </ol>

                        <figure className="mt-10 hidden rounded-3xl border border-[#e4d8c6] bg-white/70 p-6 lg:block">
                            <blockquote className="font-serif text-lg italic leading-8 text-[#1f1633]">
                                “Their brief form asked better questions than our own RFP. Six weeks later we shipped.”
                            </blockquote>
                            <figcaption className="mt-4 text-sm text-[#5b5170]">
                                <span className="font-semibold text-[#1f1633]">Ines Carvalho</span> · Head of Product, Tallyroute
                            </figcaption>
                        </figure>
                    </div>

                    <div className="relative rounded-[28px] border border-[#eadfce] bg-[#fffdf9] p-5 shadow-[0_30px_80px_-40px_rgba(109,40,217,0.45)] sm:p-8 lg:p-10">
                        <div className="flex items-center justify-between gap-4 text-sm">
                            <p aria-live="polite" className="font-semibold text-[#1f1633]">
                                {done ? 'Brief sent' : `Step ${step + 1} of ${steps.length}`}
                                <span className="font-normal text-[#8a7fa0]"> · {done ? 'All done' : current.label}</span>
                            </p>
                            <span className="font-mono text-xs tabular-nums text-[#6d28d9]">{Math.round(progress * 100)}%</span>
                        </div>
                        <div
                            role="progressbar"
                            aria-label="Brief progress"
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-valuenow={Math.round(progress * 100)}
                            className="mt-3 h-2 overflow-hidden rounded-full bg-[#efe6fb]"
                        >
                            <motion.div
                                className="h-full rounded-full bg-linear-to-r from-[#8b5cf6] to-[#6d28d9]"
                                initial={false}
                                animate={{ width: `${progress * 100}%` }}
                                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                            />
                        </div>

                        <AnimatePresence mode="wait" initial={false} custom={direction}>
                            {done ? (
                                <motion.div
                                    key="done"
                                    ref={focusOnMount('done')}
                                    tabIndex={-1}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.45, ease: EASE }}
                                    className="mt-8 outline-none"
                                >
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                        <motion.span
                                            initial={{ scale: 0.4, rotate: -30 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
                                            className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#6d28d9] text-3xl text-white shadow-[0_12px_30px_-8px_rgba(109,40,217,0.7)]"
                                        >
                                            <HiCheck aria-hidden="true" />
                                        </motion.span>
                                        <div>
                                            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8a7fa0]">Reference {reference}</p>
                                            <h3 className="mt-1 text-3xl font-semibold tracking-[-0.03em] text-[#1f1633] sm:text-4xl">
                                                Brief received, {values.name.trim().split(' ')[0]}.
                                            </h3>
                                        </div>
                                    </div>
                                    <dl className="mt-8 divide-y divide-dashed divide-[#e4d8c6] rounded-2xl border border-[#eadfce] bg-white px-5">
                                        {[
                                            ['Services', summaries[0]],
                                            ['Budget & timeline', summaries[1]],
                                            ['Reply to', values.email.trim()],
                                        ].map(([k, v]) => (
                                            <div key={k} className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
                                                <dt className="text-sm text-[#8a7fa0]">{k}</dt>
                                                <dd className="text-[15px] font-medium text-[#1f1633]">{v}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <h4 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-[#6d28d9]">What happens next</h4>
                                    <ol className="mt-4 grid gap-3 sm:grid-cols-3">
                                        {[
                                            ['Within 1 working day', 'A partner emails you a 30-minute intro call slot.'],
                                            ['By day 3', 'You get a scoped proposal with a fixed-price first phase.'],
                                            ['Week 2', 'Kick-off workshop with the team who’ll build it.'],
                                        ].map(([when, what], i) => (
                                            <li key={when} className="rounded-2xl bg-[#f6f0fd] p-4">
                                                <span className="font-mono text-xs text-[#6d28d9]">0{i + 1}</span>
                                                <p className="mt-2 text-sm font-semibold text-[#1f1633]">{when}</p>
                                                <p className="mt-1 text-sm leading-6 text-[#5b5170]">{what}</p>
                                            </li>
                                        ))}
                                    </ol>
                                    <div className="mt-8 flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={restart}
                                            className="inline-flex h-12 items-center gap-2 rounded-full border border-[#1f1633] px-6 text-sm font-semibold text-[#1f1633] transition-colors hover:bg-[#1f1633] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9]"
                                        >
                                            Start a new brief
                                        </button>
                                        <a
                                            href="#brightbridge-work"
                                            className="group inline-flex h-12 items-center gap-2 px-2 text-sm font-semibold text-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9]"
                                        >
                                            Browse our work meanwhile
                                            <HiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                                        </a>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key={current.id}
                                    noValidate
                                    custom={direction}
                                    initial={{ opacity: 0, x: direction * shift }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction * -shift }}
                                    transition={{ duration: 0.4, ease: EASE }}
                                    aria-labelledby={`${uid}-step-title`}
                                    className="mt-8"
                                    onSubmit={handleSubmit}
                                >
                                    <h3
                                        id={`${uid}-step-title`}
                                        ref={focusOnMount(current.id)}
                                        tabIndex={-1}
                                        className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#1f1633] outline-none sm:text-3xl"
                                    >
                                        {current.title}
                                    </h3>
                                    <p className="mt-2 text-[15px] text-[#5b5170]">{current.hint}</p>

                                    {step === 0 && (
                                        <div className="mt-6">
                                            <div
                                                role="group"
                                                aria-label="Services"
                                                aria-describedby={errors.services ? `${uid}-services-err` : undefined}
                                                className="grid gap-3 sm:grid-cols-2"
                                            >
                                                {services.map((s, i) => {
                                                    const on = values.services.includes(s.id)
                                                    const Icon = s.icon
                                                    return (
                                                        <label
                                                            key={s.id}
                                                            className={cn(
                                                                'group relative flex min-h-[4.75rem] cursor-pointer items-center gap-4 rounded-2xl border bg-white p-4 transition-[border-color,box-shadow,background-color] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#6d28d9]',
                                                                on
                                                                    ? 'border-[#6d28d9] bg-[#faf6ff] shadow-[0_0_0_1px_#6d28d9]'
                                                                    : 'border-[#e4d8c6] hover:border-[#cbb9e9]',
                                                            )}
                                                        >
                                                            <input
                                                                ref={i === 0 ? (el) => { refs.current.services = el } : undefined}
                                                                type="checkbox"
                                                                checked={on}
                                                                onChange={() => toggleService(s.id)}
                                                                className="sr-only"
                                                            />
                                                            <span
                                                                className={cn(
                                                                    'grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl transition-colors',
                                                                    on ? 'bg-[#6d28d9] text-white' : 'bg-[#f6f0fd] text-[#6d28d9]',
                                                                )}
                                                            >
                                                                <Icon aria-hidden="true" />
                                                            </span>
                                                            <span className="min-w-0 flex-1">
                                                                <span className="block text-[15px] font-semibold text-[#1f1633]">{s.label}</span>
                                                                <span className="block text-[13px] text-[#8a7fa0]">{s.note}</span>
                                                            </span>
                                                            <span
                                                                aria-hidden="true"
                                                                className={cn(
                                                                    'grid h-6 w-6 shrink-0 place-items-center rounded-md border text-sm transition-colors',
                                                                    on ? 'border-[#6d28d9] bg-[#6d28d9] text-white' : 'border-[#d9cbb6] text-transparent',
                                                                )}
                                                            >
                                                                <HiCheck />
                                                            </span>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                            {errorMsg('services')}
                                        </div>
                                    )}

                                    {step === 1 && (
                                        <div className="mt-6 space-y-8">
                                            <div>
                                                <p id={`${uid}-budget-label`} className={fieldLabel}>
                                                    Budget
                                                </p>
                                                <div
                                                    role="radiogroup"
                                                    aria-labelledby={`${uid}-budget-label`}
                                                    aria-describedby={errors.budget ? `${uid}-budget-err` : undefined}
                                                    className="grid gap-3 sm:grid-cols-2"
                                                >
                                                    {budgets.map((b, i) => {
                                                        const on = values.budget === b.id
                                                        return (
                                                            <label
                                                                key={b.id}
                                                                className={cn(
                                                                    'relative flex min-h-[4.5rem] cursor-pointer items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 transition-[border-color,box-shadow] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#6d28d9]',
                                                                    on
                                                                        ? 'border-[#6d28d9] shadow-[0_0_0_1px_#6d28d9]'
                                                                        : 'border-[#e4d8c6] hover:border-[#cbb9e9]',
                                                                )}
                                                            >
                                                                <input
                                                                    ref={i === 0 ? (el) => { refs.current.budget = el } : undefined}
                                                                    type="radio"
                                                                    name={`${uid}-budget`}
                                                                    value={b.id}
                                                                    checked={on}
                                                                    onChange={() => set('budget', b.id)}
                                                                    className="sr-only"
                                                                />
                                                                <span className="min-w-0">
                                                                    <span className="block text-lg font-semibold tabular-nums tracking-[-0.01em] text-[#1f1633]">
                                                                        {b.label}
                                                                    </span>
                                                                    <span className="block text-[13px] text-[#8a7fa0]">{b.scope}</span>
                                                                </span>
                                                                <span
                                                                    aria-hidden="true"
                                                                    className={cn(
                                                                        'grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors',
                                                                        on ? 'border-[#6d28d9]' : 'border-[#d9cbb6]',
                                                                    )}
                                                                >
                                                                    <span className={cn('h-2.5 w-2.5 rounded-full', on ? 'bg-[#6d28d9]' : 'bg-transparent')} />
                                                                </span>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                                {errorMsg('budget')}
                                            </div>
                                            <div>
                                                <p id={`${uid}-timeline-label`} className={fieldLabel}>
                                                    Ideal start
                                                </p>
                                                <div
                                                    role="radiogroup"
                                                    aria-labelledby={`${uid}-timeline-label`}
                                                    aria-describedby={errors.timeline ? `${uid}-timeline-err` : undefined}
                                                    className="flex flex-wrap gap-2"
                                                >
                                                    {timelines.map((t, i) => {
                                                        const on = values.timeline === t.id
                                                        return (
                                                            <label key={t.id} className="relative cursor-pointer">
                                                                <input
                                                                    ref={i === 0 ? (el) => { refs.current.timeline = el } : undefined}
                                                                    type="radio"
                                                                    name={`${uid}-timeline`}
                                                                    value={t.id}
                                                                    checked={on}
                                                                    onChange={() => set('timeline', t.id)}
                                                                    className="peer sr-only"
                                                                />
                                                                <span
                                                                    className={cn(
                                                                        'inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#6d28d9]',
                                                                        on
                                                                            ? 'border-[#1f1633] bg-[#1f1633] text-white'
                                                                            : 'border-[#e4d8c6] bg-white text-[#1f1633] hover:border-[#cbb9e9]',
                                                                    )}
                                                                >
                                                                    {t.label}
                                                                </span>
                                                            </label>
                                                        )
                                                    })}
                                                </div>
                                                {errorMsg('timeline')}
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                            {[
                                                { name: 'name', label: 'Your name', type: 'text', auto: 'name', ph: 'Maya Lindqvist' },
                                                { name: 'email', label: 'Work email', type: 'email', auto: 'email', ph: 'maya@northwind.io' },
                                                { name: 'company', label: 'Company', type: 'text', auto: 'organization', ph: 'Northwind Health' },
                                                { name: 'website', label: 'Website', type: 'url', auto: 'url', ph: 'northwind.io', optional: true },
                                            ].map((f) => (
                                                <div key={f.name}>
                                                    <label htmlFor={`${uid}-${f.name}`} className={fieldLabel}>
                                                        {f.label}
                                                        {f.optional && <span className="ml-1 font-normal text-[#8a7fa0]">(optional)</span>}
                                                    </label>
                                                    <input
                                                        id={`${uid}-${f.name}`}
                                                        ref={(el) => { refs.current[f.name] = el }}
                                                        type={f.type}
                                                        autoComplete={f.auto}
                                                        placeholder={f.ph}
                                                        value={values[f.name]}
                                                        aria-invalid={Boolean(errors[f.name])}
                                                        aria-describedby={errors[f.name] ? `${uid}-${f.name}-err` : undefined}
                                                        className={inputClass(f.name)}
                                                        onChange={(e) => set(f.name, e.target.value)}
                                                    />
                                                    {errorMsg(f.name)}
                                                </div>
                                            ))}
                                            <div className="sm:col-span-2">
                                                <label htmlFor={`${uid}-about`} className={fieldLabel}>
                                                    What are you building?
                                                </label>
                                                <textarea
                                                    id={`${uid}-about`}
                                                    ref={(el) => { refs.current.about = el }}
                                                    rows={4}
                                                    maxLength={800}
                                                    placeholder="A patient check-in app for 40 clinics, replacing paper forms by spring…"
                                                    value={values.about}
                                                    aria-invalid={Boolean(errors.about)}
                                                    aria-describedby={errors.about ? `${uid}-about-err` : undefined}
                                                    className={cn(inputClass('about'), 'h-auto min-h-32 resize-y py-3 leading-6')}
                                                    onChange={(e) => set('about', e.target.value)}
                                                />
                                                {errorMsg('about')}
                                            </div>
                                            <p className="text-[13px] leading-6 text-[#8a7fa0] sm:col-span-2">
                                                We only use these details to reply to your brief. Read our{' '}
                                                <a
                                                    href="#brightbridge-privacy"
                                                    className="font-semibold text-[#6d28d9] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9]"
                                                >
                                                    privacy notice
                                                </a>
                                                .
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-10 flex items-center justify-between gap-3 border-t border-[#eadfce] pt-6">
                                        <button
                                            type="button"
                                            onClick={goBack}
                                            disabled={step === 0}
                                            className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold text-[#1f1633] transition-colors hover:bg-[#f6f0fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d28d9] disabled:pointer-events-none disabled:opacity-35"
                                        >
                                            <HiArrowLeft aria-hidden="true" />
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#6d28d9] pl-6 pr-2 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(109,40,217,0.9)] transition-colors hover:bg-[#5b21b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1f1633]"
                                        >
                                            {step === steps.length - 1 ? 'Send brief' : `Next: ${steps[step + 1].label}`}
                                            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                                                <HiArrowRight aria-hidden="true" />
                                            </span>
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

export default StepwiseLeadForm
