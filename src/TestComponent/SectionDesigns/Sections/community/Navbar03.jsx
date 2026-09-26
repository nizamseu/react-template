import { HiOutlineMenu, HiUserGroup } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar03() {
    return (
        <header className="rounded-lg bg-[#ffccad] px-5 py-4 text-[#27201d]">
            <div className="flex items-center justify-between gap-4">
                <button
                    aria-label="Open community menu"
                    className="text-xl md:hidden"
                >
                    <HiOutlineMenu />
                </button>
                <a href="#home" className="flex items-center gap-2 font-bold">
                    <HiUserGroup className="text-[#a34c38]" /> the common room
                </a>
                <nav className="hidden gap-6 text-xs md:flex">
                    <a href="#discover">Discover</a>
                    <a href="#calendar">Calendar</a>
                    <a href="#hosts">Hosts</a>

                    <MegaMenu
                        category="community"
                        accent="#a34c38"
                        variant={3}
                    />
                </nav>
                <div className="flex items-center gap-3 text-xs">
                    <a href="#signin">Sign in</a>
                    <a
                        href="#create"
                        className="rounded-full bg-[#27201d] px-4 py-2 text-white"
                    >
                        Create a profile
                    </a>
                </div>

                <MegaMenu
                    category="community"
                    accent="#a34c38"
                    variant={3}
                    className="md:hidden"
                />
            </div>
        </header>
    )
}
