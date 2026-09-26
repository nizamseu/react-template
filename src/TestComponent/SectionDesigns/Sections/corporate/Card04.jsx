import { HiShieldCheck } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="flex gap-4 rounded-lg border border-[#cbd5df] bg-white p-5 text-[#182434]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#dce9f6] text-[#3476c5]">
                <HiShieldCheck />
            </span>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#3476c5]">
                    GOVERNANCE / RISK
                </p>
                <h3 className="mt-1 font-semibold">
                    Confidence comes from clarity.
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                    Make ownership, controls, and accountability visible.
                </p>
            </div>
        </article>
    )
}
