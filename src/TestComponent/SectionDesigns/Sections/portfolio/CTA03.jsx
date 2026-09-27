// SpeakingCalendarKeynoteBookingCTA

// CTA03 · Portfolios & Personal Websites › Banner CTAs

// Description:
// Light banner for booking the designer as a speaker. A microphone label
// "2026/2027 SPEAKING CALENDAR" introduces "Keynotes on Spatial Aesthetics &
// Design Systems" and lists formats and festivals (Awwwards Conf, OFFF
// Barcelona, FITC Tokyo), with a "Check Speaker Availability" button.

// Design:
// - Grid lg:grid-cols-[1.3fr_0.7fr] (gap-8, items-center): copy on the left,
//   button and "Represented globally by Atelier Speakers" note on the right.
// - Light palette: paper #f9f7f4 background, border #ded8cf, text #241d1a,
//   coral #ef6a4b label and button hover, muted #736a61, button #241d1a with
//   white text.
// - Headline font-serif text-3xl → sm:text-4xl regular weight; mono 10px label
//   (tracking-[.25em]) and 11px note; rounded-xl banner, rounded-full button.
// - Single column until lg; padding p-8 → sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One in-page anchor "Check Speaker Availability" → #book-speaking
//   (HiOutlineMicrophone and HiArrowRight icons).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SpeakingCalendarKeynoteBookingCTA from '@/TestComponent/SectionDesigns/Sections/portfolio/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SpeakingCalendarKeynoteBookingCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineMicrophone } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SpeakingCalendarKeynoteBookingCTA({
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
                'rounded-xl border border-[#ded8cf] bg-[#f9f7f4] p-8 text-[#241d1a] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#ef6a4b]">
                        <HiOutlineMicrophone className="text-sm" /> 2026/2027 SPEAKING CALENDAR
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                        Keynotes on Spatial Aesthetics & Design Systems
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#736a61]">
                        Booking keynote lectures, university masterclasses, and jury panels for international design festivals including Awwwards Conf, OFFF Barcelona, and FITC Tokyo.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#book-speaking"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#241d1a] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#ef6a4b] transition-colors"
                    >
                        <span>Check Speaker Availability</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-[#736a61] text-center">
                        Represented globally by Atelier Speakers
                    </span>
                </div>
            </div>
        </section>
    )
}

export default SpeakingCalendarKeynoteBookingCTA
