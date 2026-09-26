import { HiArrowRight } from 'react-icons/hi'
export default function Navbar02() {
    return (
        <header className="rounded-lg bg-[#f5f1e8] px-5 py-4 text-[#102d36]">
            <div className="grid grid-cols-[1fr_auto] items-center gap-4 sm:grid-cols-[auto_1fr_auto]">
                <a href="#home" className="font-serif text-2xl">
                    Fieldnote Class
                </a>
                <nav className="hidden justify-center gap-6 text-xs sm:flex">
                    <a href="#learn">Learn</a>
                    <a href="#teach">Teach</a>
                    <a href="#community">Community</a>
                    <a href="#stories">Stories</a>
                </nav>
                <a
                    href="#join"
                    className="justify-self-end rounded-full bg-[#102d36] px-4 py-2 text-xs font-semibold text-white"
                >
                    Join the studio <HiArrowRight className="ml-1 inline" />
                </a>
            </div>
            <nav className="mt-3 flex gap-5 overflow-x-auto border-t border-[#dce5dc] pt-3 text-xs text-gray-600 sm:hidden">
                <a href="#learn">Learn</a>
                <a href="#teach">Teach</a>
                <a href="#community">Community</a>
                <a href="#stories">Stories</a>
            </nav>
        </header>
    )
}
