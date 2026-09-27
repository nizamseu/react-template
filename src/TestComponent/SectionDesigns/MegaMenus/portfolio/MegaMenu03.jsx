// DesignManifestoMegaMenu

// MegaMenu03 · Portfolios & Personal Websites › Mega menus

// Description:
// A light, editorial "Studio Ethos & Philosophy" panel for a designer's portfolio site.
// The left half carries an italic serif manifesto quote ("We build digital experiences with
// dignity, restraint, and an obsessive attention to typography."), a short paragraph and a
// "Download Full CV / Monograph (PDF)" button; the right half lists "Invited Keynotes &
// Visiting Lectures" (OFFF Barcelona 2026, ECAL Lausanne Masterclass, It's Nice That).

// Design:
// - Two halves on a 12-column grid from lg: (col-span-6 each); below lg: they stack in a
//   single column
// - Light cream #f9f7f4 surface, #1c1b19 ink, coral #ef6a4b kickers, #ded8cf dividers and
//   top border; the CTA is a dark #1c1b19 button that turns coral on hover
// - Serif text-3xl font-light italic quote; bold uppercase text-[10px] kickers with wide
//   tracking; list rows at text-[11px]/text-xs with italic topics and bottom borders
// - The left column's border-r and pr-8 are unprefixed, so the vertical divider and right
//   padding also show when the halves are stacked on mobile

// What it does:
// - "Download Full CV / Monograph (PDF)" is an anchor to #resume that calls closeMenu on
//   click; it does not download a file
// - The keynote list is static text; each row's location string holds a literal "&bull;"
//   inside a JS string, so it renders as the text "&bull;", not a bullet; no state or effects
// - Used by AtelierOfFormMastheadNavbar: <MegaMenu category="portfolio" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-[#ded8cf] shadow-xl bg-[#f9f7f4]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DesignManifestoMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/portfolio/MegaMenu03';

// // Inside AtelierOfFormMastheadNavbar it opens from <MegaMenu category="portfolio" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-[#ded8cf] shadow-xl bg-[#f9f7f4]">
//         <DesignManifestoMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DesignManifestoMegaMenu({
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
                'bg-[#f9f7f4] text-[#1c1b19] p-8 border-t border-[#ded8cf]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Typographic Manifesto */}
                <div className="lg:col-span-6 space-y-4 border-r border-[#ded8cf] pr-8">
                    <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#ef6a4b]">
                        STUDIO ETHOS & PHILOSOPHY
                    </span>
                    <h3 className="font-serif text-3xl font-light italic leading-tight">
                        "We build digital experiences with dignity, restraint, and an obsessive attention to typography."
                    </h3>
                    <p className="text-xs text-black/70 leading-relaxed">
                        Most modern software feels like a vending machine designed to grab your eyeballs. We advocate for calm, tactile, unhurried digital spaces that respect human attention.
                    </p>
                    <div className="pt-2">
                        <a
                            href="#resume"
                            onClick={closeMenu}
                            className="inline-flex items-center gap-2 rounded bg-[#1c1b19] px-4 py-2 text-xs font-semibold text-white hover:bg-[#ef6a4b] transition-colors"
                        >
                            Download Full CV / Monograph (PDF) <HiArrowRight />
                        </a>
                    </div>
                </div>

                {/* Right: Lectures, Keynotes & Press */}
                <div className="lg:col-span-6 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#ef6a4b]">
                        INVITED KEYNOTES & VISITING LECTURES
                    </span>
                    <div className="space-y-3 text-xs">
                        {[
                            {
                                event: 'OFFF Barcelona 2026',
                                topic: 'Keynote: Why Physical Controls Still Beat Touchscreens',
                                loc: 'Main Stage &bull; Barcelona',
                            },
                            {
                                event: 'ECAL Lausanne Masterclass',
                                topic: 'Workshop: Generative Typography Systems',
                                loc: 'Department of Media &bull; Switzerland',
                            },
                            {
                                event: 'It’s Nice That Feature',
                                topic: 'Interview: 10 Years of Designing Without Compromise',
                                loc: 'Editorial Longform &bull; London',
                            },
                        ].map((item) => (
                            <div key={item.event} className="border-b border-[#ded8cf] pb-2.5">
                                <div className="flex items-center justify-between text-[11px] font-bold text-[#1c1b19]">
                                    <span>{item.event}</span>
                                    <span className="text-black/40 font-normal">{item.loc}</span>
                                </div>
                                <p className="mt-0.5 text-xs text-black/60 italic">{item.topic}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DesignManifestoMegaMenu
