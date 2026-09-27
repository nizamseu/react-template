// TrustCenterSecurityCompliance

// SecurityCompliance04 · SaaS Platforms › Security & Compliance

// Description:
// A compact, self-serve trust portal for the fictional analytics suite Clearpath. Under the
// heading "Everything your security review needs, in one place." four tabs (Overview,
// Certifications, Subprocessors, Policies) show posture stats, downloadable documents with
// size and date, and a subprocessor register. A side card with the form "Request SOC 2
// report" collects work email, company and NDA consent. Use it as a trust center page or
// as the security section of an enterprise landing page.

// Design:
// - Clean white background, slate #0f172a / #475569 text, sky blue #0284c7 for the active
//   tab, buttons, focus rings and "Public" badges; amber badges mark restricted files
// - Header row: shield wordmark "Clearpath Trust Center", a green "All systems operational"
//   pill and an "Updated 22 Sep 2026" stamp; heading text-3xl → lg:text-5xl semibold
// - Tabs are an underlined segmented bar that scrolls sideways on narrow screens; the active
//   tab has a sliding blue underline (layoutId) and panels cross-fade
// - Document rows are hairline-divided list items with an icon tile, title, meta line and a
//   40px download button; the subprocessor register is a 4-column list that stacks on mobile
// - Request card is a slate-50 rounded-3xl panel, sticky on lg; the layout is one column
//   below lg and 2 columns (1fr + 380px) on lg

// What it does:
// - tab (default "overview") is switched by clicking a tab or with Arrow keys, Home and End
//   (role="tablist" / "tab" / "tabpanel", roving tabindex)
// - Download buttons are a mock: they show "Preparing…" for 1.2 s then "Downloaded" (timers
//   are cleared on unmount); restricted files show "Request" and fill the form's document
//   select, then move focus to the email field
// - The form is controlled, validates work email format, company and NDA consent on submit,
//   shows inline errors and swaps to a success message ("Request sent") with a reset link
// - No network calls; the status pill is static

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TrustCenterSecurityCompliance from '@/TestComponent/PageSections/saas/SecurityCompliance04';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <TrustCenterSecurityCompliance />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowDownTray, HiCheck, HiCheckCircle, HiDocumentText, HiLockClosed, HiShieldCheck } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'subprocessors', label: 'Subprocessors' },
    { id: 'policies', label: 'Policies' },
]

const stats = [
    { value: 'SOC 2 Type II', label: 'Clean opinion, no exceptions (Aug 2026)' },
    { value: '0', label: 'Material security incidents since 2021' },
    { value: '2× / year', label: 'Independent penetration tests' },
]

const practices = [
    'SAML SSO and SCIM provisioning on every plan',
    'Immutable audit logs kept for 400 days',
    'Data residency in the EU or US, chosen per workspace',
    'Customer data never used to train models',
]

const certifications = [
    { id: 'soc2', title: 'SOC 2 Type II report', meta: 'PDF · 2.4 MB · Aug 2026', restricted: true },
    { id: 'soc3', title: 'SOC 3 summary', meta: 'PDF · 410 KB · Aug 2026', restricted: false },
    { id: 'iso27001', title: 'ISO/IEC 27001 certificate', meta: 'PDF · 380 KB · valid to Mar 2028', restricted: false },
    { id: 'iso27701', title: 'ISO/IEC 27701 certificate', meta: 'PDF · 372 KB · valid to Mar 2028', restricted: false },
    { id: 'pentest', title: '2026 H1 penetration test summary', meta: 'PDF · 1.1 MB · Jun 2026', restricted: true },
]

const policies = [
    { id: 'infosec', title: 'Information Security Policy', meta: 'v7.2 · updated 04 Sep 2026' },
    { id: 'incident', title: 'Incident Response Plan', meta: 'v4.0 · updated 18 Jul 2026' },
    { id: 'bcdr', title: 'Business Continuity & Disaster Recovery', meta: 'v3.1 · updated 02 May 2026' },
    { id: 'retention', title: 'Data Retention & Deletion', meta: 'v2.6 · updated 11 Apr 2026' },
    { id: 'vendor', title: 'Vendor Risk Management', meta: 'v2.0 · updated 27 Feb 2026' },
]

const subprocessors = [
    { name: 'Stratus Compute', purpose: 'Cloud hosting', location: 'EU · US', since: '2019' },
    { name: 'Mailcraft', purpose: 'Transactional email', location: 'US', since: '2020' },
    { name: 'Ledgerline', purpose: 'Billing and invoicing', location: 'EU', since: '2021' },
    { name: 'Tidewater Desk', purpose: 'Customer support', location: 'EU · US', since: '2022' },
    { name: 'Quarry Search', purpose: 'In-app search index', location: 'EU', since: '2024' },
    { name: 'Oakline Observability', purpose: 'Error monitoring', location: 'US', since: '2025' },
]

const restrictedDocs = certifications.filter((doc) => doc.restricted)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const emptyForm = { email: '', company: '', document: 'soc2', nda: false }

export function TrustCenterSecurityCompliance({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const uid = useId()
    const [tab, setTab] = useState('overview')
    const [downloads, setDownloads] = useState({})
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState({})
    const [sent, setSent] = useState(null)
    const tabRefs = useRef([])
    const timers = useRef([])
    const wantEmailFocus = useRef(false)

    useEffect(() => {
        const list = timers.current
        return () => list.forEach((t) => clearTimeout(t))
    }, [])

    const onTabKey = (event, index) => {
        const last = tabs.length - 1
        let next = null
        if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
        if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        setTab(tabs[next].id)
        tabRefs.current[next]?.focus()
    }

    const download = (id) => {
        if (downloads[id]) return
        setDownloads((d) => ({ ...d, [id]: 'loading' }))
        const t = setTimeout(() => setDownloads((d) => ({ ...d, [id]: 'done' })), 1200)
        timers.current.push(t)
    }

    const requestDoc = (id) => {
        setSent(null)
        setForm((f) => ({ ...f, document: id }))
        wantEmailFocus.current = true
        const input = document.getElementById(`${uid}-email`)
        if (input) {
            input.focus()
            wantEmailFocus.current = false
        }
    }

    const update = (field) => (event) => {
        const value = field === 'nda' ? event.target.checked : event.target.value
        setForm((f) => ({ ...f, [field]: value }))
        if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
    }

    const onSubmit = (event) => {
        event.preventDefault()
        const next = {}
        if (!form.email.trim()) next.email = 'Enter your work email.'
        else if (!EMAIL_RE.test(form.email.trim())) next.email = 'That email doesn’t look right, e.g. alex@company.com.'
        if (form.company.trim().length < 2) next.company = 'Tell us which company you’re with.'
        if (!form.nda) next.nda = 'Please accept the mutual NDA to receive restricted files.'
        setErrors(next)
        if (Object.keys(next).length) return
        const doc = restrictedDocs.find((d) => d.id === form.document)
        setSent({ email: form.email.trim(), doc: doc ? doc.title : 'SOC 2 Type II report' })
        setForm(emptyForm)
    }

    const renderDoc = (doc) => {
        const state = downloads[doc.id]
        return (
            <li key={doc.id} className="flex items-center gap-3 py-3.5 sm:gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f1f5f9] text-[#0284c7]">
                    <HiDocumentText className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0f172a]">{doc.title}</p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#64748b]">
                        {doc.meta}
                        {doc.restricted !== undefined && (
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                                    doc.restricted ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#e0f2fe] text-[#0369a1]',
                                )}
                            >
                                {doc.restricted && <HiLockClosed className="size-3" aria-hidden="true" />}
                                {doc.restricted ? 'NDA' : 'Public'}
                            </span>
                        )}
                    </p>
                </div>
                {doc.restricted ? (
                    <button
                        type="button"
                        aria-label={`Request ${doc.title}`}
                        className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-[#cbd5e1] px-4 text-xs font-semibold text-[#0f172a] transition-colors hover:border-[#0284c7] hover:text-[#0284c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                        onClick={() => requestDoc(doc.id)}
                    >
                        Request
                    </button>
                ) : (
                    <button
                        type="button"
                        aria-label={state === 'done' ? `${doc.title} downloaded` : `Download ${doc.title}`}
                        className={cn(
                            'inline-flex min-h-10 min-w-10 shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]',
                            state === 'done' ? 'bg-[#dcfce7] text-[#166534]' : 'bg-[#0284c7] text-white hover:bg-[#0369a1]',
                        )}
                        onClick={() => download(doc.id)}
                    >
                        {state === 'done' ? (
                            <HiCheck className="size-4" aria-hidden="true" />
                        ) : (
                            <HiArrowDownTray className={cn('size-4', state === 'loading' && 'motion-safe:animate-bounce')} aria-hidden="true" />
                        )}
                        <span className="hidden sm:inline">
                            {state === 'done' ? 'Downloaded' : state === 'loading' ? 'Preparing…' : 'Download'}
                        </span>
                    </button>
                )}
            </li>
        )
    }

    const panelMotion = {
        initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: reduceMotion ? 0 : 0.2 },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-16 text-base font-normal text-[#475569] sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-[#e2e8f0] pb-5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-[#0f172a]">
                        <span className="grid size-8 place-items-center rounded-lg bg-[#0284c7] text-white">
                            <HiShieldCheck className="size-5" aria-hidden="true" />
                        </span>
                        Clearpath Trust Center
                    </p>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-semibold text-[#166534]">
                        <span className="size-2 rounded-full bg-[#22c55e]" aria-hidden="true" />
                        All systems operational
                    </span>
                    <span className="text-xs text-[#94a3b8] sm:ml-auto">Updated 22 Sep 2026</span>
                </div>

                <div className="mt-10 max-w-3xl">
                    <h2 className="text-3xl font-semibold leading-tight tracking-tight text-[#0f172a] sm:text-4xl lg:text-5xl">
                        Everything your security review needs, in one place.
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
                        Download public certificates instantly, request restricted reports under NDA, and
                        see exactly who processes your data. Answers ready for your questionnaire.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
                    <div className="min-w-0">
                        <div
                            role="tablist"
                            aria-label="Trust Center sections"
                            className="flex gap-1 overflow-x-auto border-b border-[#e2e8f0] [scrollbar-width:none]"
                        >
                            {tabs.map((item, index) => {
                                const isActive = item.id === tab
                                return (
                                    <button
                                        key={item.id}
                                        ref={(el) => {
                                            tabRefs.current[index] = el
                                        }}
                                        type="button"
                                        role="tab"
                                        id={`${uid}-tab-${item.id}`}
                                        aria-selected={isActive}
                                        aria-controls={`${uid}-panel-${item.id}`}
                                        tabIndex={isActive ? 0 : -1}
                                        className={cn(
                                            'relative min-h-11 shrink-0 whitespace-nowrap px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#0284c7] sm:px-4',
                                            isActive ? 'text-[#0284c7]' : 'text-[#64748b] hover:text-[#0f172a]',
                                        )}
                                        onClick={() => setTab(item.id)}
                                        onKeyDown={(event) => onTabKey(event, index)}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <motion.span
                                                layoutId={`${uid}-underline`}
                                                transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 34 }}
                                                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#0284c7]"
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={tab}
                                id={`${uid}-panel-${tab}`}
                                role="tabpanel"
                                aria-labelledby={`${uid}-tab-${tab}`}
                                className="pt-6"
                                {...panelMotion}
                            >
                                {tab === 'overview' && (
                                    <div>
                                        <dl className="grid gap-3 sm:grid-cols-3">
                                            {stats.map((stat) => (
                                                <div key={stat.value} className="flex flex-col rounded-2xl border border-[#e2e8f0] p-5">
                                                    <dt className="order-2 mt-1 text-sm leading-snug text-[#64748b]">{stat.label}</dt>
                                                    <dd className="order-1 text-xl font-semibold tracking-tight text-[#0f172a]">{stat.value}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                        <h3 className="mt-8 text-base font-semibold text-[#0f172a]">Security practices</h3>
                                        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                                            {practices.map((practice) => (
                                                <li key={practice} className="flex gap-2.5 text-sm leading-snug text-[#334155]">
                                                    <HiCheckCircle className="mt-0.5 size-5 shrink-0 text-[#0284c7]" aria-hidden="true" />
                                                    {practice}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {tab === 'certifications' && (
                                    <ul className="divide-y divide-[#e2e8f0]">
                                        {certifications.map(renderDoc)}
                                    </ul>
                                )}

                                {tab === 'subprocessors' && (
                                    <div>
                                        <div className="hidden grid-cols-[1.2fr_1.2fr_0.8fr_0.5fr] gap-4 border-b border-[#e2e8f0] pb-2 text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8] sm:grid">
                                            <span>Subprocessor</span>
                                            <span>Purpose</span>
                                            <span>Data location</span>
                                            <span>Since</span>
                                        </div>
                                        <ul className="divide-y divide-[#e2e8f0]">
                                            {subprocessors.map((sub) => (
                                                <li
                                                    key={sub.name}
                                                    className="grid grid-cols-2 gap-x-4 gap-y-1 py-3.5 text-sm sm:grid-cols-[1.2fr_1.2fr_0.8fr_0.5fr] sm:items-center"
                                                >
                                                    <span className="font-semibold text-[#0f172a]">{sub.name}</span>
                                                    <span className="text-right text-[#64748b] sm:text-left">{sub.purpose}</span>
                                                    <span className="text-xs text-[#64748b] sm:text-sm">
                                                        <span className="sm:hidden">Location: </span>
                                                        {sub.location}
                                                    </span>
                                                    <span className="text-right text-xs tabular-nums text-[#64748b] sm:text-left sm:text-sm">
                                                        <span className="sm:hidden">Since </span>
                                                        {sub.since}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p className="mt-4 text-xs text-[#94a3b8]">
                                            We give 30 days’ notice before adding a subprocessor.
                                        </p>
                                    </div>
                                )}

                                {tab === 'policies' && (
                                    <ul className="divide-y divide-[#e2e8f0]">
                                        {policies.map(renderDoc)}
                                    </ul>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <aside className="self-start rounded-3xl bg-[#f8fafc] p-6 ring-1 ring-[#e2e8f0] sm:p-8 lg:sticky lg:top-8">
                        <AnimatePresence mode="wait" initial={false}>
                            {sent ? (
                                <motion.div key="sent" {...panelMotion} role="status">
                                    <span className="grid size-12 place-items-center rounded-full bg-[#dcfce7] text-[#166534]">
                                        <HiCheck className="size-6" aria-hidden="true" />
                                    </span>
                                    <h3 className="mt-5 text-xl font-semibold text-[#0f172a]">Request sent</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                                        We’ll email a mutual NDA to <span className="font-semibold text-[#0f172a]">{sent.email}</span>.
                                        Once it’s signed, the {sent.doc} arrives within one business day.
                                    </p>
                                    <button
                                        type="button"
                                        className="mt-5 inline-flex min-h-10 items-center text-sm font-semibold text-[#0284c7] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                                        onClick={() => setSent(null)}
                                    >
                                        Request another document
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form key="form" {...panelMotion} noValidate onSubmit={onSubmit}>
                                    <h3 className="text-xl font-semibold text-[#0f172a]">Request SOC 2 report</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                                        Restricted documents are shared under a mutual NDA with verified company
                                        emails.
                                    </p>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label htmlFor={`${uid}-email`} className="text-sm font-semibold text-[#0f172a]">
                                                Work email
                                            </label>
                                            <input
                                                ref={(el) => {
                                                    if (el && wantEmailFocus.current) {
                                                        el.focus()
                                                        wantEmailFocus.current = false
                                                    }
                                                }}
                                                id={`${uid}-email`}
                                                type="email"
                                                autoComplete="email"
                                                placeholder="alex@company.com"
                                                value={form.email}
                                                aria-invalid={Boolean(errors.email)}
                                                aria-describedby={errors.email ? `${uid}-email-error` : undefined}
                                                className={cn(
                                                    'mt-1.5 block min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-2 focus:outline-offset-0 focus:outline-[#0284c7]',
                                                    errors.email ? 'border-[#dc2626]' : 'border-[#cbd5e1]',
                                                )}
                                                onChange={update('email')}
                                            />
                                            {errors.email && (
                                                <p id={`${uid}-email-error`} className="mt-1.5 text-xs font-medium text-[#dc2626]">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor={`${uid}-company`} className="text-sm font-semibold text-[#0f172a]">
                                                Company
                                            </label>
                                            <input
                                                id={`${uid}-company`}
                                                type="text"
                                                autoComplete="organization"
                                                placeholder="Northbeam Inc."
                                                value={form.company}
                                                aria-invalid={Boolean(errors.company)}
                                                aria-describedby={errors.company ? `${uid}-company-error` : undefined}
                                                className={cn(
                                                    'mt-1.5 block min-h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-2 focus:outline-offset-0 focus:outline-[#0284c7]',
                                                    errors.company ? 'border-[#dc2626]' : 'border-[#cbd5e1]',
                                                )}
                                                onChange={update('company')}
                                            />
                                            {errors.company && (
                                                <p id={`${uid}-company-error`} className="mt-1.5 text-xs font-medium text-[#dc2626]">
                                                    {errors.company}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor={`${uid}-doc`} className="text-sm font-semibold text-[#0f172a]">
                                                Document
                                            </label>
                                            <select
                                                id={`${uid}-doc`}
                                                value={form.document}
                                                className="mt-1.5 block min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-sm text-[#0f172a] focus:outline-2 focus:outline-offset-0 focus:outline-[#0284c7]"
                                                onChange={update('document')}
                                            >
                                                {restrictedDocs.map((doc) => (
                                                    <option key={doc.id} value={doc.id}>
                                                        {doc.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="flex cursor-pointer items-start gap-3 text-sm leading-snug text-[#334155]">
                                                <input
                                                    type="checkbox"
                                                    checked={form.nda}
                                                    aria-invalid={Boolean(errors.nda)}
                                                    aria-describedby={errors.nda ? `${uid}-nda-error` : undefined}
                                                    className="mt-0.5 size-5 shrink-0 accent-[#0284c7]"
                                                    onChange={update('nda')}
                                                />
                                                I agree to Clearpath’s mutual NDA for restricted security documents.
                                            </label>
                                            {errors.nda && (
                                                <p id={`${uid}-nda-error`} className="mt-1.5 text-xs font-medium text-[#dc2626]">
                                                    {errors.nda}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#0f172a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#0284c7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0284c7]"
                                    >
                                        <HiLockClosed className="size-4" aria-hidden="true" />
                                        Request access
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default TrustCenterSecurityCompliance
