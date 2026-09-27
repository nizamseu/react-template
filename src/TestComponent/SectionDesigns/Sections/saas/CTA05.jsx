// OpenSourceCommunityGitHubDiscordCTA

// CTA05 · SaaS Platforms › Banner CTAs

// Description:
// A dark, square-edged community banner. The eyebrow reads "Open-source core •
// 14.8K GitHub stars", above the headline "Built in Public. Powered by 350+ Global
// Contributors." The copy covers the Apache 2.0 routing engine and edge proxy plus
// weekly Discord office hours. Two buttons follow: "Star on GitHub (14.8k)" and
// "Join 12,000+ on Discord".

// Design:
// - <section> with flex-col -> lg:flex-row (lg:items-center, justify-between):
//   copy on the left and a shrink-0 button group on the right.
// - Dark base #17232c with a 2px #263640 border. Mint #65e6b4 is used for the
//   eyebrow and the primary button (text #17232c, hover white). The secondary
//   button is outlined in white/30 (hover white/10).
// - Typography: mono eyebrow with tracking-[.2em], a font-black headline at
//   text-2xl -> sm:text-3xl, and mono xs body copy. The section is rounded-none, and
//   the buttons are rounded.
// - Responsive: below sm the buttons are full-width and stacked; from sm they sit
//   inline. From lg the button group moves beside the copy.

// What it does:
// - Purely presentational: no content props, no state.
// - The GitHub button opens the generic https://github.com in a new tab
//   (target="_blank", rel="noreferrer"). The Discord button links to `#discord`
//   with a HiArrowRight icon.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OpenSourceCommunityGitHubDiscordCTA from '@/TestComponent/SectionDesigns/Sections/saas/CTA05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <OpenSourceCommunityGitHubDiscordCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function OpenSourceCommunityGitHubDiscordCTA({
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
                'overflow-hidden rounded-none border-2 border-[#263640] bg-[#17232c] p-8 text-white',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#65e6b4]">
                        OPEN-SOURCE CORE &bull; 14.8K GITHUB STARS
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-black">
                        Built in Public. Powered by 350+ Global Contributors.
                    </h2>
                    <p className="mt-2 font-mono text-xs text-white/70 max-w-xl">
                        Our core routing engine and edge proxy are 100% open source under the Apache 2.0 license. Join our weekly engineering office hours on Discord.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded border border-white/30 px-5 py-3 font-mono text-xs font-bold text-white hover:bg-white/10 transition-colors"
                    >
                        <span>Star on GitHub (14.8k)</span>
                    </a>
                    <a
                        href="#discord"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded bg-[#65e6b4] px-5 py-3 font-mono text-xs font-bold text-[#17232c] hover:bg-white transition-colors"
                    >
                        <span>Join 12,000+ on Discord</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default OpenSourceCommunityGitHubDiscordCTA
