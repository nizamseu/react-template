// QuantifiedClientImpactMegaMenu

// MegaMenu03 · Corporate & Business › Mega menus

// Description:
// A case-study panel for a consulting or enterprise-services site ("PROVEN
// TRANSFORMATION AT SCALE"). Under "Quantified Enterprise Outcomes" and an "Independent
// Audited Impact Metrics" note it shows three client cards, each with a large metric
// ($140,000,000 / 99.999% / -42%), a label, a short description and a "Read Full Audit
// Report" link.

// Design:
// - Header stacks on mobile and becomes a row from md:; cards in grid-cols-1
//   md:grid-cols-3 gap-6, mapped from a static array
// - Dark navy #101b2a surface, white text, white/10 top border; sky-blue #84b9ff eyebrow,
//   metrics and links; white/5 cards with white/10 borders that turn #84b9ff on hover
// - Serif bold text-2xl heading; mono text-[10px] uppercase client names; mono extrabold
//   text-3xl metrics; rounded-lg cards; link row with an arrow icon above a white/10 rule

// What it does:
// - Each "Read Full Audit Report" link goes to #case-study and calls closeMenu on click;
//   client names and metrics are static text
// - No state or effect; the card hover border is CSS only
// - Used by StrategicPartnersMastheadNavbar: <MegaMenu category="corporate" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-white/10 shadow-2xl bg-[#101b2a]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import QuantifiedClientImpactMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/corporate/MegaMenu03';

// // Inside StrategicPartnersMastheadNavbar it opens from <MegaMenu category="corporate" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-white/10 shadow-2xl bg-[#101b2a]">
//         <QuantifiedClientImpactMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function QuantifiedClientImpactMegaMenu({
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
                'bg-[#101b2a] text-white p-8 border-t border-white/10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-[.25em]">
                        PROVEN TRANSFORMATION AT SCALE
                    </span>
                    <h3 className="mt-1 text-2xl font-bold font-serif">Quantified Enterprise Outcomes</h3>
                </div>
                <span className="text-xs text-white/50">Independent Audited Impact Metrics</span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        client: 'Global Industrial Conglomerate',
                        metric: '$140,000,000',
                        label: 'Annual Operating Expenditure Saved',
                        desc: 'Modernized 18 international factories with predictive telemetry and automated parts procurement.',
                    },
                    {
                        client: 'Tier-1 European Investment Bank',
                        metric: '99.999%',
                        label: 'Core Settlement Ledger Availability',
                        desc: 'Architected sovereign cloud transaction pipeline handling €420B daily volume.',
                    },
                    {
                        client: 'Nordic Clean Mobility Leader',
                        metric: '-42%',
                        label: 'Lifecycle Carbon Intensity Reduction',
                        desc: 'Executed end-to-end supply chain trace audit spanning 3,200 sub-tier suppliers.',
                    },
                ].map((item) => (
                    <div
                        key={item.client}
                        className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between hover:border-[#84b9ff] transition-colors"
                    >
                        <div>
                            <span className="font-mono text-[10px] text-white/40 uppercase">{item.client}</span>
                            <div className="mt-3 font-mono text-3xl font-extrabold text-[#84b9ff]">{item.metric}</div>
                            <span className="block text-xs font-bold text-white mt-1">{item.label}</span>
                            <p className="mt-2 text-xs text-white/60 leading-relaxed">{item.desc}</p>
                        </div>
                        <a
                            href="#case-study"
                            onClick={closeMenu}
                            className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#84b9ff] hover:underline"
                        >
                            <span>Read Full Audit Report</span>
                            <HiArrowRight />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default QuantifiedClientImpactMegaMenu
