import { HiArrowRight, HiUserGroup } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="rounded-lg bg-[#f7ede6] p-5 text-[#27201d]">
            <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#d5e6bb] px-3 py-1 text-[10px] font-bold uppercase">
                    Books / Weekly
                </span>
                <HiUserGroup className="text-xl text-[#a34c38]" />
            </div>
            <h3 className="mt-5 text-2xl font-black">
                The unfinished chapter club.
            </h3>
            <p className="mt-2 text-sm text-gray-600">
                Read a little, talk a lot. No homework, just good company.
            </p>
            <div className="mt-5 flex justify-between border-t border-[#e4d8d0] pt-4 text-xs">
                <span>327 neighbors</span>
                <a
                    href="#club"
                    className="flex items-center gap-1 font-semibold"
                >
                    Drop in <HiArrowRight />
                </a>
            </div>
        </article>
    )
}
