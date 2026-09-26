import { HiArrowRight, HiCalendar } from 'react-icons/hi'
export default function Card03() {
    return (
        <article className="grid overflow-hidden rounded-lg bg-[#d5e6bb] text-[#27201d] sm:grid-cols-[auto_1fr_auto]">
            <div className="flex flex-col items-center justify-center bg-[#a34c38] px-5 py-4 text-white">
                <span className="text-[10px] font-bold">OCT</span>
                <span className="text-3xl font-black">24</span>
            </div>
            <div className="p-5">
                <p className="text-[10px] font-bold uppercase tracking-[.13em]">
                    COMMUNITY MEETUP / BROOKLYN
                </p>
                <h3 className="mt-2 text-lg font-bold">
                    Coffee, sketchbooks, and a long table.
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    Saturday · 10:30 AM · 8 seats left
                </p>
            </div>
            <a
                href="#meetup"
                aria-label="View meetup"
                className="flex items-center justify-center px-5 text-xl"
            >
                <HiCalendar />
                <HiArrowRight />
            </a>
        </article>
    )
}
