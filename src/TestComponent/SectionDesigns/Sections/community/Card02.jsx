// SolvedQAThreadCard

// Card02 · Social Networks & Communities › Cards

// Description:
// A light forum/Q&A card showing a community-solved question: "How do you prevent hydration
// mismatch when rendering user client timestamps in React 19?" It credits the answer to @kai_dev
// (Staff Engineer, 4,820 karma), shows 38 upvotes and a "SOLVED BY COMMUNITY" badge, previews the
// code solution and links to the thread's 14 comments.

// Design:
// - Stacked card: header row (solved badge + upvote count), question title and author line, a dark
//   code-preview block, then a footer row with tags and a comments link
// - Palette: off-white #fcf8f5 card, beige #ebded7 border and dividers, dark brown #2c1d18 text,
//   rust #a34c38 accents, emerald-100 / emerald-800 solved badge; the code block uses #241c19 with
//   #f7e6de text and pink-400 / amber-300 syntax colours; a light card with a dark inset
// - Typography & shapes: bold base-size title, xs meta text, 10-11px mono for the badge and code;
//   rounded-xl card with shadow-sm, rounded-lg code block, rounded badge
// - Responsive: no breakpoint classes; the card fills the width of its grid cell

// What it does:
// - Purely presentational: no content props, no state (the code snippet is static, HTML-escaped text)
// - Link "View 14 Comments →" → #thread (underline on hover); tags "#react19 #nextjs" are plain text

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SolvedQAThreadCard from '@/TestComponent/SectionDesigns/Sections/community/Card02';

// const CommunityCards = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <SolvedQAThreadCard />
//     </div>
// )
// ```

'use client'

import { HiCheck, HiOutlineThumbUp } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SolvedQAThreadCard({
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
                'overflow-hidden rounded-xl border border-[#ebded7] bg-[#fcf8f5] p-5 text-[#2c1d18] shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-[#ebded7] pb-3">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                    <HiCheck /> SOLVED BY COMMUNITY
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-[#a34c38] font-bold">
                    <HiOutlineThumbUp /> 38 Upvotes
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-bold text-base leading-snug">
                    How do you prevent hydration mismatch when rendering user client timestamps in React 19?
                </h3>
                <p className="mt-1 text-xs text-[#2c1d18]/70">
                    Answered by @kai_dev (Staff Engineer &bull; 4,820 Karma)
                </p>

                {/* Code Solution Preview */}
                <div className="mt-3 rounded-lg bg-[#241c19] p-3 text-[11px] font-mono text-[#f7e6de] leading-relaxed border border-black/10">
                    <span className="text-white/40">// Use layout effect or suppressHydrationWarning</span><br />
                    <span className="text-pink-400">const</span> [mounted, setMounted] = useState(<span className="text-amber-300">false</span>);<br />
                    useEffect(() =&gt; &#123; setMounted(<span className="text-amber-300">true</span>); &#125;, []);<br />
                    <span className="text-pink-400">if</span> (!mounted) <span className="text-pink-400">return</span> &lt;span&gt;--:--&lt;/span&gt;;
                </div>

                <div className="mt-4 pt-3 border-t border-[#ebded7] flex items-center justify-between text-xs">
                    <span className="text-black/50">Tagged: #react19 #nextjs</span>
                    <a href="#thread" className="font-bold text-[#a34c38] hover:underline">
                        View 14 Comments &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default SolvedQAThreadCard
