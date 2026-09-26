import { HiArrowRight } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-8 text-[#1a2826] sm:p-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[.25em] text-[#527354]">
                        PAID CITY SCOUT AMBASSADORSHIP &bull; 2026 FELLOWSHIP
                    </span>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold leading-tight">
                        Get Paid to Map the Soul of Your City
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        We compensate local writers, photographers, and architects to conduct anonymous field critiques of independent culture in Tokyo, Berlin, Paris, and London.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#apply-scout"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1a2826] px-6 py-3.5 text-xs font-bold text-white hover:bg-[#527354] transition-colors"
                    >
                        <span>Apply to Be a City Scout</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-gray-500 text-center">
                        Monthly stipend &bull; Editorial expense accounts
                    </span>
                </div>
            </div>
        </section>
    )
}
