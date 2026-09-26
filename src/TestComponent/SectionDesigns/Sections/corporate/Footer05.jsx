import { HiArrowRight } from 'react-icons/hi'
export default function Footer05() {
    return (
        <footer className="rounded-lg border border-[#cbd5df] bg-[#f5f7f9] p-7 text-[#182434] sm:p-10">
            <div className="grid gap-7 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3476c5]">
                        Responsibility / In practice
                    </p>
                    <h2 className="mt-3 max-w-xl text-3xl font-semibold">
                        Progress should be good for more than the bottom line.
                    </h2>
                    <a
                        href="#impact"
                        className="mt-4 inline-flex items-center gap-1 text-sm"
                    >
                        Read our impact report <HiArrowRight />
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 self-end text-xs">
                    <a href="#governance">Governance</a>
                    <a href="#people">People</a>
                    <a href="#climate">Climate</a>
                    <a href="#communities">Communities</a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#cbd5df] pt-4 text-xs text-gray-500">
                © Northstar · Responsible business, in practice.
            </p>
        </footer>
    )
}
