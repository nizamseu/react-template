// BroadcastPodcastPlayerMegaMenu

// MegaMenu02 · Blogs & Digital Media › Mega menus

// Description:
// The "Broadcast Podcast Player" panel for a podcast or audio-publication navbar. A
// player card features "EPISODE 84 • SEASON 04", "On Typography, Algorithms, and the
// Death of the Curated Homepage", a static waveform, a "Play Episode" button and Apple
// Podcasts / Spotify links; beside it, "SERIES & AUDIO ARCHIVES" lists Deep Signals,
// The Kyoto Tapes and Speculative Futures with episode counts.

// Design:
// - lg:grid-cols-12 layout split 6/6: the player card left, the series list right
// - Charcoal #191919 surface, #e0e0e0 text, white/20 top border; peach #e7a37c metadata,
//   eyebrow, "played" waveform bars (first 10 of 24), Play fill and series hover border
// - Serif text-2xl episode title, font-mono metadata and episode counts; rounded-full
//   Play button and bars, rounded-lg cards on white/5 and white/[0.03] fills
// - The two halves stack below lg: and sit side by side from lg:

// What it does:
// - Only the three series rows (#series) call closeMenu on click
// - "Play Episode" has no onClick, the waveform is static, and the Apple Podcasts
//   (#apple) and Spotify (#spotify) links do not call closeMenu; no state or effect
// - Used by MarginBroadcastAudioNavbar: <MegaMenu category="media" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-white/20 shadow-2xl bg-[#191919]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BroadcastPodcastPlayerMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/media/MegaMenu02';

// // Inside MarginBroadcastAudioNavbar it opens from <MegaMenu category="media" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-white/20 shadow-2xl bg-[#191919]">
//         <BroadcastPodcastPlayerMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineMicrophone, HiOutlineVolumeUp } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BroadcastPodcastPlayerMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#191919] text-[#e0e0e0] p-8 border-t border-white/20',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Featured Podcast Audio Player Card */}
                <div className="lg:col-span-6 rounded-lg border border-white/15 bg-white/5 p-6">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#e7a37c]">
                        <span className="flex items-center gap-1.5">
                            <HiOutlineMicrophone /> EPISODE 84 &bull; SEASON 04
                        </span>
                        <span>54 MINS &bull; STEREO MASTER</span>
                    </div>
                    <h3 className="mt-3 font-serif text-2xl font-bold text-white">
                        On Typography, Algorithms, and the Death of the Curated Homepage
                    </h3>
                    <p className="mt-2 text-xs text-white/70">
                        Conversation with experimental typographer Peter Bil’ak on variable optical sizes and algorithmic flattening.
                    </p>

                    {/* Simulated Audio Waveform Bar */}
                    <div className="mt-6 flex items-center gap-1 h-8">
                        {[12, 24, 40, 18, 50, 32, 60, 28, 44, 70, 36, 52, 20, 64, 48, 30, 56, 38, 22, 46, 68, 34, 18, 42].map((h, i) => (
                            <span
                                key={i}
                                style={{ height: `${h}%` }}
                                className={`flex-1 rounded-full ${i < 10 ? 'bg-[#e7a37c]' : 'bg-white/20'}`}
                            />
                        ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-full bg-[#e7a37c] px-4 py-2 text-xs font-bold text-[#191919] hover:bg-white transition-colors"
                        >
                            <HiOutlineVolumeUp className="text-base" /> Play Episode
                        </button>
                        <div className="flex items-center gap-4 text-xs text-white/50 font-mono">
                            <a href="#apple" className="hover:text-white">Apple Podcasts</a>
                            <span>&bull;</span>
                            <a href="#spotify" className="hover:text-white">Spotify</a>
                        </div>
                    </div>
                </div>

                {/* Right: Broadcast Series Directory */}
                <div className="lg:col-span-6 space-y-4">
                    <span className="text-[10px] font-mono text-[#e7a37c] uppercase tracking-widest">
                        SERIES & AUDIO ARCHIVES
                    </span>
                    <div className="space-y-3">
                        {[
                            {
                                series: 'Deep Signals',
                                desc: 'Documentaries on cryptographic folklore and decentralized culture.',
                                episodes: '24 Episodes',
                            },
                            {
                                series: 'The Kyoto Tapes',
                                desc: 'Field recordings of traditional artisans, temple gardens, and bamboo groves.',
                                episodes: '16 Episodes',
                            },
                            {
                                series: 'Speculative Futures',
                                desc: 'Discussions with science-fiction authors, urbanists, and climate physicists.',
                                episodes: '32 Episodes',
                            },
                        ].map((prog) => (
                            <a
                                key={prog.series}
                                href="#series"
                                onClick={closeMenu}
                                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:border-[#e7a37c] transition-colors"
                            >
                                <div>
                                    <h5 className="font-bold text-sm text-white">{prog.series}</h5>
                                    <p className="mt-0.5 text-xs text-white/60">{prog.desc}</p>
                                </div>
                                <span className="shrink-0 font-mono text-[10px] text-white/40 pl-4">
                                    {prog.episodes}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BroadcastPodcastPlayerMegaMenu
