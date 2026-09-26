import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#3476c5] px-6 py-10 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                BUILD YOUR NEXT CHAPTER
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
                Do meaningful work with good people.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
                Explore open roles across the Northstar team.
            </p>
            <a
                href="#careers"
                className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-[#182434]"
            >
                See open roles <HiArrowRight />
            </a>
        </section>
    )
}
