import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#263640] bg-[#17232b] p-7 text-white sm:p-9">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#65e6b4]">
                        NORTHSTAR / RELEASE NOTES
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold">
                        Updates that make the work lighter.
                    </h2>
                    <p className="mt-2 text-sm text-white/55">
                        A monthly note on useful product improvements.
                    </p>
                </div>
                <a
                    href="#updates"
                    className="inline-flex items-center gap-2 rounded-md bg-[#65e6b4] px-5 py-3 text-sm font-bold text-[#111a22]"
                >
                    Read the latest <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
