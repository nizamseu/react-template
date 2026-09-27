// ThingsWithAStoryStatementFooter

// Footer05 · E-commerce & Marketplaces › Footers

// Description:
// Dark statement footer with the lime eyebrow "One good thing at a time" and the serif
// headline "The shop for things with a story.", a six-link nav (Objects, Makers, Wear,
// Journal, Customer care, Stockists) and a bottom bar with "© 2026 Objects with a point of
// view", "Follow the good stuff →" and "Legal / Accessibility".

// Design:
// - Grid md:grid-cols-[1fr_auto]: headline left, a 2-column link nav right (self-start);
//   bottom bar separated by border-t white/15.
// - Always dark: #211d18 background, white text, white/70 links, white/50 legal row, lime
//   #d6f36a eyebrow.
// - Serif headline text-4xl → sm:text-5xl leading-tight; eyebrow text-xs bold uppercase
//   tracking-[.16em]; rounded-lg shell with overflow-hidden.
// - Stacks on mobile; bottom bar flex-col → sm:flex-row; padding px-7 → sm:px-10, pt-9.

// What it does:
// - Purely presentational: no content props, no state.
// - Anchors #objects, #makers, #wear, #journal, #help, #stockists; the bottom-bar items
//   are plain text, not links.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ThingsWithAStoryStatementFooter from '@/TestComponent/SectionDesigns/Sections/ecommerce/Footer05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ThingsWithAStoryStatementFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ThingsWithAStoryStatementFooter({
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
                'overflow-hidden rounded-lg bg-[#211d18] px-7 pt-9 text-white sm:px-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d6f36a]">
                        One good thing at a time
                    </p>
                    <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                        The shop for things with a story.
                    </h2>
                </div>
                <nav className="grid grid-cols-2 gap-x-8 gap-y-3 self-start text-sm text-white/70">
                    <a href="#objects">Objects</a>
                    <a href="#makers">Makers</a>
                    <a href="#wear">Wear</a>
                    <a href="#journal">Journal</a>
                    <a href="#help">Customer care</a>
                    <a href="#stockists">Stockists</a>
                </nav>
            </div>
            <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 py-4 text-xs text-white/50 sm:flex-row">
                <span>© 2026 Objects with a point of view</span>
                <span>
                    Follow the good stuff <HiArrowRight className="inline" />
                </span>
                <span>Legal / Accessibility</span>
            </div>
        </footer>
    )
}

export default ThingsWithAStoryStatementFooter
