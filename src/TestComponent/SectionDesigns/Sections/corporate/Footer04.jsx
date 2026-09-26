import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#121c2c] p-7 text-white sm:p-10">
            <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#84b9ff]">
                        The work starts with a conversation
                    </p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-semibold">
                        Tell us where you want to go.
                    </h2>
                </div>
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-md bg-[#84b9ff] px-5 py-3 text-sm font-semibold text-[#121c2c]"
                >
                    Get in touch <HiArrowRight />
                </a>
            </div>
            <div className="mt-5 flex flex-wrap justify-between gap-4 text-xs text-white/45">
                <span>© Northstar Advisory 2026</span>
                <span>Privacy · Terms · LinkedIn</span>
            </div>
        </footer>
    )
}
