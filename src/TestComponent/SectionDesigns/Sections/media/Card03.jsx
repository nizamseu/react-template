import { HiOutlineBookmark } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="rounded-lg border border-[#d7cec0] bg-[#f3eee5] p-5 text-[#28221e]">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[#a84f34]">
                    THE READING LIST
                </p>
                <HiOutlineBookmark />
            </div>
            <h3 className="mt-5 font-serif text-3xl">
                Three pieces for a slower Sunday.
            </h3>
            <ol className="mt-4 space-y-3 border-t border-[#d7cec0] pt-4 text-sm">
                <li>01 &nbsp; The city after rain</li>
                <li>02 &nbsp; Notes on noticing</li>
                <li>03 &nbsp; A room of one&apos;s own, again</li>
            </ol>
        </article>
    )
}
