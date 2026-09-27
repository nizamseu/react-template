// SealRowSecurityCompliance

// SecurityCompliance01 · SaaS Platforms › Security & Compliance

// Description:
// A dark, ceremonial trust section for the fictional secrets-management platform Vaultic.
// Under the heading "Security you can audit, not just trust." it lines up four SVG seals
// (SOC 2 Type II, ISO/IEC 27001, GDPR, HIPAA) with their scope and audit details, then two
// encryption panels ("AES-256 at rest", "TLS 1.3 in transit") and a row of supporting facts.
// Use it on a product, pricing or enterprise page right before the procurement CTA.

// Design:
// - Near-black #030712 background with a soft emerald #34d399 glow and a faint dot grid;
//   white headings, zinc body copy, emerald eyebrows, hairlines and focus rings
// - Seals are drawn in SVG: a 40-point rosette edge, dashed guide ring, dark emerald core and
//   ring text on a textPath that slowly rotates (36 s per turn)
// - Seal cards are rounded-3xl with a 1px white/10 border; headings are sans text-4xl →
//   lg:text-6xl, seal names text-base semibold, audit metadata in font-mono 11px
// - Encryption panels carry small SVG diagrams: stacked disks with a lock, and a client →
//   Vaultic link with a packet dot travelling along a dashed line
// - Seals stamp in (scale 1.12 → 1, slight rotation) with a stagger when scrolled into view
// - Responsive: header stacks below md; seals grid-cols-2 → lg:grid-cols-4; encryption
//   panels stack below md; the fact row goes 2 → 4 columns at lg

// What it does:
// - No component state; seal stamp-in, ring rotation and the packet dot are visual only
// - useReducedMotion() stops the ring rotation and packet dot and turns the stamp-in into a
//   plain fade
// - "Visit the Trust Center" links to #vaultic-trust-center, "Request the SOC 2 report" to
//   #vaultic-soc2-request and each seal's "View details" to #vaultic-<seal id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SealRowSecurityCompliance from '@/TestComponent/PageSections/saas/SecurityCompliance01';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <SealRowSecurityCompliance />
//     </main>
// )
// ```

'use client'

import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowUpRight, HiLockClosed } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

function rosettePath(cx, cy, outer, inner, points) {
    const step = Math.PI / points
    const coords = []
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outer : inner
        const a = i * step - Math.PI / 2
        coords.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`)
    }
    return `M${coords.join('L')}Z`
}

const ROSETTE = rosettePath(100, 100, 97, 91, 40)
const RING = 'M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0'

const seals = [
    {
        id: 'soc2',
        title: 'SOC 2',
        sub: 'TYPE II',
        ring: 'SOC 2 TYPE II ✦ AICPA TRUST SERVICES ✦ AUDITED 2026 ✦',
        name: 'SOC 2 Type II',
        scope: 'Security, availability and confidentiality criteria',
        meta: 'Report 14 Aug 2026 · Halvorsen & Pike LLP',
    },
    {
        id: 'iso27001',
        title: 'ISO',
        sub: '27001:2022',
        ring: 'ISO/IEC 27001 ✦ INFORMATION SECURITY ✦ CERTIFIED ✦',
        name: 'ISO/IEC 27001',
        scope: 'Whole ISMS across 3 regions and 212 staff',
        meta: 'Cert. VT-27K-0419 · valid to Mar 2028',
    },
    {
        id: 'gdpr',
        title: 'GDPR',
        sub: 'EU · UK',
        ring: 'GDPR ✦ EU DATA RESIDENCY ✦ DPA + SCCs ✦ ARTICLE 28 ✦',
        name: 'GDPR',
        scope: 'EU data stays in Frankfurt and Dublin',
        meta: 'DPA and SCCs signed in-app in 2 minutes',
    },
    {
        id: 'hipaa',
        title: 'HIPAA',
        sub: 'BAA READY',
        ring: 'HIPAA ✦ PHI SAFEGUARDS ✦ BUSINESS ASSOCIATE ✦',
        name: 'HIPAA',
        scope: 'PHI isolated in dedicated single-tenant vaults',
        meta: 'BAA on Business and Enterprise plans',
    },
]

const facts = [
    { value: '99.99%', label: 'Uptime SLA, credits paid automatically' },
    { value: '24/7', label: 'In-house SOC watching every login' },
    { value: '$250k', label: 'Paid out through our bug bounty' },
    { value: '2× / yr', label: 'External pen-tests by Kestrel Security' },
]

function Seal({ seal, reduceMotion }) {
    const uid = useId()
    const ringId = `${uid}-ring`

    return (
        <div className="relative mx-auto aspect-square w-full max-w-[168px]">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full font-sans" aria-hidden="true">
                <path d={ROSETTE} fill="#34d399" fillOpacity="0.08" stroke="#34d399" strokeWidth="1.2" />
                <circle cx="100" cy="100" r="84" fill="none" stroke="#34d399" strokeOpacity="0.35" strokeDasharray="2 4" />
                <circle cx="100" cy="100" r="60" fill="#052e22" stroke="#34d399" strokeWidth="1.5" />
                <circle cx="100" cy="100" r="54" fill="none" stroke="#34d399" strokeOpacity="0.4" />
                <path
                    d="M100 58 l3.2 6.5 7.1 1-5.2 5 1.2 7.1-6.3-3.3-6.3 3.3 1.2-7.1-5.2-5 7.1-1z"
                    fill="#34d399"
                />
                <text x="100" y="108" textAnchor="middle" fill="#ffffff" fontSize="25" fontWeight="700" letterSpacing="-0.5">
                    {seal.title}
                </text>
                <text x="100" y="126" textAnchor="middle" fill="#34d399" fontSize="9.5" fontWeight="600" letterSpacing="2">
                    {seal.sub}
                </text>
            </svg>
            <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                animate={reduceMotion ? { rotate: 0 } : { rotate: 360 }}
                transition={reduceMotion ? { duration: 0 } : { duration: 36, ease: 'linear', repeat: Infinity }}
            >
                <svg viewBox="0 0 200 200" className="h-full w-full font-mono">
                    <defs>
                        <path id={ringId} d={RING} />
                    </defs>
                    <text fill="#a7f3d0" fontSize="9" fontWeight="600">
                        <textPath href={`#${ringId}`} textLength="444" lengthAdjust="spacing">
                            {seal.ring}
                        </textPath>
                    </text>
                </svg>
            </motion.div>
        </div>
    )
}

export function SealRowSecurityCompliance({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#030712] px-4 py-16 text-base font-normal text-zinc-300 sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.16),transparent_60%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-size-[22px_22px] mask-[linear-gradient(to_bottom,black,transparent_85%)]"
            />

            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#34d399]">
                            <HiLockClosed className="size-4" aria-hidden="true" />
                            Vaultic · Security &amp; compliance
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Security you can <span className="text-[#34d399]">audit</span>, not just trust.
                        </h2>
                    </div>
                    <div className="flex flex-col gap-4 md:max-w-sm">
                        <p className="text-sm leading-relaxed text-zinc-400">
                            Every secret, token and certificate in Vaultic sits behind independently audited
                            controls. Reports refresh every year, and you can read them before you sign.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="#vaultic-trust-center"
                                className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#34d399] px-5 text-sm font-semibold text-[#030712] transition-colors hover:bg-[#6ee7b7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#34d399]"
                            >
                                Visit the Trust Center
                                <HiArrowLongRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                            </a>
                            <a
                                href="#vaultic-soc2-request"
                                className="inline-flex min-h-11 items-center rounded-full border border-white/15 px-5 text-sm font-semibold text-white transition-colors hover:border-[#34d399] hover:text-[#34d399] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#34d399]"
                            >
                                Request the SOC 2 report
                            </a>
                        </div>
                    </div>
                </div>

                <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:mt-16 lg:grid-cols-4 lg:gap-5">
                    {seals.map((seal, index) => (
                        <motion.li
                            key={seal.id}
                            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.12, rotate: -6 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-3 transition-colors duration-300 hover:border-[#34d399]/50 sm:p-5"
                        >
                            <Seal seal={seal} reduceMotion={reduceMotion} />
                            <div className="mt-4 flex flex-1 flex-col border-t border-white/10 pt-4">
                                <h3 className="text-sm font-semibold text-white sm:text-base">{seal.name}</h3>
                                <p className="mt-1 text-xs leading-relaxed text-zinc-400 sm:text-sm">{seal.scope}</p>
                                <p className="mt-3 font-mono text-[10px] leading-relaxed text-[#34d399]/80 sm:text-[11px]">
                                    {seal.meta}
                                </p>
                                <a
                                    href={`#vaultic-${seal.id}`}
                                    aria-label={`View details for ${seal.name}`}
                                    className="group mt-auto inline-flex min-h-10 items-center gap-1.5 pt-3 text-xs font-semibold text-white hover:text-[#34d399] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34d399] sm:text-sm"
                                >
                                    View details
                                    <HiArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                                </a>
                            </div>
                        </motion.li>
                    ))}
                </ul>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-[#052e22] to-[#030712] p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#34d399]">At rest</p>
                                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">AES-256</h3>
                            </div>
                            <svg viewBox="0 0 80 80" className="size-16 shrink-0 sm:size-20" aria-hidden="true">
                                <ellipse cx="34" cy="18" rx="24" ry="7" fill="#052e22" stroke="#34d399" strokeWidth="1.5" />
                                <path d="M10 18v14c0 3.9 10.7 7 24 7s24-3.1 24-7V18" fill="none" stroke="#34d399" strokeWidth="1.5" />
                                <path d="M10 32v14c0 3.9 10.7 7 24 7s24-3.1 24-7V32" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.6" />
                                <path d="M10 46v14c0 3.9 10.7 7 24 7s24-3.1 24-7V46" fill="none" stroke="#34d399" strokeWidth="1.5" strokeOpacity="0.35" />
                                <rect x="50" y="48" width="24" height="20" rx="4" fill="#34d399" />
                                <path d="M55 48v-5a7 7 0 0 1 14 0v5" fill="none" stroke="#34d399" strokeWidth="3" />
                                <circle cx="62" cy="57" r="2.5" fill="#030712" />
                            </svg>
                        </div>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
                            AES-256-GCM on every volume, backup and snapshot. Each tenant gets its own data
                            key, wrapped by an HSM-held master key and rotated every 90 days.
                        </p>
                        <p className="mt-5 break-all font-mono text-[11px] text-zinc-500">
                            kek: hsm/fips-140-3-l3 · dek: per-tenant · rotation: 90d
                        </p>
                    </article>

                    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#34d399]">In transit</p>
                                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">TLS 1.3</h3>
                            </div>
                            <span className="rounded-full border border-[#34d399]/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#34d399]">
                                mTLS inside
                            </span>
                        </div>
                        <svg viewBox="0 0 240 44" className="mt-5 h-11 w-full max-w-sm" aria-hidden="true">
                            <line x1="30" y1="22" x2="210" y2="22" stroke="#34d399" strokeOpacity="0.45" strokeDasharray="4 5" />
                            <circle cx="18" cy="22" r="12" fill="#030712" stroke="#34d399" strokeWidth="1.5" />
                            <circle cx="222" cy="22" r="12" fill="#34d399" />
                            <path d="M217 22l3.5 3.5 6-7" fill="none" stroke="#030712" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <rect x="13" y="19" width="10" height="7" rx="1.5" fill="#34d399" />
                            <path d="M15 19v-2.5a3 3 0 0 1 6 0V19" fill="none" stroke="#34d399" strokeWidth="1.5" />
                            <motion.circle
                                cy="22"
                                r="4"
                                fill="#a7f3d0"
                                initial={{ cx: reduceMotion ? 120 : 36 }}
                                animate={reduceMotion ? { cx: 120 } : { cx: [36, 204] }}
                                transition={reduceMotion ? { duration: 0 } : { duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 0.4 }}
                            />
                        </svg>
                        <p className="mt-4 max-w-md text-sm leading-relaxed text-zinc-300">
                            TLS 1.3 only, with HSTS preload and perfect forward secrecy. Every internal hop
                            between Vaultic services is mutually authenticated.
                        </p>
                    </article>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 lg:grid-cols-4">
                    {facts.map((fact) => (
                        <div key={fact.value} className="flex flex-col bg-[#030712] p-5 sm:p-6">
                            <dt className="order-2 mt-1 text-xs leading-relaxed text-zinc-400 sm:text-sm">{fact.label}</dt>
                            <dd className="order-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{fact.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}

export default SealRowSecurityCompliance
