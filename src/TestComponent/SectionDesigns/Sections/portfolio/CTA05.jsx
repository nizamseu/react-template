import { HiArrowRight } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="rounded-none border-2 border-white/20 bg-[#181412] p-8 text-[#ede4de] sm:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ef6a4b]">
                        DIRECT STUDIO CHANNELS &bull; NO INTERMEDIARIES
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-light text-white leading-tight">
                        Reach Out Directly via Encrypted Signal or Studio Email
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Skip agency bureaucratic pipelines. All inquiries reviewed directly by Jamie Park within 24 hours. Stockholm CET timezone.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <a
                        href="mailto:jamie@park.studio"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                    >
                        <span>jamie@park.studio</span>
                    </a>
                    <a
                        href="#signal"
                        className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[#ef6a4b] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-white hover:text-black transition-colors"
                    >
                        <span>Signal / Telegram</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}
