import { HiHeart } from 'react-icons/hi'
export default function Card05() {
    return (
        <article className="rounded-lg bg-[#27201d] p-6 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffccad] text-[#27201d]">
                <HiHeart />
            </span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-[#ffccad]">
                OUR COMMUNITY PACT
            </p>
            <h3 className="mt-2 text-2xl font-black">Curious, not cruel.</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">
                Real names, thoughtful moderation, and space for different
                points of view.
            </p>
            <a
                href="#guidelines"
                className="mt-5 inline-block border-b border-white/40 pb-1 text-xs"
            >
                Read how we look after each other
            </a>
        </article>
    )
}
