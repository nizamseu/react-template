import { HiArrowRight } from 'react-icons/hi'
export default function Navbar05() {
    return (
        <header className="rounded-lg border border-[#263640] bg-[#1b2832] px-5 py-4 text-white sm:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center justify-between">
                    <a href="#home" className="text-xl font-semibold">
                        signal<span className="text-[#65e6b4]">/</span>stack
                    </a>
                    <span className="text-[10px] text-white/45 sm:hidden">
                        STATUS: OPERATIONAL
                    </span>
                </div>
                <nav className="flex gap-5 overflow-x-auto text-xs text-white/60">
                    <a href="#developers">Developers</a>
                    <a href="#docs">Docs</a>
                    <a href="#customers">Customers</a>
                    <a href="#pricing">Pricing</a>
                </nav>
                <a
                    href="#start"
                    className="hidden items-center gap-2 text-xs text-[#65e6b4] sm:flex"
                >
                    Get started <HiArrowRight />
                </a>
            </div>
        </header>
    )
}
