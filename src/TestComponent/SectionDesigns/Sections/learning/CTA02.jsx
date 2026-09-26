import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#102d36] p-8 text-white sm:p-11">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div className="max-w-xl">
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#c8ef70]">
                        FOR LEARNING TEAMS
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">
                        Make room for growth at work.
                    </h2>
                    <p className="mt-2 text-sm text-white/65">
                        Build a shared learning plan your people can actually
                        use.
                    </p>
                </div>
                <a
                    href="#teams"
                    className="inline-flex items-center gap-2 self-start rounded-full bg-[#c8ef70] px-5 py-3 text-sm font-bold text-[#102d36]"
                >
                    Explore team learning <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
