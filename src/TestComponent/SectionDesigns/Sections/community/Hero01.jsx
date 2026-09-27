// BetterTogetherPhotoSplitHero

// Hero01 · Social Networks & Communities › Hero sections

// Description:
// A warm, peach-toned landing hero for a people-first community, pairing the headline
// "Better things happen together." with a lifestyle photo of friends. Visitors read a short
// welcome pitch, can click "Meet your people", and see a floating "12,400 neighbors online"
// badge over the image.

// Design:
// - Two-column grid (md:grid-cols-[.95fr_1.05fr], min-h-[410px]): text column on the left
//   (eyebrow, headline block and tagline spread with justify-between), full-bleed cover photo right
// - Palette: peach background #ffccad, dark brown text #27201d, dark pill button #27201d with
//   white label; the badge reuses #ffccad on top of the photo; light and warm overall
// - Typography & shapes: uppercase bold eyebrow (text-xs, tracking .14em), font-black headline
//   text-5xl → sm:text-7xl with .95 leading, text-sm body; rounded-lg section, rounded-full button/badge
// - Responsive: single column below md with the photo stacked underneath (min-h-64);
//   padding grows from p-7 to sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Meet your people" → #communities (HiArrowRight icon); Unsplash photo with
//   descriptive alt text; closing line "Be curious. Be kind. Be here."

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BetterTogetherPhotoSplitHero from '@/TestComponent/SectionDesigns/Sections/community/Hero01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <BetterTogetherPhotoSplitHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BetterTogetherPhotoSplitHero({
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
                'overflow-hidden rounded-lg bg-[#ffccad] text-[#27201d]',
                className,
            )}
            {...props}
        >
            <div className="grid min-h-[410px] md:grid-cols-[.95fr_1.05fr]">
                <div className="flex flex-col justify-between p-7 sm:p-11">
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        A place for your people
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-lg text-5xl font-black leading-[.95] sm:text-7xl">
                            Better things happen together.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-6">
                            Find your corner, meet generous minds, and keep the
                            conversation going.
                        </p>
                        <a
                            href="#communities"
                            className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#27201d] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Meet your people <HiArrowRight />
                        </a>
                    </div>
                    <p className="text-xs">Be curious. Be kind. Be here.</p>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=85"
                        alt="Friends sharing a relaxed afternoon together"
                    />
                    <span className="absolute bottom-4 right-4 rounded-full bg-[#ffccad] px-4 py-2 text-xs font-bold">
                        12,400 neighbors online
                    </span>
                </div>
            </div>
        </section>
    )
}

export default BetterTogetherPhotoSplitHero
