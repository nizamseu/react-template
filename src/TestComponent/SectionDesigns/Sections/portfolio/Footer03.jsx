// OngoingNotebookSocialFooter

// Footer03 · Portfolios & Personal Websites › Footers

// Description:
// Cream footer that frames the site as "The ongoing notebook", with the serif
// headline "What I'm making, noticing, and learning.", three pill links to
// Are.na, Instagram and LinkedIn, and the line "© Jamie Park · Independent by
// design."

// Design:
// - Grid md:grid-cols-[1fr_auto]: text on the left, pill row on the right
//   (self-end); a border-t divider above the copyright line.
// - Light palette: cream #f1e9de background, text #241d1a, coral #ef6a4b
//   eyebrow, pill borders and divider #d5c8b7, gray-500 copyright.
// - Headline font-serif text-4xl (max-w-lg); rounded-full xs pills
//   (px-4 py-2); rounded-lg container.
// - Single column below md; pills flex-wrap; padding p-7 → sm:p-10.

// What it does:
// - Purely presentational: no content props, no state, no icons.
// - Social pills point to placeholder anchors #are-na, #instagram and
//   #linkedin rather than external profile URLs.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OngoingNotebookSocialFooter from '@/TestComponent/SectionDesigns/Sections/portfolio/Footer03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <OngoingNotebookSocialFooter />
//     </main>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function OngoingNotebookSocialFooter({
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
                'rounded-lg bg-[#f1e9de] p-7 text-[#241d1a] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-7 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ef6a4b]">
                        The ongoing notebook
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        What I&apos;m making, noticing, and learning.
                    </h2>
                </div>
                <div className="flex flex-wrap gap-3 self-end">
                    <a
                        href="#are-na"
                        className="rounded-full border border-[#d5c8b7] px-4 py-2 text-xs"
                    >
                        Are.na ↗
                    </a>
                    <a
                        href="#instagram"
                        className="rounded-full border border-[#d5c8b7] px-4 py-2 text-xs"
                    >
                        Instagram ↗
                    </a>
                    <a
                        href="#linkedin"
                        className="rounded-full border border-[#d5c8b7] px-4 py-2 text-xs"
                    >
                        LinkedIn ↗
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#d5c8b7] pt-4 text-xs text-gray-500">
                © Jamie Park · Independent by design.
            </p>
        </footer>
    )
}

export default OngoingNotebookSocialFooter
