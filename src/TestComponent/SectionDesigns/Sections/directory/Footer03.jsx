import { HiArrowRight } from 'react-icons/hi'
export default function Footer03() {
    return (
        <footer className="rounded-lg bg-[#1a2826] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="text-sm font-black uppercase">
                        Good Neighbor Index
                    </a>
                    <p className="mt-3 text-sm text-white/55">
                        A local directory that puts people before placements.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                    <a href="#categories">Categories</a>
                    <a href="#owners">For owners</a>
                    <a href="#recommend">Recommend</a>
                    <a href="#trust">Trust & safety</a>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase text-[#d9f064]">
                        Stay local
                    </p>
                    <a
                        href="#instagram"
                        className="mt-3 inline-flex items-center gap-1 text-sm"
                    >
                        Instagram <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © Good Neighbor · Local discovery, done thoughtfully.
            </p>
        </footer>
    )
}
