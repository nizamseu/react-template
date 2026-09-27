// RecommendABusinessSageFooter

// Footer04 · Directories & Search Aggregators › Footers

// Description:
// Minimal sage footer that closes the page with a single community ask: "Know
// a place people should know?" / "Pass along a good recommendation." and a
// "Recommend a business" button, followed by the Good Neighbor copyright line
// ("Built with local knowledge."). It has no link columns.

// Design:
// - Flex column → md:flex-row (justify-between, md:items-end): heading block
//   and button, then a border-t copyright row
// - Pale sage #edf1e6 background, #1a2826 text, #527354 eyebrow, #d4ddd1
//   divider, gray-500 legal text; dark #1a2826 pill with white text
// - Eyebrow text-xs bold uppercase tracking-[.14em]; heading text-4xl
//   font-black; rounded-lg footer, rounded-full button
// - Heading and button sit side by side from md and stack below it; padding
//   p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - "Recommend a business" links to #recommend

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RecommendABusinessSageFooter from '@/TestComponent/SectionDesigns/Sections/directory/Footer04';

// const AppShell = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <RecommendABusinessSageFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function RecommendABusinessSageFooter({
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
                'rounded-lg bg-[#edf1e6] p-7 text-[#1a2826] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#527354]">
                        Know a place people should know?
                    </p>
                    <h2 className="mt-3 max-w-xl text-4xl font-black">
                        Pass along a good recommendation.
                    </h2>
                </div>
                <a
                    href="#recommend"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1a2826] px-5 py-3 text-sm text-white"
                >
                    Recommend a business <HiArrowRight />
                </a>
            </div>
            <p className="mt-8 border-t border-[#d4ddd1] pt-4 text-xs text-gray-500">
                © Good Neighbor · Built with local knowledge.
            </p>
        </footer>
    )
}

export default RecommendABusinessSageFooter
