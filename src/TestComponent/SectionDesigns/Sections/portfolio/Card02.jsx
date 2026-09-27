// InteractiveGLSLShaderExperimentCard

// Card02 · Portfolios & Personal Websites › Cards

// Description:
// Terminal-style creative-coding card for "EXPERIMENT #42 • GLSL SHADER": a
// pinging status dot, "60.0 FPS • 8,400 VERTS" stats, the title "Raymarched
// Non-Euclidean Gyroid Topology", an SDF description and a mock canvas with a
// blurred gradient orb that the visitor can animate with a button.

// Design:
// - Header row (label and stats, border-b), then title, description, an h-40
//   black preview panel and an action row (button left, link right).
// - Neo-brutalist dark palette: surface #111111, white text, coral #ef6a4b
//   (label, ping dot, button, offset shadow), emerald-400 stats, orb gradient
//   from #ef6a4b to purple-600.
// - font-mono throughout, with a font-sans text-lg bold title and description;
//   square corners (rounded-none), border-2 white/20 and a hard
//   shadow-[6px_6px_0px_0px_#ef6a4b]; small rounded button.
// - No breakpoint classes: the card fills the width given by its parent.

// What it does:
// - Local state `active` (useState, false): the button toggles it, scaling and
//   rotating the orb (scale-150 rotate-90, 700ms) and switching its label from
//   "Interact with Mesh" to "Perturb Gyroid". No real WebGL is rendered; the
//   canvas is a CSS gradient mock.
// - Anchor "Source (GitHub)" → #source (HiOutlineCode); HiPlay on the button.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import InteractiveGLSLShaderExperimentCard from '@/TestComponent/SectionDesigns/Sections/portfolio/Card02';

// const ExperimentsGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <InteractiveGLSLShaderExperimentCard />
//     </div>
// )
// ```

'use client'

import { useState } from 'react';
import { HiOutlineCode, HiPlay } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function InteractiveGLSLShaderExperimentCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState(false)

    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-none border-2 border-white/20 bg-[#111111] p-5 text-white shadow-[6px_6px_0px_0px_#ef6a4b] font-mono',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-2 text-xs text-[#ef6a4b]">
                    <span className="h-2 w-2 rounded-full bg-[#ef6a4b] animate-ping" />
                    EXPERIMENT #42 &bull; GLSL SHADER
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                    60.0 FPS &bull; 8,400 VERTS
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-lg font-bold text-white">
                    Raymarched Non-Euclidean Gyroid Topology
                </h3>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Real-time signed distance fields (SDF) rendered purely in fragment shaders with smooth minimum union operations.
                </p>

                {/* Shader visual canvas representation */}
                <div className="mt-3 relative h-40 overflow-hidden rounded bg-black border border-white/10 flex items-center justify-center">
                    <div className={`h-24 w-24 rounded-full bg-gradient-to-tr from-[#ef6a4b] to-purple-600 blur-md transition-all duration-700 ${
                        active ? 'scale-150 rotate-90' : 'scale-100'
                    }`} />
                    <span className="absolute bottom-2 right-2 text-[9px] text-white/40">
                        gpu: WebGL 2.0 active
                    </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setActive(!active)}
                        className="inline-flex items-center gap-1.5 rounded bg-[#ef6a4b] px-3.5 py-1.5 font-mono text-xs font-bold text-black hover:bg-white transition-colors"
                    >
                        <HiPlay />
                        <span>{active ? 'Perturb Gyroid' : 'Interact with Mesh'}</span>
                    </button>
                    <a
                        href="#source"
                        className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"
                    >
                        <HiOutlineCode />
                        <span>Source (GitHub)</span>
                    </a>
                </div>
            </div>
        </article>
    )
}

export default InteractiveGLSLShaderExperimentCard
