// CourseRecommendationPromptFooter

// Footer04 · Learning Management & EdTech › Footers

// Description:
// Dark footer that opens with a guidance prompt: the eyebrow "A good place to
// begin", the serif heading "Not sure where to start? Tell us what you want to
// learn." and a "Get a recommendation" link, beside a 2x2 nav (Browse all,
// Plans, FAQ, Contact) and a bottom bar with "© Fieldnote Studio".

// Design:
// - Grid `md:grid-cols-[1fr_auto]` with the nav aligned to the bottom
//   (self-end), then a border-t bar with justify-between
// - Dark palette: #102d36 background, white text with white/60 and /40 tints,
//   lime #c8ef70 eyebrow, white/15 divider
// - xs bold uppercase eyebrow (.14em tracking), serif text-4xl heading, sm
//   links, xs bottom bar; rounded-lg footer
// - Columns stack below md; padding p-7 -> sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: "Get a recommendation" -> #recommend (HiArrowRight), #catalog,
//   #pricing, #faq, #contact; "Instagram · YouTube · Privacy" is plain text

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CourseRecommendationPromptFooter from '@/TestComponent/SectionDesigns/Sections/learning/Footer04';

// const SiteLayout = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <CourseRecommendationPromptFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CourseRecommendationPromptFooter({
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
                'rounded-lg bg-[#102d36] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#c8ef70]">
                        A good place to begin
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        Not sure where to start? Tell us what you want to learn.
                    </h2>
                    <a
                        href="#recommend"
                        className="mt-5 inline-flex items-center gap-2 text-sm"
                    >
                        Get a recommendation <HiArrowRight />
                    </a>
                </div>
                <nav className="grid grid-cols-2 gap-x-8 gap-y-4 self-end text-sm text-white/60">
                    <a href="#catalog">Browse all</a>
                    <a href="#pricing">Plans</a>
                    <a href="#faq">FAQ</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
            <div className="mt-9 flex justify-between border-t border-white/15 pt-4 text-xs text-white/40">
                <span>© Fieldnote Studio</span>
                <span>Instagram · YouTube · Privacy</span>
            </div>
        </footer>
    )
}

export default CourseRecommendationPromptFooter
