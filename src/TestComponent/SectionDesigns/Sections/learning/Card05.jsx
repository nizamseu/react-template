import { HiArrowRight, HiOutlineAcademicCap } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="rounded-lg border border-[#dce5dc] bg-[#f5f1e8] p-5 text-[#102d36]">
            <div className="flex items-center justify-between">
                <HiOutlineAcademicCap className="text-2xl text-[#3c7e5d]" />
                <span className="rounded-full bg-[#c8ef70] px-3 py-1 text-[10px] font-bold">
                    LIVE / 24 OCT
                </span>
            </div>
            <h3 className="mt-5 font-serif text-2xl">
                Portfolio clinic: bring your work in progress.
            </h3>
            <p className="mt-2 text-sm text-gray-600">
                A generous critique session with working designers.
            </p>
            <a
                href="#event"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold"
            >
                Save your place <HiArrowRight />
            </a>
        </article>
    )
}
