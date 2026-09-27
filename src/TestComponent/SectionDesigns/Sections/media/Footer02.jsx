// SundayLetterSignUpFooter

// Footer02 · Blogs & Digital Media › Footers

// Description:
// A sand-coloured footer built around the Sunday newsletter: "The Sunday
// edition" kicker and the heading "One letter. A few good stories." sit
// beside an email field, with a bottom row of links (Latest, Archive,
// Membership, Contact) and the Margin Journal copyright.

// Design:
// - Two-column grid `md:grid-cols-[1fr_.8fr]` (heading left, form right,
//   bottom-aligned), then a ruled link row
// - Sand palette: background #e7d9c7, ink #28221e, rust kicker #a84f34,
//   field underline #a99a85, divider #c4b39d
// - Serif text-4xl heading; bold xs uppercase kicker; underline-style email
//   field with an arrow icon button; xs bottom links; rounded-lg container
// - Stacks below md; the bottom row wraps and the copyright is pushed right
//   with ml-auto; padding p-7 → sm:p-10

// What it does:
// - Email form with a screen-reader-only label ("Email address",
//   id `margin-sunday`) only calls `preventDefault` on submit; nothing is
//   sent or stored
// - Links: `#latest`, `#archive`, `#membership`, `#contact`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SundayLetterSignUpFooter from '@/TestComponent/SectionDesigns/Sections/media/Footer02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SundayLetterSignUpFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SundayLetterSignUpFooter({
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
                'rounded-lg bg-[#e7d9c7] p-7 text-[#28221e] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a84f34]">
                        The Sunday edition
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        One letter. A few good stories.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-[#a99a85]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="margin-sunday">
                        Email address
                    </label>
                    <input
                        id="margin-sunday"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#c4b39d] pt-4 text-xs">
                <a href="#latest">Latest</a>
                <a href="#archive">Archive</a>
                <a href="#membership">Membership</a>
                <a href="#contact">Contact</a>
                <span className="ml-auto">© Margin Journal</span>
            </div>
        </footer>
    )
}

export default SundayLetterSignUpFooter
