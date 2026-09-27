// ProductHandbookDocsSearchHero

// Hero01 · Knowledge Bases & Documentation › Hero sections

// Description:
// A calm, light split hero for a product documentation / handbook site. The
// left side carries a "DOCS / PRODUCT HANDBOOK" eyebrow, the headline "Good
// answers, close at hand." and a docs search bar; the right side lists the
// four most popular guides of the week as numbered links.

// Design:
// - Rounded section with a two-column grid (md:grid-cols-[1fr_.72fr], min-h-[400px]);
//   the left column is a flex column spreading eyebrow, headline/search and footnote
//   top-to-bottom; the right column is a white panel with a left border.
// - Light sage palette: background #f6f7f4, text #17231f, green accent #41715d
//   (eyebrow, search icon, list arrows), borders #d4dbd5 / #e4e8e3 / #edf0ec,
//   gray-600/500/400 for secondary copy.
// - Headline text-5xl → sm:text-6xl, font-semibold, tight leading-[.98]; uppercase
//   bold tracking-[.15em] eyebrow; monospace list numbers; rounded-lg bordered
//   white search bar with a small bordered "⌘ K" kbd hint.
// - Padding p-7 → sm:p-12; the ⌘ K hint is hidden below sm; the "Popular this
//   week" panel is hidden below md, so mobile shows only the search column.

// What it does:
// - No content props or state. The search form's onSubmit only calls e.preventDefault(),
//   so nothing is searched or navigated; the input is uncontrolled
//   (aria-label "Search documentation"). The ⌘ K hint is visual only (no key handler).
// - An inline array of [number, title] tuples ("Set up your workspace", "Invite
//   your team", "Connect an integration", "Manage billing") is mapped to anchor
//   rows that all link to #guide, each with a HiArrowRight icon.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ProductHandbookDocsSearchHero from '@/TestComponent/SectionDesigns/Sections/knowledge/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ProductHandbookDocsSearchHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ProductHandbookDocsSearchHero({
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
                'overflow-hidden rounded-lg bg-[#f6f7f4] text-[#17231f]',
                className,
            )}
            {...props}
        >
            <div className="grid min-h-[400px] md:grid-cols-[1fr_.72fr]">
                <div className="flex flex-col justify-between p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#41715d]">
                        DOCS / PRODUCT HANDBOOK
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-xl text-5xl font-semibold leading-[.98] sm:text-6xl">
                            Good answers, close at hand.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-6 text-gray-600">
                            Product guides, API references, and team knowledge
                            in one searchable place.
                        </p>
                        <form
                            className="mt-6 flex max-w-xl items-center gap-3 rounded-lg border border-[#d4dbd5] bg-white p-2"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <HiOutlineSearch className="ml-2 shrink-0 text-[#41715d]" />
                            <input
                                aria-label="Search documentation"
                                placeholder="Search the docs..."
                                className="min-w-0 flex-1 py-2 text-sm outline-none"
                            />
                            <kbd className="hidden rounded border px-2 py-1 text-[10px] text-gray-400 sm:block">
                                ⌘ K
                            </kbd>
                        </form>
                    </div>
                    <p className="text-xs text-gray-500">
                        Updated regularly by the people who build it.
                    </p>
                </div>
                <div className="hidden border-l border-[#e4e8e3] bg-white p-7 md:flex md:flex-col md:justify-center">
                    <p className="text-xs font-semibold text-[#41715d]">
                        POPULAR THIS WEEK
                    </p>
                    {[
                        ['01', 'Set up your workspace'],
                        ['02', 'Invite your team'],
                        ['03', 'Connect an integration'],
                        ['04', 'Manage billing'],
                    ].map(([number, title]) => (
                        <a
                            key={number}
                            href="#guide"
                            className="flex items-center gap-4 border-b border-[#edf0ec] py-4"
                        >
                            <span className="font-mono text-xs text-gray-400">
                                {number}
                            </span>
                            <span className="flex-1 text-sm">{title}</span>
                            <HiArrowRight className="text-xs text-[#41715d]" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ProductHandbookDocsSearchHero
