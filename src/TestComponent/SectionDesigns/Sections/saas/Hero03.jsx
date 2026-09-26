import { HiArrowRight } from 'react-icons/hi'
export default function Hero03() {
    return (
        <section className="grid overflow-hidden rounded-lg bg-[#1b2832] text-white md:grid-cols-[1fr_.9fr]">
            <div className="flex flex-col justify-between p-7 sm:p-11">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#65e6b4]">
                    OPERATIONS / WITHOUT THE SPREADSHEETS
                </p>
                <h2 className="my-10 text-5xl font-semibold leading-none">
                    Your whole team,
                    <br />
                    in sync.
                </h2>
                <a
                    href="#demo"
                    className="inline-flex items-center gap-2 text-sm"
                >
                    See the workflow <HiArrowRight />
                </a>
            </div>
            <div className="m-5 rounded-lg border border-white/10 bg-[#111a22] p-5">
                <p className="text-xs text-white/50">PROJECT HEALTH</p>
                <p className="mt-3 text-3xl font-semibold">
                    On track <span className="text-[#65e6b4]">↗</span>
                </p>
                <div className="mt-6 space-y-3">
                    {['Design review', 'Customer preview', 'Release notes'].map(
                        (task, i) => (
                            <div
                                key={task}
                                className="flex justify-between border-t border-white/10 pt-3 text-xs"
                            >
                                <span>{task}</span>
                                <span className="text-[#65e6b4]">
                                    {['Done', 'Today', 'Next'][i]}
                                </span>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </section>
    )
}
