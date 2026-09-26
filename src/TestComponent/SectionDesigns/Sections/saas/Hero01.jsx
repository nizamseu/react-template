import { HiArrowRight } from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#111a22] p-5 text-white sm:p-8">
            <div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr]">
                <div className="flex flex-col justify-center py-5">
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#65e6b4]">
                        NORTHSTAR / OPERATIONS CLOUD
                    </p>
                    <h2 className="mt-4 text-4xl font-semibold leading-[1.02] sm:text-6xl">
                        Less chasing.
                        <br />
                        More shipping.
                    </h2>
                    <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                        A calm command center for projects, people, and the work
                        between them.
                    </p>
                    <a
                        href="#product"
                        className="mt-6 inline-flex items-center gap-2 self-start rounded-md bg-[#65e6b4] px-5 py-3 text-sm font-bold text-[#111a22]"
                    >
                        See the platform <HiArrowRight />
                    </a>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#1b2832] p-4 sm:p-6">
                    <div className="flex justify-between text-xs text-white/55">
                        <span>Team workspace / Q3 launch</span>
                        <span>•••</span>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-3">
                        {[
                            ['Tasks', '128'],
                            ['On track', '86%'],
                            ['This week', '24'],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-md bg-[#24343e] p-3"
                            >
                                <p className="text-[10px] text-white/50">
                                    {label}
                                </p>
                                <p className="mt-2 text-xl font-semibold">
                                    {value}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 rounded-md bg-[#24343e] p-4">
                        <div className="flex justify-between text-xs">
                            <span>Release readiness</span>
                            <span className="text-[#65e6b4]">86%</span>
                        </div>
                        <div className="mt-3 h-1.5 rounded bg-white/10">
                            <div className="h-1.5 w-[86%] rounded bg-[#65e6b4]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
