// SaaSPlatformMegaMenuCollection

// SaasMegaMenu · Section designs › Mega menus

// Description:
// The panel content for software-product navbars, normally rendered by MegaMenu (category="saas").
// It shows one of five B2B SaaS designs: a product feature suite, a developer and API hub,
// solutions by team and industry, an AI command center, or an integrations marketplace.
// Links are hash anchors that close the menu when clicked.

// Design:
// - Mostly dark slate backgrounds (#0b1319 to #17232c) with emerald #17a878 / mint #65e6b4 accents and monospace labels; static data arrays mapped into link lists and cards.
// - Variant 1 — "Enterprise Platform Suite": dark #0b1319 with emerald top border; uptime and compliance status bar, three feature columns (Platform Core, Automation & AI, Analytics & BI) and a case-study card.
// - Variant 2 — "Developer & API Hub": #0e161c; six SDK language tiles with an npm install line and copy icon, a syntax-coloured TypeScript code window, and a changelog with an "Open API Playground" CTA.
// - Variant 3 — "Solutions Matrix": #121c24; columns for solutions by department and by industry (compliance badges) plus a "+140%" ROI case-study card.
// - Variant 4 — "AI Command Center": light mint #edf3ee; read-only ⌘K search bar, quick-action links, an LLM model/latency matrix and a dark BYOC card ("Schedule Architecture Review").
// - Variant 5 — "Integrations Ecosystem": #17232c; six integration tiles marked "1-CLICK SETUP" and a partner-grants link.

// What it does:
// - variant selects the layout through if (variant === 1..4); any other value renders the Variant 5 design.
// - Every <a> calls closeMenu on click; there is no state or effect.
// - Some controls are visual only: the Variant 2 copy button has no handler, the Variant 4 search input is readOnly with a fixed value, the Variant 1 "Read Whitepaper (12p)" line is text, and the Variant 5 integration tiles are not links.
// - Colours are hard-coded; the accent prop is accepted but not used anywhere in the markup.

// @param {object} props
// @param {number} [props.variant=1] Design to render: 1–4, any other value falls back to Variant 5.
// @param {Function} props.closeMenu Called when any link in the panel is clicked (MegaMenu passes its own close handler).
// @param {string} [props.accent='#17a878'] Accepted for API consistency with the other category menus; currently unused.
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Merged onto the root <div> of every variant with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are spread onto the root <div> of every variant.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import SaaSPlatformMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/SaasMegaMenu';

// // Normally rendered for you by <MegaMenu category="saas" variant={2} />
// export default function DevMenuPreview() {
//     const [open, setOpen] = useState(true)
//     if (!open) return null
//     return (
//         <div className="rounded-none border border-[#263640] shadow-2xl">
//             <SaaSPlatformMegaMenuCollection variant={2} closeMenu={() => setOpen(false)} />
//         </div>
//     )
// }
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineCheckCircle,
    HiOutlineClipboardCopy,
    HiOutlineCode,
    HiOutlineCube,
    HiOutlineLightningBolt,
    HiOutlineSearch,
    HiOutlineShieldCheck,
    HiOutlineTerminal,
    HiOutlineTrendingUp,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SaaSPlatformMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#17a878',
    className,
    ...props
}) {
    // VARIANT 1: Enterprise Multi-Tier Platform Suite (northstar/)
    if (variant === 1) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#0b1319] text-[#e3edf2] p-8 border-t-2 border-[#17a878]',
                    className,
                )}
                {...props}
            >
                {/* Top Live Uptime & Trust Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#17a878] animate-pulse" />
                        <span className="font-mono text-xs text-white/90">
                            ALL SYSTEMS OPERATIONAL &bull; 99.994% UPTIME (LAST 90 DAYS)
                        </span>
                    </div>
                    <div className="flex items-center gap-6 font-mono text-xs text-white/50">
                        <span>SOC2 TYPE II</span>
                        <span>HIPAA READY</span>
                        <span>ISO 27001</span>
                        <span>EU DATA RESIDENCY</span>
                    </div>
                </div>

                {/* 4 Multi-Tier Capability Columns */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17a878]">
                            <HiOutlineCube className="text-base" /> Platform Core
                        </div>
                        <ul className="mt-4 space-y-2.5 text-xs">
                            {[
                                { title: 'Unified Data Graph', desc: 'Single model for telemetry & state' },
                                { title: 'Workspace Isolation', desc: 'Multi-tenant secure boundaries' },
                                { title: 'Event Bus & Streaming', desc: 'Sub-millisecond pub/sub fabric' },
                                { title: 'Audit Log & History', desc: 'Tamper-proof cryptographic trails' },
                            ].map((item) => (
                                <li key={item.title}>
                                    <a
                                        href="#core"
                                        onClick={closeMenu}
                                        className="group block rounded p-2 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-bold text-white group-hover:text-[#17a878] transition-colors">
                                            {item.title}
                                        </span>
                                        <p className="mt-0.5 text-[11px] text-white/50">{item.desc}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17a878]">
                            <HiOutlineLightningBolt className="text-base" /> Automation & AI
                        </div>
                        <ul className="mt-4 space-y-2.5 text-xs">
                            {[
                                { title: 'Autonomous Workflows', desc: 'Multi-step triggers without glue code' },
                                { title: 'LLM Agent Pipelines', desc: 'Claude 3.5 & GPT-4o orchestrator' },
                                { title: 'Python Edge Sandboxes', desc: 'Run custom code at the edge' },
                                { title: 'Self-Healing Retry Mesh', desc: 'Automatic backoff and escalation' },
                            ].map((item) => (
                                <li key={item.title}>
                                    <a
                                        href="#ai"
                                        onClick={closeMenu}
                                        className="group block rounded p-2 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-bold text-white group-hover:text-[#17a878] transition-colors">
                                            {item.title}
                                        </span>
                                        <p className="mt-0.5 text-[11px] text-white/50">{item.desc}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#17a878]">
                            <HiOutlineTrendingUp className="text-base" /> Analytics & BI
                        </div>
                        <ul className="mt-4 space-y-2.5 text-xs">
                            {[
                                { title: 'Live Velocity Metrics', desc: 'Real-time engineering cycle analytics' },
                                { title: 'Predictive Forecasting', desc: 'ML models for infrastructure usage' },
                                { title: 'ClickHouse Query Engine', desc: 'Sub-second queries over billions of rows' },
                                { title: 'Custom SQL Dashboards', desc: 'Shareable team metrics' },
                            ].map((item) => (
                                <li key={item.title}>
                                    <a
                                        href="#analytics"
                                        onClick={closeMenu}
                                        className="group block rounded p-2 hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-bold text-white group-hover:text-[#17a878] transition-colors">
                                            {item.title}
                                        </span>
                                        <p className="mt-0.5 text-[11px] text-white/50">{item.desc}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Featured Enterprise Case Study */}
                    <div className="rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-5 flex flex-col justify-between">
                        <div>
                            <span className="rounded bg-[#17a878]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#17a878]">
                                GARTNER LEADER 2026
                            </span>
                            <h4 className="mt-3 font-bold text-sm text-white">How Ramp Migrated 400 Microservices</h4>
                            <p className="mt-2 text-xs text-white/60 leading-relaxed">
                                Cut deployment pipeline duration by <strong>68%</strong> while maintaining zero-downtime compliance across 18 AWS regions.
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                            <span className="text-[#17a878] font-bold">Read Whitepaper (12p)</span>
                            <HiArrowRight className="text-[#17a878]" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 2: Modern Developer & API Hub (signal/stack)
    if (variant === 2) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#0e161c] text-[#d6e3ea] p-8 border-t border-[#263640]',
                    className,
                )}
                {...props}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: SDKs and Languages */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-[#65e6b4] uppercase tracking-wider">
                            <HiOutlineTerminal className="text-base" /> Developer SDKs
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            {[
                                { lang: 'TypeScript', v: 'v4.12.0', icon: 'TS' },
                                { lang: 'Python', v: 'v3.9.4', icon: 'PY' },
                                { lang: 'Go Lang', v: 'v1.22.1', icon: 'GO' },
                                { lang: 'Rust', v: 'v0.8.2', icon: 'RS' },
                                { lang: 'Ruby', v: 'v2.4.0', icon: 'RB' },
                                { lang: 'cURL / REST', v: 'OpenAPI 3.1', icon: 'HTTP' },
                            ].map((sdk) => (
                                <a
                                    key={sdk.lang}
                                    href="#sdk"
                                    onClick={closeMenu}
                                    className="flex items-center justify-between rounded border border-white/10 bg-white/5 p-2.5 hover:border-[#65e6b4] transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="rounded bg-[#65e6b4]/20 px-1 py-0.5 text-[9px] font-bold text-[#65e6b4]">
                                            {sdk.icon}
                                        </span>
                                        <span className="text-white">{sdk.lang}</span>
                                    </div>
                                    <span className="text-[10px] text-white/40">{sdk.v}</span>
                                </a>
                            ))}
                        </div>
                        <div className="rounded border border-white/10 bg-black/40 p-3 flex items-center justify-between font-mono text-xs">
                            <span className="text-white/80">$ npm install @signal/sdk</span>
                            <button
                                type="button"
                                className="text-white/40 hover:text-white"
                                title="Copy command"
                            >
                                <HiOutlineClipboardCopy />
                            </button>
                        </div>
                    </div>

                    {/* Center: Live Code Snippet Preview */}
                    <div className="lg:col-span-5 rounded-lg border border-white/15 bg-black/60 p-4 font-mono text-xs">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-white/50">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                                <span className="ml-2">stream_events.ts</span>
                            </div>
                            <span className="text-[#65e6b4]">200 OK &bull; 12ms</span>
                        </div>
                        <pre className="mt-3 text-white/80 leading-relaxed overflow-x-auto">
                            <code>
                                <span className="text-purple-400">import</span> {'{'} Signal {'}'}{' '}
                                <span className="text-purple-400">from</span>{' '}
                                <span className="text-emerald-300">&apos;@signal/sdk&apos;</span>
                                {'\n'}
                                <span className="text-purple-400">const</span> client ={' '}
                                <span className="text-purple-400">new</span>{' '}
                                <span className="text-blue-300">Signal</span>({'{'}
                                {'\n'}  apiKey: process.env.SIGNAL_KEY,
                                {'\n'}  region: <span className="text-emerald-300">&apos;eu-central-1&apos;</span>
                                {'\n'}{'}'})
                                {'\n'}
                                <span className="text-gray-500">// Subscribe to real-time events</span>
                                {'\n'}
                                <span className="text-purple-400">await</span> client.events.
                                <span className="text-yellow-300">listen</span>({'{'}
                                {'\n'}  channel: <span className="text-emerald-300">&apos;orders.created&apos;</span>,
                                {'\n'}  onEvent: (data) =&gt; console.
                                <span className="text-yellow-300">log</span>(data),
                                {'\n'}{'}'})
                            </code>
                        </pre>
                    </div>

                    {/* Right: Changelog Ticker */}
                    <div className="lg:col-span-3 space-y-4 bg-white/[0.02] p-4 rounded-lg border border-white/10">
                        <span className="text-[10px] font-mono text-[#65e6b4] uppercase tracking-wider block">
                            CHANGELOG &bull; THIS WEEK
                        </span>
                        <div className="space-y-3 text-xs">
                            <div>
                                <span className="font-mono text-[10px] text-white/40">TODAY &bull; v4.12.0</span>
                                <p className="font-medium text-white">Added WebAssembly Edge Workers with sub-1ms cold starts</p>
                            </div>
                            <div>
                                <span className="font-mono text-[10px] text-white/40">OCT 03 &bull; v4.11.2</span>
                                <p className="font-medium text-white">Native OpenTelemetry v1.3 trace exporter released</p>
                            </div>
                        </div>
                        <a
                            href="#playground"
                            onClick={closeMenu}
                            className="mt-3 flex items-center justify-center gap-2 rounded bg-[#65e6b4] py-2 text-xs font-bold text-[#0e161c] hover:bg-white transition-colors"
                        >
                            Open API Playground <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 3: Solutions by Team & Industry Matrix
    if (variant === 3) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#121c24] text-white p-8 border-t border-[#263640]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#17a878]">
                            TAILORED INFRASTRUCTURE ARCHITECTURE
                        </span>
                        <h3 className="mt-1 text-2xl font-bold">Solutions Built for Enterprise Velocity</h3>
                    </div>
                    <span className="text-xs text-white/50">Trusted by 2,400+ high-growth tech teams</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* By Team */}
                    <div className="space-y-4">
                        <p className="font-mono text-[11px] text-[#17a878] uppercase tracking-wider">
                            01 / BY DEPARTMENT
                        </p>
                        <div className="space-y-2 text-xs">
                            {[
                                { name: 'For Engineering Teams', desc: 'Zero-config preview environments, PR previews & CI sync' },
                                { name: 'For Product Managers', desc: 'Live feature flags, AB rollouts, and customer telemetry' },
                                { name: 'For Security & SecOps', desc: 'Automated vulnerability scanning & RBAC access controls' },
                                { name: 'For Finance & FinOps', desc: 'Granular cost-per-tenant tagging & automated billing caps' },
                            ].map((team) => (
                                <a
                                    key={team.name}
                                    href="#team"
                                    onClick={closeMenu}
                                    className="block rounded-md border border-white/10 bg-white/5 p-3 hover:border-[#17a878] transition-colors"
                                >
                                    <span className="font-bold text-white">{team.name}</span>
                                    <p className="mt-1 text-[11px] text-white/60">{team.desc}</p>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* By Industry */}
                    <div className="space-y-4">
                        <p className="font-mono text-[11px] text-[#17a878] uppercase tracking-wider">
                            02 / BY INDUSTRY VERTICAL
                        </p>
                        <div className="space-y-2 text-xs">
                            {[
                                { name: 'Fintech & Banking', badge: 'PCI-DSS' },
                                { name: 'HealthTech & Bio', badge: 'HIPAA' },
                                { name: 'Global E-Commerce', badge: 'Multi-Region' },
                                { name: 'Autonomous & Robotics', badge: 'Low Latency' },
                            ].map((ind) => (
                                <a
                                    key={ind.name}
                                    href="#ind"
                                    onClick={closeMenu}
                                    className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 p-3 hover:border-[#17a878] transition-colors"
                                >
                                    <span className="font-semibold text-white">{ind.name}</span>
                                    <span className="rounded bg-[#17a878]/20 px-2 py-0.5 font-mono text-[9px] text-[#17a878]">
                                        {ind.badge}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quantified ROI Spotlight */}
                    <div className="rounded-lg border border-[#17a878]/30 bg-gradient-to-b from-[#182833] to-[#0f1920] p-6 flex flex-col justify-between">
                        <div>
                            <span className="rounded bg-[#17a878] px-2 py-0.5 font-mono text-[10px] font-bold text-[#111a22]">
                                VERIFIED ROI STUDY
                            </span>
                            <div className="mt-4 font-mono text-3xl font-extrabold text-[#17a878]">+140%</div>
                            <h4 className="mt-1 font-bold text-sm">Deployment Velocity at Monzo Bank</h4>
                            <p className="mt-2 text-xs text-white/65 leading-relaxed">
                                Standardized 1,200 microservices across AWS and GCP, reducing monthly incident MTTR from 44m to 6m.
                            </p>
                        </div>
                        <a
                            href="#case-study"
                            onClick={closeMenu}
                            className="mt-6 flex items-center justify-center gap-2 rounded bg-white px-4 py-2 text-xs font-bold text-[#111a22] hover:bg-[#17a878] transition-colors"
                        >
                            Read Full Customer Story <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 4: Command Center & Feature Matrix (FLOWSTATE / AI)
    if (variant === 4) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#edf3ee] text-[#111a22] p-8 border-t-2 border-[#17a878]',
                    className,
                )}
                {...props}
            >
                {/* Interactive Command Palette Search Bar */}
                <div className="flex items-center gap-3 rounded-lg border border-black/15 bg-white px-4 py-3 shadow-sm">
                    <HiOutlineSearch className="text-lg text-gray-400" />
                    <input
                        type="text"
                        readOnly
                        value="Search 240+ features, APIs, and AI agent connectors..."
                        className="flex-1 bg-transparent text-xs text-gray-700 outline-none cursor-pointer"
                    />
                    <div className="flex items-center gap-1 font-mono text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                        <span>⌘</span>
                        <span>K</span>
                    </div>
                </div>

                {/* Quick Action Chips & AI Agent Core */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="rounded-lg bg-white p-5 border border-black/10 shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] font-bold text-[#17a878] uppercase tracking-wider">
                                QUICK ACTIONS
                            </span>
                            <ul className="mt-3 space-y-2 text-xs font-medium">
                                {['Deploy autonomous pipeline', 'Connect Snowflake data warehouse', 'Generate production API token', 'Invite 10 team seats'].map((action) => (
                                    <li key={action}>
                                        <a
                                            href="#action"
                                            onClick={closeMenu}
                                            className="flex items-center justify-between py-1.5 hover:text-[#17a878] transition-colors"
                                        >
                                            <span>&bull; {action}</span>
                                            <HiArrowRight className="text-gray-400" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                            Zero CLI setup required
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-5 border border-black/10 shadow-sm">
                        <span className="font-mono text-[10px] font-bold text-[#17a878] uppercase tracking-wider">
                            LLM MODEL MATRIX
                        </span>
                        <div className="mt-3 space-y-2.5 text-xs">
                            {[
                                { model: 'Claude 3.5 Sonnet', latency: '180ms', provider: 'Anthropic' },
                                { model: 'GPT-4o Omnichannel', latency: '210ms', provider: 'OpenAI' },
                                { model: 'Gemini 1.5 Pro (2M ctx)', latency: '240ms', provider: 'Google' },
                                { model: 'Llama 3.3 70B (Private VPC)', latency: '85ms', provider: 'Dedicated' },
                            ].map((m) => (
                                <div key={m.model} className="flex items-center justify-between border-b border-gray-100 pb-2">
                                    <div>
                                        <span className="font-bold">{m.model}</span>
                                        <span className="block text-[10px] text-gray-500">{m.provider}</span>
                                    </div>
                                    <span className="font-mono text-[11px] font-bold text-[#17a878]">{m.latency}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg bg-[#111a22] text-white p-5 flex flex-col justify-between">
                        <div>
                            <span className="rounded bg-[#65e6b4] px-2 py-0.5 font-mono text-[9px] font-bold text-[#111a22]">
                                ENTERPRISE SLA
                            </span>
                            <h4 className="mt-3 font-bold text-base">Bring Your Own Cloud (BYOC)</h4>
                            <p className="mt-2 text-xs text-white/70 leading-relaxed">
                                Deploy Flowstate directly inside your private AWS VPC, Azure Subnet, or GCP Project. Your data never touches our network.
                            </p>
                        </div>
                        <a
                            href="#byoc"
                            onClick={closeMenu}
                            className="mt-4 flex items-center justify-center gap-2 rounded bg-[#65e6b4] py-2 text-xs font-bold text-[#111a22] hover:bg-white transition-colors"
                        >
                            Schedule Architecture Review <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 5: App Ecosystem & Integration Marketplace (signal/stack)
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#17232c] text-white p-8 border-t border-[#263640]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#65e6b4]">
                        INTEGRATION ECOSYSTEM &bull; 80+ CONNECTORS
                    </span>
                    <h3 className="mt-1 text-2xl font-bold">Plug Directly into Your Existing Stack</h3>
                </div>
                <div className="text-xs text-white/60">
                    Community Connectors &bull; Certified Partner Network
                </div>
            </div>

            {/* 6 Integration Tiles */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { name: 'GitHub Enterprise', tag: 'CI/CD Sync', active: true },
                    { name: 'Slack Connect', tag: 'Realtime Alerts', active: true },
                    { name: 'Linear App', tag: 'Issue Tracker', active: true },
                    { name: 'AWS CloudWatch', tag: 'Telemetry Sink', active: true },
                    { name: 'Snowflake', tag: 'Data Lakehouse', active: true },
                    { name: 'Datadog APM', tag: 'Metrics Export', active: true },
                ].map((app) => (
                    <div
                        key={app.name}
                        className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between hover:border-[#65e6b4] transition-colors"
                    >
                        <div>
                            <span className="h-2 w-2 rounded-full bg-[#65e6b4] block mb-2" />
                            <h5 className="font-bold text-xs text-white">{app.name}</h5>
                            <span className="text-[10px] text-white/50 block mt-1">{app.tag}</span>
                        </div>
                        <span className="mt-3 font-mono text-[9px] text-[#65e6b4]">1-CLICK SETUP</span>
                    </div>
                ))}
            </div>

            {/* Partner Program Banner */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-white/60">
                <span>Building an internal tool or developer platform? Build on our public API and join the Partner Network.</span>
                <a href="#partner" onClick={closeMenu} className="font-bold text-[#65e6b4] underline hover:text-white">
                    Explore Partner Grants ($25k available) &rarr;
                </a>
            </div>
        </div>
    )
}

export default SaaSPlatformMegaMenuCollection
