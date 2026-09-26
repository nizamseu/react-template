import { useState } from 'react'
import { HiCheck, HiOutlineCode, HiPlay } from 'react-icons/hi'

export default function Card03() {
    const [running, setRunning] = useState(false)

    return (
        <article className="overflow-hidden rounded-xl border border-white/10 bg-[#11241f] text-[#d6ede4] p-5 shadow-2xl font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="flex items-center gap-1.5 text-xs text-[#c8ef70]">
                    <HiOutlineCode /> LESSON 04 &bull; INTERACTIVE CODING
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400">
                    <HiCheck /> 3/3 TESTS PASSING
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-sans text-lg font-bold text-white">
                    Generative Algorithmic Topographies
                </h3>
                <p className="mt-1 font-sans text-xs text-white/60">
                    Calculate Perlin noise vectors across grid coordinates to simulate geographic elevation.
                </p>

                {/* Code Window Box */}
                <div className="mt-3 rounded-lg bg-black/50 p-3 text-[11px] leading-relaxed border border-white/10">
                    <div className="text-white/40">// vertexShader.glsl</div>
                    <div className="text-pink-400">void <span className="text-blue-300">main</span>() &#123;</div>
                    <div className="pl-4 text-emerald-300">vec3 pos = position;</div>
                    <div className="pl-4 text-emerald-300">pos.z += snoise(uv * 4.0) * elevation;</div>
                    <div className="pl-4 text-pink-400">gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);</div>
                    <div className="text-pink-400">&#125;</div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setRunning(!running)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                            running
                                ? 'bg-emerald-400 text-black'
                                : 'bg-[#c8ef70] text-[#0e272f] hover:bg-white'
                        }`}
                    >
                        <HiPlay />
                        <span>{running ? 'Output Active (60fps)' : 'Run Lesson Code'}</span>
                    </button>
                    <span className="text-[11px] text-white/50">Free sandbox exercise</span>
                </div>
            </div>
        </article>
    )
}
