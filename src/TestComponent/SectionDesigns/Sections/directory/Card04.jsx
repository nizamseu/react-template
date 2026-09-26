import { HiArrowRight } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="rounded-lg bg-[#edf1e6] p-5 text-[#1a2826]">
            <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[#527354]">
                NEIGHBOR RECOMMENDS
            </p>
            <div className="mt-3 flex items-center gap-3">
                <img
                    className="h-12 w-12 rounded-full object-cover"
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                    alt="Local business owner"
                />
                <div>
                    <h3 className="font-semibold">Little Fern Garden Co.</h3>
                    <p className="text-xs text-gray-500">
                        Native plants · Workshops
                    </p>
                </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">
                “They helped us choose plants that actually thrive here.”
            </p>
            <a
                href="#fern"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold"
            >
                See the recommendation <HiArrowRight />
            </a>
        </article>
    )
}
