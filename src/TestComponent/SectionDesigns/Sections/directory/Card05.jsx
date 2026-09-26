import { HiArrowRight, HiOutlineAdjustments } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="rounded-lg border border-[#d4ddd1] bg-white p-5 text-[#1a2826]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#527354]">
                    SEARCH THAT FITS
                </p>
                <HiOutlineAdjustments />
            </div>
            <h3 className="mt-4 text-xl font-bold">
                Useful filters. No sponsored surprises.
            </h3>
            <p className="mt-2 text-sm text-gray-600">
                Sort by distance, opening hours, services, and community
                ratings.
            </p>
            <a
                href="#filters"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d9f064] px-4 py-2 text-xs font-bold"
            >
                Explore filters <HiArrowRight />
            </a>
        </article>
    )
}
