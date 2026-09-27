// GlobalEdgeTelemetryLatencyCard

// Card01 · SaaS Platforms › Cards

// Description:
// A dark, monospace observability card titled "Global edge telemetry", with a
// pulsing live dot and "Updated 1s ago". It shows P99 global latency (14.2 ms),
// live throughput (482.4k req/s), a 13-bar sparkline and per-region latency
// (US-EAST 8.4ms, EU-CENTRAL 11.2ms, AP-NORTHEAST 16.8ms). All figures are
// hard-coded.

// Design:
// - <article> built from stacked rows: a header (border-b), a baseline-aligned
//   left/right metric row, a bar sparkline (flex items-end, h-14) and a 3-column
//   regional grid.
// - Very dark base #0b1319 with #e3edf2 / white text and a green #17a878 accent
//   (live dot, throughput, bars at /70 opacity). Dividers are white/10 and labels
//   white/40-60.
// - Typography: font-mono throughout; tiny 10px uppercase labels and a text-3xl
//   font-black headline metric. The card is rounded-2xl with a white/10 border and
//   shadow-2xl, and bars are rounded-t-sm.
// - Responsive: no breakpoint classes. The card fills its container, so it suits a
//   card grid.

// What it does:
// - No content props, no state. The live dot uses animate-pulse, and each bar turns fully
//   opaque on hover (transition-colors).
// - Sparkline bars are mapped from an inline array of 13 percentage heights set
//   through inline style. There are no links or CTAs.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GlobalEdgeTelemetryLatencyCard from '@/TestComponent/SectionDesigns/Sections/saas/Card01';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <GlobalEdgeTelemetryLatencyCard />
//     </div>
// )
// ```

'use client'

import { HiOutlineLightningBolt, HiOutlineTrendingUp } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GlobalEdgeTelemetryLatencyCard({
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
                'overflow-hidden rounded-2xl border border-white/10 bg-[#0b1319] p-5 text-[#e3edf2] shadow-2xl font-mono',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-2 text-xs text-[#17a878]">
                    <span className="h-2 w-2 rounded-full bg-[#17a878] animate-pulse" />
                    GLOBAL EDGE TELEMETRY
                </span>
                <span className="text-[10px] text-white/40">UPDATED 1S AGO</span>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
                <div>
                    <span className="block text-[10px] text-white/50">P99 GLOBAL LATENCY</span>
                    <span className="text-3xl font-black text-white">14.2 ms</span>
                </div>
                <div className="text-right">
                    <span className="block text-[10px] text-white/50">LIVE THROUGHPUT</span>
                    <span className="text-lg font-bold text-[#17a878]">482.4k req/s</span>
                </div>
            </div>

            {/* Sparkline Visual */}
            <div className="mt-4 flex h-14 items-end gap-1 border-b border-white/10 pb-2">
                {[45, 62, 58, 80, 75, 90, 84, 95, 88, 100, 92, 98, 94].map((h, i) => (
                    <div
                        key={i}
                        className="flex-1 rounded-t-sm bg-[#17a878]/70 hover:bg-[#17a878] transition-colors"
                        style={{ height: `${h}%` }}
                    />
                ))}
            </div>

            {/* Regional breakdown */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-white/60 pt-1">
                <div>
                    <span className="block text-white/40">US-EAST</span>
                    <span className="font-bold text-white">8.4ms</span>
                </div>
                <div>
                    <span className="block text-white/40">EU-CENTRAL</span>
                    <span className="font-bold text-white">11.2ms</span>
                </div>
                <div>
                    <span className="block text-white/40">AP-NORTHEAST</span>
                    <span className="font-bold text-white">16.8ms</span>
                </div>
            </div>
        </article>
    )
}

export default GlobalEdgeTelemetryLatencyCard
