// OpinionColumnAuthorBylineCard

// Card05 · Blogs & Digital Media › Cards

// Description:
// An opinion-column card from the "MARGINALIA · CRITICAL OPINION" section.
// It shows the author (avatar, "Beatrice Vane", "Chief Design Critic ·
// Oxford"), the column title "Why Hyper-Optimized Software Made Contemporary
// Culture Monotonous", an excerpt, a pull quote, a response count and a
// "Read Column" link.

// Design:
// - Single `article`: meta row (ruled underneath), author row with avatar,
//   title and excerpt, then a ruled footer with pull quote and link
// - Light paper palette: background #f7f5f0, border and rules #ded8cb, ink
//   #1c1d1a, terracotta accent #a8472b (label, avatar ring, link), excerpt
//   #59554d
// - Serif text-xl bold title and italic serif pull quote; monospace 10-12px
//   labels; 48px round avatar with a 2px accent ring; rounded-xl card with
//   shadow-sm
// - No breakpoint classes: fluid width that fills its grid cell

// What it does:
// - Purely presentational: no content props, no state
// - "Read Column" link points to `#read-column`; "142 Responses" is static
//   text with a chat icon; avatar is a remote Unsplash photo

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OpinionColumnAuthorBylineCard from '@/TestComponent/SectionDesigns/Sections/media/Card05';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <OpinionColumnAuthorBylineCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function OpinionColumnAuthorBylineCard({
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
                'overflow-hidden rounded-xl border border-[#ded8cb] bg-[#f7f5f0] p-6 text-[#1c1d1a] shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-[#ded8cb] pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#a8472b] font-bold">
                    MARGINALIA &bull; CRITICAL OPINION
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-black/50">
                    <HiOutlineChatAlt2 /> 142 Responses
                </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <img
                    className="h-12 w-12 rounded-full object-cover border-2 border-[#a8472b]"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Author Beatrice Vane"
                />
                <div>
                    <h4 className="font-serif text-sm font-bold">Beatrice Vane</h4>
                    <p className="font-mono text-[10px] text-black/50">Chief Design Critic &bull; Oxford</p>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-xl font-bold leading-tight text-[#1c1d1a]">
                    Why Hyper-Optimized Software Made Contemporary Culture Monotonous
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#59554d]">
                    When algorithms optimize for frictionless consumption, they quietly eliminate the serendipitous weirdness that sparked the greatest cultural shifts of the 20th century.
                </p>

                <div className="mt-5 pt-3 border-t border-[#ded8cb] flex items-center justify-between text-xs">
                    <span className="font-serif italic text-black/60">&ldquo;Friction is where the soul resides.&rdquo;</span>
                    <a href="#read-column" className="font-bold text-[#a8472b] hover:underline">
                        Read Column &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default OpinionColumnAuthorBylineCard
