import { HiArrowRight } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#f5f1e8] text-[#102d36] md:grid-cols-[.72fr_1.28fr]">
            <div className="flex flex-col justify-between p-7 sm:p-10">
                <p className="text-xs font-bold uppercase text-[#3c7e5d]">
                    A BETTER WAY TO LEARN
                </p>
                <h2 className="my-10 font-serif text-5xl leading-none">
                    Small lessons.
                    <br />
                    Real momentum.
                </h2>
                <a
                    href="#paths"
                    className="inline-flex items-center gap-2 text-sm font-bold"
                >
                    Choose a learning path <HiArrowRight />
                </a>
            </div>
            <div className="relative min-h-64">
                <img
                    className="absolute inset-0 h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1100&q=85"
                    alt="Learners sharing ideas during a workshop"
                />
            </div>
        </section>
    )
}
