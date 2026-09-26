import { HiArrowRight, HiOutlineKey } from 'react-icons/hi'

export default function CTA01() {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#161412] p-8 text-[#f5eee6] sm:p-12 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#c5a880]/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#c5a880] border border-[#c5a880]/30">
                    <HiOutlineKey /> PASSKEY ACCESS ONLY &bull; DROP 05
                </span>
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-light tracking-wide text-white">
                    Unlock the Private Salon Vault.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[#c5a880]/80">
                    Our most sought-after archive pieces and 1-of-1 collaborative prototypes open to registered patrons 24 hours prior to public release.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter personal email for passkey..."
                        className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs text-white placeholder:text-white/40 outline-none focus:border-[#c5a880] flex-1"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c5a880] px-6 py-3 font-serif text-xs font-bold text-black hover:bg-white transition-colors shrink-0"
                    >
                        <span>Request Access Key</span>
                        <HiArrowRight />
                    </button>
                </form>
            </div>
        </section>
    )
}
