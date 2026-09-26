import { HiArrowRight } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="grid overflow-hidden rounded-lg bg-[#e7d9c7] text-[#28221e] sm:grid-cols-[1fr_auto]">
            <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a84f34]">
                    FROM THE ARCHIVE / 1998
                </p>
                <h3 className="mt-3 font-serif text-2xl">
                    The case for keeping a paper notebook.
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                    A rediscovered essay by editor-in-chief Mara Wells.
                </p>
            </div>
            <a
                href="#archive"
                aria-label="Read archive essay"
                className="flex items-center justify-center bg-[#d4c0a6] p-5 text-xl"
            >
                <HiArrowRight />
            </a>
        </article>
    )
}
