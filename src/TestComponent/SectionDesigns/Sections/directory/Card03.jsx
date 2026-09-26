import { HiArrowRight, HiLocationMarker } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="overflow-hidden rounded-lg bg-[#1a2826] text-white">
            <div className="flex items-center justify-between bg-[#d9f064] p-4 text-[#1a2826]">
                <span className="text-xs font-bold uppercase tracking-[.12em]">
                    OPEN NOW / 0.8 MI
                </span>
                <HiLocationMarker />
            </div>
            <div className="p-5">
                <p className="text-[10px] text-white/45">HOME / BIKE REPAIR</p>
                <h3 className="mt-2 text-xl font-semibold">
                    Good Wheel Workshop
                </h3>
                <p className="mt-2 text-sm text-white/60">
                    Same-day tune-ups · Family owned since 1994
                </p>
                <a
                    href="#shop"
                    className="mt-5 inline-flex items-center gap-2 text-sm text-[#d9f064]"
                >
                    View hours & details <HiArrowRight />
                </a>
            </div>
        </article>
    )
}
