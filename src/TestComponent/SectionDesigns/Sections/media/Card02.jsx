// PodcastEpisodeWaveformPlayerCard

// Card02 · Blogs & Digital Media › Cards

// Description:
// A dark audio card for episode 48 of the "MARGIN DISCUSSIONS" podcast,
// "The Crisis of Public Space with Rem Koolhaas". It shows the runtime, a
// short summary, a mock player with a play button, a bar waveform and the
// current chapter, plus a note that a transcript is included.

// Design:
// - Single `article`: meta row (ruled underneath), title and summary, an
//   inset player panel (button + waveform + time row), then a ruled footer
// - Dark studio palette: card #191919, text #f0ede6 and white, peach accent
//   #e7a37c (label, play button, played bars, link), player panel bg
//   black/60, borders white/10 and white/5
// - Serif text-xl bold title; monospace 9-12px labels; 40px round play
//   button that scales up on hover; 20 flex bars with rounded tops;
//   rounded-xl card with shadow-2xl
// - No breakpoint classes: fluid width; the waveform bars flex to the
//   available width

// What it does:
// - Local `playing` state (useState, starts false) is toggled by the play
//   button, but nothing reads it: the icon stays a play glyph and the
//   waveform does not change
// - Waveform is a hard-coded array of 20 bar heights (percent) mapped to
//   bars; the first 8 are highlighted as "played"; time row shows 14:20,
//   "Chapter 2: The Mallification of Rome" and 48:12
// - "Listen on Apple / Spotify" link points to `#listen`

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PodcastEpisodeWaveformPlayerCard from '@/TestComponent/SectionDesigns/Sections/media/Card02';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <PodcastEpisodeWaveformPlayerCard />
//     </div>
// )
// ```

'use client'

import { useState } from 'react';
import { HiOutlineMicrophone, HiPlay } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PodcastEpisodeWaveformPlayerCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [playing, setPlaying] = useState(false)

    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-xl border border-white/10 bg-[#191919] p-5 text-[#f0ede6] shadow-2xl',
                className,
            )}
            {...props}
        >
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

export default PodcastEpisodeWaveformPlayerCard
