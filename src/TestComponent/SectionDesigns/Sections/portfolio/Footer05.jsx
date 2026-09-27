// StudioLetterNewsletterStrip

// Footer05 · Portfolios & Personal Websites › Footers

// Description:
// White, bordered strip that promotes a designer's low-volume newsletter: the
// eyebrow "A low-volume studio letter", the serif line "One note when there's
// something to say.", a dark "Get the occasional note" pill link and the
// reassurance "No noise, no schedule. Unsubscribe whenever."

// Design:
// - Flex layout: text left, pill link right, vertically centred from sm
//   (sm:flex-row sm:items-center); a border-t #eee7df note line below.
// - Light palette: white background with border #d5c8b7, text #241d1a, coral
//   #ef6a4b eyebrow, #241d1a pill with white text, gray-500 note.
// - Headline font-serif text-2xl; xs bold uppercase eyebrow
//   (tracking-[.14em]); rounded-full pill (px-5 py-3); rounded-lg container.
// - Stacks vertically below sm (not md); fixed p-7 padding at all widths.

// What it does:
// - Purely presentational: no content props, no state, no email input or form.
// - One in-page anchor "Get the occasional note" → #newsletter (HiArrowRight).

// Note: it is rendered as a <footer> but holds only a newsletter call to
// action, with no copyright, brand, navigation or contact links, so it reads
// more like a Banner CTA than a page footer.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import StudioLetterNewsletterStrip from '@/TestComponent/SectionDesigns/Sections/portfolio/Footer05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <StudioLetterNewsletterStrip />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function StudioLetterNewsletterStrip({
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
                'rounded-lg border border-[#d5c8b7] bg-white p-7 text-[#241d1a]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ef6a4b]">
                        A low-volume studio letter
                    </p>
                    <h2 className="mt-2 font-serif text-2xl">
                        One note when there&apos;s something to say.
                    </h2>
                </div>
                <a
                    href="#newsletter"
                    className="inline-flex items-center gap-2 rounded-full bg-[#241d1a] px-5 py-3 text-sm text-white"
                >
                    Get the occasional note <HiArrowRight />
                </a>
            </div>
            <p className="mt-7 border-t border-[#eee7df] pt-4 text-xs text-gray-500">
                No noise, no schedule. Unsubscribe whenever.
            </p>
        </footer>
    )
}

export default StudioLetterNewsletterStrip
