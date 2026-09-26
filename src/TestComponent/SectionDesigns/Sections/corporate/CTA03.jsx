import { HiArrowRight } from 'react-icons/hi'
export default function CTA03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#e9edf1] text-[#182434] sm:grid-cols-[1fr_auto]">
            <div className="p-7 sm:p-9">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3476c5]">
                    LET&apos;S TALK ABOUT YOUR NEXT MOVE
                </p>
                <h2 className="mt-2 text-3xl font-semibold">
                    No big deck. Just a useful first conversation.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Tell us where you want to go and what&apos;s in the way.
                </p>
            </div>
            <div className="flex items-center p-7 pt-0 sm:p-8">
                <a
                    href="#schedule"
                    className="inline-flex items-center gap-2 rounded-md bg-[#3476c5] px-5 py-3 text-sm text-white"
                >
                    Schedule a conversation <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
