import { HiOutlineLocationMarker } from 'react-icons/hi'
export default function Navbar03() {
    return (
        <header className="rounded-lg border border-[#d4ddd1] bg-white px-5 py-3 text-[#1a2826]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-bold">
                    Good Neighbor<span className="text-[#527354]">.</span>
                </a>
                <nav className="order-3 flex w-full gap-5 border-t pt-3 text-xs sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#services">Services</a>
                    <a href="#food">Food & drink</a>
                    <a href="#shops">Shops</a>
                    <a href="#community">Community</a>
                </nav>
                <a
                    href="#location"
                    className="flex items-center gap-1 rounded-full bg-[#edf1e6] px-3 py-2 text-xs"
                >
                    <HiOutlineLocationMarker /> Eastside
                </a>
            </div>
        </header>
    )
}
