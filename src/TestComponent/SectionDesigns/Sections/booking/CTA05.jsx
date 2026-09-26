import { HiArrowRight } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="rounded-none border-2 border-[#e07d5b] bg-[#0e1d24] p-8 text-[#dae6ec] sm:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#e07d5b]">
                        EXECUTIVE LEADERSHIP SANCTUARIES &bull; HIGH-SPEED CONNECTIVITY
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Host Off-Grid Board & Executive Offsites
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Sanctuaries equipped with redundant Starlink terminals, private culinary teams, secluded strategy pavilions, and on-demand helicopter transfers.
                    </p>
                </div>

                <a
                    href="#executive-retreats"
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#e07d5b] px-6 py-3.5 font-mono text-xs font-bold text-[#0e1d24] hover:bg-white transition-colors shrink-0"
                >
                    <span>Reserve Executive Sanctuary</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
