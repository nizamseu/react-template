import { HiArrowRight } from 'react-icons/hi'
export default function CTA01() {
    return (
        <section className="flex flex-col justify-between gap-5 rounded-lg bg-[#d6f36a] p-7 text-[#202315] sm:flex-row sm:items-center sm:p-9">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em]">
                    THE GOOD THINGS EDIT
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    Find something you&apos;ll keep.
                </h2>
                <p className="mt-2 text-sm">
                    Thoughtful pieces from independent makers.
                </p>
            </div>
            <a
                href="#collection"
                className="inline-flex items-center gap-2 self-start rounded-full bg-[#202315] px-5 py-3 text-sm font-semibold text-white"
            >
                Explore the collection <HiArrowRight />
            </a>
        </section>
    )
}
