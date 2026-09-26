import { useState } from 'react'
import { HiCheck, HiOutlineClipboardCopy } from 'react-icons/hi'

export default function Card02() {
    const [copied, setCopied] = useState(false)

    const copyCode = () => {
        navigator.clipboard?.writeText(
            `curl -X POST https://api.signal.dev/v1/embeddings \\\n  -H "Authorization: Bearer $KEY" \\\n  -d '{"model": "embed-3", "input": "Awwwards SOTD"}'`
        )
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <article className="overflow-hidden rounded-xl border border-[#263640] bg-[#0e161c] text-[#e3edf2] p-5 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-[#263640] pb-3">
                <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        POST
                    </span>
                    <span className="text-xs font-bold text-white">/v1/embeddings</span>
                </div>
                <button
                    type="button"
                    onClick={copyCode}
                    className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white transition-colors"
                >
                    {copied ? <HiCheck className="text-emerald-400" /> : <HiOutlineClipboardCopy />}
                    <span>{copied ? 'Copied cURL' : 'Copy cURL'}</span>
                </button>
            </div>

            <div className="mt-3 rounded-lg bg-black/60 p-3 text-[11px] text-white/80 leading-relaxed border border-white/5">
                <span className="text-purple-400">curl</span> -X POST https://api.signal.dev/v1/embeddings \<br />
                &nbsp;&nbsp;-H <span className="text-emerald-300">&quot;Authorization: Bearer $KEY&quot;</span> \<br />
                &nbsp;&nbsp;-d <span className="text-amber-300">&#39;&#123;&quot;model&quot;: &quot;embed-3&quot;, &quot;input&quot;: &quot;Query&quot;&#125;&#39;</span>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#263640] text-xs">
                <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">200 OK</span>
                    <span className="text-white/40">&bull;</span>
                    <span className="text-white/60">28ms latency</span>
                </div>
                <a href="#test-api" className="text-[#65e6b4] hover:underline font-bold">
                    Test in Playground &rarr;
                </a>
            </div>
        </article>
    )
}
