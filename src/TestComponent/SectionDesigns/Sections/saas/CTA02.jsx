import { HiArrowRight } from 'react-icons/hi'

export default function CTA02() {
    return (
        <section className="rounded-xl border border-[#263640] bg-[#0e161c] p-8 text-white sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#65e6b4]">
                        ZERO-DOWNTIME INFRASTRUCTURE MIGRATION
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-black leading-tight">
                        Migrating from AWS or Datadog? We Do the Heavy Lifting.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Our dedicated distributed systems team collaborates with your engineering leads to map schemas, dual-write data, and execute DNS failover with zero production interruption.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#schedule-migration"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#65e6b4] px-6 py-3.5 font-mono text-xs font-bold text-[#0e161c] hover:bg-white transition-colors"
                    >
                        <span>Schedule Migration Discovery Call</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-white/50 text-center">
                        Includes complimentary $10k migration credit
                    </span>
                </div>
            </div>
        </section>
    )
}
