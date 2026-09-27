// LimeWeeklyIdeaNewsletterFooter

// Footer02 · Learning Management & EdTech › Footers

// Description:
// Bright lime footer led by a newsletter pitch: the eyebrow "One useful idea a
// week" and the serif heading "Keep a little room for learning." sit beside an
// underline-style email signup, followed by a link row (Courses, Teachers,
// Scholarships, Help) and "© Fieldnote Learning".

// Design:
// - Grid `md:grid-cols-[1fr_1fr]` (heading | form), then a flex-wrap bottom row
//   with the copyright pushed right via ml-auto
// - Light palette: lime #c8ef70 background, #102d36 text, olive #71873e form
//   underline, #a2bf58 divider
// - xs bold uppercase eyebrow (.15em tracking), serif text-4xl heading, xs link
//   row; underline-only transparent input; rounded-lg footer
// - Columns stack below md; link row wraps; padding p-7 -> sm:p-10

// What it does:
// - No content props, no state; the form's onSubmit only calls preventDefault (nothing
//   is sent); sr-only label for #weekly-learn, icon-only submit button with
//   aria-label="Subscribe"
// - Anchors: #courses, #teachers, #scholarships, #help

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LimeWeeklyIdeaNewsletterFooter from '@/TestComponent/SectionDesigns/Sections/learning/Footer02';

// const SiteLayout = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <LimeWeeklyIdeaNewsletterFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LimeWeeklyIdeaNewsletterFooter({
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
                'rounded-lg bg-[#c8ef70] p-7 text-[#102d36] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em]">
                        One useful idea a week
                    </p>
                    <h2 className="mt-3 max-w-md font-serif text-4xl">
                        Keep a little room for learning.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-[#71873e]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="weekly-learn">
                        Email
                    </label>
                    <input
                        id="weekly-learn"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#a2bf58] pt-4 text-xs">
                <a href="#courses">Courses</a>
                <a href="#teachers">Teachers</a>
                <a href="#scholarships">Scholarships</a>
                <a href="#help">Help</a>
                <span className="ml-auto">© Fieldnote Learning</span>
            </div>
        </footer>
    )
}

export default LimeWeeklyIdeaNewsletterFooter
