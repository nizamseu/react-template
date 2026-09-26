import {
    HiArrowRight,
    HiOutlineBookmark,
    HiOutlineClock,
    HiOutlineEye,
    HiOutlineMicrophone,
    HiOutlineNewspaper,
    HiOutlinePhotograph,
    HiOutlineVolumeUp,
} from 'react-icons/hi'

export default function MediaMegaMenu({ variant = 1, closeMenu, accent = '#a84f34' }) {
    // VARIANT 1: The Sunday Edition / Broadsheet Magazine (MARGIN.)
    if (variant === 1) {
        return (
            <div className="bg-[#f2efe9] text-[#1c1d1a] p-8 border-t-2 border-[#a8472b]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Lead Cover Story */}
                    <div className="lg:col-span-5 space-y-4 border-r border-[#ded8cb] pr-6">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="font-bold text-[#a8472b] uppercase tracking-widest">
                                COVER ESSAY &bull; ISSUE NO. 48
                            </span>
                            <span className="text-black/50">14 MIN READ</span>
                        </div>
                        <div className="relative h-48 overflow-hidden rounded">
                            <img
                                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                                alt="Cover Essay Landscape"
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                        <h3 className="font-serif text-2xl font-bold leading-tight hover:underline cursor-pointer">
                            The Architecture of Solitude: Why Modern Spaces are Built for Silence
                        </h3>
                        <p className="text-xs text-black/70 leading-relaxed">
                            From Kyoto meditation pavilions to brutalist concrete chapels in the Swiss Alps, a quiet revolution is rejecting architectural noise.
                        </p>
                        <div className="text-[11px] text-black/50">
                            By Arthur Pendelton &bull; Photography by Emi Yoshikawa
                        </div>
                    </div>

                    {/* Center: The Cultural Beats */}
                    <div className="lg:col-span-4 space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a8472b]">
                            THE CULTURAL INDEX
                        </span>
                        <div className="space-y-3 text-xs">
                            {[
                                {
                                    section: 'DESIGN CRITIQUE',
                                    title: 'When Interfaces Stole the Joy of Tactility',
                                    time: '6m',
                                },
                                {
                                    section: 'SPECULATIVE FUTURE',
                                    title: 'Autonomous Micro-Forests: Re-wilding Tokyo’s Rooftops',
                                    time: '9m',
                                },
                                {
                                    section: 'SOUND & ARCHIVE',
                                    title: 'Preserving the Disappearing Dialects of the Hebrides',
                                    time: '11m',
                                },
                                {
                                    section: 'THE PHILOSOPHICAL ESSAY',
                                    title: 'The Lost Art of Waiting Without Reaching for a Screen',
                                    time: '8m',
                                },
                            ].map((story) => (
                                <a
                                    key={story.title}
                                    href="#story"
                                    onClick={closeMenu}
                                    className="group block border-b border-[#ded8cb] pb-2.5 hover:text-[#a8472b] transition-colors"
                                >
                                    <div className="flex items-center justify-between text-[10px] font-mono text-black/40">
                                        <span>{story.section}</span>
                                        <span>{story.time}</span>
                                    </div>
                                    <h5 className="mt-1 font-serif text-sm font-semibold text-black/90 group-hover:text-[#a8472b]">
                                        {story.title}
                                    </h5>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right: The Weekend Dispatch Newsletter */}
                    <div className="lg:col-span-3 space-y-4 bg-[#e8e3d8] p-5 rounded-lg border border-[#ded8cb]">
                        <span className="text-[9px] font-bold uppercase tracking-[.25em] text-[#a8472b]">
                            DISPATCH NO. 142
                        </span>
                        <h4 className="font-serif text-lg font-bold">The Saturday Morning Letter</h4>
                        <p className="text-xs text-black/70 leading-relaxed">
                            A weekly curation of five unhurried essays, one photographic folio, and an audio field recording. Read by 84,000 curious minds.
                        </p>
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="w-full rounded border border-black/20 bg-white px-3 py-2 text-xs outline-none"
                        />
                        <button
                            type="button"
                            onClick={closeMenu}
                            className="w-full rounded bg-[#a8472b] py-2 text-xs font-bold text-white hover:bg-[#863720] transition-colors"
                        >
                            Receive Dispatch
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 2: Broadcast Studio & Multimedia Podcast Atelier
    if (variant === 2) {
        return (
            <div className="bg-[#191919] text-[#e0e0e0] p-8 border-t border-white/20">
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

    // VARIANT 3: Minimalist High-Contrast Cultural Gazette
    if (variant === 3) {
        return (
            <div className="bg-[#121212] text-white p-8 border-t-2 border-white">
                <div className="flex items-center justify-between border-b border-white/20 pb-4 font-mono text-xs">
                    <span className="tracking-[.25em]">GAZETTE EDITION &bull; OCTOBER 2026</span>
                    <span className="text-white/50">CIRCULATION: 120,000 &bull; GLOBAL PRINT & DIGITAL</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            num: '01',
                            section: 'THE LONG ESSAYS',
                            stories: [
                                'The Death of the Physical Book Has Been Greatly Exaggerated',
                                'Sub-Antarctic Weather Stations and the Poetry of Isolation',
                                'Can AI Write a Genuinely Devastating Elegiac Poem?',
                            ],
                        },
                        {
                            num: '02',
                            section: 'CRITIQUE & REVIEWS',
                            stories: [
                                'Venice Architecture Biennale: The Monolith Strikes Back',
                                'Tarkovsky in 8K: Does High Resolution Ruin Mystery?',
                                'Review: The Uncomfortable Chairs of Gaetano Pesce',
                            ],
                        },
                        {
                            num: '03',
                            section: 'FIELD REPORTS',
                            stories: [
                                'From the Salt Mines of Maras, Peru: An Ancient Cooperative',
                                'Building Wooden Sailboats in the Lofoten Islands',
                                'Night Shifts at the Tokyo Central Fish Auction',
                            ],
                        },
                    ].map((col) => (
                        <div key={col.num} className="space-y-4">
                            <div className="flex items-baseline gap-2 border-b border-white/10 pb-2">
                                <span className="font-mono text-sm text-white/40">{col.num}</span>
                                <span className="text-xs font-bold uppercase tracking-wider">{col.section}</span>
                            </div>
                            <ul className="space-y-3 text-xs leading-relaxed">
                                {col.stories.map((s) => (
                                    <li key={s}>
                                        <a
                                            href="#gazette-story"
                                            onClick={closeMenu}
                                            className="block text-white/80 hover:text-white hover:underline transition-colors"
                                        >
                                            &bull; {s}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-8 border-t border-white/20 pt-4 flex items-center justify-between text-xs text-white/50">
                    <span>Curated independently without sponsored native advertising.</span>
                    <a href="#archive" onClick={closeMenu} className="font-bold text-white underline">
                        Explore Full 10-Year Archive &rarr;
                    </a>
                </div>
            </div>
        )
    }

    // VARIANT 4: Real-time News Pulse & Live Wire Feed
    if (variant === 4) {
        return (
            <div className="bg-[#f7f5f2] text-[#222] p-8 border-t border-black/10">
                {/* Breaking Wire Banner */}
                <div className="flex items-center gap-3 rounded bg-red-600 px-4 py-2 text-xs font-bold text-white">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    <span className="uppercase tracking-widest font-mono text-[10px]">BREAKING WIRE</span>
                    <span className="truncate">International Union for Architecture sets new net-zero timber construction code for 2028.</span>
                </div>

                {/* 4 Live Timestamp Feed Items */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        {
                            time: '4m ago',
                            tag: 'POLICY',
                            title: 'EU approves strict open-source protections for creative developers',
                        },
                        {
                            time: '18m ago',
                            tag: 'DESIGN',
                            title: 'Dieter Rams donates personal prototype archives to Frankfurt Museum',
                        },
                        {
                            time: '42m ago',
                            tag: 'AI ETHICS',
                            title: 'Major photographers guild files landmark lawsuit over synthetic training models',
                        },
                        {
                            time: '1h 10m ago',
                            tag: 'URBANISM',
                            title: 'Paris completes 100% car-free transformation of Central Riverfront',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-lg border border-black/10 bg-white p-4 flex flex-col justify-between hover:shadow-sm transition-shadow"
                        >
                            <div>
                                <div className="flex items-center justify-between font-mono text-[10px] text-gray-500">
                                    <span className="font-bold text-red-600">{item.time}</span>
                                    <span>#{item.tag}</span>
                                </div>
                                <h5 className="mt-2 text-xs font-bold leading-snug">{item.title}</h5>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
                                <span>Wire Feed</span>
                                <button type="button" className="hover:text-black">
                                    <HiOutlineBookmark /> Save
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 5: Visual Archival & Art Book Edition
    return (
        <div className="bg-[#1a1816] text-[#e8e4df] p-8 border-t border-[#443e39]">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#443e39] pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#e7a37c] uppercase tracking-[.25em]">
                        VISUAL ESSAYS &bull; MONOGRAPH SERIE NO. 03
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Photographic Folios from the Periphery</h3>
                </div>
                <div className="text-xs text-white/50">
                    Munken Lynx Paper &bull; Printed in Gotland &bull; Limited Run of 1,000
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'The Silent Fjord: Winter in Western Greenland',
                        photographer: 'Soren Aabye',
                        image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
                        pages: '38 Photographs',
                    },
                    {
                        title: 'Shadows of Brutalism: Concrete Across the Balkans',
                        photographer: 'Milica Jovanovic',
                        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
                        pages: '44 Photographs',
                    },
                    {
                        title: 'Night Workers of the Tsukiji Archipelago',
                        photographer: 'Kenjiro Morita',
                        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
                        pages: '52 Photographs',
                    },
                ].map((folio) => (
                    <div key={folio.title} className="group overflow-hidden rounded bg-black/40 border border-[#443e39]">
                        <div className="relative h-44 overflow-hidden">
                            <img
                                src={folio.image}
                                alt={folio.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <span className="absolute bottom-2 left-2 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] text-[#e7a37c]">
                                {folio.pages}
                            </span>
                        </div>
                        <div className="p-4">
                            <h4 className="font-serif text-sm font-bold text-white group-hover:underline">
                                {folio.title}
                            </h4>
                            <p className="mt-1 text-xs text-white/50">By {folio.photographer}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#443e39] flex items-center justify-between text-xs">
                <span className="text-white/60">Hardcover Monograph No. 03 available for pre-order ($45 USD)</span>
                <a href="#order-book" onClick={closeMenu} className="font-bold text-[#e7a37c] underline">
                    Order Limited Print Edition &rarr;
                </a>
            </div>
        </div>
    )
}
