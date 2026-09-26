import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#e7d4c8] bg-white p-7 text-[#27201d] sm:p-9">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#a34c38]">
                        THE COMMONROOM NOTE
                    </p>
                    <h2 className="mt-2 text-3xl font-black">
                        Good things are happening nearby.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        A monthly note about groups, meetups, and member
                        stories.
                    </p>
                </div>
                <a
                    href="#newsletter"
                    className="inline-flex items-center gap-2 rounded-full bg-[#27201d] px-5 py-3 text-sm text-white"
                >
                    Get the note <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
