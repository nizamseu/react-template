import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#132d3a] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#f0aa8d]">
                        A little farther, a little slower
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        Find a stay that feels like somewhere.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-white/40"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="travel-email">
                        Email
                    </label>
                    <input
                        id="travel-email"
                        type="email"
                        placeholder="Get the field notes"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button
                        aria-label="Subscribe"
                        className="px-3 text-[#f0aa8d]"
                    >
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 text-xs text-white/60 sm:grid-cols-4">
                <a href="#stays">Stays</a>
                <a href="#experiences">Experiences</a>
                <a href="#hosting">Hosting</a>
                <a href="#help">Help & safety</a>
            </div>
            <p className="mt-7 text-xs text-white/40">
                © Elsewhere Travel · Places, not checklists.
            </p>
        </footer>
    )
}
