import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#241d1a] p-7 text-[#f5eee5] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ef6a4b]">
                        Have a question, a project, or a good book?
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        My inbox is open.
                    </h2>
                    <a
                        href="mailto:hello@jamie.example"
                        className="mt-5 inline-flex items-center gap-2 text-sm"
                    >
                        Write me a note <HiArrowRight />
                    </a>
                </div>
                <nav className="grid grid-cols-2 gap-3 self-end text-sm text-white/60">
                    <a href="#work">Selected work</a>
                    <a href="#about">About Jamie</a>
                    <a href="#credits">Credits</a>
                    <a href="#accessibility">Accessibility</a>
                </nav>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © Jamie Park 2026 · Built with care
            </p>
        </footer>
    )
}
