import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#b65f47] p-7 text-white sm:p-10">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-white/70">
                        Know a place worth sharing?
                    </p>
                    <h2 className="mt-3 max-w-xl font-serif text-4xl">
                        Make room for the next good guest.
                    </h2>
                </div>
                <a
                    href="#host"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#132d3a]"
                >
                    Become a host <HiArrowRight />
                </a>
            </div>
            <div className="mt-9 flex justify-between border-t border-white/25 pt-4 text-xs text-white/70">
                <span>© Elsewhere 2026</span>
                <span>Hosting · Safety · Support</span>
            </div>
        </footer>
    )
}
