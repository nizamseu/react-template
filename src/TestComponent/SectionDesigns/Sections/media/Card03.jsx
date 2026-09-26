import { HiArrowRight } from 'react-icons/hi'

export default function Card03() {
    return (
        <article className="overflow-hidden rounded-none border-2 border-black bg-white p-5 text-black shadow-[6px_6px_0px_0px_#000]">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <span className="flex items-center gap-2 font-mono text-[10px] font-black uppercase text-rose-600">
                    <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
                    INVESTIGATIVE DISPATCH &bull; 18 MIN AGO
                </span>
                <span className="font-mono text-xs font-black">
                    WIRE NO. 408
                </span>
            </div>

            <div className="mt-4">
                <h3 className="font-serif text-2xl font-black leading-tight">
                    Leaked Blueprint Archives Reveal Forgotten 1968 Brutalist Masterplan
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-black/80 font-serif">
                    Confidential municipal dockets uncovered in Vienna disclose an unbuilt network of elevated pedestrian skyways intended to replace private automobile arteries.
                </p>

                {/* Evidence metadata badge */}
                <div className="mt-4 rounded border border-black bg-neutral-100 p-2.5 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between">
                        <span className="text-black/60">PRIMARY SOURCE:</span>
                        <span className="font-bold">Vienna Municipal Archives Box 44</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-black/60">VERIFICATION:</span>
                        <span className="text-emerald-700 font-bold">Double-Blind Corroborated</span>
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                    <span className="font-mono text-xs text-black/60">6,400 words</span>
                    <a
                        href="#read-dispatch"
                        className="inline-flex items-center gap-1 font-mono text-xs font-black uppercase tracking-wider text-black hover:text-rose-600 transition-colors"
                    >
                        <span>Open Dossier</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </article>
    )
}
