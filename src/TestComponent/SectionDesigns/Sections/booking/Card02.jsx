import { HiArrowRight, HiStar } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="overflow-hidden rounded-lg bg-[#f0e6d8] text-[#132d3a]">
            <div className="relative">
                <img
                    className="h-44 w-full object-cover"
                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=850&q=85"
                    alt="Lake and mountains from a quiet cabin"
                />
                <span className="absolute bottom-3 left-3 bg-white px-3 py-1 text-[10px] font-bold uppercase">
                    Host&apos;s pick
                </span>
            </div>
            <div className="p-5">
                <p className="text-xs uppercase tracking-wide text-[#b65f47]">
                    LAKE DISTRICT / ENGLAND
                </p>
                <h3 className="mt-2 font-serif text-2xl">
                    The little house at water&apos;s edge
                </h3>
                <div className="mt-4 flex justify-between text-xs">
                    <span>2 guests · 2 nights</span>
                    <span className="flex items-center gap-1">
                        <HiStar className="text-[#d28b42]" />
                        4.97
                    </span>
                </div>
                <div className="mt-4 flex justify-between border-t border-[#d9cbb9] pt-4">
                    <b>
                        $320{' '}
                        <span className="font-normal text-gray-500">total</span>
                    </b>
                    <HiArrowRight className="text-[#b65f47]" />
                </div>
            </div>
        </article>
    )
}
