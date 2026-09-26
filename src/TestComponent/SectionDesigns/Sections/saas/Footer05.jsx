import { HiArrowRight } from 'react-icons/hi'
export default function Footer05() {
    return (
        <footer className="overflow-hidden rounded-lg bg-[#111a22] px-7 pt-8 text-white sm:px-10">
            <div className="flex flex-col justify-between gap-7 border-b border-white/15 pb-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#65e6b4]">
                        Build with confidence
                    </p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-semibold leading-none">
                        Your next chapter starts here.
                    </h2>
                </div>
                <a href="#talk" className="flex items-center gap-2 text-sm">
                    Talk to a specialist <HiArrowRight />
                </a>
            </div>
            <div className="flex flex-wrap justify-between gap-4 py-4 text-xs text-white/45">
                <span>© 2026 Northstar Software</span>
                <span>Built for teams around the world</span>
                <span>LinkedIn ↗ · GitHub ↗</span>
            </div>
        </footer>
    )
}
