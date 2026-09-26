import { HiArrowRight } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="flex h-full flex-col justify-between rounded-lg bg-[#d6f36a] p-6 text-[#202315]">
            <div>
                <p className="text-xs font-bold uppercase tracking-[.14em]">
                    The material index
                </p>
                <h3 className="mt-4 font-serif text-3xl">
                    Know what
                    <br />
                    you bring home.
                </h3>
                <p className="mt-4 max-w-xs text-sm leading-6">
                    Every product comes with clear notes on origin, materials,
                    and care.
                </p>
            </div>
            <a
                href="#materials"
                className="mt-8 inline-flex items-center justify-between border-t border-[#8d9e43] pt-4 text-sm font-semibold"
            >
                Our sourcing promise <HiArrowRight />
            </a>
        </article>
    )
}
