import { HiArrowRight } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="group overflow-hidden rounded-lg bg-[#efe8dc]">
            <div className="relative overflow-hidden">
                <img
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=800&q=85"
                    alt="Sculptural handmade ceramic vase"
                />
                <span className="absolute left-4 top-4 bg-[#d6f36a] px-3 py-1 text-[10px] font-bold uppercase text-[#1c1b19]">
                    Small batch
                </span>
            </div>
            <div className="flex items-end justify-between p-5">
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-600">
                        FORM & FIELD · CERAMICS
                    </p>
                    <h3 className="mt-2 font-serif text-2xl">Tide vessel</h3>
                    <p className="mt-1 text-sm">$68</p>
                </div>
                <button
                    aria-label="View Tide vessel"
                    className="rounded-full border border-[#1c1b19] p-3"
                >
                    <HiArrowRight />
                </button>
            </div>
        </article>
    )
}
