// EnterpriseTeamResidencyCTA

// CTA02 · Learning Management & EdTech › Banner CTAs

// Description:
// Cream B2B banner selling an "ENTERPRISE RESIDENCY FOR DESIGN & TECH TEAMS".
// The headline "Transform Your Product Organization's Craft Standard" and copy
// about custom 4-to-8 week private studios sit beside a "Request Custom
// Enterprise Syllabus" button and a minimum cohort size note (6 people).

// Design:
// - Grid: one column, `lg:grid-cols-[1.3fr_0.7fr]` from lg (copy | CTA stack),
//   items-center
// - Light palette: cream #f5f1e8 background, #102d36 text and button (hover
//   #3c7e5d), forest green #3c7e5d eyebrow, gray-200 border, gray-500 note
// - Mono 10px uppercase eyebrow (.25em tracking), serif text-3xl -> sm:text-4xl
//   bold headline; rounded-xl section, rounded-full button
// - Stacks below lg (CTA under the copy); padding p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor "Request Custom Enterprise Syllabus" -> #enterprise-quote
//   (HiArrowRight)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import EnterpriseTeamResidencyCTA from '@/TestComponent/SectionDesigns/Sections/learning/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <EnterpriseTeamResidencyCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function EnterpriseTeamResidencyCTA({
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
                'rounded-xl border border-gray-200 bg-[#f5f1e8] p-8 text-[#102d36] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#3c7e5d]">
                        ENTERPRISE RESIDENCY FOR DESIGN & TECH TEAMS
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                        Transform Your Product Organization’s Craft Standard
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#102d36]/70">
                        Custom 4-to-8 week private studios for product design, engineering, and design operations teams at Stripe, Figma, and Airbnb.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#enterprise-quote"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102d36] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#3c7e5d] transition-colors"
                    >
                        <span>Request Custom Enterprise Syllabus</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-gray-500 text-center">
                        Minimum cohort size: 6 engineers/designers
                    </span>
                </div>
            </div>
        </section>
    )
}

export default EnterpriseTeamResidencyCTA
