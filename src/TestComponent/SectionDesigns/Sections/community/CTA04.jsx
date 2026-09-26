import { HiArrowRight } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="rounded-xl border border-white/10 bg-[#291f1b] p-8 text-white sm:p-12 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffccad]">
                        MONTHLY VIRTUAL DEMO DAY &bull; LAST FRIDAY OF EVERY MONTH
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Demo Your Side Project in Front of 4,000 Peers
                    </h2>
                    <p className="mt-2 text-sm text-white/70">
                        Five selected makers get 5 minutes each to screen-share live prototypes with no slides. Get instant community feedback, beta users, and seed funding inquiries.
                    </p>
                </div>

                <a
                    href="#apply-demo"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffccad] px-6 py-3.5 font-mono text-xs font-bold text-[#291f1b] hover:bg-white transition-colors shrink-0"
                >
                    <span>Submit Demo Pitch</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
