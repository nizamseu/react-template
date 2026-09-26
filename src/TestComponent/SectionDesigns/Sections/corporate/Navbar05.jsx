import { HiArrowRight } from 'react-icons/hi'
export default function Navbar05() {
    return (
        <header className="rounded-lg bg-[#121c2c] px-5 py-4 text-white">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <a href="#home" className="text-xl font-semibold">
                    N / S
                </a>
                <nav className="flex gap-5 overflow-x-auto text-xs text-white/60">
                    <a href="#strategy">Strategy</a>
                    <a href="#transformation">Transformation</a>
                    <a href="#organization">Organization</a>
                    <a href="#growth">Growth</a>
                </nav>
                <a
                    href="#conversation"
                    className="flex items-center gap-2 self-start text-xs text-[#84b9ff]"
                >
                    A first conversation <HiArrowRight />
                </a>
            </div>
        </header>
    )
}
