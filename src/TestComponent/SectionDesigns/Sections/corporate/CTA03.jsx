import { HiArrowRight, HiOutlineDocumentDownload } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-xl border border-gray-200 bg-[#f5f7f9] p-8 text-[#182434] sm:p-12 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#3476c5]">
                        <HiOutlineDocumentDownload className="text-sm" /> 2026 CORPORATE GOVERNANCE DISCLOSURE
                    </span>
                    <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">
                        Download Our Complete 2026 ESG & Impact Disclosures
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        140 pages of carbon reduction metrics, board independence statistics, and climate risk scenario modeling independently assured by KPMG.
                    </p>
                </div>

                <a
                    href="#download-esg"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#182434] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-[#3476c5] transition-colors shrink-0"
                >
                    <span>Download ESG Audit (PDF)</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
