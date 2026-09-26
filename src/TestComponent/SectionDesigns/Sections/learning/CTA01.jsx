import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#c8ef70] p-7 text-[#102d36] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em]">
                    YOUR NEXT CHAPTER
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    Pick one skill. See where it leads.
                </h2>
                <p className="mt-2 text-sm">
                    Practical lessons and a plan you can make your own.
                </p>
            </div>
            <a
                href="#paths"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#102d36] px-5 py-3 text-sm font-semibold text-white"
            >
                Find your learning path <HiArrowRight />
            </a>
        </section>
    )
}
