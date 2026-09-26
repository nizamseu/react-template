import { HiArrowRight } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="rounded-lg bg-[#111a22] p-5 text-white">
            <p className="text-xs text-white/50">CUSTOMER SUPPORT / Q3</p>
            <p className="mt-4 text-4xl font-semibold">−31%</p>
            <h3 className="mt-1 font-semibold">Time to resolution</h3>
            <p className="mt-2 text-xs text-[#65e6b4]">
                Fewer handoffs, faster answers
            </p>
            <HiArrowRight className="mt-5 text-[#65e6b4]" />
        </article>
    )
}
