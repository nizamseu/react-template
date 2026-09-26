import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#27201d] p-8 text-white sm:p-11">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ffccad]">
                        MAKE YOUR INTEREST A MEETING PLACE
                    </p>
                    <h2 className="mt-2 max-w-xl text-3xl font-black">
                        Start a group around the thing you love.
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Set the tone, invite a few people, see what grows.
                    </p>
                </div>
                <a
                    href="#create"
                    className="inline-flex items-center gap-2 self-start rounded-full bg-[#ffccad] px-5 py-3 text-sm font-bold text-[#27201d]"
                >
                    Create a group <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
