// ProductNotesNewsletterFooter

// Footer04 · SaaS Platforms › Footers

// Description:
// A dark footer built around a newsletter sign-up. It has the eyebrow "Northstar /
// Product notes", the headline "Only the updates worth opening.", an underlined
// work-email field with an arrow submit button, a small resource nav (Customer
// stories, Guides, Events, Newsletter archive) and "© Northstar Inc. · Privacy ·
// Security · Status".

// Design:
// - <footer> grid `lg:grid-cols-[1fr_1fr_1fr]` (heading | form | nav), with a
//   copyright line underneath.
// - Dark base #111a22 with a mint #65e6b4 eyebrow and submit arrow, a white/30
//   input underline, white/60 nav links and white/40 copyright text.
// - Typography: xs bold uppercase eyebrow with tracking-[.14em] and a text-3xl
//   semibold headline. The input is transparent and borderless apart from the
//   form's border-b. The footer is rounded-lg, with padding p-7 -> sm:p-10.
// - Responsive: the three blocks stack below lg. The nav grid stays 2 columns.

// What it does:
// - The <form> onSubmit only calls e.preventDefault(). There is no state, and the
//   email is not stored or sent anywhere.
// - The email input (id "saas-news") has an sr-only "Work email" label. The submit
//   button has aria-label "Subscribe" and a HiArrowRight icon. Links: `#customers`,
//   `#guides`, `#events`, `#newsletter`.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ProductNotesNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/saas/Footer04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ProductNotesNewsletterFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ProductNotesNewsletterFooter({
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
                'rounded-lg bg-[#111a22] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#65e6b4]">
                        Northstar / Product notes
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold">
                        Only the updates worth opening.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-white/30"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="saas-news">
                        Work email
                    </label>
                    <input
                        id="saas-news"
                        type="email"
                        placeholder="Work email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button
                        aria-label="Subscribe"
                        className="px-3 text-[#65e6b4]"
                    >
                        <HiArrowRight />
                    </button>
                </form>
                <nav className="grid grid-cols-2 gap-3 text-xs text-white/60">
                    <a href="#customers">Customer stories</a>
                    <a href="#guides">Guides</a>
                    <a href="#events">Events</a>
                    <a href="#newsletter">Newsletter archive</a>
                </nav>
            </div>
            <p className="mt-8 text-xs text-white/40">
                © Northstar Inc. · Privacy · Security · Status
            </p>
        </footer>
    )
}

export default ProductNotesNewsletterFooter
