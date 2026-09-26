import { HiArrowRight } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="rounded-lg border-l-4 border-[#a84f34] bg-white p-6 text-[#28221e]">
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a84f34]">
                A NOTE FROM THE EDITOR
            </p>
            <h3 className="mt-3 font-serif text-2xl">
                Pay attention to what stays with you.
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
                The stories we remember have a way of becoming part of our own.
            </p>
            <a
                href="#letter"
                className="mt-5 inline-flex items-center gap-2 text-sm"
            >
                Read the letter <HiArrowRight />
            </a>
        </article>
    )
}
