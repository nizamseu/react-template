import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#dce9f6] p-7 text-[#121c2c] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3476c5]">
                        Northstar / Briefing
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-semibold">
                        Ideas for leaders shaping what&apos;s next.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-[#9fb5c9]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="northstar-brief">
                        Work email
                    </label>
                    <input
                        id="northstar-brief"
                        type="email"
                        placeholder="Work email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#b9cee1] pt-4 text-xs sm:grid-cols-4">
                <a href="#insights">Insights</a>
                <a href="#leadership">Leadership</a>
                <a href="#events">Events</a>
                <a href="#contact">Contact</a>
            </div>
        </footer>
    )
}
