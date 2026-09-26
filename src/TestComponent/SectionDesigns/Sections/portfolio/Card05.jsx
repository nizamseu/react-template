import { HiStar } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="rounded-lg border-l-4 border-[#ef6a4b] bg-white p-6 text-[#241d1a]">
            <div className="flex gap-1 text-[#ef6a4b]">
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
            </div>
            <blockquote className="mt-4 font-serif text-xl leading-7">
                “Jamie knows how to make complex work feel clear without making
                it feel ordinary.”
            </blockquote>
            <p className="mt-5 border-t border-[#eee7df] pt-4 text-xs">
                ALEX MORGAN{' '}
                <span className="text-gray-500">/ Founder, Field Notes</span>
            </p>
        </article>
    )
}
