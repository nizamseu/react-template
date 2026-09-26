import { HiArrowRight } from 'react-icons/hi'
export default function Hero02() {
    return (
        <section className="rounded-lg bg-[#65e6b4] p-8 text-[#111a22] sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[.16em]">
                SOFTWARE THAT GETS OUT OF THE WAY
            </p>
            <div className="mt-8 grid gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
                <h2 className="text-5xl font-semibold leading-[.92] sm:text-7xl">
                    Make room
                    <br />
                    for the work.
                </h2>
                <div>
                    <p className="text-sm leading-6">
                        One connected workspace for planning, shipping, and
                        learning what worked.
                    </p>
                    <a
                        href="#try"
                        className="mt-5 inline-flex items-center gap-2 rounded-md bg-[#111a22] px-5 py-3 text-sm text-white"
                    >
                        Start your trial <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}
