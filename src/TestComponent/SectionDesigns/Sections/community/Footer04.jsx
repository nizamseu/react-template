import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#27201d] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ffccad]">
                        A little more human online
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-black">
                        Bring your people. We&apos;ll make room.
                    </h2>
                    <a
                        href="#join"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#ffccad] px-5 py-3 text-sm font-bold text-[#27201d]"
                    >
                        Join Commonroom <HiArrowRight />
                    </a>
                </div>
                <nav className="grid grid-cols-2 gap-x-8 gap-y-4 self-end text-sm text-white/60">
                    <a href="#about">About</a>
                    <a href="#groups">Groups</a>
                    <a href="#help">Help</a>
                    <a href="#contact">Contact</a>
                </nav>
            </div>
            <p className="mt-9 border-t border-white/15 pt-4 text-xs text-white/40">
                © Commonroom · Better together.
            </p>
        </footer>
    )
}
