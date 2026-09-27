// SolutionsMatrixMegaMenu

// MegaMenu03 · SaaS Platforms › Mega menus

// Description:
// The "Solutions Matrix" panel for a B2B SaaS navbar that sells by team and industry.
// Under "Solutions Built for Enterprise Velocity" ("Trusted by 2,400+ high-growth tech
// teams") it lists four department solutions ("For Engineering Teams" to "For Finance &
// FinOps"), four industry verticals with badges (PCI-DSS, HIPAA, Multi-Region, Low
// Latency) and a "+140%" ROI card on "Deployment Velocity at Monzo Bank".

// Design:
// - Header row (eyebrow, title, tagline) over a grid-cols-1 md:grid-cols-3 grid:
//   "01 / BY DEPARTMENT", "02 / BY INDUSTRY VERTICAL" and the ROI spotlight card
// - Dark #121c24 surface, white text, #263640 top border; emerald #17a878 eyebrows,
//   badges, hover borders and the "+140%" figure; ROI card fades #182833 → #0f1920
// - Bold text-2xl title, font-mono eyebrows and badges, text-3xl extrabold mono stat;
//   rounded-md link cards (white/5 fill, white/10 border), rounded-lg ROI card with a
//   #17a878/30 border and a white CTA that turns emerald on hover
// - Header and columns stack on mobile; from md: the header splits left/right and the
//   three columns sit side by side

// What it does:
// - Department cards (#team), industry rows (#ind) and "Read Full Customer Story"
//   (#case-study) all call closeMenu on click; there is no state or effect
// - Used by NorthstarEnterpriseThreeTierMastheadNavbar: <MegaMenu category="saas" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-2xl border border-white/10 shadow-2xl bg-[#121c24]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SolutionsMatrixMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/saas/MegaMenu03';

// // Inside NorthstarEnterpriseThreeTierMastheadNavbar it opens from <MegaMenu category="saas" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-2xl border border-white/10 shadow-2xl bg-[#121c24]">
//         <SolutionsMatrixMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SolutionsMatrixMegaMenu({
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

export default SolutionsMatrixMegaMenu
