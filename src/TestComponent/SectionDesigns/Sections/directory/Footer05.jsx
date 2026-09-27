// LocalNoteMinimalFooter

// Footer05 · Directories & Search Aggregators › Footers

// Description:
// Light, bordered footer framed as "A useful local note": "Find the new place
// everyone is talking about." with a line about openings, community picks and
// local guides, a compact 2×2 nav (Nearby, Local guides, Events, Suggest a
// listing) and the line "© Good Neighbor Index 2026.".

// Design:
// - Grid md:grid-cols-[1fr_auto] (gap-7): text left, nav right (self-end),
//   then a border-t copyright row
// - White background with a #d4ddd1 border, #1a2826 text, #527354 eyebrow,
//   gray-500 body and legal text, #e8ede7 divider; clean light feel
// - Eyebrow text-xs bold uppercase tracking-[.14em]; heading text-3xl
//   font-black; nav links text-xs; rounded-lg footer with fixed p-7 padding
// - Below md the nav drops under the text block

// What it does:
// - Purely presentational: no content props, no state
// - Links: Nearby → #nearby, Local guides → #guides (inline arrow icon),
//   Events → #events, Suggest a listing → #suggest

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LocalNoteMinimalFooter from '@/TestComponent/SectionDesigns/Sections/directory/Footer05';

// const AppShell = ({ children }) => (
//     <>
//         <main className="space-y-6">{children}</main>
//         <LocalNoteMinimalFooter />
//     </>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LocalNoteMinimalFooter({
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
                'rounded-lg border border-[#d4ddd1] bg-white p-7 text-[#1a2826]',
                className,
            )}
            {...props}
        >
            <div className="grid gap-7 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#527354]">
                        A useful local note
                    </p>
                    <h2 className="mt-2 text-3xl font-black">
                        Find the new place everyone is talking about.
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Neighborhood openings, community picks, and practical
                        local guides.
                    </p>
                </div>
                <nav className="grid grid-cols-2 gap-3 self-end text-xs">
                    <a href="#nearby">Nearby</a>
                    <a href="#guides">
                        Local guides <HiArrowRight className="inline" />
                    </a>
                    <a href="#events">Events</a>
                    <a href="#suggest">Suggest a listing</a>
                </nav>
            </div>
            <p className="mt-8 border-t border-[#e8ede7] pt-4 text-xs text-gray-500">
                © Good Neighbor Index 2026.
            </p>
        </footer>
    )
}

export default LocalNoteMinimalFooter
