// OpenDirectoryAPICTA

// CTA04 · Directories & Search Aggregators › Banner CTAs

// Description:
// Dark developer-facing banner for the "Open Directory API · REST & GraphQL":
// "Access 4,820 Independent Place Records Programmatically". It lists the data
// on offer (coordinates, noise ratings, opening status, scout critiques) and
// offers free rate-limited keys via a "Request Free API Key" button.

// Design:
// - Flex column → md:flex-row (md:items-center, justify-between): copy
//   (max-w-xl) left, button right
// - Dark #182622 background, white text (white/70 body), border-white/10,
//   lime #d9f064 eyebrow and button with #14201e text (hover white)
// - Section set in font-mono with heading and body switched to font-sans;
//   heading text-3xl bold; code icon in the eyebrow; rounded-xl section with
//   shadow-2xl, small-radius (rounded) button
// - The button sits under the copy until md; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - "Request Free API Key" links to #request-api

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OpenDirectoryAPICTA from '@/TestComponent/SectionDesigns/Sections/directory/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <OpenDirectoryAPICTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineCode } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function OpenDirectoryAPICTA({
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
                'rounded-xl border border-white/10 bg-[#182622] p-8 text-white sm:p-12 shadow-2xl font-mono',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#d9f064] font-bold">
                        <HiOutlineCode className="text-base" /> OPEN DIRECTORY API &bull; REST & GRAPHQL
                    </span>
                    <h2 className="mt-2 font-sans text-3xl font-bold leading-tight text-white">
                        Access 4,820 Independent Place Records Programmatically
                    </h2>
                    <p className="mt-2 font-sans text-sm text-white/70">
                        Query geolocation coordinates, acoustic noise ratings, opening status, and verified scout critiques. Free rate-limited API keys for indie app developers and civic cartographers.
                    </p>
                </div>

                <a
                    href="#request-api"
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#d9f064] px-6 py-3.5 text-xs font-bold text-[#14201e] hover:bg-white transition-colors shrink-0"
                >
                    <span>Request Free API Key</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default OpenDirectoryAPICTA
