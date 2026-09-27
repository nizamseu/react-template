// Maison08MinimalLinkFooter

// Footer03 · E-commerce & Marketplaces › Footers

// Description:
// Minimal bordered footer for the homeware shop "Maison / 08" with the tagline "Objects
// for a life well lived. Selected with intention, delivered with care.", six links in two
// columns (Shop all, Our story, Delivery & returns, Field notes, Frequently asked, Get in
// touch) and a bottom bar with "© Maison / 08 — Objects that stay.", "London · Copenhagen ·
// Online" and an Instagram link.

// Design:
// - flex-col → md:flex-row with justify-between (brand block left, 2-column link grid
//   right, gap-x-10 gap-y-5); bottom bar separated by border-t.
// - Light: white background, gray-200 border, gray-500 muted text; body text colour is
//   inherited (not set). Dark mode: gray-900 background, gray-700 borders.
// - Serif brand text-3xl; text-sm links without hover styles; text-xs legal row; 1px
//   border with rounded-lg corners.
// - Stacks on mobile, row layout from md; bottom bar flex-wrap; padding p-6 → sm:p-9.

// What it does:
// - Purely presentational: no content props, no state.
// - Anchors #shop, #about, #shipping, #journal, #faq, #contact and #instagram (with
//   HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import Maison08MinimalLinkFooter from '@/TestComponent/SectionDesigns/Sections/ecommerce/Footer03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <Maison08MinimalLinkFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function Maison08MinimalLinkFooter({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <footer
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-9',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-8 md:flex-row">
                <div>
                    <p className="font-serif text-3xl">Maison / 08</p>
                    <p className="mt-2 max-w-xs text-sm text-gray-500">
                        Objects for a life well lived. Selected with intention,
                        delivered with care.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-sm">
                    <a href="#shop">Shop all</a>
                    <a href="#about">Our story</a>
                    <a href="#shipping">Delivery & returns</a>
                    <a href="#journal">Field notes</a>
                    <a href="#faq">Frequently asked</a>
                    <a href="#contact">Get in touch</a>
                </div>
            </div>
            <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-700">
                <span>© Maison / 08 — Objects that stay.</span>
                <span>London · Copenhagen · Online</span>
                <a href="#instagram" className="flex items-center gap-1">
                    Instagram <HiArrowRight />
                </a>
            </div>
        </footer>
    )
}

export default Maison08MinimalLinkFooter
