import { HiArrowRight, HiPlay } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="grid gap-7 rounded-lg bg-[#edf3ee] p-6 text-[#111a22] sm:p-9 lg:grid-cols-[.8fr_1.2fr]">
            <div className="flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-[.15em] text-[#137d62]">
                    A PRODUCT TOUR, NOT A PITCH
                </p>
                <h2 className="mt-4 text-4xl font-semibold leading-none sm:text-5xl">
                    See your work take shape.
                </h2>
                <p className="mt-4 text-sm leading-6 text-gray-600">
                    A two-minute tour of the space where good teams keep good
                    work moving.
                </p>
                <a
                    href="#tour"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Watch the product tour <HiArrowRight />
                </a>
            </div>
            <div className="relative min-h-60 overflow-hidden rounded-lg bg-[#111a22] p-5 text-white">
                <div className="grid grid-cols-3 gap-2">
                    {['Plan', 'Make', 'Ship'].map((step, i) => (
                        <div
                            key={step}
                            className="rounded bg-white/10 p-3 text-xs"
                        >
                            <span className="text-[#65e6b4]">0{i + 1}</span>
                            <p className="mt-3">{step}</p>
                        </div>
                    ))}
                </div>
                <button
                    aria-label="Play product tour"
                    className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#65e6b4] text-[#111a22]"
                >
                    <HiPlay />
                </button>
            </div>
        </section>
    )
}
