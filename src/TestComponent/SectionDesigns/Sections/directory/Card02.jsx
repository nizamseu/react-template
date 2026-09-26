import { HiArrowRight, HiBadgeCheck, HiStar } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="rounded-lg border border-[#d4ddd1] bg-white p-5 text-[#1a2826]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#527354]">
                        FINANCIAL SERVICES
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                        Harbor & Pine Accounting
                    </h3>
                </div>
                <HiBadgeCheck className="text-xl text-[#527354]" />
            </div>
            <p className="mt-2 text-sm text-gray-600">
                Bookkeeping and tax planning for independent businesses.
            </p>
            <div className="mt-4 flex justify-between border-t border-[#edf0ec] pt-4 text-xs">
                <span className="flex items-center gap-1">
                    <HiStar className="text-[#aa7a2e]" />
                    4.9 · 86 reviews
                </span>
                <a href="#listing" aria-label="View listing">
                    <HiArrowRight />
                </a>
            </div>
        </article>
    )
}
