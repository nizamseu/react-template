// CharcoalNewsletterLinkGridFooter

// Footer01 · Blogs & Digital Media › Footers

// Description:
// A dark site footer for Margin Journal. The tagline "Read widely. Think
// slowly." and heading "Good stories leave room to think." sit above an
// email sign-up for the weekly edition, next to a grid of six site links;
// a bottom bar carries the copyright and social/legal names.

// Design:
// - Two-column grid `lg:grid-cols-[1.2fr_.8fr]`: heading + form on the left,
//   a 2-column link grid on the right, then a ruled bottom bar
// - Charcoal palette: background #252721, cream text #f1eee6, salmon kicker
//   #d6a08a, links white/65, bottom bar white/40, rules white/35 and white/15
// - Serif text-4xl heading; bold xs uppercase kicker tracked at .2em;
//   underline-style email field (bottom border only, transparent input) with
//   an arrow icon button; rounded-lg container
// - Stacks into one column below lg; bottom bar wraps; padding p-7 → sm:p-10

// What it does:
// - Email form (aria-label "Email for the weekly edition") only calls
//   `preventDefault` on submit; nothing is sent or stored
// - Links: `#latest`, `#membership`, `#writers`, `#about`, `#podcast`,
//   `#contact`; "Instagram · Mastodon · Privacy · Terms" is plain text, not
//   links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CharcoalNewsletterLinkGridFooter from '@/TestComponent/SectionDesigns/Sections/media/Footer01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CharcoalNewsletterLinkGridFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CharcoalNewsletterLinkGridFooter({
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
                'rounded-lg bg-[#252721] p-7 text-[#f1eee6] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-9 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d6a08a]">
                        Read widely. Think slowly.
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        Good stories leave room to think.
                    </h2>
                    <form
                        className="mt-6 flex max-w-md border-b border-white/35"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            aria-label="Email for the weekly edition"
                            placeholder="Your email address"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                        />
                        <button aria-label="Subscribe" className="px-3">
                            <HiArrowRight />
                        </button>
                    </form>
                </div>
                <div className="grid grid-cols-2 gap-5 text-sm text-white/65">
                    <a href="#latest">Latest stories</a>
                    <a href="#membership">Membership</a>
                    <a href="#writers">Our writers</a>
                    <a href="#about">About Margin</a>
                    <a href="#podcast">Listen in</a>
                    <a href="#contact">Contact the desk</a>
                </div>
            </div>
            <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/40">
                <span>© 2026 Margin Journal</span>
                <span>Instagram · Mastodon · Privacy · Terms</span>
            </div>
        </footer>
    )
}

export default CharcoalNewsletterLinkGridFooter
