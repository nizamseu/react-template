import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#ffccad] p-7 text-[#27201d] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em]">
                    YOUR PEOPLE ARE HERE
                </p>
                <h2 className="mt-2 text-3xl font-black">
                    Find a group where you can be yourself.
                </h2>
                <p className="mt-2 text-sm">
                    Shared interests make a pretty good beginning.
                </p>
            </div>
            <a
                href="#groups"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#27201d] px-5 py-3 text-sm text-white"
            >
                Find your people <HiArrowRight />
            </a>
        </section>
    )
}
