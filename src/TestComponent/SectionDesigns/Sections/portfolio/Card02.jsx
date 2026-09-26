import { HiArrowRight } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="overflow-hidden rounded-lg bg-[#ef6a4b] text-[#241d1a]">
            <div className="relative">
                <img
                    className="h-48 w-full object-cover"
                    src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=850&q=85"
                    alt="Bold visual identity system"
                />
                <span className="absolute left-3 top-3 bg-[#f1e9de] px-3 py-1 text-[10px] font-bold uppercase">
                    Identity / 2025
                </span>
            </div>
            <div className="flex justify-between p-5">
                <div>
                    <h3 className="text-xl font-black">
                        Field Notes / New language
                    </h3>
                    <p className="mt-1 text-sm">Strategy, identity, digital</p>
                </div>
                <HiArrowRight className="text-xl" />
            </div>
        </article>
    )
}
