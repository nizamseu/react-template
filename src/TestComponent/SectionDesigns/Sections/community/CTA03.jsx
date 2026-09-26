import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f7ede6] text-[#27201d] sm:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a34c38]">
                    MEET FACE TO FACE
                </p>
                <h2 className="mt-2 text-3xl font-black">
                    Good conversations don&apos;t have to stay online.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Find a local meetup or host a small gathering yourself.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 sm:p-8">
                <a
                    href="#calendar"
                    className="inline-flex items-center gap-2 rounded-md bg-[#a34c38] px-5 py-3 text-sm text-white"
                >
                    See the community calendar <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
