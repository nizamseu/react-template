import { HiOutlineMenuAlt3, HiOutlineShoppingBag } from 'react-icons/hi'
import MegaMenu from '@/TestComponent/SectionDesigns/MegaMenu'
export default function Navbar03() {
    return (
        <header className="rounded-lg border border-gray-200 bg-white px-5 py-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center">
                <button
                    aria-label="Open categories"
                    className="justify-self-start text-xl"
                >
                    <HiOutlineMenuAlt3 />
                </button>
                <a
                    href="#home"
                    className="font-serif text-xl font-bold tracking-tight"
                >
                    Maison / 08
                </a>
                <button
                    aria-label="Shopping bag"
                    className="flex items-center gap-2 justify-self-end text-sm"
                >
                    <HiOutlineShoppingBag />
                    <span className="hidden sm:inline">Bag (0)</span>
                </button>
            </div>
            <nav className="mt-4 flex justify-center gap-6 border-t border-gray-100 pt-3 text-[10px] font-semibold uppercase tracking-[.15em] text-gray-500 dark:border-gray-800">
                <a href="#living">Living</a>
                <a href="#wear">Wear</a>
                <a href="#objects">Objects</a>
                <a href="#stories">Stories</a>

                <MegaMenu category="ecommerce" accent="#9a704b" variant={3} />
            </nav>
        </header>
    )
}
