import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#1a2826] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d9f064]">
                        Good work should be easy to find
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-black">
                        Put your business on the neighborhood map.
                    </h2>
                    <a
                        href="#listing"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d9f064] px-5 py-3 text-sm font-semibold text-[#1a2826]"
                    >
                        Add a listing <HiArrowRight />
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-4 self-end text-sm text-white/65">
                    <a href="#categories">Browse categories</a>
                    <a href="#verification">Verification</a>
                    <a href="#recommend">Recommend a place</a>
                    <a href="#help">Help center</a>
                </div>
            </div>
            <p className="mt-9 border-t border-white/15 pt-4 text-xs text-white/40">
                © Good Neighbor Index · Local, by design.
            </p>
        </footer>
    )
}
