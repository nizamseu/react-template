import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#252721] p-7 text-[#f1eee6] sm:p-10">
            <div className="grid gap-9 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.2em] text-[#d6a08a]">
                        Read widely. Think slowly.
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        Good stories leave room to think.
                    </h2>
                    <form
                        className="mt-6 flex max-w-md border-b border-white/35"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            aria-label="Email for the weekly edition"
                            placeholder="Your email address"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                        />
                        <button aria-label="Subscribe" className="px-3">
                            <HiArrowRight />
                        </button>
                    </form>
                </div>
                <div className="grid grid-cols-2 gap-5 text-sm text-white/65">
                    <a href="#latest">Latest stories</a>
                    <a href="#membership">Membership</a>
                    <a href="#writers">Our writers</a>
                    <a href="#about">About Margin</a>
                    <a href="#podcast">Listen in</a>
                    <a href="#contact">Contact the desk</a>
                </div>
            </div>
            <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/40">
                <span>© 2026 Margin Journal</span>
                <span>Instagram · Mastodon · Privacy · Terms</span>
            </div>
        </footer>
    )
}
