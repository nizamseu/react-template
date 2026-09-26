import { HiArrowRight, HiOutlineMail } from 'react-icons/hi'

export default function CTA03() {
    return (
        <section className="rounded-xl border border-black/15 bg-white p-8 text-black sm:p-12 shadow-sm">
            <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#a8472b]">
                    <HiOutlineMail className="text-sm" /> THE 7:00 AM MORNING DISPATCH
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-normal leading-tight">
                    Three Remarkable Essays Delivered to Your Inbox Every Sunrise
                </h2>
                <p className="mt-2 text-sm text-black/70 leading-relaxed">
                    Zero news cycle outrage. Just three longform reflections on architecture, philosophy, and cultural anthropology curated by our editors. Read by 85,000 thinkers daily.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Enter email for morning dispatch..."
                        className="rounded-full border border-black/20 bg-neutral-50 px-5 py-3 text-xs text-black outline-none focus:border-[#a8472b] flex-1"
                    />
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1d1a] px-6 py-3 font-serif text-xs font-bold text-white hover:bg-[#a8472b] transition-colors shrink-0"
                    >
                        <span>Subscribe Free</span>
                        <HiArrowRight />
                    </button>
                </form>
            </div>
        </section>
    )
}
