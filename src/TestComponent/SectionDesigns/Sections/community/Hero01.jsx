import { HiArrowRight } from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#ffccad] text-[#27201d]">
            <div className="grid min-h-[410px] md:grid-cols-[.95fr_1.05fr]">
                <div className="flex flex-col justify-between p-7 sm:p-11">
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        A place for your people
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-lg text-5xl font-black leading-[.95] sm:text-7xl">
                            Better things happen together.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-6">
                            Find your corner, meet generous minds, and keep the
                            conversation going.
                        </p>
                        <a
                            href="#communities"
                            className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#27201d] px-5 py-3 text-sm font-semibold text-white"
                        >
                            Meet your people <HiArrowRight />
                        </a>
                    </div>
                    <p className="text-xs">Be curious. Be kind. Be here.</p>
                </div>
                <div className="relative min-h-64">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=85"
                        alt="Friends sharing a relaxed afternoon together"
                    />
                    <span className="absolute bottom-4 right-4 rounded-full bg-[#ffccad] px-4 py-2 text-xs font-bold">
                        12,400 neighbors online
                    </span>
                </div>
            </div>
        </section>
    )
}
