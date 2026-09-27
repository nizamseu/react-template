// IdempotencyKeyArchitecturePatternCard

// Card03 · Knowledge Bases & Documentation › Cards

// Description:
// A dark architecture-guide card from the "CRYPTOGRAPHIC TRUST PATTERNS" series:
// "Guaranteeing Exactly-Once Execution with Idempotency Keys". It explains how
// Northstar prevents duplicate charges with Redis TTL leases and shows a small
// header/cache-behaviour snippet, tagged "RFC 7231" and "Replay-Attack Proof".

// Design:
// - Single article: header row (series label with key icon | RFC badge), title
//   and summary, an inset pseudo-code panel, and a footer row with a top border.
// - Dark forest palette: background #121f1a, 1px border #41715d, white text,
//   mint accent #9bd2a7 (series label, link), emerald-500/20 badge with
//   emerald-400 text, code panel black/40 with emerald-300 and white/40 comment lines.
// - Monospace labels and code, sans-serif text-base bold title and text-xs body;
//   rounded-2xl card, rounded-xl code panel, shadow-2xl.
// - No breakpoint classes: the card is fluid and fills its grid cell.

// What it does:
// - Purely presentational: no content props, no state; content is hard-coded.
// - One anchor, "Read Architecture Whitepaper →" → #idempotency-spec.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IdempotencyKeyArchitecturePatternCard from '@/TestComponent/SectionDesigns/Sections/knowledge/Card03';

// const DocsGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <IdempotencyKeyArchitecturePatternCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineKey, HiOutlineShieldCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function IdempotencyKeyArchitecturePatternCard({
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
                'overflow-hidden rounded-2xl border border-[#41715d] bg-[#121f1a] p-5 text-white shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#9bd2a7] font-bold">
                    <HiOutlineKey /> CRYPTOGRAPHIC TRUST PATTERNS
                </span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] text-emerald-400 font-bold">
                    RFC 7231
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-base font-bold text-white">
                    Guaranteeing Exactly-Once Execution with Idempotency Keys
                </h3>
                <p className="mt-1 text-xs text-white/70">
                    How Northstar prevents duplicate financial charges during transient network timeouts and client retries using Redis TTL leases.
                </p>

                {/* Architecture diagram simulation */}
                <div className="mt-4 rounded-xl bg-black/40 p-3 font-mono text-xs border border-white/5 space-y-1.5">
                    <div className="text-white/40">// Request Header Specification</div>
                    <div className="text-emerald-300">Idempotency-Key: &quot;usr_9a4f_charge_4821&quot;</div>
                    <div className="text-white/40">// Cache Layer Behavior</div>
                    <div className="text-white/80">Redis SETNX &bull; TTL 24 Hours &bull; Lock: Acquired</div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-white/50">
                        <HiOutlineShieldCheck className="text-emerald-400" /> Replay-Attack Proof
                    </span>
                    <a href="#idempotency-spec" className="font-bold text-[#9bd2a7] hover:underline">
                        Read Architecture Whitepaper &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default IdempotencyKeyArchitecturePatternCard
