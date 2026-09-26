import { HiHeart, HiStar } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="overflow-hidden rounded-lg bg-[#f4f0e9]">
            <div className="relative">
                <img
                    className="h-52 w-full object-cover"
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=850&q=85"
                    alt="Quiet coastal house with a private pool"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[10px] font-semibold">
                    Guest favorite
                </span>
                <button
                    aria-label="Save stay"
                    className="absolute right-3 top-3 rounded-full bg-white p-2"
                >
                    <HiHeart />
                </button>
            </div>
            <div className="p-5 text-[#182833]">
                <div className="flex justify-between text-xs">
                    <span className="uppercase tracking-wide">
                        Comporta · Portugal
                    </span>
                    <span className="flex items-center gap-1">
                        <HiStar className="text-[#e07d5b]" />
                        4.96
                    </span>
                </div>
                <h3 className="mt-2 font-serif text-2xl">
                    The house among the pines
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    2 guests · 1 bedroom · Sea nearby
                </p>
                <p className="mt-4 text-sm font-semibold">
                    $184{' '}
                    <span className="font-normal text-gray-500">
                        / night · free cancellation
                    </span>
                </p>
            </div>
        </article>
    )
}
