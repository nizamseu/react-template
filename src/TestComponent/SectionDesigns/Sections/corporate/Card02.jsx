import { HiArrowRight, HiChartBar } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="rounded-lg bg-[#121c2c] p-6 text-white">
            <div className="flex justify-between">
                <span className="text-xs text-white/50">
                    CLIENT OUTCOME / 2025
                </span>
                <HiChartBar className="text-[#84b9ff]" />
            </div>
            <p className="mt-6 text-5xl font-semibold">2.4×</p>
            <h3 className="mt-2 font-semibold">Faster decision cycles.</h3>
            <p className="mt-2 text-sm text-white/55">
                After bringing three regional teams into one operating model.
            </p>
            <a
                href="#case-study"
                className="mt-5 inline-flex items-center gap-2 text-xs text-[#84b9ff]"
            >
                Read the case <HiArrowRight />
            </a>
        </article>
    )
}
