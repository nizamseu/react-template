// MorningDispatchNewsletterCTA

// CTA03 · Blogs & Digital Media › Banner CTAs

// Description:
// A clean newsletter sign-up banner for "THE 7:00 AM MORNING DISPATCH". The
// headline "Three Remarkable Essays Delivered to Your Inbox Every Sunrise"
// promises curated long-form reading with no news-cycle outrage ("Read by
// 85,000 thinkers daily"), followed by an email field and "Subscribe Free".

// Design:
// - Single left-aligned column (max-w-2xl): mail-icon kicker, headline,
//   copy, then an inline email form
// - Light palette: white banner, black text (copy black/70), terracotta
//   accent #a8472b (kicker, input focus border, button hover), input bg
//   neutral-50 (#fafafa), ink button #1c1d1a
// - Serif text-3xl → sm:text-4xl normal-weight headline; monospace 10px
//   kicker; rounded-full input and button; rounded-xl banner with a
//   black/15 border and shadow-sm
// - Input and button stack below sm and sit in one row from sm; padding
//   p-8 → sm:p-12

// What it does:
// - Email form only calls `preventDefault` on submit; nothing is sent or
//   stored (the input has a placeholder but no label or aria-label)
// - No content props, no state, no links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MorningDispatchNewsletterCTA from '@/TestComponent/SectionDesigns/Sections/media/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MorningDispatchNewsletterCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineMail } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MorningDispatchNewsletterCTA({
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
                'rounded-xl border border-black/15 bg-white p-8 text-black sm:p-12 shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#a8472b]">
                    <HiOutlineMail className="text-sm" /> THE 7:00 AM MORNING DISPATCH
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                    Three Remarkable Essays Delivered to Your Inbox Every Sunrise
                </h2>
                <p className="mt-2 text-sm text-black/70 leading-relaxed">
                    Zero news cycle outrage. Just three longform reflections on architecture, philosophy, and cultural anthropology curated by our editors. Read by 85,000 thinkers daily.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter email for morning dispatch..."
                        className="rounded-full border border-black/20 bg-neutral-50 px-5 py-3 text-xs text-black outline-none focus:border-[#a8472b] flex-1"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1d1a] px-6 py-3 font-serif text-xs font-bold text-white hover:bg-[#a8472b] transition-colors shrink-0"
                    >
                        <span>Subscribe Free</span>
                        <HiArrowRight />
                    </button>
                </form>
            </div>
        </section>
    )
}

export default MorningDispatchNewsletterCTA
