import { HiArrowRight, HiOutlineBell, HiOutlineMenu } from 'react-icons/hi'
export default function Navbar01() {
    return (
        <header className="rounded-lg border border-gray-200 bg-white px-5 py-3 dark:border-gray-700 dark:bg-[#111a22] dark:text-white sm:px-7">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        aria-label="Open navigation"
                        className="text-xl lg:hidden"
                    >
                        <HiOutlineMenu />
                    </button>
                    <a
                        href="#workspace"
                        className="font-semibold tracking-tight"
                    >
                        northstar<span className="text-[#17a878]">/</span>
                    </a>
                    <span className="hidden text-xs text-gray-400 sm:block">
                        Workspace / Product
                    </span>
                </div>
                <nav className="hidden gap-6 text-xs text-gray-500 lg:flex">
                    <a href="#overview">Overview</a>
                    <a href="#projects">Projects</a>
                    <a href="#reports">Reports</a>
                    <a href="#integrations">Integrations</a>
                </nav>
                <div className="flex items-center gap-4">
                    <button aria-label="Notifications">
                        <HiOutlineBell />
                    </button>
                    <a
                        href="#trial"
                        className="rounded-md bg-[#17232b] px-4 py-2 text-xs font-semibold text-white dark:bg-[#65e6b4] dark:text-[#111a22]"
                    >
                        Start trial <HiArrowRight className="ml-1 inline" />
                    </a>
                </div>
            </div>
        </header>
    )
}
