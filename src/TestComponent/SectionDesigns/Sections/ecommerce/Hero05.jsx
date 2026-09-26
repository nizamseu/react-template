import { HiArrowRight } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#f4ebe4] text-[#241f1b] dark:bg-gray-800 dark:text-white">
            <div className="grid min-h-[390px] md:grid-cols-[1fr_1fr]">
                <div className="flex flex-col justify-center p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[.15em]">
                        A gift, already thought through
                    </p>
                    <h2 className="mt-4 font-serif text-5xl leading-[.95] sm:text-6xl">
                        For the ones
                        <br />
                        who show up.
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-6 text-gray-600 dark:text-gray-300">
                        A considered collection of little thank-yous, big
                        celebrations, and just-because.
                    </p>
                    <a
                        href="#gifts"
                        className="mt-6 inline-flex items-center gap-3 self-start rounded-full bg-[#2a85ff] px-5 py-3 text-sm font-semibold text-white"
                    >
                        Find their thing <HiArrowRight />
                    </a>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=1000&q=85"
                        alt="Colorful thoughtful gifts ready to be shared"
                    />
                    <span className="absolute bottom-5 right-5 bg-white px-4 py-2 text-xs font-semibold text-gray-900">
                        THE GIFT EDIT / Nº 06
                    </span>
                </div>
            </div>
        </section>
    )
}
