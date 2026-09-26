import { HiArrowRight } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="rounded-lg bg-[#c8ef70] p-8 text-[#102d36] sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[.15em]">
                LEARN BY MAKING
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
                <h2 className="font-serif text-5xl leading-[.92] sm:text-7xl">
                    From curious
                    <br />
                    to capable.
                </h2>
                <div>
                    <p className="text-sm leading-6">
                        Practice-led courses for people who would rather make a
                        first draft than wait for perfect.
                    </p>
                    <a
                        href="#catalog"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#102d36] pb-2 text-sm font-semibold"
                    >
                        Browse the catalog <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}
