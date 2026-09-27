// ShaderLaboratoryMegaMenu

// MegaMenu02 · Portfolios & Personal Websites › Mega menus

// Description:
// A near-black creative-code panel, "WebGL / WebGPU Sandbox", for a designer or creative
// technologist's portfolio. Under an "Interactive Shader Experiments • Open Lab" kicker and
// award counts (14x AWWWARDS SOTD, 8x FWA OF THE DAY, 4x WEBBYS) it lists four experiments,
// LAB 01–04 (Raymarched Cloth Sim, Procedural Audio Font, Volumetric Cloud Chamber, Spatial
// Canvas HUD), each with its tech stack, a one-line description and a "Run WebGL Demo" link.

// Design:
// - Header row (kicker + title left, award counts right) above a grid of experiment cards:
//   1 column on mobile, jumping straight to 4 columns from md:
// - #111 surface, #eaeaea text, coral #ef6a4b for the kicker, LAB numbers, demo links and
//   card hover border; white/15–white/20 rules, white/5 cards with white/10 borders
// - Monospace throughout the header, labels and links; text-2xl bold mono title, card text
//   at text-xs, text-[11px] and text-[10px]; small rounded corners (rounded)
// - Header stacks on mobile (flex-col) and becomes a bottom-aligned row from md:

// What it does:
// - Each card's "Run WebGL Demo" anchor points to #launch-demo and calls closeMenu on
//   click; the cards themselves are not links (hover only changes the border colour)
// - The award counts are static text; no state or effects
// - Used by KineticLabTerminalNavbar: <MegaMenu category="portfolio" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-none border-2 border-white/20 shadow-[6px_6px_0px_0px_#ef6a4b] bg-[#111]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ShaderLaboratoryMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/portfolio/MegaMenu02';

// // Inside KineticLabTerminalNavbar it opens from <MegaMenu category="portfolio" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-2 border-white/20 shadow-[6px_6px_0px_0px_#ef6a4b] bg-[#111]">
//         <ShaderLaboratoryMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineExternalLink } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ShaderLaboratoryMegaMenu({
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

export default ShaderLaboratoryMegaMenu
