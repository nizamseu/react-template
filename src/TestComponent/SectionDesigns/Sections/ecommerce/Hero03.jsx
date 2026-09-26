import { HiArrowRight } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#d6f36a] md:grid-cols-[1.2fr_.8fr]">
            <div className="flex flex-col justify-between p-7 sm:p-10">
                <p className="text-xs font-bold uppercase tracking-[.16em]">
                    A smaller footprint / a longer life
                </p>
                <div className="py-12">
                    <h2 className="max-w-xl text-5xl font-black uppercase leading-[.9] sm:text-7xl">
                        Wear it
                        <br />
                        on repeat.
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-6">
                        Every piece in the circular edit is made to be repaired,
                        reworn, and handed down.
                    </p>
                    <a
                        href="#circular"
                        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1c1b19] px-5 py-3 text-sm font-semibold text-white"
                    >
                        Shop circular <HiArrowRight />
                    </a>
                </div>
                <p className="text-xs">01 / 05 &nbsp; THE CIRCULAR EDIT</p>
            </div>
            <img
                className="h-72 w-full object-cover md:h-full"
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85"
                alt="Thoughtfully styled everyday clothing"
            />
        </section>
    )
}
