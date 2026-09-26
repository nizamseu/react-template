import { useState } from 'react'
import { HiOutlineCalendar, HiCheck } from 'react-icons/hi'

export default function CTA04() {
    const [added, setAdded] = useState(false)

    return (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#1c1b18] p-8 text-white sm:p-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                <div>
                    <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest">
                        UPCOMING COLLABORATION &bull; 100 PIECES WORLDWIDE
                    </span>
                    <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-light text-white">
                        STUDIO NORD &times; GOODFORM: Volcanic Ceramics & Raw Wool
                    </h2>
                </div>
                <div className="font-mono text-xs text-white/60 shrink-0">
                    DROP DATE: OCT 24, 2026 &bull; 18:00 CET
                </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs text-white/70 max-w-lg">
                    Each piece comes numbered with an engraved brass certification plaque. Patrons with calendar sync receive an instant SMS unlock link 10 minutes prior to drop.
                </p>

                <button
                    type="button"
                    onClick={() => setAdded(!added)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-mono font-bold transition-colors shrink-0 ${
                        added
                            ? 'bg-emerald-500 text-black'
                            : 'bg-white text-black hover:bg-amber-300'
                    }`}
                >
                    {added ? <HiCheck /> : <HiOutlineCalendar />}
                    <span>{added ? 'Drop Added to Calendar' : 'Sync Drop to Calendar'}</span>
                </button>
            </div>
        </section>
    )
}
