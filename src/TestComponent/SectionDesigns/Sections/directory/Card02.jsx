import { HiArrowRight, HiOutlineLocationMarker } from 'react-icons/hi'

export default function Card02() {
    return (
        <article className="overflow-hidden rounded-xl border border-gray-200 bg-[#f5f8f5] p-5 text-[#1a2826] shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#527354] font-bold">
                    INDEPENDENT DESIGN STUDIO
                </span>
                <span className="rounded bg-[#527354]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#527354]">
                    35 SPECIALISTS
                </span>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <HiOutlineLocationMarker className="text-[#527354]" />
                    <span>Rotterdam, Netherlands</span>
                </div>

                <h3 className="mt-1 font-bold text-xl leading-tight">
                    Studio Dumbar / DEPT
                </h3>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                    Pioneering international design agency specializing in kinetic identity, generative code, and large-scale public cultural institutions.
                </p>

                {/* Capabilities tags */}
                <div className="mt-4 flex flex-wrap gap-1.5 font-mono text-[10px]">
                    <span className="rounded bg-white px-2 py-1 border border-gray-200">#KineticIdentity</span>
                    <span className="rounded bg-white px-2 py-1 border border-gray-200">#CreativeCoding</span>
                    <span className="rounded bg-white px-2 py-1 border border-gray-200">#CustomTypography</span>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
                    <span className="font-mono text-gray-500">Rates: $180–$250/hr</span>
                    <a
                        href="#studio-profile"
                        className="inline-flex items-center gap-1 font-bold text-[#527354] hover:underline"
                    >
                        <span>View Studio Portfolio</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}
