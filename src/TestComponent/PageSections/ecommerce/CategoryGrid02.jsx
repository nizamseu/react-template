// NeoBrutalistStickerCategoryGrid

// CategoryGrid02 · E-commerce & Marketplaces › Category Grid

// Description:
// A loud, neo-brutalist category grid for the streetwear label LOUDMOUTH SUPPLY. A
// "Drop 07 · Live now" tag sits above the shouty heading "Pick your poison." and a "Shop
// all 412 pieces" button; below, six flat colour blocks (Tees, Hoodies, Outerwear, Denim,
// Kicks, Shades) carry rotated NEW / HOT / -30% stickers and a three-part perks bar. Use it
// on youth, streetwear or merch stores that want personality over polish.

// Design:
// - Grid of six blocks: grid-cols-2 → sm:grid-cols-3 → lg:grid-cols-6, gap-5 → sm:gap-6 so
//   hard shadows and stickers never collide; perks bar is 1 → md:3 columns
// - White page, black ink, 3px black borders and hard shadows shadow-[6px_6px_0_#000];
//   blocks are flat #ffd23f, #ff5c39, #6c9eff, #7ae582, #f5a3ff and one black block
// - Heavy uppercase type (font-black, tracking-tighter, text-5xl → lg:text-8xl heading);
//   mono counts and prices; the word "poison" sits in a -2° rotated yellow slab
// - Hover lifts a block (-translate 4px, shadow grows to 10px) and pops its photo from
//   grayscale to colour on md+; active presses it flat; stickers spin -8° and scale up
// - Stickers are 56px circles rotated between -12° and 14°; no framer-motion, CSS
//   transitions only (duration-150) so it feels snappy

// What it does:
// - Each block is an anchor to #shop-<category> (e.g. #shop-hoodies); the header button
//   points to #shop-all
// - No state; hover lift, grayscale-to-colour and sticker spin are visual only
// - Photos stay in full colour below md, where there is no hover

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NeoBrutalistStickerCategoryGrid from '@/TestComponent/PageSections/ecommerce/CategoryGrid02';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <NeoBrutalistStickerCategoryGrid />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const categories = [
    {
        id: 'tees',
        name: 'Tees',
        count: 96,
        from: 32,
        bg: 'bg-[#ffd23f]',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
        alt: 'Printed graphic t-shirt',
        sticker: { label: 'New', className: 'bg-white text-black rotate-[14deg]' },
    },
    {
        id: 'hoodies',
        name: 'Hoodies',
        count: 58,
        from: 78,
        bg: 'bg-[#ff5c39]',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80',
        alt: 'Back view of a person wearing a grey hoodie',
        sticker: { label: 'Hot', className: 'bg-black text-[#ffd23f] -rotate-[10deg]' },
    },
    {
        id: 'outerwear',
        name: 'Outerwear',
        count: 34,
        from: 145,
        bg: 'bg-[#6c9eff]',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
        alt: 'Black leather jacket on a white background',
    },
    {
        id: 'denim',
        name: 'Denim',
        count: 41,
        from: 88,
        bg: 'bg-[#7ae582]',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80',
        alt: 'Person walking in ripped light-wash jeans',
        sticker: { label: '-30%', className: 'bg-[#f5a3ff] text-black rotate-[8deg]' },
    },
    {
        id: 'kicks',
        name: 'Kicks',
        count: 27,
        from: 110,
        bg: 'bg-[#f5a3ff]',
        image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=80',
        alt: 'Maroon canvas sneaker on a yellow background',
        sticker: { label: 'Hot', className: 'bg-[#ff5c39] text-white -rotate-[12deg]' },
    },
    {
        id: 'shades',
        name: 'Shades',
        count: 19,
        from: 45,
        bg: 'bg-black text-white',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80',
        alt: 'Black sunglasses on a white background',
        sticker: { label: 'New', className: 'bg-[#7ae582] text-black rotate-[10deg]' },
    },
]

const perks = [
    { label: 'Free shipping', detail: 'On every order over $75', bg: 'bg-[#ffd23f]' },
    { label: 'New drop', detail: 'Every Friday · 12:00 EST', bg: 'bg-[#6c9eff]' },
    { label: 'No-drama returns', detail: '30 days, prepaid label', bg: 'bg-[#7ae582]' },
]

export function NeoBrutalistStickerCategoryGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 font-normal text-black sm:px-6 md:py-24 lg:px-10 text-base',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 border-[3px] border-black bg-black px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-white">
                            <span className="h-2 w-2 rounded-full bg-[#7ae582]" aria-hidden="true" />
                            Drop 07 · Live now
                        </p>
                        <h2 className="mt-6 text-5xl font-black uppercase leading-[0.86] tracking-tighter text-black sm:text-6xl lg:text-8xl">
                            Pick your
                            <br />
                            <span className="mt-2 inline-block -rotate-2 border-[3px] border-black bg-[#ffd23f] px-3 shadow-[6px_6px_0_#000]">
                                poison.
                            </span>
                        </h2>
                    </div>
                    <div className="flex max-w-sm flex-col gap-5">
                        <p className="text-base font-medium leading-snug text-black">
                            LOUDMOUTH SUPPLY makes heavyweight basics for people who talk back.
                            Six departments. Zero beige.
                        </p>
                        <a
                            href="#shop-all"
                            className="inline-flex min-h-12 items-center justify-between gap-4 self-start border-[3px] border-black bg-black px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[6px_6px_0_#ff5c39] transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_#ff5c39] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-dashed focus-visible:outline-black active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                            Shop all 412 pieces
                            <HiArrowRight className="h-5 w-5" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                <ul className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 lg:grid-cols-6">
                    {categories.map((category) => (
                        <li key={category.id} className="relative">
                            <a
                                href={`#shop-${category.id}`}
                                className={cn(
                                    'group relative flex h-full flex-col border-[3px] border-black p-2.5 shadow-[6px_6px_0_#000] transition-all duration-150 ease-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_#000] focus-visible:outline-[3px] focus-visible:outline-offset-[6px] focus-visible:outline-dashed focus-visible:outline-black active:translate-x-1 active:translate-y-1 active:shadow-none',
                                    category.bg,
                                )}
                            >
                                <div className="relative aspect-square overflow-hidden border-[3px] border-black bg-white">
                                    <img
                                        src={category.image}
                                        alt={category.alt}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105 md:grayscale md:group-hover:grayscale-0"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col px-0.5 pb-0.5 pt-3">
                                    <span className="text-lg font-black uppercase leading-none tracking-tight sm:text-xl">
                                        {category.name}
                                    </span>
                                    <span className="mt-2 flex items-center justify-between gap-2 font-mono text-[11px] font-bold uppercase">
                                        <span>{category.count} items</span>
                                        <span>from ${category.from}</span>
                                    </span>
                                    <span
                                        className={cn(
                                            'mt-3 flex items-center justify-between border-t-[3px] border-black pt-2 text-xs font-black uppercase tracking-wide',
                                            category.bg.includes('bg-black') && 'border-white',
                                        )}
                                    >
                                        Shop
                                        <HiArrowRight
                                            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    </span>
                                </div>
                                {category.sticker && (
                                    <span
                                        className={cn(
                                            'absolute -right-3 -top-3 z-10 grid h-14 w-14 place-items-center rounded-full border-[3px] border-black text-xs font-black uppercase tracking-tight shadow-[3px_3px_0_#000] transition-transform duration-150 group-hover:-rotate-[8deg] group-hover:scale-110',
                                            category.sticker.className,
                                        )}
                                    >
                                        {category.sticker.label}
                                    </span>
                                )}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="mt-14 grid border-[3px] border-black shadow-[6px_6px_0_#000] md:grid-cols-3">
                    {perks.map((perk, index) => (
                        <div
                            key={perk.label}
                            className={cn(
                                'flex items-center justify-between gap-4 px-5 py-4',
                                perk.bg,
                                index > 0 && 'border-t-[3px] border-black md:border-l-[3px] md:border-t-0',
                            )}
                        >
                            <span className="text-sm font-black uppercase tracking-tight sm:text-base">
                                {perk.label}
                            </span>
                            <span className="text-right font-mono text-[11px] font-bold uppercase">
                                {perk.detail}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default NeoBrutalistStickerCategoryGrid
