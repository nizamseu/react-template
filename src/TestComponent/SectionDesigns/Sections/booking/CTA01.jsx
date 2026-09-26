import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#e5ede8] p-7 text-[#132d3a] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#346a62]">
                    MAKE A LITTLE ROOM
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    Your next story starts with somewhere.
                </h2>
                <p className="mt-2 text-sm">
                    Find a stay that fits the dates you have.
                </p>
            </div>
            <a
                href="#search"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#132d3a] px-5 py-3 text-sm text-white"
            >
                Check availability <HiArrowRight />
            </a>
        </section>
    )
}
