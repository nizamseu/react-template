// OneLineCLIInstallerDeployCTA

// CTA01 · SaaS Platforms › Banner CTAs

// Description:
// A dark developer banner, "Deploy Your First Distributed Cluster in 90 Seconds.",
// with a pulsing "Developer first • No card required" pill and copy about the
// universal CLI installer. A terminal bar shows the one-line install command
// `curl -sSL https://northstar.dev/install.sh | bash` next to a Copy button.

// Design:
// - <section> (relative, overflow-hidden) with a max-w-2xl content column: pill,
//   headline, copy, then the terminal bar (command | copy button).
// - Very dark base #0b1319 with #e3edf2 / white text and emerald-300/400 accents.
//   The terminal is black/60 with a white/10 border, and the Copy button is
//   white/10 (hover white/20).
// - Typography: font-mono base, with a font-sans font-black headline at
//   text-3xl -> sm:text-4xl. The section is rounded-2xl with shadow-2xl; the pill is
//   rounded-full, the terminal rounded-xl and the button rounded-lg.
// - Responsive: below sm the command and button stack (the button stretches full
//   width); from sm they sit in one row. A long command scrolls horizontally.
//   Padding goes p-8 -> sm:p-12.

// What it does:
// - `copied` state: handleCopy writes `command` through
//   navigator.clipboard?.writeText, shows HiCheck + "Copied" for 2 s (setTimeout),
//   then reverts to HiOutlineClipboardCopy + "Copy".
// - No links or navigation. The "$" prompt glyph is select-none. No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OneLineCLIInstallerDeployCTA from '@/TestComponent/SectionDesigns/Sections/saas/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <OneLineCLIInstallerDeployCTA />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { HiCheck, HiOutlineClipboardCopy } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function OneLineCLIInstallerDeployCTA({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [copied, setCopied] = useState(false)
    const command = 'curl -sSL https://northstar.dev/install.sh | bash'

    const handleCopy = () => {
        navigator.clipboard?.writeText(command)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1319] p-8 text-[#e3edf2] sm:p-12 shadow-2xl font-mono',
                className,
            )}
            {...props}
        >
            <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    DEVELOPER FIRST &bull; NO CARD REQUIRED
                </span>
                <h2 className="mt-3 font-sans text-3xl sm:text-4xl font-black text-white leading-tight">
                    Deploy Your First Distributed Cluster in 90 Seconds.
                </h2>
                <p className="mt-2 font-sans text-sm text-white/70">
                    Run the universal CLI installer. Automatically provisions local development environments, links remote edge databases, and configures TLS.
                </p>

                {/* Interactive Copyable Terminal Bar */}
                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl bg-black/60 p-3.5 border border-white/10">
                    <div className="flex items-center gap-2 text-xs text-emerald-300 overflow-x-auto">
                        <span className="text-white/40 select-none">$</span>
                        <span>{command}</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors shrink-0"
                    >
                        {copied ? <HiCheck className="text-emerald-400" /> : <HiOutlineClipboardCopy />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                </div>
            </div>
        </section>
    )
}

export default OneLineCLIInstallerDeployCTA
