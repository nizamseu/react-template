import { HiArrowRight, HiOutlineDocumentDownload } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-8 text-[#102d36] sm:p-12 shadow-sm">
            <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#3c7e5d]">
                    <HiOutlineDocumentDownload className="text-sm" /> COMPLIMENTARY ACADEMIC DISPATCH
                </span>
                <h2 className="mt-3 font-serif text-3xl font-bold">
                    Download the 2026 Creative Craft Syllabus & Reading List
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    80 pages of curated lectures, typography exercises, shader math foundations, and our recommended reading list from 20+ visiting faculty members.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter email for instant PDF download..."
                        className="rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-xs text-[#102d36] outline-none focus:border-[#3c7e5d] flex-1"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3c7e5d] px-6 py-3 text-xs font-bold text-white hover:bg-[#102d36] transition-colors shrink-0"
                    >
                        <span>Download 80-Page Guide</span>
                        <HiArrowRight />
                    </button>
                </form>
            </div>
        </section>
    )
}
