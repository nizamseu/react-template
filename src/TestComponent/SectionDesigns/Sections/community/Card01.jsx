import { HiArrowRight, HiUserGroup } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="overflow-hidden rounded-lg bg-[#f4eee7]">
            <div className="relative h-40 bg-[#ffccad]">
                <img
                    className="h-full w-full object-cover mix-blend-multiply"
                    src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=85"
                    alt="Friends sharing a meal"
                />
                <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs">
                    <HiUserGroup /> 842 members
                </span>
            </div>
            <div className="p-5 text-[#27201d]">
                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#a34c38]">
                    FOOD / LOCAL MEETUPS
                </p>
                <div className="mt-2 flex items-start justify-between">
                    <h3 className="max-w-[15rem] text-xl font-bold">
                        The Sunday Table
                    </h3>
                    <HiArrowRight className="text-[#a34c38]" />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                    Recipes, supper clubs, and a seat for one more.
                </p>
            </div>
        </article>
    )
}
