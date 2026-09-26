import { HiStar } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="rounded-lg border-l-4 border-[#b65f47] bg-[#f8f5ef] p-6 text-[#132d3a]">
            <div className="flex items-center gap-1 text-[#d28b42]">
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
            </div>
            <blockquote className="mt-4 font-serif text-xl leading-7">
                “We came back with sandy shoes, a recipe, and a new favorite
                place.”
            </blockquote>
            <div className="mt-5 border-t border-[#e3dbce] pt-4 text-xs">
                <b>JULES & MARA</b>
                <span className="ml-2 text-gray-500">/ Verified guests</span>
            </div>
        </article>
    )
}
