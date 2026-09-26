import { HiArrowRight, HiOutlineCode } from 'react-icons/hi'

export default function CTA04() {
    return (
        <section className="rounded-xl border border-white/10 bg-[#182622] p-8 text-white sm:p-12 shadow-2xl font-mono">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#d9f064] font-bold">
                        <HiOutlineCode className="text-base" /> OPEN DIRECTORY API &bull; REST & GRAPHQL
                    </span>
                    <h2 className="mt-2 font-sans text-3xl font-bold leading-tight text-white">
                        Access 4,820 Independent Place Records Programmatically
                    </h2>
                    <p className="mt-2 font-sans text-sm text-white/70">
                        Query geolocation coordinates, acoustic noise ratings, opening status, and verified scout critiques. Free rate-limited API keys for indie app developers and civic cartographers.
                    </p>
                </div>

                <a
                    href="#request-api"
                    className="inline-flex items-center justify-center gap-2 rounded bg-[#d9f064] px-6 py-3.5 text-xs font-bold text-[#14201e] hover:bg-white transition-colors shrink-0"
                >
                    <span>Request Free API Key</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
