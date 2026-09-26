import { HiArrowRight, HiOutlineMicrophone } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-xl border border-[#ded8cf] bg-[#f9f7f4] p-8 text-[#241d1a] sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#ef6a4b]">
                        <HiOutlineMicrophone className="text-sm" /> 2026/2027 SPEAKING CALENDAR
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                        Keynotes on Spatial Aesthetics & Design Systems
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#736a61]">
                        Booking keynote lectures, university masterclasses, and jury panels for international design festivals including Awwwards Conf, OFFF Barcelona, and FITC Tokyo.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#book-speaking"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#241d1a] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#ef6a4b] transition-colors"
                    >
                        <span>Check Speaker Availability</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-[#736a61] text-center">
                        Represented globally by Atelier Speakers
                    </span>
                </div>
            </div>
        </section>
    )
}
