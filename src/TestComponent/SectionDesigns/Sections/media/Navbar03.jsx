import { HiArrowRight } from 'react-icons/hi'
export default function Navbar03() {
    return (
        <header className="rounded-lg bg-[#28221e] px-5 py-4 text-[#f3eee5]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <a
                    href="#menu"
                    className="justify-self-start text-xs uppercase tracking-widest"
                >
                    Menu
                </a>
                <a href="#home" className="font-serif text-xl">
                    The Sunday Paper
                </a>
                <a
                    href="#join"
                    className="flex items-center gap-1 justify-self-end text-xs"
                >
                    Join <HiArrowRight />
                </a>
            </div>
            <p className="mt-3 border-t border-white/15 pt-3 text-center text-[9px] uppercase tracking-[.2em] text-white/45">
                Independent stories for a curious life
            </p>
        </header>
    )
}
