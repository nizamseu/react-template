import { HiOutlineCheck, HiOutlineExclamationCircle } from 'react-icons/hi'

export default function Card02() {
    return (
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-[#f4f8f5] p-5 text-[#162720] shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-rose-600 font-bold">
                    <HiOutlineExclamationCircle className="text-base" /> TROUBLESHOOTING RUNBOOK
                </span>
                <span className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-700">
                    ERR_RATE_LIMIT_429
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-bold text-base leading-snug">
                    HTTP 429: Too Many Requests & Token Bucket Depletion
                </h3>
                <p className="mt-1 text-xs text-gray-600">
                    Occurs when client application exhausts the per-IP burst allocation (500 requests/sec).
                </p>

                {/* Resolution Decision Steps */}
                <div className="mt-3 rounded-lg bg-white p-3 font-mono text-xs border border-gray-200 space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-[#41715d]">1.</span>
                        <span>Read <code className="bg-gray-100 px-1 py-0.5 rounded text-[11px]">Retry-After</code> response header in milliseconds.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-[#41715d]">2.</span>
                        <span>Implement truncated exponential backoff with full jitter.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="font-bold text-[#41715d]">3.</span>
                        <span>Upgrade to Enterprise tier for dedicated IP bypass pools.</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 font-bold font-mono text-[11px]">
                        <HiOutlineCheck /> Verified Resolution Step
                    </span>
                    <a href="#view-runbook" className="font-bold text-[#41715d] hover:underline">
                        Copy SDK Backoff Snippet &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}
