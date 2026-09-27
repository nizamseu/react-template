// EnterprisePlatformSuiteMegaMenu

// MegaMenu01 · SaaS Platforms › Mega menus

// Description:
// The "Enterprise Platform Suite" panel for a B2B SaaS or cloud-platform navbar. A
// status bar reads "ALL SYSTEMS OPERATIONAL • 99.994% UPTIME (LAST 90 DAYS)" beside
// SOC2 TYPE II, HIPAA READY, ISO 27001 and EU DATA RESIDENCY labels. Below it, three
// feature columns (Platform Core, Automation & AI, Analytics & BI) list four links each,
// and a "GARTNER LEADER 2026" card tells "How Ramp Migrated 400 Microservices".

// Design:
// - Status bar (flex-wrap, border-b) over a grid-cols-1 md:grid-cols-2 lg:grid-cols-4
//   grid: three icon-headed link columns, with the case-study card as the fourth cell
// - Dark #0b1319 surface, #e3edf2 text; emerald #17a878 top border (border-t-2), column
//   headings, pulsing status dot, badge and title hover; white/5 row hover, white/50 copy
// - font-mono text-xs status and compliance labels, bold uppercase text-xs headings,
//   text-[11px] descriptions; rounded rows, rounded-lg card with a white/[0.07] gradient
//   and white/10 border; no shadow of its own
// - Columns stack on mobile, pair up from md: and sit four across from lg:; the
//   compliance labels wrap under the status line on narrow screens

// What it does:
// - All 12 feature links call closeMenu on click; they point to #core, #ai or
//   #analytics by column
// - "Read Whitepaper (12p)" in the case-study card is plain text with an arrow icon, not
//   a link; the status dot pulses via CSS (animate-pulse); no state or effect
// - Used by NorthstarPlatformSuiteNavbar: <MegaMenu category="saas" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-xl border-t-2 border-[#17a878] shadow-2xl bg-[#0b1319]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EnterprisePlatformSuiteMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/saas/MegaMenu01';

// // Inside NorthstarPlatformSuiteNavbar it opens from <MegaMenu category="saas" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border-t-2 border-[#17a878] shadow-2xl bg-[#0b1319]">
//         <EnterprisePlatformSuiteMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineCube,
    HiOutlineLightningBolt,
    HiOutlineTrendingUp,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function EnterprisePlatformSuiteMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    className,
    ...props
}) {
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

export default EnterprisePlatformSuiteMegaMenu
