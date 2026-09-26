import { HiStar } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="rounded-lg bg-[#e9edf1] p-6 text-[#182434]">
            <div className="flex gap-1 text-[#3476c5]">
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
            </div>
            <blockquote className="mt-4 text-lg leading-7">
                “They helped us move from a broad ambition to a plan our teams
                could act on Monday.”
            </blockquote>
            <div className="mt-5 border-t border-[#cbd5df] pt-4">
                <p className="text-sm font-semibold">Chief Operating Officer</p>
                <p className="mt-1 text-xs text-gray-500">
                    Global services organization
                </p>
            </div>
        </article>
    )
}
