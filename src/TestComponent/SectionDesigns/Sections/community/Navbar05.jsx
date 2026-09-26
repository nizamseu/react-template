import { HiArrowRight } from 'react-icons/hi'
export default function Navbar05() {
    return (
        <header className="rounded-lg border border-[#e7d4c8] bg-white px-5 py-4 text-[#27201d]">
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[auto_1fr_auto]">
                <a href="#home" className="font-serif text-2xl">
                    Common / Local
                </a>
                <nav className="hidden justify-center gap-6 text-xs sm:flex">
                    <a href="#nearby">Nearby</a>
                    <a href="#meetups">Meetups</a>
                    <a href="#recommend">Recommend</a>
                </nav>
                <a
                    href="#welcome"
                    className="flex items-center gap-1 justify-self-end text-xs font-bold"
                >
                    Say hello <HiArrowRight />
                </a>
            </div>
        </header>
    )
}
