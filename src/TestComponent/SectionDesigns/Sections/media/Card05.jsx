import { HiOutlineChatAlt2 } from 'react-icons/hi'

export default function Card05() {
    return (
        <article className="overflow-hidden rounded-xl border border-[#ded8cb] bg-[#f7f5f0] p-6 text-[#1c1d1a] shadow-sm">
            <div className="flex items-center justify-between border-b border-[#ded8cb] pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#a8472b] font-bold">
                    MARGINALIA &bull; CRITICAL OPINION
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-black/50">
                    <HiOutlineChatAlt2 /> 142 Responses
                </span>
            </div>

            <div className="mt-4 flex items-center gap-3">
                <img
                    className="h-12 w-12 rounded-full object-cover border-2 border-[#a8472b]"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                    alt="Author Beatrice Vane"
                />
                <div>
                    <h4 className="font-serif text-sm font-bold">Beatrice Vane</h4>
                    <p className="font-mono text-[10px] text-black/50">Chief Design Critic &bull; Oxford</p>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-xl font-bold leading-tight text-[#1c1d1a]">
                    Why Hyper-Optimized Software Made Contemporary Culture Monotonous
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#59554d]">
                    When algorithms optimize for frictionless consumption, they quietly eliminate the serendipitous weirdness that sparked the greatest cultural shifts of the 20th century.
                </p>

                <div className="mt-5 pt-3 border-t border-[#ded8cb] flex items-center justify-between text-xs">
                    <span className="font-serif italic text-black/60">&ldquo;Friction is where the soul resides.&rdquo;</span>
                    <a href="#read-column" className="font-bold text-[#a8472b] hover:underline">
                        Read Column &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}
