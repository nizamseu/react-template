// FieldNotesDispatchTextHero

// Hero03 · Blogs & Digital Media › Hero sections

// Description:
// A text-only section opener for the "MARGIN / FIELD NOTES" series. It
// shows the headline "Take the long way around.", a one-line description of
// the dispatches, an underlined "Read the dispatches" link and a closing
// topic line "PEOPLE / PLACES / SMALL OBSERVATIONS".

// Design:
// - Flex row that stacks by default: headline block on the left, short
//   description and link (max-w-sm) bottom-aligned on the right, then a full
//   width ruled footer line; no imagery
// - Sand palette: background #e7d9c7, ink #28221e, rust accent #a84f34
//   (kicker, link underline), divider #c4ae98
// - Serif headline text-5xl → sm:text-7xl, leading-[.94]; bold xs uppercase
//   tracked kicker; link styled as a bottom border rather than a button;
//   rounded-lg container
// - Column layout on mobile, switches to `md:flex-row md:items-end`;
//   padding p-7 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single text link "Read the dispatches" to `#dispatches` with arrow icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import FieldNotesDispatchTextHero from '@/TestComponent/SectionDesigns/Sections/media/Hero03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <FieldNotesDispatchTextHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function FieldNotesDispatchTextHero({
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
                'rounded-lg bg-[#e7d9c7] p-7 text-[#28221e] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a84f34]">
                        MARGIN / FIELD NOTES
                    </p>
                    <h2 className="mt-4 max-w-3xl font-serif text-5xl leading-[.94] sm:text-7xl">
                        Take the long way around.
                    </h2>
                </div>
                <div className="max-w-sm">
                    <p className="text-sm leading-6">
                        Dispatches from people following a question further than
                        expected.
                    </p>
                    <a
                        href="#dispatches"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#a84f34] pb-2 text-sm font-semibold"
                    >
                        Read the dispatches <HiArrowRight />
                    </a>
                </div>
            </div>
            <div className="mt-9 border-t border-[#c4ae98] pt-4 text-xs">
                PEOPLE / PLACES / SMALL OBSERVATIONS
            </div>
        </section>
    )
}

export default FieldNotesDispatchTextHero
