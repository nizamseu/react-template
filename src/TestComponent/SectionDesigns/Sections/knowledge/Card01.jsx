// APIEndpointReferenceCard

// Card01 · Knowledge Bases & Documentation › Cards

// Description:
// A dark API-reference card documenting a single endpoint: "GET /v2/orders/:id"
// ("Retrieve Single Order by Idempotency Key"). It shows a short description, a
// two-row parameter table (order_id, expand[]), the "200 OK (application/json)"
// response line and a link to an interactive console.

// Design:
// - Single article: header row (method badge + path | "OPENAPI 3.1 SPEC"), title
//   and description, an inset parameters table, then a footer row split by a top border.
// - Dark palette: background #0f1a16, text #e0ece6, borders white/10, table on
//   black/40; emerald-500/20 GET badge with emerald-400 text, emerald-300 parameter
//   names, amber-300 "Required" marker, mint #9bd2a7 console link.
// - Monospace base font with sans-serif title/description; text-sm bold title,
//   text-xs / text-[10px] details; rounded-2xl card, rounded-lg table, shadow-2xl.
// - No breakpoint classes: the card is fluid and fills its grid cell.

// What it does:
// - Purely presentational: no content props, no state; all content is hard-coded (no
//   mapped arrays).
// - One anchor, "Interactive Console →" (HiOutlineCode icon) → #test-endpoint.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import APIEndpointReferenceCard from '@/TestComponent/SectionDesigns/Sections/knowledge/Card01';

// const DocsGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <APIEndpointReferenceCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineCode } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function APIEndpointReferenceCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#0f1a16] p-5 text-[#e0ece6] shadow-2xl font-mono',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        GET
                    </span>
                    <span className="text-xs font-bold text-white">/v2/orders/:id</span>
                </div>
                <span className="text-[10px] text-white/50">OPENAPI 3.1 SPEC</span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-sm font-bold text-white">
                    Retrieve Single Order by Idempotency Key
                </h3>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Returns complete customer object, fulfillment tracking webhooks, and cryptographic proof of payment.
                </p>

                {/* Parameters table mockup */}
                <div className="mt-3 rounded-lg bg-black/40 p-3 space-y-2 text-xs border border-white/5">
                    <div className="flex items-center justify-between pb-1 border-b border-white/10 text-[10px] text-white/40">
                        <span>PARAMETER</span>
                        <span>TYPE & STATUS</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-emerald-300 font-bold">order_id</span>
                        <span className="text-[10px] text-amber-300">UUID &bull; Required</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-emerald-300 font-bold">expand[]</span>
                        <span className="text-[10px] text-white/50">Array[str] &bull; Optional</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-emerald-400">Response: 200 OK (application/json)</span>
                    <a href="#test-endpoint" className="text-[#9bd2a7] hover:underline font-bold flex items-center gap-1">
                        <HiOutlineCode />
                        <span>Interactive Console &rarr;</span>
                    </a>
                </div>
            </div>
        </article>
    )
}

export default APIEndpointReferenceCard
