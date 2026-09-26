import { useState } from 'react'
import { HiOutlineMicrophone, HiPlay } from 'react-icons/hi'

export default function Card02() {
    const [playing, setPlaying] = useState(false)

    return (
        <article className="overflow-hidden rounded-xl border border-white/10 bg-[#191919] p-5 text-[#f0ede6] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[#e7a37c] uppercase tracking-widest">
                    <HiOutlineMicrophone /> MARGIN DISCUSSIONS &bull; EP. 48
                </span>
                <span className="font-mono text-xs text-white/50">48:12 RUNTIME</span>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-xl font-bold text-white leading-tight">
                    The Crisis of Public Space with Rem Koolhaas
                </h3>
                <p className="mt-1 text-xs text-white/60">
                    A raw discussion on privatized plazas, the destruction of European city centers, and how architecture lost its political nerve.
                </p>

                {/* Simulated Audio Waveform */}
                <div className="mt-4 rounded-xl bg-black/60 p-4 border border-white/5">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setPlaying(!playing)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e7a37c] text-[#191919] hover:scale-105 transition-transform"
                        >
                            <HiPlay className="text-lg ml-0.5" />
                        </button>
                        <div className="flex-1">
                            <div className="flex h-8 items-end gap-1">
                                {[20, 45, 60, 30, 80, 95, 40, 70, 85, 50, 65, 90, 75, 40, 60, 80, 45, 90, 35, 70].map((h, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 rounded-t-sm transition-colors ${
                                            i < 8 ? 'bg-[#e7a37c]' : 'bg-white/20'
                                        }`}
                                        style={{ height: `${h}%` }}
                                    />
                                ))}
                            </div>
                            <div className="mt-1 flex justify-between font-mono text-[9px] text-white/40">
                                <span>14:20</span>
                                <span>Chapter 2: The Mallification of Rome</span>
                                <span>48:12</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-white/50">Includes full transcript</span>
                    <a href="#listen" className="font-bold text-[#e7a37c] hover:underline">
                        Listen on Apple / Spotify &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}
