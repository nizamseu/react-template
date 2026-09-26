import { HiOutlineClock, HiStar } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="flex flex-col justify-between rounded-lg border border-[#dce5dc] bg-white p-5 text-[#102d36]">
            <div>
                <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#3c7e5d]">
                        CREATIVE PRACTICE
                    </span>
                    <span className="flex items-center gap-1">
                        <HiStar className="text-[#d8a345]" />
                        4.9
                    </span>
                </div>
                <h3 className="mt-4 font-serif text-2xl">
                    Make your ideas visible.
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                    A hands-on class in sketching, mapping, and finding the
                    story.
                </p>
            </div>
            <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <HiOutlineClock /> 45 min
                </span>
                <span>Beginner friendly →</span>
            </div>
        </article>
    )
}
