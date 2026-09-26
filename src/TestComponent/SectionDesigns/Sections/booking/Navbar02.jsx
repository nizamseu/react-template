import { HiArrowRight, HiOutlineGlobeAlt } from 'react-icons/hi'
export default function Navbar02() {
    return (
        <header className="rounded-lg bg-[#132d3a] px-5 py-4 text-white sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-serif text-2xl">
                    elsewhere.
                </a>
                <nav className="order-3 flex w-full gap-6 border-t border-white/15 pt-3 text-xs text-white/70 sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#stays">Find a stay</a>
                    <a href="#places">Places</a>
                    <a href="#journal">Field notes</a>
                    <a href="#hosts">For hosts</a>
                </nav>
                <div className="flex items-center gap-3 text-xs">
                    <button aria-label="Choose language">
                        <HiOutlineGlobeAlt />
                    </button>
                    <a href="#account">Sign in</a>
                    <a
                        href="#plan"
                        className="flex items-center gap-1 rounded-full bg-[#e07d5b] px-4 py-2"
                    >
                        Plan a trip <HiArrowRight />
                    </a>
                </div>
            </div>
        </header>
    )
}
