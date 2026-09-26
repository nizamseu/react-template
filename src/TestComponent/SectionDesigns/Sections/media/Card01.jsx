import { HiArrowRight } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="group grid overflow-hidden rounded-lg bg-[#f1eee6] text-[#1f201c] sm:grid-cols-[.9fr_1.1fr]">
            <img
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-full"
                src="https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=85"
                alt="City skyline after sunset"
            />
            <div className="flex flex-col justify-between p-5">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a8472b]">
                        City / Essay / 8 min
                    </p>
                    <h3 className="mt-3 font-serif text-3xl leading-tight">
                        A quieter kind of city after dark.
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#626159]">
                        The late walkers, tiny kitchens, and third places that
                        keep a neighborhood awake.
                    </p>
                </div>
                <a
                    href="#story"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                >
                    Read the story <HiArrowRight />
                </a>
            </div>
        </article>
    )
}
