import { HiArrowRight, HiOutlineGift } from 'react-icons/hi'

export default function CTA05() {
    return (
        <section className="rounded-xl border border-[#d8c8ba] bg-[#f5ede4] p-8 text-[#241f1b] sm:p-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-serif text-xs font-bold uppercase tracking-wider text-[#9a704b]">
                        <HiOutlineGift /> GIFTING CONCIERGE &bull; COMPLIMENTARY
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Thoughtfully Packaged in Hinoki Cypress Boxes
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#685b52]">
                        Every order above $200 includes custom hand-lettered washi notes, organic botanical drying herbs, and reusable Japanese cedar ribbon packaging.
                    </p>
                </div>

                <a
                    href="#gift-service"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#241f1b] px-6 py-3.5 text-xs font-serif font-bold text-white hover:bg-[#9a704b] transition-colors shrink-0"
                >
                    <span>Configure Gift Box</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
