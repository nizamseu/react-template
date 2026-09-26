import { HiArrowRight } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="group overflow-hidden rounded-lg bg-[#f1eee9]">
            <div className="relative">
                <img
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=850&q=85"
                    alt="Bright editorial identity design"
                />
                <span className="absolute bottom-3 left-3 bg-[#ef6a4b] px-3 py-1 text-[10px] font-bold uppercase">
                    2025 / Identity
                </span>
            </div>
            <div className="flex justify-between p-5 text-[#241d1a]">
                <div>
                    <h3 className="text-xl font-bold">
                        Field Notes, reimagined.
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Brand strategy · Art direction · Digital
                    </p>
                </div>
                <HiArrowRight className="text-xl" />
            </div>
        </article>
    )
}
