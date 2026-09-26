import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi'

export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#f3eee6] text-[#1c1b19] dark:bg-[#26231f] dark:text-white">
            <div className="grid min-h-[430px] md:grid-cols-[.88fr_1.12fr]">
                <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#685c4c] dark:text-[#d5c5ae]">
                        <HiOutlineSparkles className="text-lg" /> Objects with a
                        point of view
                    </div>
                    <div className="py-10 md:py-0">
                        <p className="text-sm text-[#846c4e]">
                            The autumn collection / 2026
                        </p>
                        <h2 className="mt-4 max-w-lg font-serif text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
                            Keep the good things close.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-[#625d55] dark:text-[#d0c9be]">
                            Useful, quietly beautiful pieces from independent
                            makers. Chosen to be used every day.
                        </p>
                        <a
                            href="#collection"
                            className="mt-7 inline-flex items-center gap-3 border-b border-[#1c1b19] pb-2 text-sm font-semibold dark:border-white"
                        >
                            Explore the collection <HiArrowRight />
                        </a>
                    </div>
                    <p className="text-xs text-[#777067]">
                        01 — 04 <span className="mx-2">/</span> Curated for
                        everyday
                    </p>
                </div>
                <div className="relative min-h-72 overflow-hidden bg-[#d2c3aa]">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=85"
                        alt="Handcrafted homeware arranged in warm natural light"
                    />
                    <div className="absolute bottom-5 left-5 max-w-[200px] bg-[#f8f5ef] p-4 text-[#1c1b19] sm:bottom-8 sm:left-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em]">
                            Maker no. 014
                        </p>
                        <p className="mt-1 font-serif text-xl">Form & Field</p>
                        <p className="mt-1 text-xs text-[#71695e]">
                            Small batch, made slowly
                        </p>
                    </div>
                    <span className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#d6f36a] text-[10px] font-bold uppercase leading-tight text-center text-[#202315]">
                        New
                        <br />
                        season
                    </span>
                </div>
            </div>
        </section>
    )
}
