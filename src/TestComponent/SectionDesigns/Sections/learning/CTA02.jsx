import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="rounded-xl border border-gray-200 bg-[#f5f1e8] p-8 text-[#102d36] sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#3c7e5d]">
                        ENTERPRISE RESIDENCY FOR DESIGN & TECH TEAMS
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                        Transform Your Product Organization’s Craft Standard
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#102d36]/70">
                        Custom 4-to-8 week private studios for product design, engineering, and design operations teams at Stripe, Figma, and Airbnb.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#enterprise-quote"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#102d36] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#3c7e5d] transition-colors"
                    >
                        <span>Request Custom Enterprise Syllabus</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-gray-500 text-center">
                        Minimum cohort size: 6 engineers/designers
                    </span>
                </div>
            </div>
        </section>
    )
}
