// ResponsibleBusinessFooter

// Footer05 · Corporate & Business › Footers

// Description:
// Light footer themed around corporate responsibility: the eyebrow "Responsibility / In
// practice", the headline "Progress should be good for more than the bottom line.", a
// "Read our impact report" link, a 2x2 link grid (Governance, People, Climate,
// Communities) and the sign-off "© Northstar · Responsible business, in practice.".

// Design:
// - Grid md:grid-cols-[1fr_auto] gap-7 (message | links aligned to the bottom with
//   self-end) above a copyright row with a top border
// - Off-white #f5f7f9 background with #cbd5df border and divider, ink #182434 text, blue
//   #3476c5 eyebrow, gray-500 legal line - light feel
// - Headline text-3xl font-semibold max-w-xl; links text-xs in a grid-cols-2 gap-x-8
//   gap-y-3; rounded-lg footer
// - Below md the link grid stacks under the message; padding p-7 -> sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: #impact (with HiArrowRight), #governance, #people, #climate, #communities

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ResponsibleBusinessFooter from '@/TestComponent/SectionDesigns/Sections/corporate/Footer05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ResponsibleBusinessFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ResponsibleBusinessFooter({
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
                'rounded-lg border border-[#cbd5df] bg-[#f5f7f9] p-7 text-[#182434] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-7 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3476c5]">
                        Responsibility / In practice
                    </p>
                    <h2 className="mt-3 max-w-xl text-3xl font-semibold">
                        Progress should be good for more than the bottom line.
                    </h2>
                    <a
                        href="#impact"
                        className="mt-4 inline-flex items-center gap-1 text-sm"
                    >
                        Read our impact report <HiArrowRight />
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 self-end text-xs">
                    <a href="#governance">Governance</a>
                    <a href="#people">People</a>
                    <a href="#climate">Climate</a>
                    <a href="#communities">Communities</a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#cbd5df] pt-4 text-xs text-gray-500">
                © Northstar · Responsible business, in practice.
            </p>
        </footer>
    )
}

export default ResponsibleBusinessFooter
