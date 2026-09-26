import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#d9f064] p-7 text-[#1a2826] sm:p-10">
            <div className="grid gap-7 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        Good businesses deserve to be found
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-black">
                        Put your work on the local map.
                    </h2>
                </div>
                <a
                    href="#claim"
                    className="inline-flex items-center gap-2 self-end text-sm font-bold"
                >
                    Claim your listing <HiArrowRight />
                </a>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[#aabd4d] pt-4 text-xs sm:grid-cols-4">
                <a href="#browse">Browse the index</a>
                <a href="#verification">How we verify</a>
                <a href="#recommend">Recommend a place</a>
                <a href="#help">Help</a>
            </div>
        </footer>
    )
}
