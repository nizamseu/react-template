import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="rounded-lg bg-[#1a2826] p-8 text-white sm:p-11">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#d9f064]">
                        FOR LOCAL OWNERS
                    </p>
                    <h2 className="mt-2 max-w-xl text-3xl font-black">
                        Help the right neighbors find you.
                    </h2>
                    <p className="mt-2 text-sm text-white/60">
                        Claim your listing and keep the details current.
                    </p>
                </div>
                <a
                    href="#claim"
                    className="inline-flex items-center gap-2 self-start rounded-md bg-[#d9f064] px-5 py-3 text-sm font-bold text-[#1a2826]"
                >
                    Claim your listing <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
