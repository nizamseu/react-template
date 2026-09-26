import { HiArrowRight, HiOutlineKey } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="rounded-2xl border border-white/10 bg-[#1a2d36] p-8 text-white sm:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#e07d5b]">
                        <HiOutlineKey className="text-sm" /> UNLISTED PROPERTIES &bull; PRIVATE INVITATION
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Access the Secret Season Archive
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        18 architecturally historic residences whose owners never list publicly. Accessible only during off-peak shoulder seasons to verified patrons of the craft.
                    </p>
                </div>

                <a
                    href="#secret-season"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#e07d5b] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-[#1a2d36] transition-colors shrink-0"
                >
                    <span>Request Secret Season Key</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
