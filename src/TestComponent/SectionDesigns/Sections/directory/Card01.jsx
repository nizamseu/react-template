import { HiArrowRight, HiLocationMarker, HiStar } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="rounded-lg border border-[#d9e0d8] bg-white p-5 text-[#1a2826]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#527354]">
                        HOME / REPAIR
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                        Northside Workshop
                    </h3>
                </div>
                <HiArrowRight className="text-lg" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
                Thoughtful repairs for old houses and new ideas.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-xs">
                <span className="flex items-center gap-1">
                    <HiLocationMarker />
                    1.2 mi away
                </span>
                <span className="flex items-center gap-1">
                    <HiStar className="text-[#a17625]" />
                    4.9 / 86 reviews
                </span>
                <span className="rounded-full bg-[#d9f064] px-3 py-1 font-semibold">
                    Open today
                </span>
            </div>
        </article>
    )
}
