import { HiArrowRight } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="relative isolate overflow-hidden rounded-lg bg-[#121c2c] p-7 text-white sm:p-12">
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=85"
                alt=""
            />
            <p className="text-xs font-bold uppercase tracking-[.15em] text-[#84b9ff]">
                NORTHSTAR / BUSINESS ADVISORY
            </p>
            <h2 className="mt-5 max-w-3xl text-5xl font-semibold leading-[.95] sm:text-7xl">
                Make the complicated make sense.
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-5">
                <p className="max-w-sm text-sm text-white/65">
                    We help leaders find a practical way through high-stakes
                    change.
                </p>
                <a
                    href="#team"
                    className="inline-flex items-center gap-2 border-b border-[#84b9ff] pb-2 text-sm"
                >
                    Meet your partners <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
