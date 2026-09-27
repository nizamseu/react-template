// OpenCurriculumSageFooter

// Footer03 · Learning Management & EdTech › Footers

// Description:
// Soft sage footer for "Fieldnote / Open curriculum" with the heading
// "Knowledge grows when it gets shared." and a note about free guides and
// exercises, beside a 2x2 link grid (Open lessons, Accessibility, For educators,
// Open license) and the line "© 2026 Fieldnote · Learning belongs to everyone."

// Design:
// - Grid `md:grid-cols-[1.1fr_.9fr]` (intro | links) plus a border-t legal row
// - Light palette: sage #e3ebdd background, #102d36 text, forest green #3c7e5d
//   eyebrow, #c5d3c5 divider, gray-500/600 secondary text
// - xs bold uppercase eyebrow (.14em tracking), sans text-4xl semibold heading
//   (not serif), sm links; rounded-lg footer
// - Columns stack below md; padding p-7 -> sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: #open (with inline HiArrowRight), #access, #teachers, #license

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OpenCurriculumSageFooter from '@/TestComponent/SectionDesigns/Sections/learning/Footer03';

// const SiteLayout = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <OpenCurriculumSageFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function OpenCurriculumSageFooter({
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
                'rounded-lg bg-[#e3ebdd] p-7 text-[#102d36] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3c7e5d]">
                        Fieldnote / Open curriculum
                    </p>
                    <h2 className="mt-3 max-w-md text-4xl font-semibold">
                        Knowledge grows when it gets shared.
                    </h2>
                    <p className="mt-3 text-sm text-gray-600">
                        Explore free guides and exercises for every curious
                        mind.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <a href="#open">
                        Open lessons <HiArrowRight className="inline" />
                    </a>
                    <a href="#access">Accessibility</a>
                    <a href="#teachers">For educators</a>
                    <a href="#license">Open license</a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#c5d3c5] pt-4 text-xs text-gray-500">
                © 2026 Fieldnote · Learning belongs to everyone.
            </p>
        </footer>
    )
}

export default OpenCurriculumSageFooter
