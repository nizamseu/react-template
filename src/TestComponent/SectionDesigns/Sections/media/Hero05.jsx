import { HiArrowRight } from 'react-icons/hi'
export default function Hero05() {
    return (
        <section className="rounded-lg bg-[#a84f34] p-7 text-[#fff7ee] sm:p-11">
            <div className="grid gap-7 md:grid-cols-[1fr_.7fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.17em]">
                        A PUBLICATION FOR THE CURIOUS
                    </p>
                    <h2 className="mt-4 font-serif text-5xl leading-[.95] sm:text-6xl">
                        Good questions.
                        <br />
                        Better stories.
                    </h2>
                </div>
                <div className="flex flex-col justify-end">
                    <p className="text-sm leading-6 text-white/80">
                        Reporting and ideas for people who like to look a little
                        closer.
                    </p>
                    <a
                        href="#subscribe"
                        className="mt-5 inline-flex items-center gap-2 self-start border-b border-white pb-2 text-sm"
                    >
                        Get the Sunday edition <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}
