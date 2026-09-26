import { HiArrowRight } from 'react-icons/hi'
export default function Hero04() {
    return (
        <section className="rounded-lg bg-[#102d36] p-7 text-white sm:p-11">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c8ef70]">
                        YOUR NEXT CHAPTER
                    </p>
                    <h2 className="mt-4 max-w-2xl text-5xl font-semibold leading-[.95] sm:text-6xl">
                        Make your next skill count.
                    </h2>
                </div>
                <div className="max-w-sm">
                    <p className="text-sm leading-6 text-white/65">
                        Build the practical skills that move your work, your
                        team, and your ideas forward.
                    </p>
                    <a
                        href="#start"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#c8ef70] px-5 py-3 text-sm font-bold text-[#102d36]"
                    >
                        Start learning <HiArrowRight />
                    </a>
                </div>
            </div>
            <div className="mt-10 border-t border-white/20 pt-4 text-xs text-white/50">
                1,200+ lessons <span className="mx-3">/</span> Expert
                instructors <span className="mx-3">/</span> Learn on your time
            </div>
        </section>
    )
}
