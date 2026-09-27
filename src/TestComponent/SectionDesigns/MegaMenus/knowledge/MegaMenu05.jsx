// SupportSLAMegaMenu

// MegaMenu05 · Knowledge Bases & Documentation › Mega menus

// Description:
// A dark support-and-escalation panel for a developer platform's help center. The kicker
// "SUPPORT CHANNELS • TICKET ESCALATION" sits over the serif title "We Stand Behind Every
// Production Line" and "Average First Response: 4 Minutes • 99.8% CSAT", followed by three
// cards: "Enterprise SLA Guarantee", "Live Architecture Office Hours" (Thursdays 4 PM UTC)
// and "Submit Urgent Incident Ticket" with an "Open Incident Ticket" button-style link.

// Design:
// - Header row (stacked on mobile, side by side with items-end from md:), then three cards
//   in 1 column on mobile and 3 from md:
// - Dark green #172721 surface with #e0eee6 text and a #41715d top border; mint #9bd2a7
//   kicker, card labels and links; the ticket CTA is a solid mint block with #172721 text
//   that turns white on hover
// - Serif text-2xl title, text-base bold card titles, leading-relaxed text-xs copy;
//   rounded-lg white/5 cards with white/10 borders and a rounded (4px) CTA
// - Only the ticket card uses flex-col justify-between, so its CTA sits at the bottom
//   while the other two links follow their text

// What it does:
// - "Review Enterprise SLA Matrix →" links to #sla, "Add to Google Calendar →" to #hours
//   and "Open Incident Ticket" to #submit-ticket; all call closeMenu on click
// - "Add to Google Calendar" is only a hash link with no calendar integration; no state or
//   effects
// - Used by RuntimeSupportEscalationGridNavbar: <MegaMenu category="knowledge" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-none border-y border-[#41715d] shadow-2xl bg-[#172721]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SupportSLAMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/knowledge/MegaMenu05';

// // Inside RuntimeSupportEscalationGridNavbar it opens from <MegaMenu category="knowledge" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-y border-[#41715d] shadow-2xl bg-[#172721]">
//         <SupportSLAMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function SupportSLAMegaMenu({
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

export default SupportSLAMegaMenu
