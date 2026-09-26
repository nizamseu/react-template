import { HiArrowRight, HiOutlineClock, HiOutlineUserGroup } from 'react-icons/hi'

export default function Card01() {
    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#0e272f] p-5 text-[#e8f3ea] shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#c8ef70]">
                    10-WEEK INTENSIVE &bull; COHORT 04
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1b3e49] px-2.5 py-0.5 text-[10px] text-white">
                    <HiOutlineUserGroup /> 18 Students Max
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                    Creative Direction & Systems for Modern Brands
                </h3>
                <p className="mt-2 text-xs text-white/70">
                    Lead by former design directors from Pentagram and Apple. Transition from senior craftsperson into visionary design leadership.
                </p>

                {/* 4-Week Milestone Roadmap */}
                <div className="mt-4 space-y-2 rounded-xl bg-white/5 p-3 text-xs border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#c8ef70]">W01 &bull; STRATEGY</span>
                        <span className="text-white/80">Cultural Positioning & Voice</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#c8ef70]">W03 &bull; IDENTITY</span>
                        <span className="text-white/80">Kinetic Typography Systems</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-[#c8ef70]">W06 &bull; SPATIAL</span>
                        <span className="text-white/80">3D Interactive Environments</span>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 font-mono text-xs text-white/60">
                        <HiOutlineClock />
                        <span>Starts Oct 15 &bull; $1,450</span>
                    </div>
                    <a
                        href="#cohort-detail"
                        className="inline-flex items-center gap-1 rounded-full bg-[#c8ef70] px-4 py-1.5 font-mono text-xs font-bold text-[#0e272f] hover:bg-white transition-colors"
                    >
                        <span>Syllabus</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}
