// CoralStartAProjectFooter

// Footer02 · Portfolios & Personal Websites › Footers

// Description:
// Coral closing footer for Jamie Park's site: the eyebrow "LET'S MAKE THE
// USEFUL THING", the uppercase headline "Beautifully, together.", a
// "Start a project" link, and a bottom bar with "© Jamie Park 2026" and
// "Brooklyn · Everywhere".

// Design:
// - Flex layout: headline left, link right, bottom-aligned from md
//   (md:flex-row md:items-end); a bottom bar with border-t #c95038.
// - Warm palette: coral #ef6a4b background, text #241d1a, divider #c95038.
// - Headline text-5xl font-black uppercase leading-[.9]; xs bold uppercase
//   eyebrow (tracking-[.14em]); semibold link underlined with border-b
//   #241d1a; rounded-lg container.
// - Stacks vertically below md; padding p-7 → sm:p-10.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "Start a project" → #contact (HiArrowRight icon).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CoralStartAProjectFooter from '@/TestComponent/SectionDesigns/Sections/portfolio/Footer02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CoralStartAProjectFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CoralStartAProjectFooter({
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
                'rounded-lg bg-[#ef6a4b] p-7 text-[#241d1a] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        LET&apos;S MAKE THE USEFUL THING
                    </p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-black uppercase leading-[.9]">
                        Beautifully, together.
                    </h2>
                </div>
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 border-b border-[#241d1a] pb-2 text-sm font-semibold"
                >
                    Start a project <HiArrowRight />
                </a>
            </div>
            <div className="mt-9 flex justify-between border-t border-[#c95038] pt-4 text-xs">
                <span>© Jamie Park 2026</span>
                <span>Brooklyn · Everywhere</span>
            </div>
        </footer>
    )
}

export default CoralStartAProjectFooter
