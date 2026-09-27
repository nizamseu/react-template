// FloatingPillOnThisPage

// OnThisPage03 · Knowledge Bases & Documentation › On-This-Page Navigation

// Description:
// A Helpbase admin article, "Set up single sign-on (SSO)", scrolling inside a rounded
// article box. On phones and tablets a floating blue "On this page" pill hovers over
// the bottom of the box, shows the current section and opens a popover list of the
// seven headings; on lg the same list sits in a classic right rail with a "Still
// stuck?" card. Use it for help-center articles that are read mostly on mobile.

// Design:
// - White page with a faint dotted #dbeafe pattern, slate #0f172a text, blue #2563eb
//   accent; article box rounded-[32px] with a 1px #e2e8f0 border and a soft shadow
// - Floating pill (below lg): blue, rounded-full, 48px tall, "3/7" counter chip,
//   current heading (truncated) and a chevron; the popover rises from it (scale + fade,
//   instant for reduced motion) as a white card with the active item on a #eff6ff pill
// - Rail (lg): bullet list where the active bullet grows and fills blue; a slate "Still
//   stuck?" card with a contact link sits under it
// - Article parts: requirement checklist, protocol cards, key/value rows with copy
//   buttons, an attribute table and blue / amber callouts
// - Box height 480px → sm:540px → lg:600px; title text-3xl → sm:4xl → lg:5xl

// What it does:
// - IntersectionObserver rooted on the box (rootMargin -75% bottom) plus a debounced
//   scroll-end check pick the active heading; links (#hash, click intercepted)
//   smooth-scroll the box to a heading and focus it (instant for reduced motion)
// - The pill is a disclosure button (aria-expanded, aria-controls); opening focuses the
//   active link, Arrow keys / Home / End move between links, Escape or an outside click
//   closes and returns focus to the pill; choosing a link closes it
// - Copy buttons put the ACS URL or Entity ID on the clipboard (API with textarea
//   fallback) and show "Copied" for 1.8 s; support links are #hash anchors

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FloatingPillOnThisPage from '@/TestComponent/PageSections/knowledge/OnThisPage03';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <FloatingPillOnThisPage />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiChevronRight,
    HiChevronUp,
    HiOutlineChatBubbleLeftRight,
    HiOutlineClipboardDocument,
    HiOutlineExclamationTriangle,
    HiOutlineInformationCircle,
    HiOutlineShieldCheck,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const TOC = [
    { id: 'before', label: 'Before you begin' },
    { id: 'protocol', label: 'Choose a protocol' },
    { id: 'configure', label: 'Configure SAML' },
    { id: 'attributes', label: 'Map user attributes' },
    { id: 'test', label: 'Test the connection' },
    { id: 'enforce', label: 'Enforce SSO' },
    { id: 'troubleshoot', label: 'Troubleshooting' },
]

const SPY_IDS = TOC.map((item) => item.id)

const FIELDS = [
    { key: 'acs', label: 'ACS URL', value: 'https://acme.helpbase.io/sso/saml/acs' },
    { key: 'entity', label: 'Entity ID', value: 'urn:helpbase:acme' },
]

const ATTRIBUTES = [
    ['email', 'NameID', 'Required'],
    ['first_name', 'givenName', 'Required'],
    ['last_name', 'surname', 'Required'],
    ['team', 'groups', 'Optional'],
]

function legacyCopy(text) {
    try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.top = '0'
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

async function copyText(text) {
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        }
    } catch {
        // not allowed here: fall back
    }
    return legacyCopy(text)
}

function useScrollSpy(ids, reduceMotion) {
    const boxRef = useRef(null)
    const headingRefs = useRef({})
    const lockRef = useRef(0)
    const [active, setActive] = useState(ids[0])

    useEffect(() => {
        const root = boxRef.current
        if (!root) return undefined

        const compute = () => {
            const line = root.getBoundingClientRect().top + root.clientHeight * 0.25
            let current = ids[0]
            ids.forEach((id) => {
                const el = headingRefs.current[id]
                if (el && el.getBoundingClientRect().top <= line) current = id
            })
            if (root.scrollTop + root.clientHeight >= root.scrollHeight - 4) current = ids[ids.length - 1]
            setActive(current)
        }

        let observer = null
        if (typeof IntersectionObserver !== 'undefined') {
            observer = new IntersectionObserver(
                () => {
                    if (Date.now() > lockRef.current) compute()
                },
                { root, rootMargin: '0px 0px -75% 0px', threshold: [0, 1] },
            )
            ids.forEach((id) => headingRefs.current[id] && observer.observe(headingRefs.current[id]))
        }

        let idle = null
        const onScroll = () => {
            clearTimeout(idle)
            idle = setTimeout(() => {
                if (Date.now() < lockRef.current) {
                    lockRef.current = 0
                    return
                }
                compute()
            }, 140)
        }
        root.addEventListener('scroll', onScroll, { passive: true })

        return () => {
            observer?.disconnect()
            root.removeEventListener('scroll', onScroll)
            clearTimeout(idle)
        }
    }, [ids])

    const jump = (id) => {
        const root = boxRef.current
        const el = headingRefs.current[id]
        if (!root || !el) return
        const top = el.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop - 20
        lockRef.current = Date.now() + 1500
        root.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' })
        setActive(id)
        el.focus({ preventScroll: true })
    }

    return { boxRef, headingRefs, active, jump }
}

export function FloatingPillOnThisPage({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const { boxRef, headingRefs, active, jump } = useScrollSpy(SPY_IDS, reduceMotion)
    const [menuOpen, setMenuOpen] = useState(false)
    const [copied, setCopied] = useState({ key: null, ok: true, n: 0 })
    const pillRef = useRef(null)
    const popRef = useRef(null)
    const activeIndex = SPY_IDS.indexOf(active)
    const menuId = `${uid}-menu`

    useEffect(() => {
        if (!copied.key) return undefined
        const id = setTimeout(() => setCopied((c) => ({ ...c, key: null })), 1800)
        return () => clearTimeout(id)
    }, [copied])

    useEffect(() => {
        if (!menuOpen) return undefined
        const onKey = (event) => {
            if (event.key !== 'Escape') return
            setMenuOpen(false)
            pillRef.current?.focus()
        }
        const onDown = (event) => {
            if (popRef.current?.contains(event.target) || pillRef.current?.contains(event.target)) return
            setMenuOpen(false)
        }
        const frame = requestAnimationFrame(() => {
            const pop = popRef.current
            const target = pop?.querySelector('[aria-current="location"]') || pop?.querySelector('a')
            target?.focus()
        })
        document.addEventListener('keydown', onKey)
        document.addEventListener('pointerdown', onDown)
        return () => {
            cancelAnimationFrame(frame)
            document.removeEventListener('keydown', onKey)
            document.removeEventListener('pointerdown', onDown)
        }
    }, [menuOpen])

    const onCopy = async (field) => {
        const ok = await copyText(field.value)
        setCopied((c) => ({ key: field.key, ok, n: c.n + 1 }))
    }

    const hid = (id) => `${uid}-${id}`
    const headingProps = (id) => ({
        id: hid(id),
        ref: (el) => {
            headingRefs.current[id] = el
        },
        tabIndex: -1,
    })
    const onLink = (event, id) => {
        event.preventDefault()
        setMenuOpen(false)
        jump(id)
    }

    const onMenuKey = (event) => {
        const links = [...(popRef.current?.querySelectorAll('a') ?? [])]
        const index = links.indexOf(document.activeElement)
        let next = null
        if (event.key === 'ArrowDown') next = links[(index + 1) % links.length]
        if (event.key === 'ArrowUp') next = links[(index - 1 + links.length) % links.length]
        if (event.key === 'Home') next = links[0]
        if (event.key === 'End') next = links[links.length - 1]
        if (!next) return
        event.preventDefault()
        next.focus()
    }

    const onMenuBlur = (event) => {
        const to = event.relatedTarget
        if (!to || popRef.current?.contains(to) || pillRef.current?.contains(to)) return
        setMenuOpen(false)
    }

    const h3 = 'scroll-mt-6 text-2xl font-bold tracking-[-0.02em] text-[#0f172a] outline-none sm:text-[26px]'
    const p = 'text-[16px] leading-7 text-[#334155]'
    const code = 'rounded-md bg-[#eff6ff] px-1.5 py-0.5 font-mono text-[0.86em] text-[#1d4ed8]'

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-white px-4 py-16 text-base font-normal text-[#0f172a] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(#dbeafe_1.2px,transparent_1.2px)] bg-[size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            />
            <div className="relative mx-auto max-w-6xl">
                <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1 text-[13px] font-medium text-[#64748b]">
                        {['Help Center', 'Admin', 'Security'].map((crumb) => (
                            <li key={crumb} className="flex items-center gap-1">
                                <a
                                    href={`#helpbase-${crumb.toLowerCase().replace(' ', '-')}`}
                                    className="inline-flex min-h-10 items-center rounded px-1 hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-[#2563eb]"
                                >
                                    {crumb}
                                </a>
                                <HiChevronRight aria-hidden="true" className="size-3.5 text-[#cbd5e1]" />
                            </li>
                        ))}
                        <li aria-current="page" className="px-1 text-[#0f172a]">
                            Single sign-on
                        </li>
                    </ol>
                </nav>
                <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-[#0f172a] sm:text-4xl lg:text-5xl">
                            Set up single sign-on (SSO)
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-[#475569]">
                            Let your team sign in to Helpbase with the identity provider you already use — and switch
                            off passwords for good.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="flex -space-x-2">
                            <span className="grid size-9 place-items-center rounded-full bg-[#2563eb] text-xs font-bold text-white ring-2 ring-white">
                                PR
                            </span>
                            <span className="grid size-9 place-items-center rounded-full bg-[#0f172a] text-xs font-bold text-white ring-2 ring-white">
                                TE
                            </span>
                        </span>
                        <p className="text-sm leading-5 text-[#64748b]">
                            <span className="font-semibold text-[#0f172a]">Priya Raman & Tom Ellis</span>
                            <br />
                            Updated Sep 12, 2026 · 6 min
                        </p>
                    </div>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_250px]">
                    <div className="relative min-w-0">
                        <div className="overflow-hidden rounded-[32px] border border-[#e2e8f0] bg-white shadow-[0_30px_70px_-45px_rgba(37,99,235,0.5)]">
                            <div
                                ref={boxRef}
                                role="region"
                                aria-label="Article: Set up single sign-on"
                                tabIndex={0}
                                className="h-[480px] overflow-y-auto overscroll-y-contain px-5 py-8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563eb] sm:h-[540px] sm:px-10 lg:h-[600px]"
                            >
                                <article className="mx-auto max-w-2xl space-y-5">
                                    <p className="inline-flex items-center gap-2 rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">
                                        <HiOutlineShieldCheck aria-hidden="true" className="size-4" />
                                        Business and Enterprise plans
                                    </p>

                                    <h3 {...headingProps('before')} className={h3}>
                                        Before you begin
                                    </h3>
                                    <ul className="space-y-2.5">
                                        {[
                                            'You are an Owner or Admin in your Helpbase workspace.',
                                            'You can create apps in your identity provider’s admin console.',
                                            'Everyone who will use SSO has an email on a verified domain.',
                                        ].map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-[15.5px] leading-7 text-[#334155]">
                                                <span className="mt-1.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#2563eb] text-white">
                                                    <HiCheck aria-hidden="true" className="size-3" />
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <h3 {...headingProps('protocol')} className={cn(h3, 'pt-6')}>
                                        Choose a protocol
                                    </h3>
                                    <p className={p}>
                                        Helpbase supports SAML 2.0 and OpenID Connect. Pick whichever your provider documents
                                        best; both give the same result for your agents.
                                    </p>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {[
                                            ['SAML 2.0', 'Most enterprise providers. Metadata XML or manual setup.', true],
                                            ['OpenID Connect', 'Modern providers. Client id, secret and issuer URL.', false],
                                        ].map(([name, text, picked]) => (
                                            <div
                                                key={name}
                                                className={cn(
                                                    'rounded-2xl border p-4',
                                                    picked ? 'border-[#93c5fd] bg-[#eff6ff]' : 'border-[#e2e8f0]',
                                                )}
                                            >
                                                <p className="flex items-center justify-between font-semibold text-[#0f172a]">
                                                    {name}
                                                    {picked && (
                                                        <span className="rounded-full bg-[#2563eb] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                                            This guide
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-[#64748b]">{text}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <h3 {...headingProps('configure')} className={cn(h3, 'pt-6')}>
                                        Configure SAML
                                    </h3>
                                    <p className={p}>
                                        In your identity provider, create a new SAML app called “Helpbase” and paste these two
                                        values. Then download the provider’s metadata XML and upload it under Settings →
                                        Security → Single sign-on.
                                    </p>
                                    <div className="divide-y divide-[#e2e8f0] rounded-2xl border border-[#e2e8f0]">
                                        {FIELDS.map((field) => {
                                            const isCopied = copied.key === field.key && copied.ok
                                            return (
                                                <div key={field.key} className="flex items-center gap-3 py-2 pl-4 pr-2">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-semibold text-[#64748b]">{field.label}</p>
                                                        <p className="truncate font-mono text-[13px] text-[#0f172a]">{field.value}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        aria-label={isCopied ? `${field.label} copied` : `Copy ${field.label}`}
                                                        className={cn(
                                                            'inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]',
                                                            isCopied
                                                                ? 'bg-[#2563eb] text-white'
                                                                : 'bg-[#f1f5f9] text-[#334155] hover:bg-[#dbeafe] hover:text-[#1d4ed8]',
                                                        )}
                                                        onClick={() => onCopy(field)}
                                                    >
                                                        {isCopied ? (
                                                            <HiCheck aria-hidden="true" className="size-4" />
                                                        ) : (
                                                            <HiOutlineClipboardDocument aria-hidden="true" className="size-4" />
                                                        )}
                                                        {isCopied ? 'Copied' : copied.key === field.key ? 'Press ⌘C' : 'Copy'}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <span aria-live="polite" className="sr-only">
                                        {copied.key && copied.ok
                                            ? `${FIELDS.find((f) => f.key === copied.key).label} copied to clipboard`
                                            : ''}
                                    </span>

                                    <h3 {...headingProps('attributes')} className={cn(h3, 'pt-6')}>
                                        Map user attributes
                                    </h3>
                                    <p className={p}>
                                        Helpbase creates agent accounts on first sign-in, so the provider must send these
                                        attributes with every assertion.
                                    </p>
                                    <div className="overflow-hidden rounded-2xl border border-[#e2e8f0]">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-[#f8fafc] text-xs uppercase tracking-wider text-[#64748b]">
                                                <tr>
                                                    <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">
                                                        Helpbase
                                                    </th>
                                                    <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">
                                                        Provider
                                                    </th>
                                                    <th scope="col" className="hidden px-4 py-2.5 font-semibold sm:table-cell">
                                                        Status
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#f1f5f9]">
                                                {ATTRIBUTES.map(([ours, theirs, status]) => (
                                                    <tr key={ours}>
                                                        <td className="px-3 py-2.5 font-mono text-[13px] text-[#1d4ed8] sm:px-4">{ours}</td>
                                                        <td className="px-3 py-2.5 font-mono text-[13px] text-[#0f172a] sm:px-4">{theirs}</td>
                                                        <td className="hidden px-4 py-2.5 text-[#64748b] sm:table-cell">{status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <h3 {...headingProps('test')} className={cn(h3, 'pt-6')}>
                                        Test the connection
                                    </h3>
                                    <p className={p}>
                                        Click <strong className="font-semibold text-[#0f172a]">Test SSO</strong>. A new window
                                        opens your provider’s login; after you sign in, Helpbase shows the attributes it
                                        received so you can check the mapping before anyone else is affected.
                                    </p>
                                    <div className="flex gap-3 rounded-2xl bg-[#eff6ff] p-4">
                                        <HiOutlineInformationCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#2563eb]" />
                                        <p className="text-[15px] leading-6 text-[#1e3a8a]">
                                            Keep this tab signed in while you test. If something is off you can still fix the
                                            settings without being locked out.
                                        </p>
                                    </div>

                                    <h3 {...headingProps('enforce')} className={cn(h3, 'pt-6')}>
                                        Enforce SSO
                                    </h3>
                                    <p className={p}>
                                        Once the test passes, switch on <code className={code}>Require SSO</code>. Agents are
                                        signed out and must use your provider next time; customer-facing pages are not
                                        affected.
                                    </p>
                                    <div className="flex gap-3 rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-4">
                                        <HiOutlineExclamationTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[#d97706]" />
                                        <p className="text-[15px] leading-6 text-[#78350f]">
                                            Add at least one break-glass Owner who can still sign in with a password and a
                                            security key.
                                        </p>
                                    </div>

                                    <h3 {...headingProps('troubleshoot')} className={cn(h3, 'pt-6')}>
                                        Troubleshooting
                                    </h3>
                                    <dl className="space-y-3">
                                        {[
                                            ['“Invalid audience”', 'The Entity ID in your provider does not match urn:helpbase:acme.'],
                                            ['“User not assigned”', 'Assign the Helpbase app to the user or their group in the provider.'],
                                            ['Redirect loop', 'Clear cookies for acme.helpbase.io and try a private window.'],
                                        ].map(([term, text]) => (
                                            <div key={term} className="rounded-2xl border border-[#e2e8f0] p-4">
                                                <dt className="font-semibold text-[#0f172a]">{term}</dt>
                                                <dd className="mt-1 text-[15px] leading-6 text-[#475569]">{text}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <div className="pb-48 pt-6 text-center text-xs text-[#94a3b8]">
                                        Article ID 4127 · Helpbase Help Center
                                    </div>
                                </article>
                            </div>
                        </div>

                        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center px-4 lg:hidden">
                            <div className="pointer-events-auto relative">
                                <AnimatePresence>
                                    {menuOpen && (
                                        <motion.nav
                                            ref={popRef}
                                            id={menuId}
                                            aria-label="On this page"
                                            initial={{ opacity: 0, y: reduceMotion ? 0 : 10, scale: reduceMotion ? 1 : 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.97 }}
                                            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                                            className="absolute bottom-full left-1/2 mb-3 w-[min(19rem,calc(100vw-3rem))] -translate-x-1/2 origin-bottom rounded-3xl border border-[#e2e8f0] bg-white p-2 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)]"
                                            onKeyDown={onMenuKey}
                                            onBlur={onMenuBlur}
                                        >
                                            <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">
                                                On this page
                                            </p>
                                            <ul>
                                                {TOC.map((item, i) => (
                                                    <li key={item.id}>
                                                        <a
                                                            href={`#${hid(item.id)}`}
                                                            aria-current={active === item.id ? 'location' : undefined}
                                                            className={cn(
                                                                'flex min-h-11 items-center gap-3 rounded-2xl px-3 text-[15px] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563eb]',
                                                                active === item.id
                                                                    ? 'bg-[#eff6ff] font-semibold text-[#1d4ed8]'
                                                                    : 'text-[#334155] hover:bg-[#f8fafc]',
                                                            )}
                                                            onClick={(event) => onLink(event, item.id)}
                                                        >
                                                            <span className="w-4 font-mono text-xs text-[#94a3b8]">{i + 1}</span>
                                                            {item.label}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.nav>
                                    )}
                                </AnimatePresence>
                                <button
                                    ref={pillRef}
                                    type="button"
                                    aria-expanded={menuOpen}
                                    aria-controls={menuId}
                                    className="flex h-12 max-w-[calc(100vw-3rem)] items-center gap-3 rounded-full bg-[#2563eb] pl-2 pr-3 text-left text-white shadow-[0_14px_34px_-10px_rgba(37,99,235,0.8)] ring-4 ring-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d4ed8]"
                                    onClick={() => setMenuOpen((v) => !v)}
                                >
                                    <span className="rounded-full bg-white/20 px-2.5 py-1 font-mono text-xs font-semibold tabular-nums">
                                        {activeIndex + 1}/{TOC.length}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#bfdbfe]">
                                            On this page
                                        </span>
                                        <span className="block max-w-[11rem] truncate text-sm font-semibold">
                                            {TOC[activeIndex].label}
                                        </span>
                                    </span>
                                    <HiChevronUp
                                        aria-hidden="true"
                                        className={cn('size-5 shrink-0 transition-transform duration-300', !menuOpen && 'rotate-180')}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <aside className="hidden lg:block">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#94a3b8]">On this page</p>
                        <nav aria-label="On this page" className="mt-4">
                            <ul className="space-y-0.5">
                                {TOC.map((item) => {
                                    const isActive = active === item.id
                                    return (
                                        <li key={item.id}>
                                            <a
                                                href={`#${hid(item.id)}`}
                                                aria-current={isActive ? 'location' : undefined}
                                                className={cn(
                                                    'group flex min-h-10 items-center gap-3 rounded-xl px-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#2563eb]',
                                                    isActive ? 'font-semibold text-[#1d4ed8]' : 'text-[#475569] hover:text-[#0f172a]',
                                                )}
                                                onClick={(event) => onLink(event, item.id)}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className={cn(
                                                        'size-2 shrink-0 rounded-full transition-all duration-300',
                                                        isActive
                                                            ? 'scale-125 bg-[#2563eb] shadow-[0_0_0_4px_#dbeafe]'
                                                            : 'bg-[#cbd5e1] group-hover:bg-[#94a3b8]',
                                                    )}
                                                />
                                                {item.label}
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </nav>
                        <div className="mt-8 rounded-3xl bg-[#0f172a] p-5 text-white">
                            <HiOutlineChatBubbleLeftRight aria-hidden="true" className="size-6 text-[#60a5fa]" />
                            <p className="mt-3 font-semibold">Still stuck?</p>
                            <p className="mt-1 text-sm leading-6 text-[#94a3b8]">Our security team replies within 4 business hours.</p>
                            <a
                                href="#helpbase-contact-support"
                                className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#93c5fd] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#93c5fd]"
                            >
                                Contact support
                                <HiArrowRight aria-hidden="true" className="size-4" />
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}

export default FloatingPillOnThisPage
