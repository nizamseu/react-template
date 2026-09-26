import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#111a22] p-7 text-white sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#65e6b4]">
                        Northstar / Product notes
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold">
                        Only the updates worth opening.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-white/30"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="saas-news">
                        Work email
                    </label>
                    <input
                        id="saas-news"
                        type="email"
                        placeholder="Work email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button
                        aria-label="Subscribe"
                        className="px-3 text-[#65e6b4]"
                    >
                        <HiArrowRight />
                    </button>
                </form>
                <nav className="grid grid-cols-2 gap-3 text-xs text-white/60">
                    <a href="#customers">Customer stories</a>
                    <a href="#guides">Guides</a>
                    <a href="#events">Events</a>
                    <a href="#newsletter">Newsletter archive</a>
                </nav>
            </div>
            <p className="mt-8 text-xs text-white/40">
                © Northstar Inc. · Privacy · Security · Status
            </p>
        </footer>
    )
}
