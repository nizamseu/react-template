import { HiArrowRight } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="rounded-lg bg-[#ffccad] p-7 text-[#27201d] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        MAKE SOMETHING TOGETHER
                    </p>
                    <h2 className="mt-4 text-5xl font-black leading-[.94]">
                        Your idea has a community.
                    </h2>
                </div>
                <div className="flex flex-col justify-end">
                    <p className="max-w-md text-sm leading-6">
                        Share what you&apos;re making, get thoughtful feedback,
                        and celebrate each small win along the way.
                    </p>
                    <a
                        href="#share"
                        className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-[#27201d] px-5 py-3 text-sm text-white"
                    >
                        Share your first post <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}
