// DesignStudioProfileCard

// Card02 · Directories & Search Aggregators › Cards

// Description:
// Light, image-free profile card for an agency listing: "Studio Dumbar / DEPT"
// in Rotterdam, tagged as an independent design studio with 35 specialists.
// Shows a capability blurb, hashtag skill chips, an hourly rate range
// ($180–$250/hr) and a "View Studio Portfolio" link.

// Design:
// - Stacked card: header row (category label + specialist count), location,
//   title, blurb, wrapped tag chips, border-t footer row (rate + link)
// - Pale #f5f8f5 surface, #1a2826 text, green #527354 accents (label, badge on
//   #527354/10, link), gray-200 borders, gray-500/600 secondary text
// - rounded-xl card with border and shadow-sm; title text-xl bold; label,
//   chips and rate in font-mono (10px / xs); chips are white bordered boxes
// - No breakpoints: fills its grid cell; tag chips wrap (flex-wrap)

// What it does:
// - Purely presentational: no content props, no state; tags are hard-coded spans
// - "View Studio Portfolio" links to #studio-profile

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DesignStudioProfileCard from '@/TestComponent/SectionDesigns/Sections/directory/Card02';

// const ListingGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <DesignStudioProfileCard />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineLocationMarker } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DesignStudioProfileCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-xl border border-gray-200 bg-[#f5f8f5] p-5 text-[#1a2826] shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#527354] font-bold">
                    INDEPENDENT DESIGN STUDIO
                </span>
                <span className="rounded bg-[#527354]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#527354]">
                    35 SPECIALISTS
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <HiOutlineLocationMarker className="text-[#527354]" />
                    <span>Rotterdam, Netherlands</span>
                </div>

                <h3 className="mt-1 font-bold text-xl leading-tight">
                    Studio Dumbar / DEPT
                </h3>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                    Pioneering international design agency specializing in kinetic identity, generative code, and large-scale public cultural institutions.
                </p>

                {/* Capabilities tags */}
                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px]">
                    <span className="rounded bg-white px-2 py-1 border border-gray-200">#KineticIdentity</span>
                    <span className="rounded bg-white px-2 py-1 border border-gray-200">#CreativeCoding</span>
                    <span className="rounded bg-white px-2 py-1 border border-gray-200">#CustomTypography</span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="font-mono text-gray-500">Rates: $180–$250/hr</span>
                    <a
                        href="#studio-profile"
                        className="inline-flex items-center gap-1 font-bold text-[#527354] hover:underline"
                    >
                        <span>View Studio Portfolio</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default DesignStudioProfileCard
