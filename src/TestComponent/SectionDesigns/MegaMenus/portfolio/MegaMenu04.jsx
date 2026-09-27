// ServicesRetainersMegaMenu

// MegaMenu04 · Portfolios & Personal Websites › Mega menus

// Description:
// A dark "work with me" dropdown for a freelance designer or small studio portfolio. The
// header reads "WORKING TOGETHER • FIXED-SCOPE MODELS" over the serif title "Ways We Can
// Collaborate", with "No Bloated Agency Overhead • Direct Principal Collaboration" on the
// right. Three numbered service cards follow (The Design Sprint, Fractional Design
// Director, End-to-End Product Build), then a "Book Exploration Call on Cal.com →" link.

// Design:
// - p-8 panel: header stacks on mobile and becomes a row at md:, then a grid of one column
//   on mobile and three at md:, then a footer row that stays side by side at every width
// - Warm near-black #241d1a surface with white text and a coral #ef6a4b border-t; coral
//   also colours the eyebrow, number/duration lines, deliverables and the underlined CTA
// - font-serif text-2xl title, font-mono tracked eyebrow and meta; cards are rounded-lg
//   white/5 tiles with white/10 borders and a divider above each deliverable line
// - The CTA turns white on hover; the service cards have no hover state

// What it does:
// - Only "Book Exploration Call on Cal.com →" (#cal) is a link; it calls closeMenu on click
// - The three service cards are static divs with no link or handler; no state or effect
// - Used by FloatingPillDiscoveryNavbar: <MegaMenu category="portfolio" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-2xl border border-[#ef6a4b]/50 shadow-2xl bg-[#241d1a]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ServicesRetainersMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/portfolio/MegaMenu04';

// // Inside FloatingPillDiscoveryNavbar it opens from <MegaMenu category="portfolio" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-2xl border border-[#ef6a4b]/50 shadow-2xl bg-[#241d1a]">
//         <ServicesRetainersMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function ServicesRetainersMegaMenu({
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
                'bg-[#241d1a] text-white p-8 border-t border-[#ef6a4b]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#ef6a4b]">
                        WORKING TOGETHER &bull; FIXED-SCOPE MODELS
                    </span>
                    <h3 className="mt-1 font-serif text-2xl">Ways We Can Collaborate</h3>
                </div>
                <span className="text-xs text-white/50 font-mono">No Bloated Agency Overhead &bull; Direct Principal Collaboration</span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        num: '01',
                        title: 'The Design Sprint',
                        time: '2 Weeks Intensive',
                        desc: 'Complete brand positioning or interactive prototype ready for investor pitch or user testing.',
                        deliverable: 'Figma System + Interactive Prototype',
                    },
                    {
                        num: '02',
                        title: 'Fractional Design Director',
                        time: 'Quarterly Retainer',
                        desc: 'Embedding 2 days/week to lead your product design team, elevate craft, and hire top senior talent.',
                        deliverable: 'Leadership + Architecture Review',
                    },
                    {
                        num: '03',
                        title: 'End-to-End Product Build',
                        time: '6–8 Weeks',
                        desc: 'Full design system architecture and high-performance React front-end development.',
                        deliverable: 'Production Codebase + Design System',
                    },
                ].map((serv) => (
                    <div
                        key={serv.num}
                        className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
                    >
                        <div>
                            <span className="font-mono text-[10px] text-[#ef6a4b]">{serv.num} &bull; {serv.time}</span>
                            <h4 className="mt-2 font-bold text-base text-white">{serv.title}</h4>
                            <p className="mt-2 text-xs text-white/65 leading-relaxed">{serv.desc}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#ef6a4b]">
                            {serv.deliverable}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-white/60">Schedule a 20-min exploration call to see if your project is a mutual fit.</span>
                <a href="#cal" onClick={closeMenu} className="font-bold text-[#ef6a4b] underline hover:text-white">
                    Book Exploration Call on Cal.com &rarr;
                </a>
            </div>
        </div>
    )
}

export default ServicesRetainersMegaMenu
