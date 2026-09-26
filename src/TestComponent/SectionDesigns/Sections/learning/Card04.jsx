import { HiStar } from 'react-icons/hi'

export default function Card04() {
    return (
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 text-[#102d36] shadow-md">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#3c7e5d] font-bold">
                    STUDENT CAPSTONE SHOWCASE
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-amber-500 font-bold">
                    <HiStar className="fill-amber-400" /> A+ EVALUATION
                </span>
            </div>

            <div className="relative mt-4 h-48 overflow-hidden rounded-xl bg-gray-100">
                <img
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=85"
                    alt="Kinetic brand system project by Maya Lin"
                />
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-lg font-bold">
                    Kinetic Type Engine for Sound Synthesizers
                </h3>
                <p className="mt-0.5 text-xs text-gray-500 font-medium">
                    By Maya Lin &bull; Cohort 03 Graduate &bull; Now at Studio Dumbar
                </p>

                {/* Scorecard Grid */}
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-2.5 text-center text-xs font-mono">
                    <div>
                        <span className="block text-[9px] text-gray-400">CONCEPT</span>
                        <span className="font-bold text-[#3c7e5d]">98 / 100</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400">SYSTEMS</span>
                        <span className="font-bold text-[#3c7e5d]">95 / 100</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400">EXECUTION</span>
                        <span className="font-bold text-[#3c7e5d]">100 / 100</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500 font-serif italic">&ldquo;Remarkable typographic rigor.&rdquo;</span>
                    <a href="#view-crit" className="font-bold text-[#3c7e5d] hover:underline">
                        View Critique &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}
