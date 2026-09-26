import { HiArrowRight } from 'react-icons/hi'
export default function Card01() {
    return (
        <article className="group overflow-hidden rounded-lg bg-[#e9edf1]">
            <img
                className="h-48 w-full object-cover"
                src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=85"
                alt="Team reviewing a project together"
            />
            <div className="flex items-end justify-between p-5 text-[#182434]">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#3476c5]">
                        CLIENT OUTCOME / OPERATIONS
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">
                        Making room for sustainable growth.
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        A five-year plan, built with the people doing the work.
                    </p>
                </div>
                <HiArrowRight className="mb-1 shrink-0 text-[#3476c5]" />
            </div>
        </article>
    )
}
