// CoverEssayDropCapArticleCard

// Card01 · Blogs & Digital Media › Cards

// Description:
// An editorial teaser card for the cover essay of issue no. 48, "The
// Architecture of Silence: In Praise of Tokyo's Third Places". It shows the
// read time, a bookmark button, a monospace byline, an excerpt opening with
// a large drop cap, topic tags and a "Read Full Essay" link.

// Design:
// - Single `article` stacked top to bottom: meta row (ruled underneath),
//   headline, byline, excerpt, then a ruled footer row with tags and link
// - Warm paper palette: background #f2efe9, border and rules #ded8cb, ink
//   #1c1d1a, terracotta accent #a8472b, byline #787163, excerpt #45423a
// - Serif text-2xl normal-weight headline; monospace 10-11px labels;
//   serif text-3xl bold drop cap floated left; rounded-xl, 1px border,
//   shadow-sm that becomes shadow-md on hover
// - No breakpoint classes: fluid width that fills its grid cell

// What it does:
// - Purely presentational: no content props, no state
// - Bookmark icon button (aria-label "Bookmark essay") has hover colour
//   only, no click handler; the headline changes colour on hover but is not
//   a link; "Read Full Essay" links to `#read`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CoverEssayDropCapArticleCard from '@/TestComponent/SectionDesigns/Sections/media/Card01';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <CoverEssayDropCapArticleCard />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineBookmark } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CoverEssayDropCapArticleCard({
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
                'overflow-hidden rounded-xl border border-[#ded8cb] bg-[#f2efe9] p-6 text-[#1c1d1a] shadow-sm hover:shadow-md transition-shadow',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#ded8cb] pb-3">
                <span className="font-bold text-[#a8472b] uppercase tracking-widest">
                    COVER ESSAY &bull; ISSUE NO. 48
                </span>
                <div className="flex items-center gap-3">
                    <span className="text-black/50">14 MIN READ</span>
                    <button aria-label="Bookmark essay" className="hover:text-[#a8472b] transition-colors">
                        <HiOutlineBookmark className="text-sm" />
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-2xl font-normal leading-tight hover:text-[#a8472b] transition-colors cursor-pointer">
                    The Architecture of Silence: In Praise of Tokyo’s Third Places
                </h3>
                <p className="mt-1 font-mono text-[11px] text-[#787163]">
                    BY DR. HARUKI TANAKA &bull; PHOTOGRAPHY BY TADAO SHIN
                </p>

                {/* Excerpt with drop cap styling */}
                <div className="mt-4 text-xs leading-relaxed text-[#45423a]">
                    <span className="float-left mr-2 font-serif text-3xl font-bold leading-none text-[#a8472b]">
                        W
                    </span>
                    hen the Yamanote train slows to a halt at 01:14 AM, the city sheds its metallic skin. What remains are the cedar-lined kissaten counters and five-seat jazz bars that shelter Tokyo’s late-night solitary thinkers.
                </div>

                <div className="mt-6 flex items-center justify-between pt-3 border-t border-[#ded8cb] text-xs">
                    <span className="font-mono text-[10px] text-black/50 uppercase">ANTHROPOLOGY &bull; CITIES</span>
                    <a href="#read" className="inline-flex items-center gap-1 font-bold text-[#a8472b] hover:underline">
                        <span>Read Full Essay</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default CoverEssayDropCapArticleCard
