import { HiArrowRight } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="rounded-lg border border-[#cbd5df] bg-[#f5f7f9] p-5 text-[#182434]">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#3476c5]">
                INSIGHT / ORGANIZATION
            </p>
            <h3 className="mt-4 text-2xl font-semibold">
                The hardest part of change is making it stick.
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
                Three ways leaders can turn a new direction into a daily
                practice.
            </p>
            <a
                href="#insight"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
            >
                Read the insight <HiArrowRight />
            </a>
        </article>
    )
}
