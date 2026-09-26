import { HiArrowRight } from 'react-icons/hi'
export default function CTA04() {
    return (
        <section className="rounded-lg bg-[#b65f47] px-6 py-10 text-center text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                TAKE THE SCENIC ROUTE
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                Leave a little space for somewhere new.
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-white/80">
                Explore stays and experiences picked by people who live there.
            </p>
            <a
                href="#destinations"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#132d3a]"
            >
                Explore destinations <HiArrowRight />
            </a>
        </section>
    )
}
