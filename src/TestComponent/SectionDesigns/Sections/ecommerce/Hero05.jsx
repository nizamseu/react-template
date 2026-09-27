'use client'

import { HiArrowRight } from 'react-icons/hi'
import { cn } from '@/design-system/lib/cn'


// Gift Edit Split Hero

// Hero05 · E-commerce & Marketplaces › Hero sections

// Description:
// Gifting hero for "The Gift Edit / Nº 06". The left half shows the eyebrow "A gift,
// already thought through", the serif headline "For the ones who show up.", copy about
// little thank-yous, big celebrations and just-because gifts, and a blue pill CTA "Find
// their thing"; the right half is a colourful gifts photo with a white edition tag.

// Design:
// - Two equal columns (md:grid-cols-[1fr_1fr], min-h-[390px]); text vertically centred
//   (flex-col justify-center); image column relative with an absolute bottom-right tag.
// - Blush #f4ebe4 background, #241f1b text, gray-600 copy, CTA #2a85ff with white text,
//   white tag with gray-900 text. Dark mode: gray-800 background, white text, gray-300 copy.
// - Serif headline text-5xl → sm:text-6xl (leading-[.95]); eyebrow text-xs bold uppercase
//   tracking-[.15em]; rounded-full pill CTA; square tag; rounded-lg shell.
// - Stacks on mobile (image min-h-64 below the text); side by side from md; padding
//   p-7 → sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One anchor CTA "Find their thing" → #gifts (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import Hero05 from '@/TestComponent/SectionDesigns/Sections/ecommerce/Hero05'

// const LandingPage = () => (
//     <main className="space-y-6">
//         <Hero05 />
//     </main>
// )
// ```

export function Hero05({
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
                'overflow-hidden rounded-lg bg-[#f4ebe4] text-[#241f1b] dark:bg-gray-800 dark:text-white',
                className,
            )}
            {...props}
        >
            <div className="grid min-h-[390px] md:grid-cols-[1fr_1fr]">
                <div className="flex flex-col justify-center p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[.15em]">
                        A gift, already thought through
                    </p>
                    <h2 className="mt-4 font-serif text-5xl leading-[.95] sm:text-6xl">
                        For the ones
                        <br />
                        who show up.
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-300">
                        A considered collection of little thank-yous, big
                        celebrations, and just-because.
                    </p>
                    <a
                        href="#gifts"
                        className="mt-6 inline-flex items-center gap-3 self-start rounded-full bg-[#2a85ff] px-5 py-3 text-sm font-semibold text-white"
                    >
                        Find their thing <HiArrowRight />
                    </a>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1000&q=85"
                        alt="Colorful thoughtful gifts ready to be shared"
                    />
                    <span className="absolute bottom-5 right-5 bg-white px-4 py-2 text-xs font-semibold text-gray-900">
                        THE GIFT EDIT / Nº 06
                    </span>
                </div>
            </div>
        </section>
    )
}

export default Hero05
