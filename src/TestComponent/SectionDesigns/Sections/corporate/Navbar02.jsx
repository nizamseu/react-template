import { HiArrowRight } from 'react-icons/hi'
export default function Navbar02() {
    return (
        <header className="rounded-lg bg-[#121c2c] px-5 py-4 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="text-xs font-bold tracking-[.14em]">
                    NORTHSTAR / ADVISORY
                </a>
                <nav className="order-3 flex w-full gap-6 border-t border-white/15 pt-3 text-xs text-white/65 sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#expertise">Expertise</a>
                    <a href="#sectors">Sectors</a>
                    <a href="#insights">Insights</a>
                    <a href="#careers">Careers</a>
                </nav>
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-xs text-[#84b9ff]"
                >
                    Let&apos;s talk <HiArrowRight />
                </a>
            </div>
        </header>
    )
}
