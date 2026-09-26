import { HiArrowRight } from 'react-icons/hi'
export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#27201d] px-5 py-4 text-white">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <a href="#home" className="text-xl font-black">
                    COMMONROOM
                </a>
                <nav className="flex gap-5 overflow-x-auto text-xs text-white/60">
                    <a href="#photography">Photography</a>
                    <a href="#food">Food</a>
                    <a href="#outdoors">Outdoors</a>
                    <a href="#makers">Makers</a>
                </nav>
                <a
                    href="#new-group"
                    className="flex items-center gap-2 self-start text-xs text-[#ffccad]"
                >
                    Start a group <HiArrowRight />
                </a>
            </div>
        </header>
    )
}
