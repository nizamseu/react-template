import { HiCheckCircle } from 'react-icons/hi'
export default function Card04() {
    return (
        <article className="rounded-lg border border-[#d7e0da] bg-white p-5 text-[#132d3a]">
            <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#346a62]">
                BOOK WITH CONFIDENCE
            </p>
            <h3 className="mt-3 text-xl font-semibold">
                Know the full picture before you confirm.
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-gray-600">
                {[
                    'Clear total price',
                    'Flexible cancellation terms',
                    'Verified host details',
                ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                        <HiCheckCircle className="text-[#346a62]" />
                        {item}
                    </li>
                ))}
            </ul>
        </article>
    )
}
