// MakeSomethingUsefulContactFooter

// Footer01 · Portfolios & Personal Websites › Footers

// Description:
// Dark closing footer for Jamie Park that doubles as a contact prompt: the
// eyebrow "Have a good one in mind?", a big uppercase "Let's make something
// useful." and a "Send a note" email link, with location and social names on
// the right and a bottom bar reading "© Jamie Park 2026" / "Site by Jamie".

// Design:
// - Flex layout: contact prompt left, info block right, bottom-aligned from md
//   (md:flex-row md:items-end); a border-t white/15 bottom bar.
// - Dark palette: espresso #241d1a background, text #f5eee5, coral #ef6a4b
//   eyebrow and link underline, muted text in white/60 and white/40.
// - Headline text-5xl font-black uppercase leading-[.9]; xs bold uppercase
//   eyebrow (tracking-[.16em]); rounded-lg; border-b underlined link.
// - Stacks vertically below md; padding p-7 → sm:p-10.

// What it does:
// - Purely presentational: no content props, no state.
// - One mailto link "Send a note" → hello@jamie.example (HiArrowRight); the
//   "Instagram ↗ LinkedIn ↗ Are.na ↗" line is plain text, not links.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MakeSomethingUsefulContactFooter from '@/TestComponent/SectionDesigns/Sections/portfolio/Footer01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MakeSomethingUsefulContactFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MakeSomethingUsefulContactFooter({
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
                'rounded-lg bg-[#241d1a] p-7 text-[#f5eee5] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ef6a4b]">
                        Have a good one in mind?
                    </p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-black uppercase leading-[.9]">
                        Let&apos;s make something useful.
                    </h2>
                    <a
                        href="mailto:hello@jamie.example"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#ef6a4b] pb-2 text-sm"
                    >
                        Send a note <HiArrowRight />
                    </a>
                </div>
                <div className="text-sm text-white/60">
                    <p>Brooklyn, NY · Working everywhere</p>
                    <p className="mt-3">
                        Instagram ↗ &nbsp; LinkedIn ↗ &nbsp; Are.na ↗
                    </p>
                </div>
            </div>
            <div className="mt-10 flex justify-between border-t border-white/15 pt-4 text-xs text-white/40">
                <span>© Jamie Park 2026</span>
                <span>Site by Jamie, with care.</span>
            </div>
        </footer>
    )
}

export default MakeSomethingUsefulContactFooter
