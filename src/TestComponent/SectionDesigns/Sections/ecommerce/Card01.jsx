import { HiOutlineHeart, HiStar } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="group rounded-lg bg-[#f5f1e9] p-3 text-[#26211b]">
            <div className="relative overflow-hidden rounded-md bg-[#e9e2d5]">
                <img
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85"
                    alt="Model wearing a new season look"
                />
                <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide">
                    Staff pick
                </span>
                <button
                    aria-label="Save this look"
                    className="absolute right-3 top-3 rounded-full bg-white p-2"
                >
                    <HiOutlineHeart />
                </button>
            </div>
            <div className="flex items-start justify-between gap-3 px-2 pb-2 pt-4">
                <div>
                    <p className="text-[10px] uppercase tracking-[.14em] text-[#766b5e]">
                        STUDIO NORTH · LINEN
                    </p>
                    <h3 className="mt-1 font-semibold">The Sunday set</h3>
                    <p className="mt-1 text-xs text-[#766b5e]">
                        Natural / 3 colors
                    </p>
                </div>
                <div className="text-right">
                    <span className="flex items-center justify-end gap-1 text-xs">
                        <HiStar className="text-[#bd7b2e]" />
                        4.9
                    </span>
                    <p className="mt-2 text-sm font-semibold">$126</p>
                </div>
            </div>
        </article>
    )
}
