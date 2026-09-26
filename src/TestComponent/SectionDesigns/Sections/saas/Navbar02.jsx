import { HiArrowRight } from 'react-icons/hi'
export default function Navbar02() {
    return (
        <header className="rounded-lg bg-[#111a22] px-5 py-4 text-white sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <a href="#home" className="font-semibold">
                    northstar<span className="text-[#65e6b4]">.</span>
                </a>
                <nav className="order-3 flex w-full gap-6 border-t border-white/10 pt-3 text-xs text-white/65 sm:order-none sm:w-auto sm:border-0 sm:pt-0">
                    <a href="#platform">Platform</a>
                    <a href="#solutions">Solutions</a>
                    <a href="#customers">Customers</a>
                    <a href="#pricing">Pricing</a>
                </nav>
                <div className="flex items-center gap-4 text-xs">
                    <a href="#login">Log in</a>
                    <a
                        href="#trial"
                        className="rounded-md bg-[#65e6b4] px-4 py-2 font-bold text-[#111a22]"
                    >
                        Start free <HiArrowRight className="ml-1 inline" />
                    </a>
                </div>
            </div>
        </header>
    )
}
