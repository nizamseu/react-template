// DesignerPortfolioMegaMenuCollection

// PortfolioMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for an independent designer's portfolio site (fictional
// "Jamie Park" studio). Depending on `variant` the visitor sees selected case studies,
// creative-code experiments, a design manifesto with talks, service/retainer packages
// or a photographic contact sheet.

// Design:
// - Five hard-coded layouts in warm charcoal tones (plus one light cream variant) with coral #ef6a4b highlights, serif or mono headlines and responsive card grids.
// - Variant 1 — "Selected Works": #1c1816 panel, header with a pulsing "Available for select Q4 commissions" badge, four clickable project cards (number, year, client, title, award) and a footer with contact e-mail and "Browse Complete 12-Year Archive" link.
// - Variant 2 — "Shader Laboratory": #111 panel, mono "WebGL / WebGPU Sandbox" header with award counts and four "LAB 0x" cards (title, tech stack, description) each with a "Run WebGL Demo" link.
// - Variant 3 — "Design Manifesto": light #f9f7f4 panel in two columns: italic serif manifesto quote with a "Download Full CV / Monograph (PDF)" button-link, and a static list of keynotes/lectures.
// - Variant 4 — "Services & Retainers": #241d1a panel, three service cards (Design Sprint, Fractional Design Director, End-to-End Product Build) with duration and deliverable, plus a "Book Exploration Call on Cal.com" link.
// - Variant 5 — "Visual Notes": #181412 panel, four-photo contact sheet (Unsplash images with title and location, zoom on hover), 2 columns on mobile and 4 from md.

// What it does:
// - `variant` 1-4 each return their own layout; any other value (including 5) falls through to Variant 5.
// - Every anchor calls `closeMenu` on click (placeholder hrefs such as "#case-study", "#launch-demo", "#resume", "#cal").
// - Variant 5 contains no links and never calls `closeMenu`; the Variant 3 lecture list and Variant 4 service cards are static.
// - Purely presentational: no state or effects; interactivity is limited to hover styles.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "portfolio"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of every link/CTA so the parent mega menu can close.
// @param {string} [props.accent='#ef6a4b'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Merged onto the root <div> of every variant with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are spread onto the root <div> of every variant.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import DesignerPortfolioMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/PortfolioMegaMenu';

// function WorkMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <DesignerPortfolioMegaMenuCollection variant={1} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="portfolio"
// // <MegaMenu category="portfolio" variant={1} accent="#ef6a4b" label="Selected Works" />
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineCalendar,
    HiOutlineCode,
    HiOutlineExternalLink,
    HiOutlineSparkles,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DesignerPortfolioMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#ef6a4b',
    className,
    ...props
}) {
    // VARIANT 1: Selected Case Studies & Client Index (JP / Designer)
    if (variant === 1) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#1c1816] text-[#ede4de] p-8 border-t-2 border-[#ef6a4b]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <span className="font-mono text-[10px] text-[#ef6a4b] uppercase tracking-[.25em]">
                            JAMIE PARK &bull; INDEPENDENT DESIGN DIRECTOR &bull; STOCKHOLM & TOKYO
                        </span>
                        <h3 className="mt-1 font-serif text-2xl text-white">
                            Selected Works & Commissioned Case Studies
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-[#ef6a4b]/20 px-3 py-1 text-xs text-[#ef6a4b] font-mono">
                        <span className="h-2 w-2 rounded-full bg-[#ef6a4b] animate-ping" />
                        <span>Available for select Q4 commissions</span>
                    </div>
                </div>

                {/* 4 Selected Projects Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        {
                            num: '01',
                            client: 'Apple Inc.',
                            title: 'Spatial Typography & VisionOS Type Engine',
                            year: '2025',
                            role: 'Design Lead',
                            award: 'D&AD Yellow Pencil',
                        },
                        {
                            num: '02',
                            client: 'Nike Global',
                            title: 'The Speed Index: Realtime Marathon Visualizer',
                            year: '2024',
                            role: 'Art Director',
                            award: 'Awwwards Site of the Year',
                        },
                        {
                            num: '03',
                            client: 'Teenage Engineering',
                            title: 'Pocket Synthesizer Hardware UI & Companion App',
                            year: '2024',
                            role: 'Principal UI',
                            award: 'Cannes Lions Gold',
                        },
                        {
                            num: '04',
                            client: 'Spotify Sound Lab',
                            title: 'Algorithmic Mood Capsule & 3D Album Sculptures',
                            year: '2023',
                            role: 'Creative Tech',
                            award: 'FWA of the Month',
                        },
                    ].map((proj) => (
                        <a
                            key={proj.num}
                            href="#case-study"
                            onClick={closeMenu}
                            className="group flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-5 hover:border-[#ef6a4b] transition-colors"
                        >
                            <div>
                                <div className="flex items-center justify-between font-mono text-[10px] text-[#ef6a4b]">
                                    <span>PROJECT {proj.num}</span>
                                    <span>{proj.year}</span>
                                </div>
                                <h4 className="mt-2 text-sm font-bold text-white group-hover:text-[#ef6a4b] transition-colors">
                                    {proj.client}
                                </h4>
                                <p className="mt-1 text-xs text-white/70">{proj.title}</p>
                            </div>
                            <div className="mt-6 pt-3 border-t border-white/10 text-[10px] text-white/45 flex items-center justify-between">
                                <span>{proj.award}</span>
                                <HiArrowRight className="text-[#ef6a4b] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-white/60 font-mono">
                    <span>Direct inquiry: hello@jamiepark.studio</span>
                    <a href="#all-work" onClick={closeMenu} className="font-bold text-[#ef6a4b] underline hover:text-white">
                        Browse Complete 12-Year Archive (64 Projects) &rarr;
                    </a>
                </div>
            </div>
        )
    }

    // VARIANT 2: Experimental Laboratory & Creative Code (Kinetic Lab)
    if (variant === 2) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#111] text-[#eaeaea] p-8 border-t border-white/20',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-[#ef6a4b] uppercase tracking-[.25em]">
                            INTERACTIVE SHADER EXPERIMENTS &bull; OPEN LAB
                        </span>
                        <h3 className="mt-1 text-2xl font-bold font-mono text-white">WebGL / WebGPU Sandbox</h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                        <span>14x AWWWARDS SOTD</span>
                        <span>8x FWA OF THE DAY</span>
                        <span>4x WEBBYS</span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        {
                            title: 'Raymarched Cloth Sim',
                            tech: 'Three.js & Custom GLSL',
                            desc: 'Interactive silk drape reacting to cursor physics and acoustic FFT.',
                        },
                        {
                            title: 'Procedural Audio Font',
                            tech: 'Variable Fonts & WebAudio',
                            desc: 'Typography glyphs that deform dynamically based on live microphone frequency.',
                        },
                        {
                            title: 'Volumetric Cloud Chamber',
                            tech: 'WebGPU Compute Shaders',
                            desc: 'Simulating subatomic particle trails in 60 FPS real-time rendering.',
                        },
                        {
                            title: 'Spatial Canvas HUD',
                            tech: 'WebXR & VisionOS',
                            desc: 'Spatial window manager prototype for floating infinite canvas workspace.',
                        },
                    ].map((exp, i) => (
                        <div
                            key={exp.title}
                            className="group flex flex-col justify-between rounded border border-white/10 bg-white/5 p-4 hover:border-[#ef6a4b] transition-colors"
                        >
                            <div>
                                <span className="font-mono text-[10px] text-[#ef6a4b]">LAB 0{i + 1}</span>
                                <h4 className="mt-1 font-bold text-xs text-white">{exp.title}</h4>
                                <span className="text-[10px] font-mono text-white/40 block mt-0.5">{exp.tech}</span>
                                <p className="mt-2 text-[11px] text-white/60 leading-relaxed">{exp.desc}</p>
                            </div>
                            <a
                                href="#launch-demo"
                                onClick={closeMenu}
                                className="mt-4 flex items-center justify-between text-xs font-mono text-[#ef6a4b] underline hover:text-white"
                            >
                                <span>Run WebGL Demo</span>
                                <HiOutlineExternalLink />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 3: Design Manifesto, Philosophy & Press
    if (variant === 3) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#f9f7f4] text-[#1c1b19] p-8 border-t border-[#ded8cf]',
                    className,
                )}
                {...props}
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Typographic Manifesto */}
                    <div className="lg:col-span-6 space-y-4 border-r border-[#ded8cf] pr-8">
                        <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#ef6a4b]">
                            STUDIO ETHOS & PHILOSOPHY
                        </span>
                        <h3 className="font-serif text-3xl font-light italic leading-tight">
                            "We build digital experiences with dignity, restraint, and an obsessive attention to typography."
                        </h3>
                        <p className="text-xs text-black/70 leading-relaxed">
                            Most modern software feels like a vending machine designed to grab your eyeballs. We advocate for calm, tactile, unhurried digital spaces that respect human attention.
                        </p>
                        <div className="pt-2">
                            <a
                                href="#resume"
                                onClick={closeMenu}
                                className="inline-flex items-center gap-2 rounded bg-[#1c1b19] px-4 py-2 text-xs font-semibold text-white hover:bg-[#ef6a4b] transition-colors"
                            >
                                Download Full CV / Monograph (PDF) <HiArrowRight />
                            </a>
                        </div>
                    </div>

                    {/* Right: Lectures, Keynotes & Press */}
                    <div className="lg:col-span-6 space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-[.25em] text-[#ef6a4b]">
                            INVITED KEYNOTES & VISITING LECTURES
                        </span>
                        <div className="space-y-3 text-xs">
                            {[
                                {
                                    event: 'OFFF Barcelona 2026',
                                    topic: 'Keynote: Why Physical Controls Still Beat Touchscreens',
                                    loc: 'Main Stage &bull; Barcelona',
                                },
                                {
                                    event: 'ECAL Lausanne Masterclass',
                                    topic: 'Workshop: Generative Typography Systems',
                                    loc: 'Department of Media &bull; Switzerland',
                                },
                                {
                                    event: 'It’s Nice That Feature',
                                    topic: 'Interview: 10 Years of Designing Without Compromise',
                                    loc: 'Editorial Longform &bull; London',
                                },
                            ].map((item) => (
                                <div key={item.event} className="border-b border-[#ded8cf] pb-2.5">
                                    <div className="flex items-center justify-between text-[11px] font-bold text-[#1c1b19]">
                                        <span>{item.event}</span>
                                        <span className="text-black/40 font-normal">{item.loc}</span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-black/60 italic">{item.topic}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 4: Services, Retainers & Client Engagements
    if (variant === 4) {
        return (
            <div
                data-variant={variant}
                data-size={size}
                data-disabled={disabled || loading}
                className={cn(
                    'bg-[#241d1a] text-white p-8 border-t border-[#ef6a4b]',
                    className,
                )}
                {...props}
            >
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#ef6a4b]">
                            WORKING TOGETHER &bull; FIXED-SCOPE MODELS
                        </span>
                        <h3 className="mt-1 font-serif text-2xl">Ways We Can Collaborate</h3>
                    </div>
                    <span className="text-xs text-white/50 font-mono">No Bloated Agency Overhead &bull; Direct Principal Collaboration</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            num: '01',
                            title: 'The Design Sprint',
                            time: '2 Weeks Intensive',
                            desc: 'Complete brand positioning or interactive prototype ready for investor pitch or user testing.',
                            deliverable: 'Figma System + Interactive Prototype',
                        },
                        {
                            num: '02',
                            title: 'Fractional Design Director',
                            time: 'Quarterly Retainer',
                            desc: 'Embedding 2 days/week to lead your product design team, elevate craft, and hire top senior talent.',
                            deliverable: 'Leadership + Architecture Review',
                        },
                        {
                            num: '03',
                            title: 'End-to-End Product Build',
                            time: '6–8 Weeks',
                            desc: 'Full design system architecture and high-performance React front-end development.',
                            deliverable: 'Production Codebase + Design System',
                        },
                    ].map((serv) => (
                        <div
                            key={serv.num}
                            className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
                        >
                            <div>
                                <span className="font-mono text-[10px] text-[#ef6a4b]">{serv.num} &bull; {serv.time}</span>
                                <h4 className="mt-2 font-bold text-base text-white">{serv.title}</h4>
                                <p className="mt-2 text-xs text-white/65 leading-relaxed">{serv.desc}</p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-[#ef6a4b]">
                                {serv.deliverable}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/60">Schedule a 20-min exploration call to see if your project is a mutual fit.</span>
                    <a href="#cal" onClick={closeMenu} className="font-bold text-[#ef6a4b] underline hover:text-white">
                        Book Exploration Call on Cal.com &rarr;
                    </a>
                </div>
            </div>
        )
    }

    // VARIANT 5: Visual Moodboard, Photo Essays & Field Notes
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#181412] text-[#e3deda] p-8 border-t border-white/15',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#ef6a4b] uppercase tracking-[.25em]">
                        VISUAL OBSERVATIONS &bull; CONTACT SHEET ARCHIVE
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Forms, Light & Found Typography</h3>
                </div>
                <div className="text-xs text-white/50">Kyoto &bull; Belgrade &bull; Mexico City &bull; Gotland</div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {
                        title: 'Daisen-in Zen Stones',
                        loc: 'Kyoto, Japan',
                        img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                        title: 'Brutalist Concrete Spomenik',
                        loc: 'Balkans',
                        img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                        title: 'Hand-Painted Signage',
                        loc: 'Oaxaca, Mexico',
                        img: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=400&q=80',
                    },
                    {
                        title: 'Winter Baltic Sea Fog',
                        loc: 'Fårö, Sweden',
                        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
                    },
                ].map((shot) => (
                    <div key={shot.title} className="group overflow-hidden rounded bg-black/40 border border-white/10">
                        <img
                            src={shot.img}
                            alt={shot.title}
                            className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="p-2.5">
                            <span className="block text-xs font-semibold text-white">{shot.title}</span>
                            <span className="font-mono text-[9px] text-white/40">{shot.loc}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DesignerPortfolioMegaMenuCollection
