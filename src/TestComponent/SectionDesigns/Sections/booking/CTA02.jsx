import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#132d3a] p-8 text-white sm:p-11">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#f0aa8d]">
                        THE LOCAL SIDE OF THE STORY
                    </p>
                    <h2 className="mt-2 max-w-xl font-serif text-3xl">
                        Share the place you know by heart.
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Host a small experience for curious travelers.
                    </p>
                </div>
                <a
                    href="#host"
                    className="inline-flex items-center gap-2 self-start rounded-full bg-[#f0aa8d] px-5 py-3 text-sm font-semibold text-[#132d3a]"
                >
                    Become a host <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
