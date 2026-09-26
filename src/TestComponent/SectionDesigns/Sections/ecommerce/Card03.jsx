import { HiOutlineHeart, HiStar } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <div className="relative rounded-md bg-[#f3f0ea] p-3">
                <img
                    className="h-52 w-full object-contain"
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"
                    alt="Red everyday running shoe"
                />
                <button
                    aria-label="Save shoe"
                    className="absolute right-3 top-3 rounded-full bg-white p-2 text-gray-800"
                >
                    <HiOutlineHeart />
                </button>
            </div>
            <div className="flex items-center justify-between pt-4">
                <span className="text-xs font-semibold uppercase text-[#6e685e]">
                    Field Runner / 02
                </span>
                <span className="flex items-center gap-1 text-xs">
                    <HiStar className="text-[#e3a124]" />
                    4.9
                </span>
            </div>
            <h3 className="mt-2 font-semibold">Everyday trail sneaker</h3>
            <div className="mt-3 flex items-center justify-between">
                <span className="text-sm">$118</span>
                <button className="rounded-full bg-[#1c1b19] px-4 py-2 text-xs font-semibold text-white">
                    Quick add
                </button>
            </div>
        </article>
    )
}
