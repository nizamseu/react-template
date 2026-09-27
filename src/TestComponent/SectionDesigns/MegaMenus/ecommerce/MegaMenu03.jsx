// MaisonHauteCoutureAtelierMegaMenu

// MegaMenu03 · E-commerce & Marketplaces › Mega menus

// Description:
// A haute-couture atelier dropdown for a luxury fashion house. Under "SALON PERMANENT •
// MAISON 08" and "Collections Automne-Hiver" it lists four Roman-numeral collections
// (I. Prêt-à-Porter Tailoring to IV. Haute Parfumerie), shows a two-image lookbook diptych
// (LOOK 12, ACCESSOIRES) and a "BESPOKE CLIENT SERVICES" box with "Book Salon Appointment",
// "WhatsApp Atelier Direct" and a note on courier delivery to 42 countries.

// Design:
// - p-8 panel with a #e8e4dc top border; grid-cols-1 on mobile, lg:grid-cols-12 split
//   4 / 5 / 3 (collections, diptych, services); the diptych is always grid-cols-2
// - Ivory #fbfaf8 surface, #1e1c1a text, bronze #9a704b eyebrows, numerals and link hovers,
//   #f4f0e8 services box, black/70 bottom gradient over the h-64 images
// - Serif italic text-2xl heading, serif image captions and text-lg services title; tiny
//   tracked uppercase eyebrows (text-[9px]/[10px]); rounded-md rows, rounded-lg services box
// - The collections column always has a #e8e4dc right border and pr-8 (not scoped to lg:),
//   so it also shows when stacked; diptych images zoom to scale-105 on group-hover

// What it does:
// - Every link calls closeMenu on click: all four collections go to #maison-cat, plus
//   "Book Salon Appointment" (#salon) and "WhatsApp Atelier Direct" (#concierge)
// - The lookbook images and captions are not links; no state or effect
// - Used by MaisonDOrThreeTierCoutureNavbar: <MegaMenu category="ecommerce" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-[#e8e4dc] shadow-2xl bg-[#fbfaf8]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MaisonHauteCoutureAtelierMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/ecommerce/MegaMenu03';

// // Inside MaisonDOrThreeTierCoutureNavbar it opens from <MegaMenu category="ecommerce" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-[#e8e4dc] shadow-2xl bg-[#fbfaf8]">
//         <MaisonHauteCoutureAtelierMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MaisonHauteCoutureAtelierMegaMenu({
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
                'bg-[#fbfaf8] text-[#1e1c1a] p-8 border-t border-[#e8e4dc]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Numbered Collections */}
                <div className="lg:col-span-4 space-y-6 border-r border-[#e8e4dc] pr-8">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#9a704b]">
                            SALON PERMANENT &bull; MAISON 08
                        </span>
                        <h3 className="mt-2 font-serif text-2xl font-light italic">
                            Collections Automne-Hiver
                        </h3>
                    </div>
                    <ul className="space-y-4">
                        {[
                            { roman: 'I.', title: 'Prêt-à-Porter Tailoring', desc: 'Sculpted wool overcoats & silk shirts' },
                            { roman: 'II.', title: 'Cuir & Maroquinerie', desc: 'Hand-burnished calfskin luggage & bags' },
                            { roman: 'III.', title: 'Bijoux Sculpturaux', desc: 'Recycled 18k solid gold & raw stones' },
                            { roman: 'IV.', title: 'Haute Parfumerie', desc: 'Smoked cedar, vetiver & black tea extrait' },
                        ].map((cat) => (
                            <li key={cat.title}>
                                <a
                                    href="#maison-cat"
                                    onClick={closeMenu}
                                    className="group block rounded-md p-2 hover:bg-black/[0.03] transition-colors"
                                >
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-serif italic text-sm text-[#9a704b]">{cat.roman}</span>
                                        <span className="text-xs font-semibold uppercase tracking-wider group-hover:underline">
                                            {cat.title}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-[11px] text-black/50 pl-5">{cat.desc}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Center: Lookbook Diptych */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="group relative overflow-hidden rounded bg-black/5">
                        <img
                            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"
                            alt="Maison Look 01"
                            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                            <span className="text-[10px] font-mono tracking-widest text-white/80">LOOK 12</span>
                            <span className="font-serif text-sm">Cashmere Trench & No. 04 Belt</span>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded bg-black/5">
                        <img
                            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80"
                            alt="Maison Look 02"
                            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                            <span className="text-[10px] font-mono tracking-widest text-white/80">ACCESSOIRES</span>
                            <span className="font-serif text-sm">The Trapeze Calfskin Bag</span>
                        </div>
                    </div>
                </div>

                {/* Right: Atelier Services */}
                <div className="lg:col-span-3 space-y-5 bg-[#f4f0e8] p-6 rounded-lg">
                    <div>
                        <span className="text-[9px] font-bold uppercase tracking-[.2em] text-[#9a704b]">
                            BESPOKE CLIENT SERVICES
                        </span>
                        <h4 className="mt-1 font-serif text-lg">Personal Styling & Monogramming</h4>
                        <p className="mt-2 text-xs text-black/60 leading-relaxed">
                            Book a private salon fitting in Paris, New York, or via virtual HD preview.
                        </p>
                    </div>
                    <div className="space-y-2 text-xs">
                        <a
                            href="#salon"
                            onClick={closeMenu}
                            className="flex items-center justify-between border-b border-black/10 py-2 font-medium hover:text-[#9a704b]"
                        >
                            <span>Book Salon Appointment</span>
                            <HiArrowRight />
                        </a>
                        <a
                            href="#concierge"
                            onClick={closeMenu}
                            className="flex items-center justify-between border-b border-black/10 py-2 font-medium hover:text-[#9a704b]"
                        >
                            <span>WhatsApp Atelier Direct</span>
                            <HiArrowRight />
                        </a>
                    </div>
                    <div className="text-[10px] text-black/50">
                        White-glove complimentary courier across 42 countries.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MaisonHauteCoutureAtelierMegaMenu
