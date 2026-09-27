// EditorialLookbookDropMegaMenu

// MegaMenu01 · E-commerce & Marketplaces › Mega menus

// Description:
// An editorial lookbook dropdown for a lifestyle or home-goods store. It opens with a
// "Drop 04 / S/S 2026" campaign image titled "Tactile Objects for Daily Rituals" and a
// "Shop the Lookbook" link, then two department lists ("Living & Home", "Wear & Utility")
// with badges (Hot, New, Restock, -30%) and item counts, and a "Curators' Pick" card for
// the $115 Nordic Fluted Vase with five stars, "Free global delivery $150+" and "View Cart (0)".

// Design:
// - Single column on mobile, three columns at lg: (grid-cols-[1.1fr_1.3fr_0.9fr]): a
//   min-h-[360px] image banner, a 2-column department grid and a product spotlight panel
// - Cream #f9f7f4 surface with #1c1b19 text and a #f2eee8 spotlight panel; bronze #9a704b
//   headings and badges, red-100/red-700 sale badges, lime #d6f36a hover on the banner link
// - The only e-commerce panel with dark: styles: #1c1b19 surface, #23211e spotlight, lime
//   #d6f36a headings and badges, white/10 borders
// - Serif text-3xl banner title over a black/85 bottom gradient; text-[11px] uppercase
//   tracked headings, text-xs lists with text-[9px] badges; rounded-lg shadow-sm product card
// - Department column has a bottom border on mobile and a right border at lg:; the banner
//   image zooms to scale-105 on hover and list labels nudge right via group-hover

// What it does:
// - Every link calls closeMenu on click: "Shop the Lookbook" (#drop-04), the twelve
//   department links (hash built from the name, lower-cased with spaces as dashes, e.g.
//   #ceramics-&-vases) and "View Cart (0)" (#cart)
// - The Curators' Pick product card and star rating are display only (not a link); no
//   state or effect
// - Used by GoodformEditorialShopNavbar: <MegaMenu category="ecommerce" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-none border-b-2 border-black/20 shadow-2xl backdrop-blur-md'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EditorialLookbookDropMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/ecommerce/MegaMenu01';

// // Inside GoodformEditorialShopNavbar it opens from <MegaMenu category="ecommerce" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-b-2 border-black/20 shadow-2xl backdrop-blur-md">
//         <EditorialLookbookDropMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineSparkles, HiOutlineStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function EditorialLookbookDropMegaMenu({
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
                'bg-[#f9f7f4] text-[#1c1b19] dark:bg-[#1c1b19] dark:text-[#f3eee6]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr_0.9fr]">
                {/* Featured Campaign Banner */}
                <div className="relative flex min-h-[360px] flex-col justify-end overflow-hidden p-8 text-white">
                    <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
                        alt="Spring Edit Campaign"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
                            <HiOutlineSparkles className="text-amber-300" /> Drop 04 / S/S 2026
                        </span>
                        <h3 className="mt-3 font-serif text-3xl font-normal leading-tight">
                            Tactile Objects for Daily Rituals
                        </h3>
                        <p className="mt-2 text-xs text-white/80 line-clamp-2">
                            Handcrafted stoneware, organic Belgian linen, and architectural brass essentials.
                        </p>
                        <a
                            href="#drop-04"
                            onClick={closeMenu}
                            className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white underline decoration-2 underline-offset-4 hover:text-[#d6f36a]"
                        >
                            Shop the Lookbook <HiArrowRight />
                        </a>
                    </div>
                </div>

                {/* Department Columns */}
                <div className="grid grid-cols-2 gap-6 p-8 border-b lg:border-b-0 lg:border-r border-black/5 dark:border-white/10">
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9a704b] dark:text-[#d6f36a]">
                            Living & Home
                        </p>
                        <ul className="mt-4 space-y-2.5 text-xs">
                            {[
                                { name: 'Ceramics & Vases', badge: 'Hot', count: '38 items' },
                                { name: 'Linen Tablecloths', count: '14 items' },
                                { name: 'Aroma Diffusers & Incense', badge: 'New', count: '22 items' },
                                { name: 'Sculptural Lighting', count: '19 items' },
                                { name: 'Hand-blown Glassware', count: '31 items' },
                                { name: 'Makers & Studios Index', count: '12 artisans' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        onClick={closeMenu}
                                        className="group flex items-center justify-between py-1 text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors"
                                    >
                                        <span className="font-medium group-hover:translate-x-1 transition-transform">
                                            {item.name}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            {item.badge && (
                                                <span className="rounded bg-[#9a704b]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#9a704b] dark:bg-[#d6f36a]/20 dark:text-[#d6f36a]">
                                                    {item.badge}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-black/40 dark:text-white/40">
                                                {item.count}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#9a704b] dark:text-[#d6f36a]">
                            Wear & Utility
                        </p>
                        <ul className="mt-4 space-y-2.5 text-xs">
                            {[
                                { name: 'Everyday Canvas Totes', count: '18 items' },
                                { name: 'Organic Cotton Robes', badge: 'Restock', count: '12 items' },
                                { name: 'Vegetable-Tanned Leather', count: '16 items' },
                                { name: 'Merino Wool Throws', count: '9 items' },
                                { name: 'Minimalist Timepieces', count: '8 items' },
                                { name: 'Archive Overstock Sale', badge: '-30%', count: '25 items' },
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        onClick={closeMenu}
                                        className="group flex items-center justify-between py-1 text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors"
                                    >
                                        <span className="font-medium group-hover:translate-x-1 transition-transform">
                                            {item.name}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            {item.badge && (
                                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                                                    {item.badge}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-black/40 dark:text-white/40">
                                                {item.count}
                                            </span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Spotlight Product Card */}
                <div className="p-8 bg-[#f2eee8] dark:bg-[#23211e] flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[.16em] text-black/50 dark:text-white/50">
                            Curators' Pick
                        </span>
                        <div className="mt-3 overflow-hidden rounded-lg bg-white dark:bg-black/40 shadow-sm border border-black/5 dark:border-white/5">
                            <img
                                src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80"
                                alt="Nordic Clay Vessel"
                                className="h-36 w-full object-cover"
                            />
                            <div className="p-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-serif font-bold">Nordic Fluted Vase</span>
                                    <span className="font-mono font-bold">$115</span>
                                </div>
                                <p className="mt-1 text-[11px] text-black/60 dark:text-white/60">
                                    Glazed stoneware by Studio Arhoj.
                                </p>
                                <div className="mt-3 flex items-center gap-1 text-amber-500 text-xs">
                                    <HiOutlineStar className="fill-amber-400" />
                                    <HiOutlineStar className="fill-amber-400" />
                                    <HiOutlineStar className="fill-amber-400" />
                                    <HiOutlineStar className="fill-amber-400" />
                                    <HiOutlineStar className="fill-amber-400" />
                                    <span className="ml-1 text-[10px] text-black/50 dark:text-white/50">(48 reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs">
                        <span className="text-black/60 dark:text-white/60">Free global delivery $150+</span>
                        <a
                            href="#cart"
                            onClick={closeMenu}
                            className="font-semibold underline hover:text-[#9a704b]"
                        >
                            View Cart (0)
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditorialLookbookDropMegaMenu
