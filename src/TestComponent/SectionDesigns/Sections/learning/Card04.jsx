import { HiArrowRight } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="grid overflow-hidden rounded-lg bg-[#e3ebdd] sm:grid-cols-[.7fr_1.3fr]">
            <div className="flex items-center justify-center bg-[#c8ef70] p-5 text-5xl font-serif text-[#102d36]">
                04
            </div>
            <div className="p-5 text-[#102d36]">
                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#3c7e5d]">
                    A NOTE FROM YOUR MENTOR
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                    Ask better questions before you reach for answers.
                </h3>
                <a
                    href="#mentor"
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold"
                >
                    Read the field note <HiArrowRight />
                </a>
            </div>
        </article>
    )
}
