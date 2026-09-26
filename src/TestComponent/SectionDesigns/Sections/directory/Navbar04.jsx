import { HiArrowRight, HiOutlineMenu } from 'react-icons/hi'
export default function Navbar04() {
    return (
        <header className="rounded-lg bg-[#1a2826] px-5 py-4 text-white">
            <div className="flex items-center justify-between gap-4">
                <a
                    href="#home"
                    className="font-black uppercase tracking-[.12em]"
                >
                    THE LOCAL LIST
                </a>
                <nav className="hidden gap-6 text-xs text-white/65 md:flex">
                    <a href="#editors">Editor&apos;s picks</a>
                    <a href="#nearby">Nearby</a>
                    <a href="#categories">Categories</a>
                </nav>
                <div className="flex items-center gap-3">
                    <button
                        aria-label="Open menu"
                        className="text-xl md:hidden"
                    >
                        <HiOutlineMenu />
                    </button>
                    <a
                        href="#listing"
                        className="flex items-center gap-1 text-xs text-[#d9f064]"
                    >
                        Add a listing <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}
