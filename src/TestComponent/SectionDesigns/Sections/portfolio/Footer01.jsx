import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#241d1a] p-7 text-[#f5eee5] sm:p-10">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#ef6a4b]">
                        Have a good one in mind?
                    </p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-black uppercase leading-[.9]">
                        Let&apos;s make something useful.
                    </h2>
                    <a
                        href="mailto:hello@jamie.example"
                        className="mt-5 inline-flex items-center gap-2 border-b border-[#ef6a4b] pb-2 text-sm"
                    >
                        Send a note <HiArrowRight />
                    </a>
                </div>
                <div className="text-sm text-white/60">
                    <p>Brooklyn, NY · Working everywhere</p>
                    <p className="mt-3">
                        Instagram ↗ &nbsp; LinkedIn ↗ &nbsp; Are.na ↗
                    </p>
                </div>
            </div>
            <div className="mt-10 flex justify-between border-t border-white/15 pt-4 text-xs text-white/40">
                <span>© Jamie Park 2026</span>
                <span>Site by Jamie, with care.</span>
            </div>
        </footer>
    )
}
