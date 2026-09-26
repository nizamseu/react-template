import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#102d36] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#c8ef70]">
                        A good place to begin
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        Not sure where to start? Tell us what you want to learn.
                    </h2>
                    <a
                        href="#recommend"
                        className="mt-5 inline-flex items-center gap-2 text-sm"
                    >
                        Get a recommendation <HiArrowRight />
                    </a>
                </div>
                <nav className="grid grid-cols-2 gap-x-8 gap-y-4 self-end text-sm text-white/60">
                    <a href="#catalog">Browse all</a>
                    <a href="#pricing">Plans</a>
                    <a href="#faq">FAQ</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
            <div className="mt-9 flex justify-between border-t border-white/15 pt-4 text-xs text-white/40">
                <span>© Fieldnote Studio</span>
                <span>Instagram · YouTube · Privacy</span>
            </div>
        </footer>
    )
}
