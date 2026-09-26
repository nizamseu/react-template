import { useState } from 'react'
import { HiCheck, HiOutlineClipboardCopy } from 'react-icons/hi'

export default function CTA01() {
    const [copied, setCopied] = useState(false)
    const command = 'curl -sSL https://northstar.dev/install.sh | bash'

    const handleCopy = () => {
        navigator.clipboard?.writeText(command)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1319] p-8 text-[#e3edf2] sm:p-12 shadow-2xl font-mono">
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
