// HostExperiencesMegaMenu

// MegaMenu04 · Booking & Reservations › Mega menus

// Description:
// A dark experiences dropdown for a boutique stays / travel-booking site that also sells
// hosted activities. A mono kicker "BEYOND ACCOMMODATION • IMMERSIVE FIELD NOTES" tops the
// serif headline "Led by Local Craftsmen, Foragers & Scientists", next to a "Host an
// Experience" pill. Three experience cards (Raku pottery in Uji, Azores freediving, Atacama
// stargazing) show place/duration, title, per-guest price, rating and a "Reserve →" link.

// Design:
// - p-8 panel with a 1px #e07d5b top border: a header that stacks on mobile and becomes an
//   end-aligned row at md:, then a card grid of one column on mobile and three at md:
// - Deep teal #1a2d36 surface with white text; terracotta #e07d5b kicker, prices, links and
//   the pill button, which inverts to white with #1a2d36 text on hover
// - Serif text-2xl headline, bold text-sm card titles, font-mono text-[10px] locations and
//   text-xs prices; cards are rounded-lg p-5 with a white/10 border on white/5
// - Text-only cards with a white/10 rule above the rating/Reserve footer; the underlined
//   "Reserve" links have no hover style

// What it does:
// - "Host an Experience" calls closeMenu and goes to #host; each "Reserve →" link calls
//   closeMenu and goes to #book-exp. Everything else is display only; no state or effect
// - Card locations are JS strings, so their &bull; shows as literal "&bull;" text (e.g.
//   "Uji, Kyoto &bull; 4 Hours"); the JSX &bull; and &rarr; elsewhere render fine
// - Used by SlowCoastFloatingPillNavbar: <MegaMenu category="booking" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-[#e07d5b] shadow-2xl bg-[#1a2d36]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HostExperiencesMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/booking/MegaMenu04';

// // Inside SlowCoastFloatingPillNavbar it opens from <MegaMenu category="booking" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-[#e07d5b] shadow-2xl bg-[#1a2d36]">
//         <HostExperiencesMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function HostExperiencesMegaMenu({
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
                'bg-[#1a2d36] text-white p-8 border-t border-[#e07d5b]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#e07d5b] uppercase tracking-[.25em]">
                        BEYOND ACCOMMODATION &bull; IMMERSIVE FIELD NOTES
                    </span>
                    <h3 className="mt-1 font-serif text-2xl">Led by Local Craftsmen, Foragers & Scientists</h3>
                </div>
                <a
                    href="#host"
                    onClick={closeMenu}
                    className="rounded-full bg-[#e07d5b] px-4 py-1.5 text-xs font-bold text-white hover:bg-white hover:text-[#1a2d36] transition-colors"
                >
                    Host an Experience
                </a>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Tea Ceremony & Raku Pottery with Master Chiba',
                        loc: 'Uji, Kyoto &bull; 4 Hours',
                        price: '$190 / guest',
                        rating: '5.0 (48 reviews)',
                    },
                    {
                        title: 'Deep Sea Freediving & Marine Rewilding',
                        loc: 'Azores Archipelago &bull; Full Day',
                        price: '$260 / guest',
                        rating: '4.98 (32 reviews)',
                    },
                    {
                        title: 'High-Altitude Stargazing with Astrophysicists',
                        loc: 'Atacama Desert &bull; Night Session',
                        price: '$220 / guest',
                        rating: '5.0 (64 reviews)',
                    },
                ].map((exp) => (
                    <div
                        key={exp.title}
                        className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
                    >
                        <div>
                            <span className="font-mono text-[10px] text-white/50">{exp.loc}</span>
                            <h4 className="mt-2 font-bold text-sm text-white">{exp.title}</h4>
                            <span className="block mt-2 font-mono text-xs text-[#e07d5b] font-bold">{exp.price}</span>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                            <span className="text-white/50">{exp.rating}</span>
                            <a href="#book-exp" onClick={closeMenu} className="font-bold text-[#e07d5b] underline">
                                Reserve &rarr;
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HostExperiencesMegaMenu
