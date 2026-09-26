import { HiArrowRight } from 'react-icons/hi'
export default function Footer05() {
    return (
        <footer className="overflow-hidden rounded-lg bg-[#211d18] px-7 pt-9 text-white sm:px-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d6f36a]">
                        One good thing at a time
                    </p>
                    <h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">
                        The shop for things with a story.
                    </h2>
                </div>
                <nav className="grid grid-cols-2 gap-x-8 gap-y-3 self-start text-sm text-white/70">
                    <a href="#objects">Objects</a>
                    <a href="#makers">Makers</a>
                    <a href="#wear">Wear</a>
                    <a href="#journal">Journal</a>
                    <a href="#help">Customer care</a>
                    <a href="#stockists">Stockists</a>
                </nav>
            </div>
            <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 py-4 text-xs text-white/50 sm:flex-row">
                <span>© 2026 Objects with a point of view</span>
                <span>
                    Follow the good stuff <HiArrowRight className="inline" />
                </span>
                <span>Legal / Accessibility</span>
            </div>
        </footer>
    )
}
