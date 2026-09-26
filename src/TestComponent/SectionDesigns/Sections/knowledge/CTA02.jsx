import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#17231f] p-8 text-white sm:p-11">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#9bd2a7]">
                        BUILD WITH THE API
                    </p>
                    <h2 className="mt-2 max-w-xl text-3xl font-semibold">
                        Your next integration can start here.
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Explore endpoints, SDKs, and working examples.
                    </p>
                </div>
                <a
                    href="#api"
                    className="inline-flex items-center gap-2 self-start rounded-md bg-[#9bd2a7] px-5 py-3 text-sm font-bold text-[#17231f]"
                >
                    Open the API reference <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
