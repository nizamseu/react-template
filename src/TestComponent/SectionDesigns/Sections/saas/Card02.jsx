// SignalEmbeddingsAPIEndpointCard

// Card02 · SaaS Platforms › Cards

// Description:
// A developer-focused API reference card for the `POST /v1/embeddings` endpoint of
// api.signal.dev. It shows a syntax-coloured cURL request, a "Copy cURL" button, a
// "200 OK · 28ms latency" response footer and a "Test in Playground" link.

// Design:
// - <article> with three parts separated by #263640 borders: a header row (POST
//   method badge + path, copy button), a code block, and a footer row (status +
//   link).
// - Dark base #0e161c with a #263640 border and #e3edf2 text. The code block is
//   black/60, with syntax colours purple-400 (curl), emerald-300 (header) and
//   amber-300 (JSON body). The badge and status are emerald, and the link is mint
//   #65e6b4.
// - Typography: font-mono throughout, with 10-11px code and labels and a bold path.
//   The card is rounded-xl with shadow-2xl, and the code block rounded-lg.
// - Responsive: no breakpoint classes. The fixed layout fills its grid cell.

// What it does:
// - `copied` state: "Copy cURL" writes a cURL command through
//   navigator.clipboard?.writeText, swaps the icon to HiCheck and the label to
//   "Copied cURL", then resets after 2 s with setTimeout.
// - The copied command's JSON input is "Awwwards SOTD", which differs from the
//   "Query" shown in the displayed snippet.
// - One link to `#test-api` ("Test in Playground →"). No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SignalEmbeddingsAPIEndpointCard from '@/TestComponent/SectionDesigns/Sections/saas/Card02';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <SignalEmbeddingsAPIEndpointCard />
//     </div>
// )
// ```

'use client'

import { useState } from 'react';
import { HiCheck, HiOutlineClipboardCopy } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SignalEmbeddingsAPIEndpointCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [copied, setCopied] = useState(false)

    const copyCode = () => {
        navigator.clipboard?.writeText(
            `curl -X POST https://api.signal.dev/v1/embeddings \\\n  -H "Authorization: Bearer $KEY" \\\n  -d '{"model": "embed-3", "input": "Awwwards SOTD"}'`
        )
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-xl border border-[#263640] bg-[#0e161c] text-[#e3edf2] p-5 shadow-2xl font-mono',
                className,
            )}
            {...props}
        >
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

export default SignalEmbeddingsAPIEndpointCard
