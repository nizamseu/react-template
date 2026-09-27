// SyllabusPDFLeadMagnetCTA

// CTA03 · Learning Management & EdTech › Banner CTAs

// Description:
// White lead-capture banner offering a free download: "Download the 2026
// Creative Craft Syllabus & Reading List", an 80-page PDF of lectures, exercises
// and faculty reading lists. Visitors enter an email and press "Download
// 80-Page Guide".

// Design:
// - Single left-aligned block (max-w-2xl) with eyebrow, headline, copy and an
//   inline email form
// - Light palette: white background, #102d36 text, forest green #3c7e5d
//   eyebrow, focus ring and button (hover #102d36), gray-50 input, gray-200/300
//   borders, gray-600 copy
// - Mono 10px uppercase eyebrow with a download icon, serif text-3xl bold
//   headline; rounded-xl section with shadow-sm, rounded-full input and button
// - Form is flex-col below sm and a row from sm; padding p-8 -> sm:p-12

// What it does:
// - No content props, no state; the form's onSubmit only calls preventDefault, so no
//   email is sent and no PDF is downloaded; the input is uncontrolled and has
//   only a placeholder (no label)
// - No links; icons HiOutlineDocumentDownload and HiArrowRight are decorative

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SyllabusPDFLeadMagnetCTA from '@/TestComponent/SectionDesigns/Sections/learning/CTA03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SyllabusPDFLeadMagnetCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineDocumentDownload } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SyllabusPDFLeadMagnetCTA({
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
                'rounded-xl border border-gray-200 bg-white p-8 text-[#102d36] sm:p-12 shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#3c7e5d]">
                    <HiOutlineDocumentDownload className="text-sm" /> COMPLIMENTARY ACADEMIC DISPATCH
                </span>
                <h2 className="mt-3 font-serif text-3xl font-bold">
                    Download the 2026 Creative Craft Syllabus & Reading List
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    80 pages of curated lectures, typography exercises, shader math foundations, and our recommended reading list from 20+ visiting faculty members.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter email for instant PDF download..."
                        className="rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-xs text-[#102d36] outline-none focus:border-[#3c7e5d] flex-1"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3c7e5d] px-6 py-3 text-xs font-bold text-white hover:bg-[#102d36] transition-colors shrink-0"
                    >
                        <span>Download 80-Page Guide</span>
                        <HiArrowRight />
                    </button>
                </form>
            </div>
        </section>
    )
}

export default SyllabusPDFLeadMagnetCTA
