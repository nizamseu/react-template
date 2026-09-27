// KnowledgeBaseDeveloperDocsMegaMenuCollection

// KnowledgeMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for a developer documentation / help-center website (fictional
// "Northstar" platform). Depending on `variant` the visitor sees docs and SDK links,
// a mock self-service search with popular articles, a trust/compliance center,
// starter-template recipes or support and escalation channels.

// Design:
// - Five hard-coded layouts in dark green tones (plus one light variant) with mint #9bd2a7 highlights (#41715d on the light variant) and responsive grids (1 column on mobile, 3-4 from md/lg).
// - Variant 1 — "API & SDK Docs": #0f1a16 panel, "API v4.2" header with protocol list, three icon-headed link columns (Getting Started, Core API Reference, Official SDKs) and a community card with a "Join Discord Guild" link.
// - Variant 2 — "Self-Service Hub": light #f4f8f5 panel, read-only search field with a "Press Enter" hint and three popular-article cards (category, title, helpfulness/read time, "Read Full Article" link).
// - Variant 3 — "Trust & Security": #121f1a panel, SOC2 / HIPAA / ISO 27001 badges and three shield-icon security cards each with a "Download Technical Whitepaper (PDF)" link.
// - Variant 4 — "Cookbook Recipes": #101c17 panel, GitHub-stars header and three starter-template cards (stack, name, description) with "Clone on GitHub" links.
// - Variant 5 — "Support SLA": #172721 panel, response-time/CSAT header and three support cards (Enterprise SLA, Architecture Office Hours, Urgent Incident Ticket) with links and an "Open Incident Ticket" button-link.

// What it does:
// - `variant` 1-4 each return their own layout; any other value (including 5) falls through to Variant 5.
// - Every anchor calls `closeMenu` on click; hrefs are placeholders (e.g. "#doc", "#art", "#whitepaper", "#clone", "#submit-ticket").
// - Purely presentational: the Variant 2 search field is read-only with no search logic; no state, effects or data fetching.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "knowledge"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of every link/CTA so the parent mega menu can close.
// @param {string} [props.accent='#41715d'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Merged onto the root <div> of every variant with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are spread onto the root <div> of every variant.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import KnowledgeBaseDeveloperDocsMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/KnowledgeMegaMenu';

// function DocsMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <KnowledgeBaseDeveloperDocsMegaMenuCollection variant={1} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="knowledge"
// // <MegaMenu category="knowledge" variant={1} accent="#41715d" label="API & SDKs" />
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineBookOpen,
    HiOutlineCheckCircle,
    HiOutlineCode,
    HiOutlineQuestionMarkCircle,
    HiOutlineSearch,
    HiOutlineShieldCheck,
    HiOutlineTerminal,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function KnowledgeBaseDeveloperDocsMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#41715d',
    className,
    ...props
}) {
    // VARIANT 1: Developer Documentation & Multi-Language SDKs (northstar docs)
    if (variant === 1) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#0f1a16] text-[#e0ece6] p-8 border-t-2 border-[#9bd2a7]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-[.25em]">
                            NORTHSTAR DEVELOPER KNOWLEDGE BASE &bull; API v4.2
                        </span>
                        <h3 className="mt-1 font-bold text-2xl text-white">Production Guides & Architecture References</h3>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-[#9bd2a7]">
                        <span>OPENAPI 3.1 &bull; REST &bull; GRAPHQL &bull; GRPC</span>
                    </div>
                </div>

                {/* 4 Documentation Pillars */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9bd2a7]">
                            <HiOutlineBookOpen className="text-base" /> Getting Started
                        </div>
                        <ul className="mt-3 space-y-2 text-xs">
                            {['5-Minute Quickstart', 'Authentication & Tokens', 'SDK Installation', 'Handling First Webhook'].map((s) => (
                                <li key={s}>
                                    <a href="#doc" onClick={closeMenu} className="block py-1 hover:text-[#9bd2a7] transition-colors">
                                        &bull; {s}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9bd2a7]">
                            <HiOutlineTerminal className="text-base" /> Core API Reference
                        </div>
                        <ul className="mt-3 space-y-2 text-xs">
                            {['Workspaces & Tenancy', 'Event Streaming API', 'Edge Worker Functions', 'Database Replication'].map((s) => (
                                <li key={s}>
                                    <a href="#doc" onClick={closeMenu} className="block py-1 hover:text-[#9bd2a7] transition-colors">
                                        &bull; {s}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9bd2a7]">
                            <HiOutlineCode className="text-base" /> Official SDKs
                        </div>
                        <ul className="mt-3 space-y-2 text-xs">
                            {['TypeScript / Node.js', 'Python 3.11+ / FastAPI', 'Go Lang v1.22', 'Rust / Tokio Runtime'].map((s) => (
                                <li key={s}>
                                    <a href="#doc" onClick={closeMenu} className="block py-1 hover:text-[#9bd2a7] transition-colors">
                                        &bull; {s}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Developer Discord & Status Card */}
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-wider block">
                                COMMUNITY SUPPORT
                            </span>
                            <h4 className="mt-1 text-sm font-bold text-white">Ask Platform Engineers Live</h4>
                            <p className="mt-1 text-xs text-white/60">
                                8,400+ developers online. Get instant code debugging from core library contributors.
                            </p>
                        </div>
                        <a
                            href="#discord"
                            onClick={closeMenu}
                            className="mt-4 flex items-center justify-between text-xs font-bold text-[#9bd2a7] underline hover:text-white"
                        >
                            <span>Join Discord Guild</span>
                            <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 2: Instant Search & Self-Service Knowledge Base
    if (variant === 2) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#f4f8f5] text-[#162720] p-8 border-t border-[#d1e2d7]',
                    className,
                )}
                {...props}
            >
                <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm">
                    <HiOutlineSearch className="text-lg text-gray-400" />
                    <input
                        type="text"
                        readOnly
                        value="Describe your issue (e.g. How do I rotate automated webhook secrets?)"
                        className="flex-1 bg-transparent text-xs text-gray-800 outline-none cursor-pointer"
                    />
                    <span className="font-mono text-[11px] text-emerald-800 font-bold">Press Enter</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Configuring Multi-Region Active-Active Database Replication',
                            helpful: '99% found helpful &bull; 8m read',
                            category: 'DATABASE & STORAGE',
                        },
                        {
                            title: 'Managing Enterprise SSO via Okta, Azure AD and Google Workspace',
                            helpful: '96% found helpful &bull; 6m read',
                            category: 'SECURITY & IAM',
                        },
                        {
                            title: 'Understanding Consumption Billing & Automatic Usage Quotas',
                            helpful: '94% found helpful &bull; 4m read',
                            category: 'BILLING & PLANS',
                        },
                    ].map((art) => (
                        <div key={art.title} className="rounded-lg bg-white p-5 border border-gray-200 flex flex-col justify-between shadow-sm">
                            <div>
                                <span className="font-mono text-[10px] text-[#41715d] font-bold">{art.category}</span>
                                <h5 className="mt-1 font-bold text-sm text-gray-900 hover:text-[#41715d] cursor-pointer">
                                    {art.title}
                                </h5>
                                <p className="mt-2 text-xs text-gray-500">{art.helpful}</p>
                            </div>
                            <a href="#art" onClick={closeMenu} className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#41715d] underline">
                                Read Full Article &rarr;
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 3: System Architecture, Whitepapers & Compliance Hub
    if (variant === 3) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#121f1a] text-[#d9e8e0] p-8 border-t border-[#41715d]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-[.25em]">
                            SYSTEM ARCHITECTURE & TRUST CENTER
                        </span>
                        <h3 className="mt-1 text-2xl font-bold font-serif text-white">Enterprise Compliance & Guarantees</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                        <span>SOC2 TYPE II</span>
                        <span>HIPAA BAA</span>
                        <span>ISO 27001</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Zero-Knowledge Cryptographic Envelope Encryption',
                            desc: 'Every database column is encrypted client-side before touching disk. Customer-managed KMS keys supported.',
                        },
                        {
                            title: 'Distributed Consensus & Raft Storage Fabric',
                            desc: 'Automatic 3-datacenter quorum failover with zero manual operator intervention in &lt; 800ms.',
                        },
                        {
                            title: 'EU Sovereign Data Boundary & GDPR Guarantees',
                            desc: 'Data never transits outside EU-central-1 (Frankfurt) or Swiss data centers.',
                        },
                    ].map((sec) => (
                        <div key={sec.title} className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                            <div>
                                <HiOutlineShieldCheck className="text-xl text-[#9bd2a7]" />
                                <h4 className="mt-2 font-bold text-sm text-white">{sec.title}</h4>
                                <p className="mt-2 text-xs text-white/60 leading-relaxed">{sec.desc}</p>
                            </div>
                            <a href="#whitepaper" onClick={closeMenu} className="mt-4 pt-3 border-t border-white/10 text-xs text-[#9bd2a7] underline">
                                Download Technical Whitepaper (PDF) &rarr;
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 4: Interactive Cookbook, Recipes & GitHub Templates
    if (variant === 4) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#101c17] text-white p-8 border-t border-white/15',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-[.25em]">
                            DEVELOPER RECIPES & STARTER TEMPLATES
                        </span>
                        <h3 className="mt-1 text-2xl font-bold">1-Click Deployable Production Architectures</h3>
                    </div>
                    <span className="font-mono text-xs text-white/60">★ 14,820 GitHub Stars</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            name: 'Next.js 15 App Router + Northstar Auth',
                            stack: 'TypeScript, Tailwind, React 19',
                            desc: 'Complete multi-tenant organization management, session tokens, and team invites out of the box.',
                        },
                        {
                            name: 'Real-Time Multiplayer Canvas Sync',
                            stack: 'WebSockets, CRDTs, Redis',
                            desc: 'Figma-style multiplayer live cursor presence and state synchronization boilerplate.',
                        },
                        {
                            name: 'Stripe Metered Billing Integration',
                            stack: 'Node.js, Stripe SDK, Webhooks',
                            desc: 'Idempotent webhook consumers and usage-based usage calculation engine.',
                        },
                    ].map((repo) => (
                        <div key={repo.name} className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                            <div>
                                <span className="font-mono text-[10px] text-[#9bd2a7]">{repo.stack}</span>
                                <h4 className="mt-2 font-bold text-sm text-white">{repo.name}</h4>
                                <p className="mt-2 text-xs text-white/60">{repo.desc}</p>
                            </div>
                            <a
                                href="#clone"
                                onClick={closeMenu}
                                className="mt-4 flex items-center justify-between text-xs font-mono text-[#9bd2a7] underline hover:text-white"
                            >
                                <span>Clone on GitHub</span>
                                <HiArrowRight />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 5: Community Forum & Direct Engineer Escalation
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#172721] text-[#e0eee6] p-8 border-t border-[#41715d]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-[.25em]">
                        SUPPORT CHANNELS &bull; TICKET ESCALATION
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">We Stand Behind Every Production Line</h3>
                </div>
                <div className="text-xs text-white/70 font-mono">
                    Average First Response: 4 Minutes &bull; 99.8% CSAT
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <span className="font-mono text-[10px] text-[#9bd2a7] block">TIER 1 SUPPORT</span>
                    <h4 className="mt-2 font-bold text-base text-white">Enterprise SLA Guarantee</h4>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                        Dedicated Slack / Teams connect channel with assigned staff solutions architects. 15-minute P1 critical escalation window.
                    </p>
                    <a href="#sla" onClick={closeMenu} className="mt-4 block text-xs font-bold text-[#9bd2a7] underline">
                        Review Enterprise SLA Matrix &rarr;
                    </a>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5">
                    <span className="font-mono text-[10px] text-[#9bd2a7] block">WEEKLY CLINICS</span>
                    <h4 className="mt-2 font-bold text-base text-white">Live Architecture Office Hours</h4>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                        Join our lead architects every Thursday at 4 PM UTC. Bring your system diagrams and scaling bottlenecks for live review.
                    </p>
                    <a href="#hours" onClick={closeMenu} className="mt-4 block text-xs font-bold text-[#9bd2a7] underline">
                        Add to Google Calendar &rarr;
                    </a>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-[#9bd2a7] block">TICKET DISPATCH</span>
                        <h4 className="mt-2 font-bold text-base text-white">Submit Urgent Incident Ticket</h4>
                        <p className="mt-2 text-xs text-white/60">
                            Immediate paging to our 24/7 follow-the-sun on-call site reliability team.
                        </p>
                    </div>
                    <a
                        href="#submit-ticket"
                        onClick={closeMenu}
                        className="mt-4 flex items-center justify-center rounded bg-[#9bd2a7] py-2 text-xs font-bold text-[#172721] hover:bg-white transition-colors"
                    >
                        Open Incident Ticket
                    </a>
                </div>
            </div>
        </div>
    )
}

export default KnowledgeBaseDeveloperDocsMegaMenuCollection
