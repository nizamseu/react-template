// ThreeColumnBrandFooter

// Footer03 · Directories & Search Aggregators › Footers

// Description:
// Classic dark site footer for the Good Neighbor Index: brand name with the
// tagline "A local directory that puts people before placements.", a 2×2 grid
// of site links, a "Stay local" Instagram link and a copyright line ("Local
// discovery, done thoughtfully.").

// Design:
// - Grid md:grid-cols-[1fr_1fr_1fr] (gap-8): brand / links / social, then a
//   border-t copyright row
// - Deep green #1a2826 background, white text (white/55–60 body, white/40
//   legal), lime #d9f064 "Stay local" label, white/15 divider
// - Brand text-sm font-black uppercase; links text-sm; label text-xs bold
//   uppercase; rounded-lg footer
// - Columns stack below md; padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Links: brand → #home, Categories → #categories, For owners → #owners,
//   Recommend → #recommend, Trust & safety → #trust, Instagram → #instagram

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ThreeColumnBrandFooter from '@/TestComponent/SectionDesigns/Sections/directory/Footer03';

// const AppShell = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <ThreeColumnBrandFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ThreeColumnBrandFooter({
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
                'rounded-lg bg-[#1a2826] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="text-sm font-black uppercase">
                        Good Neighbor Index
                    </a>
                    <p className="mt-3 text-sm text-white/55">
                        A local directory that puts people before placements.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                    <a href="#categories">Categories</a>
                    <a href="#owners">For owners</a>
                    <a href="#recommend">Recommend</a>
                    <a href="#trust">Trust & safety</a>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase text-[#d9f064]">
                        Stay local
                    </p>
                    <a
                        href="#instagram"
                        className="mt-3 inline-flex items-center gap-1 text-sm"
                    >
                        Instagram <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © Good Neighbor · Local discovery, done thoughtfully.
            </p>
        </footer>
    )
}

export default ThreeColumnBrandFooter
