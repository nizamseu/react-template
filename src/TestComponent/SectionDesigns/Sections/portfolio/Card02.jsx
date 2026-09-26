import { useState } from 'react'
import { HiOutlineCode, HiPlay } from 'react-icons/hi'

export default function Card02() {
    const [active, setActive] = useState(false)

    return (
        <article className="overflow-hidden rounded-none border-2 border-white/20 bg-[#111111] p-5 text-white shadow-[6px_6px_0px_0px_#ef6a4b] font-mono">
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
