// DocsAsCodeGitHubContributionBanner

// CTA01 · Knowledge Bases & Documentation › Banner CTAs

// Description:
// A dark open-source contribution banner: "Spotted a Typo or Missing Recipe?
// Edit This Page on GitHub." Tagged "Docs-as-Code · Apache 2.0" with "1,420+
// Engineers Contributed", it invites readers to fork and edit the docs, and
// shows a mock terminal window with a git branch/lint workflow and "PR #1,492 MERGED".

// Design:
// - Relative section with a blurred decorative circle top-right; a grid of one
//   column that becomes lg:grid-cols-12 (copy spans 7, terminal mock spans 5).
// - Dark palette: background #0f1714, border white/10; green accent #41715d
//   (glow #41715d/20, badge #41715d/25) and mint #9bd2a7 (badge text, $ prompts,
//   primary button with #0f1714 text, hover white); secondary button white/5 with
//   white/20 border; terminal black/60 with red/yellow/green window dots and an
//   emerald-400 success line.
// - Monospace base font; sans-serif headline text-2xl → sm:text-4xl font-black
//   tracking-tight; text-sm body; text-xs bold buttons with rounded-xl corners;
//   rounded-2xl section, shadow-2xl.
// - Padding p-8 → sm:p-12; the terminal stacks below the copy until lg; badge
//   row and buttons use flex-wrap.

// What it does:
// - Purely presentational: no content props, no state; the terminal lines are static.
// - CTAs: "Fork & Edit on GitHub" → https://github.com (new tab,
//   rel="noreferrer", external-link icon) and "Good First Issues (24)" →
//   #good-first-issues.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DocsAsCodeGitHubContributionBanner from '@/TestComponent/SectionDesigns/Sections/knowledge/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <DocsAsCodeGitHubContributionBanner />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineCode, HiOutlineExternalLink } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DocsAsCodeGitHubContributionBanner({
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
                'relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f1714] p-8 text-white sm:p-12 shadow-2xl font-mono',
                className,
            )}
            {...props}
        >
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#41715d]/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#41715d]/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9bd2a7] border border-[#41715d]/40">
                            <HiOutlineCode className="text-sm" /> Docs-as-Code &bull; Apache 2.0
                        </span>
                        <span className="text-xs text-white/40">1,420+ Engineers Contributed</span>
                    </div>

                    <h2 className="mt-4 font-sans text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                        Spotted a Typo or Missing Recipe? Edit This Page on GitHub.
                    </h2>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-white/70">
                        Our entire knowledge base, distributed SDK references, and interactive tutorials are open-source. Submit a pull request, get reviewed by our core engineers within 24 hours, and earn official contributor recognition.
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#9bd2a7] px-6 py-3 font-sans text-xs font-bold text-[#0f1714] hover:bg-white transition-all shadow-md"
                        >
                            <span>Fork & Edit on GitHub</span>
                            <HiOutlineExternalLink className="text-sm" />
                        </a>
                        <a
                            href="#good-first-issues"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 font-sans text-xs font-bold text-white hover:bg-white/10 transition-colors"
                        >
                            <span>Good First Issues (24)</span>
                            <HiArrowRight className="text-xs text-[#9bd2a7]" />
                        </a>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="rounded-xl border border-white/10 bg-black/60 p-4 shadow-inner">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/40">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
                                <span className="ml-2 font-mono text-[11px] text-white/60">git-workflow.sh</span>
                            </div>
                            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">PR #1,492 MERGED</span>
                        </div>
                        <div className="mt-3 space-y-1.5 text-xs text-white/80 font-mono">
                            <p className="text-white/40"># Fork and create branch</p>
                            <p><span className="text-[#9bd2a7]">$</span> git checkout -b docs/fix-websocket-auth</p>
                            <p className="text-white/40 mt-2"># Validate markdown schema & run linter</p>
                            <p><span className="text-[#9bd2a7]">$</span> pnpm docs:lint --fix</p>
                            <p className="text-emerald-400 font-bold mt-2">&check; All 482 docstring tests passing</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DocsAsCodeGitHubContributionBanner
