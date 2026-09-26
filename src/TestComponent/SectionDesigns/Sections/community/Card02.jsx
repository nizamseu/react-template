import { HiCheck, HiOutlineThumbUp } from 'react-icons/hi'

export default function Card02() {
    return (
        <article className="overflow-hidden rounded-xl border border-[#ebded7] bg-[#fcf8f5] p-5 text-[#2c1d18] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#ebded7] pb-3">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                    <HiCheck /> SOLVED BY COMMUNITY
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-[#a34c38] font-bold">
                    <HiOutlineThumbUp /> 38 Upvotes
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-bold text-base leading-snug">
                    How do you prevent hydration mismatch when rendering user client timestamps in React 19?
                </h3>
                <p className="mt-1 text-xs text-[#2c1d18]/70">
                    Answered by @kai_dev (Staff Engineer &bull; 4,820 Karma)
                </p>

                {/* Code Solution Preview */}
                <div className="mt-3 rounded-lg bg-[#241c19] p-3 text-[11px] font-mono text-[#f7e6de] leading-relaxed border border-black/10">
                    <span className="text-white/40">// Use layout effect or suppressHydrationWarning</span><br />
                    <span className="text-pink-400">const</span> [mounted, setMounted] = useState(<span className="text-amber-300">false</span>);<br />
                    useEffect(() =&gt; &#123; setMounted(<span className="text-amber-300">true</span>); &#125;, []);<br />
                    <span className="text-pink-400">if</span> (!mounted) <span className="text-pink-400">return</span> &lt;span&gt;--:--&lt;/span&gt;;
                </div>

                <div className="mt-4 pt-3 border-t border-[#ebded7] flex items-center justify-between text-xs">
                    <span className="text-black/50">Tagged: #react19 #nextjs</span>
                    <a href="#thread" className="font-bold text-[#a34c38] hover:underline">
                        View 14 Comments &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}
