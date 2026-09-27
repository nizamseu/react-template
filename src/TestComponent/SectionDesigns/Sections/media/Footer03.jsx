// ThreeColumnPublicationFooter

// Footer03 · Blogs & Digital Media › Footers

// Description:
// A light, classic three-column footer for MARGIN, "a publication for
// people who keep asking why". It shows the wordmark and tagline, a small
// grid of site links (About us, Writers, Pitch a story, Membership), an
// "Independent since 2018" note with a "Follow the margin" link, and a
// legal line.

// Design:
// - Grid `md:grid-cols-[1fr_1fr_1fr]`: brand, 2x2 link grid, follow block;
//   then a ruled copyright line
// - Light cream palette: background #f3eee5, ink #28221e, rust link
//   #a84f34, grey copy gray-600 (#4b5563) and gray-500 (#6b7280), divider
//   #d7cec0
// - Serif text-3xl wordmark; sm body text; xs legal line; rounded-lg
//   container, no form or icons except the arrow on the follow link
// - Single column below md; padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Links: `#about`, `#writers`, `#pitch`, `#membership`, `#instagram`;
//   "Terms · Privacy · Accessibility" is plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ThreeColumnPublicationFooter from '@/TestComponent/SectionDesigns/Sections/media/Footer03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ThreeColumnPublicationFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ThreeColumnPublicationFooter({
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
                'rounded-lg bg-[#f3eee5] p-7 text-[#28221e] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <p className="font-serif text-3xl">MARGIN</p>
                    <p className="mt-3 text-sm text-gray-600">
                        A publication for people who keep asking why.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <a href="#about">About us</a>
                    <a href="#writers">Writers</a>
                    <a href="#pitch">Pitch a story</a>
                    <a href="#membership">Membership</a>
                </div>
                <div className="text-sm">
                    <p>Independent since 2018</p>
                    <a
                        href="#instagram"
                        className="mt-3 inline-flex items-center gap-1 text-[#a84f34]"
                    >
                        Follow the margin <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#d7cec0] pt-4 text-xs text-gray-500">
                © Margin Journal · Terms · Privacy · Accessibility
            </p>
        </footer>
    )
}

export default ThreeColumnPublicationFooter
