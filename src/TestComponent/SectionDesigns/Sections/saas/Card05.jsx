import { HiStar } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="rounded-lg border border-white/10 bg-[#1b2832] p-6 text-white">
            <div className="flex gap-1 text-[#65e6b4]">
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
                <HiStar />
            </div>
            <p className="mt-4 text-lg leading-7">
                “We stopped asking where the latest version lived and started
                shipping the work.”
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#65e6b4] text-xs font-bold text-[#111a22]">
                    AM
                </span>
                <div>
                    <p className="text-sm font-semibold">Ari Morgan</p>
                    <p className="text-xs text-white/50">
                        Head of Product · Matter
                    </p>
                </div>
            </div>
        </article>
    )
}
