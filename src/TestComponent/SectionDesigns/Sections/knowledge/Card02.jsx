// RateLimitTroubleshootingRunbookCard

// Card02 · Knowledge Bases & Documentation › Cards

// Description:
// A light troubleshooting-runbook card for the "ERR_RATE_LIMIT_429" error ("HTTP
// 429: Too Many Requests & Token Bucket Depletion"). It explains the cause and
// lists three numbered resolution steps (read Retry-After, exponential backoff
// with jitter, upgrade tier), ending with a "Verified Resolution Step" label.

// Design:
// - Single article: header row (runbook label | error-code badge), heading and
//   cause text, a white inset box of numbered steps, and a footer row with a top border.
// - Light mint palette: background #f4f8f5, text #162720, gray-200 borders;
//   rose-600 / rose-100 / rose-700 error accents; #41715d step numbers and link;
//   emerald-600 verified label; subtle shadow-sm.
// - Monospace uppercase text-[10px] labels; text-base bold heading (leading-snug);
//   monospace text-xs steps with an inline gray-100 code chip; rounded-xl card,
//   rounded-lg steps box.
// - No breakpoint classes: the card is fluid and fills its grid cell.

// What it does:
// - Purely presentational: no content props, no state; the three steps are hard-coded.
// - One anchor, "Copy SDK Backoff Snippet →" → #view-runbook (a plain link; it
//   does not copy anything to the clipboard).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RateLimitTroubleshootingRunbookCard from '@/TestComponent/SectionDesigns/Sections/knowledge/Card02';

// const DocsGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <RateLimitTroubleshootingRunbookCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineCheck, HiOutlineExclamationCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function RateLimitTroubleshootingRunbookCard({
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
                'overflow-hidden rounded-xl border border-gray-200 bg-[#f4f8f5] p-5 text-[#162720] shadow-sm',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-rose-600 font-bold">
                    <HiOutlineExclamationCircle className="text-base" /> TROUBLESHOOTING RUNBOOK
                </span>
                <span className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700">
                    ERR_RATE_LIMIT_429
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-bold text-base leading-snug">
                    HTTP 429: Too Many Requests & Token Bucket Depletion
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                    Occurs when client application exhausts the per-IP burst allocation (500 requests/sec).
                </p>

                {/* Resolution Decision Steps */}
                <div className="mt-3 rounded-lg bg-white p-3 font-mono text-xs border border-gray-200 space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-[#41715d]">1.</span>
                        <span>Read <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">Retry-After</code> response header in milliseconds.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-[#41715d]">2.</span>
                        <span>Implement truncated exponential backoff with full jitter.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-[#41715d]">3.</span>
                        <span>Upgrade to Enterprise tier for dedicated IP bypass pools.</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold font-mono text-[11px]">
                        <HiOutlineCheck /> Verified Resolution Step
                    </span>
                    <a href="#view-runbook" className="font-bold text-[#41715d] hover:underline">
                        Copy SDK Backoff Snippet &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default RateLimitTroubleshootingRunbookCard
