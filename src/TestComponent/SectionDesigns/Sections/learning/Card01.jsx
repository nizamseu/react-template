import { HiArrowRight, HiPlay } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="group overflow-hidden rounded-lg bg-[#f1f0e8] text-[#102d36]">
            <div className="relative h-44 bg-[#c8ef70]">
                <img
                    className="h-full w-full object-cover mix-blend-multiply"
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=85"
                    alt="Course notes and open notebook"
                />
                <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#102d36] text-white">
                    <HiPlay />
                </span>
            </div>
            <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.15em]">
                    DESIGN / BEGINNER
                </p>
                <h3 className="mt-2 font-serif text-2xl">
                    Make a portfolio that feels like you.
                </h3>
                <div className="mt-4 h-1.5 rounded-full bg-[#d8d9ce]">
                    <div className="h-1.5 w-2/5 rounded-full bg-[#3c7e5d]" />
                </div>
                <p className="mt-2 text-xs text-gray-600">
                    2 of 5 lessons completed
                </p>
                <a
                    href="#course"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Continue learning <HiArrowRight />
                </a>
            </div>
        </article>
    )
}
