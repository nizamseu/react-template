import { HiArrowRight } from 'react-icons/hi'
export default function Footer05() {
    return (
        <footer className="rounded-lg bg-[#132d3a] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#f0aa8d]">
                        Somewhere is calling
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        Find a place to let the week fall away.
                    </h2>
                    <a
                        href="#search"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#f0aa8d] pb-2 text-sm"
                    >
                        Browse all stays <HiArrowRight />
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-x-7 gap-y-3 self-end text-xs text-white/60">
                    <a href="#coast">Coastal stays</a>
                    <a href="#cabins">Cabins</a>
                    <a href="#city">City breaks</a>
                    <a href="#hosts">Meet the hosts</a>
                </div>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © Elsewhere · Travel well.
            </p>
        </footer>
    )
}
