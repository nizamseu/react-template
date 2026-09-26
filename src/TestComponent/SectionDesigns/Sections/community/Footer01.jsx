import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#27201d] p-7 text-[#fff4ec] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ffccad]">
                        Keep the good conversation going
                    </p>
                    <h2 className="mt-3 max-w-md text-4xl font-black leading-none">
                        The neighborhood note.
                    </h2>
                    <p className="mt-3 max-w-sm text-sm text-white/60">
                        A monthly roundup of meetups, new groups, and generous
                        ideas.
                    </p>
                </div>
                <form
                    className="flex items-end border-b border-white/40"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="community-email">
                        Email address
                    </label>
                    <input
                        id="community-email"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button
                        aria-label="Join the newsletter"
                        className="px-3 py-3 text-[#ffccad]"
                    >
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/45">
                <span>© Commonroom Community</span>
                <span>Guidelines · Safety · Accessibility · Contact</span>
            </div>
        </footer>
    )
}
