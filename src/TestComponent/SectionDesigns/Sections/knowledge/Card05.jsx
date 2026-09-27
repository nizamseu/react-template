// BreakingReleaseMigrationNoticeCard

// Card05 · Knowledge Bases & Documentation › Cards

// Description:
// An amber-accented changelog card flagging a "BREAKING RELEASE" (v4.18.0 · OCT
// 2026, Node ≥ 20.0): "Async Storage Engine Migration & TLS 1.3 Strict Mandate".
// It explains that getSync()/setSync() were removed, shows the CLI upgrade
// command "npm i @platform/sdk@latest" and links to a migration guide.

// Design:
// - Single article: header row (breaking badge + version | Node requirement
//   chip), title and explanation with inline code, a CLI box, and a footer row
//   with a top border.
// - Warm dark palette: background #16120b, border amber-500/30, white text;
//   amber-500/20 badge with amber-400 text, amber-300 inline code on black/40,
//   CLI box black/60 with an emerald-400 command; amber-500 button with black text
//   (hover amber-400). This amber theme departs from the folder's green palette.
// - text-base bold tracking-tight title, text-xs leading-relaxed body, monospace
//   meta and code; rounded-2xl card, rounded-full badge, rounded-xl CLI box,
//   rounded-lg button; shadow-xl.
// - No breakpoint classes: the card is fluid and fills its grid cell.

// What it does:
// - Purely presentational: no content props, no state. The CLI command uses select-all
//   so one click selects it (CSS only, no copy handler).
// - One CTA anchor, "Migration Guide" (HiArrowRight) → #migration-guide.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BreakingReleaseMigrationNoticeCard from '@/TestComponent/SectionDesigns/Sections/knowledge/Card05';

// const DocsGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <BreakingReleaseMigrationNoticeCard />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineExclamationCircle, HiOutlineCode } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BreakingReleaseMigrationNoticeCard({
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
                'overflow-hidden rounded-2xl border border-amber-500/30 bg-[#16120b] p-6 text-white shadow-xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-amber-400 border border-amber-500/30">
                        <HiOutlineExclamationCircle className="h-3.5 w-3.5" /> BREAKING RELEASE
                    </span>
                    <span className="font-mono text-xs font-semibold text-white/70">v4.18.0 &bull; OCT 2026</span>
                </div>
                <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/50">Node &ge; 20.0</span>
            </div>

            <div className="mt-4">
                <h3 className="text-base font-bold text-white tracking-tight">
                    Async Storage Engine Migration & TLS 1.3 Strict Mandate
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                    Legacy synchronous store methods (<code className="rounded bg-black/40 px-1 py-0.5 font-mono text-amber-300">getSync()</code> and <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-amber-300">setSync()</code>) are now removed. All distributed session handles now require Promise-based resolution.
                </p>

                <div className="mt-4 rounded-xl bg-black/60 p-3 border border-white/10 font-mono text-xs text-white/80">
                    <div className="flex items-center justify-between text-[11px] text-white/40 pb-2 border-b border-white/5 mb-2">
                        <span className="flex items-center gap-1.5"><HiOutlineCode className="text-amber-400" /> CLI UPGRADE</span>
                        <span>npm / yarn / pnpm</span>
                    </div>
                    <code className="text-emerald-400 select-all">$ npm i @platform/sdk@latest</code>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-[11px] text-white/40">Deprecation window closed</span>
                    <a
                        href="#migration-guide"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-black hover:bg-amber-400 transition-colors shadow-sm"
                    >
                        <span>Migration Guide</span>
                        <HiArrowRight className="h-3.5 w-3.5" />
                    </a>
                </div>
            </div>
        </article>
    )
}

export default BreakingReleaseMigrationNoticeCard
