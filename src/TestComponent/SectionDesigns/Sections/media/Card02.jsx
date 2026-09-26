import { HiArrowRight } from 'react-icons/hi'
export default function Card02() {
    return (
        <article className="overflow-hidden rounded-lg bg-[#28221e] text-[#f3eee5]">
            <div className="flex h-40 items-end bg-[#a84f34] p-5">
                <p className="font-serif text-4xl">LISTEN / 028</p>
            </div>
            <div className="p-5">
                <p className="text-[10px] uppercase tracking-[.15em] text-[#e7a37c]">
                    THE MARGIN CONVERSATION
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                    Making work that makes room.
                </h3>
                <p className="mt-2 text-sm text-white/60">
                    A conversation with artist Ana Reyes.
                </p>
                <a
                    href="#listen"
                    className="mt-5 inline-flex items-center gap-2 text-sm"
                >
                    Listen to 32 minutes <HiArrowRight />
                </a>
            </div>
        </article>
    )
}
