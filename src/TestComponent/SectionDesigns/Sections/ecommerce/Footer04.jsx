// GoodformShopNoteNewsletterFooter

// Footer04 · E-commerce & Marketplaces › Footers

// Description:
// Warm newsletter footer "A note from the shop" for Goodform: the serif headline "Good
// things, and the people who make them.", an underline email signup, a "Visit" address
// (12 Market Lane, Copenhagen, DK), "Follow along" links (Instagram ↗, Pinterest ↗) and a
// legal line "© 2026 Goodform · Terms · Privacy · Made thoughtfully".

// Design:
// - Grid lg:grid-cols-[1.2fr_.8fr]: headline + form left, a 2-column info grid right;
//   legal line separated by border-t black/10.
// - #f3eee6 background, #1c1b19 text, #8a8174 form underline, gray-600 / gray-500 muted.
//   Dark mode: #26231f background, white text, gray-300 secondary text.
// - Serif headline text-4xl leading-tight; eyebrow text-xs bold uppercase tracking-[.16em];
//   underline-only email field (max-w-md) with arrow button; rounded-lg shell.
// - Stacks below lg; padding p-7 → sm:p-10.

// What it does:
// - Email form (input aria-label "Email for the newsletter", button aria-label "Join
//   newsletter"); onSubmit only calls e.preventDefault(), so nothing is sent. No content props,
//   no state.
// - Anchors #instagram and #pinterest; the legal line is plain text.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GoodformShopNoteNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/ecommerce/Footer04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <GoodformShopNoteNewsletterFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GoodformShopNoteNewsletterFooter({
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
                'rounded-lg bg-[#f3eee6] p-7 text-[#1c1b19] dark:bg-[#26231f] dark:text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                    <span className="text-xs font-bold uppercase tracking-[.16em]">
                        A note from the shop
                    </span>
                    <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight">
                        Good things, and the people who make them.
                    </h2>
                    <form
                        className="mt-6 flex max-w-md border-b border-[#8a8174]"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            aria-label="Email for the newsletter"
                            placeholder="Your email"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                        />
                        <button aria-label="Join newsletter" className="px-3">
                            <HiArrowRight />
                        </button>
                    </form>
                </div>
                <div className="grid grid-cols-2 gap-5 text-sm">
                    <div>
                        <p className="font-semibold">Visit</p>
                        <p className="mt-3 text-gray-600 dark:text-gray-300">
                            12 Market Lane
                            <br />
                            Copenhagen, DK
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">Follow along</p>
                        <a
                            href="#instagram"
                            className="mt-3 block text-gray-600 dark:text-gray-300"
                        >
                            Instagram ↗
                        </a>
                        <a
                            href="#pinterest"
                            className="mt-2 block text-gray-600 dark:text-gray-300"
                        >
                            Pinterest ↗
                        </a>
                    </div>
                </div>
            </div>
            <p className="mt-9 border-t border-black/10 pt-4 text-xs text-gray-500">
                © 2026 Goodform · Terms · Privacy · Made thoughtfully
            </p>
        </footer>
    )
}

export default GoodformShopNoteNewsletterFooter
