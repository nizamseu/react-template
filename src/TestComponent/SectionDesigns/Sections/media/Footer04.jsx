// DarkArchiveInvitationFooter

// Footer04 · Blogs & Digital Media › Footers

// Description:
// A compact dark closing footer. The kicker "Keep a little wonder close"
// and the heading "Read something that changes the question." sit next to
// an underlined "Explore the archive" link; a bottom bar shows "© Margin"
// and the names Instagram, Bluesky and Contact.

// Design:
// - Flex row (stacked by default): heading block left, archive link right,
//   bottom-aligned; then a ruled bottom bar with two items spread apart
// - Dark espresso palette: background #28221e, cream text #f3eee5, peach
//   accent #e7a37c (kicker, link underline), bottom bar white/45, divider
//   white/15
// - Serif text-4xl heading (max-w-xl); xs uppercase kicker tracked at .16em;
//   link styled as a bottom border with arrow; rounded-lg container
// - Column layout below md, `md:flex-row md:items-end` from md; padding
//   p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - One link to `#archive`; "Instagram · Bluesky · Contact" is plain text,
//   not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DarkArchiveInvitationFooter from '@/TestComponent/SectionDesigns/Sections/media/Footer04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DarkArchiveInvitationFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DarkArchiveInvitationFooter({
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
                'rounded-lg bg-[#28221e] p-7 text-[#f3eee5] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <p className="text-xs uppercase tracking-[.16em] text-[#e7a37c]">
                        Keep a little wonder close
                    </p>
                    <h2 className="mt-3 max-w-xl font-serif text-4xl">
                        Read something that changes the question.
                    </h2>
                </div>
                <a
                    href="#archive"
                    className="inline-flex items-center gap-2 border-b border-[#e7a37c] pb-2 text-sm"
                >
                    Explore the archive <HiArrowRight />
                </a>
            </div>
            <div className="mt-9 flex justify-between border-t border-white/15 pt-4 text-xs text-white/45">
                <span>© Margin</span>
                <span>Instagram · Bluesky · Contact</span>
            </div>
        </footer>
    )
}

export default DarkArchiveInvitationFooter
