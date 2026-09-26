import { HiArrowRight, HiOutlineBookOpen } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="rounded-lg border border-[#dce3dd] bg-white p-5 text-[#17231f]">
            <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#e8f0eb] text-[#41715d]">
                    <HiOutlineBookOpen />
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                    GUIDE / 04 MIN
                </span>
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#41715d]">
                GETTING STARTED
            </p>
            <h3 className="mt-2 text-xl font-semibold">
                Invite your team and set up roles.
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
                Choose the right access for each person before your first
                project.
            </p>
            <a
                href="#guide"
                className="mt-5 inline-flex items-center gap-2 border-t border-gray-100 pt-4 text-sm font-semibold"
            >
                Read the guide <HiArrowRight />
            </a>
        </article>
    )
}
