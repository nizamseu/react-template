// SundaySupplyArtisanProvisionsMegaMenu

// MegaMenu05 · E-commerce & Marketplaces › Mega menus

// Description:
// A warm, slow-living dropdown for an artisan homeware or provisions shop. The header reads
// "SUNDAY SUPPLY • PROVISIONS FOR THE SLOW HOME" over the serif title "Handcrafted by
// Independent Makers & Quiet Studios", with an italic maker quote on the right. Below are
// two priced bundles ("Stoneware Pour-Over & Linen Set" $78, "Wild Cypress & Sea Salt Soak"
// $44) with "View Details" links and a "MAKER SPOTLIGHT" card for ceramicist Elena Vane.

// Design:
// - p-8 panel: header stacks on mobile and becomes a row at md: (md:items-end), then a grid
//   of one column on mobile and three at md: (two bundle cards, one maker card)
// - Warm beige #f5ede4 surface with #2d2520 text and #d8c8ba borders; tan #9a704b for the
//   eyebrow labels and underlined links; bundle cards are white/70, the maker card #ede1d5
// - font-serif title, product names and quotes; font-mono prices; tracked uppercase
//   text-[10px] eyebrows; rounded-lg cards and h-44 images with #2d2520/90 caption tags
// - Bundle cards gain shadow-md on hover and their photos zoom (hover:scale-105,
//   duration-500); the maker portrait is a rounded-full h-12 w-12 white-bordered avatar

// What it does:
// - Both "View Details" links (#bundle-1, #bundle-2) and "Explore Elena's 18 Pieces"
//   (#artisan-elena) call closeMenu on click
// - Prices, image captions and quotes are display only; no state or effect
// - Used by SundaySupplyLedgerGridNavbar: <MegaMenu category="ecommerce" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-2xl border border-[#d8c8ba] shadow-xl bg-[#f5ede4]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SundaySupplyArtisanProvisionsMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/ecommerce/MegaMenu05';

// // Inside SundaySupplyLedgerGridNavbar it opens from <MegaMenu category="ecommerce" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-2xl border border-[#d8c8ba] shadow-xl bg-[#f5ede4]">
//         <SundaySupplyArtisanProvisionsMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SundaySupplyArtisanProvisionsMegaMenu({
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
                'bg-[#f5ede4] text-[#2d2520] p-8 border-t border-[#d8c8ba]',
                className,
            )}
            {...props}
        >
            {/* Header banner */}
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#d8c8ba] pb-4 gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[.22em] text-[#9a704b]">
                        SUNDAY SUPPLY &bull; PROVISIONS FOR THE SLOW HOME
                    </span>
                    <h3 className="mt-1 font-serif text-2xl">
                        Handcrafted by Independent Makers & Quiet Studios
                    </h3>
                </div>
                <p className="max-w-md text-xs text-[#2d2520]/70 italic font-serif">
                    "Every object carries the fingerprint of its craftsperson — made to grow gentler with age."
                </p>
            </div>

            {/* 3 Sensory Bundles & Artisan Feature */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bundle 1 */}
                <div className="rounded-lg bg-white/70 p-5 border border-[#d8c8ba]/60 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="relative h-44 overflow-hidden rounded">
                            <img
                                src="https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80"
                                alt="Morning Coffee Ritual"
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <span className="absolute bottom-2 left-2 rounded bg-[#2d2520]/90 px-2 py-0.5 text-[10px] font-medium text-white">
                                The Morning Ritual
                            </span>
                        </div>
                        <h4 className="mt-3 font-serif text-base font-bold">Stoneware Pour-Over & Linen Set</h4>
                        <p className="mt-1 text-xs text-[#2d2520]/70">
                            Includes wheel-thrown dripper, washed flax filter cloth, and heirloom single-origin beans.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#d8c8ba]/40 pt-3">
                        <span className="font-mono text-xs font-bold">$78 Complete Set</span>
                        <a
                            href="#bundle-1"
                            onClick={closeMenu}
                            className="text-xs font-semibold text-[#9a704b] underline hover:text-[#2d2520]"
                        >
                            View Details
                        </a>
                    </div>
                </div>

                {/* Bundle 2 */}
                <div className="rounded-lg bg-white/70 p-5 border border-[#d8c8ba]/60 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
                        <div className="relative h-44 overflow-hidden rounded">
                            <img
                                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80"
                                alt="Botanical Candle and Bath"
                                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <span className="absolute bottom-2 left-2 rounded bg-[#2d2520]/90 px-2 py-0.5 text-[10px] font-medium text-white">
                                Bath & Sanctuary
                            </span>
                        </div>
                        <h4 className="mt-3 font-serif text-base font-bold">Wild Cypress & Sea Salt Soak</h4>
                        <p className="mt-1 text-xs text-[#2d2520]/70">
                            Harvested Pacific sea salts blended with cold-pressed Hinoki and cedarwood oils.
                        </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#d8c8ba]/40 pt-3">
                        <span className="font-mono text-xs font-bold">$44 Jar (500g)</span>
                        <a
                            href="#bundle-2"
                            onClick={closeMenu}
                            className="text-xs font-semibold text-[#9a704b] underline hover:text-[#2d2520]"
                        >
                            View Details
                        </a>
                    </div>
                </div>

                {/* Artisan Profile */}
                <div className="rounded-lg bg-[#ede1d5] p-5 border border-[#d8c8ba] flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a704b]">
                            MAKER SPOTLIGHT
                        </span>
                        <div className="mt-2 flex items-center gap-3">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                                alt="Elena Vane, Potter"
                                className="h-12 w-12 rounded-full object-cover border border-white"
                            />
                            <div>
                                <h5 className="font-serif font-bold text-sm">Elena Vane</h5>
                                <p className="text-[11px] text-[#2d2520]/70">Ceramicist &bull; Devon, UK</p>
                            </div>
                        </div>
                        <p className="mt-3 text-xs text-[#2d2520]/80 leading-relaxed italic">
                            "Every batch is wood-fired over 48 hours using local orchard trimmings. No two glaze blooms are identical."
                        </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#d8c8ba]">
                        <a
                            href="#artisan-elena"
                            onClick={closeMenu}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2d2520] hover:text-[#9a704b]"
                        >
                            Explore Elena's 18 Pieces <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SundaySupplyArtisanProvisionsMegaMenu
