import { HiArrowRight } from 'react-icons/hi'
export default function Hero04() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#f3eee5] text-[#28221e]">
            <div className="grid min-h-[390px] md:grid-cols-[.7fr_1.3fr]">
                <div className="flex flex-col justify-between p-7 sm:p-10">
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#a84f34]">
                        THE DAILY / NO. 246
                    </p>
                    <h2 className="my-8 font-serif text-5xl leading-none">
                        A small thought
                        <br />
                        for a large day.
                    </h2>
                    <a
                        href="#today"
                        className="inline-flex items-center gap-2 text-sm"
                    >
                        Today&apos;s note <HiArrowRight />
                    </a>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85"
                        alt="Quiet golden morning light"
                    />
                    <span className="absolute bottom-4 left-4 bg-[#f3eee5] px-3 py-2 text-xs">
                        A three-minute read
                    </span>
                </div>
            </div>
        </section>
    )
}
