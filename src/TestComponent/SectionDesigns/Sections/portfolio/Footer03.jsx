export default function Footer03() {
    return (
        <footer className="rounded-lg bg-[#f1e9de] p-7 text-[#241d1a] sm:p-10">
            <div className="grid gap-7 md:grid-cols-[1fr_auto]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ef6a4b]">
                        The ongoing notebook
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        What I&apos;m making, noticing, and learning.
                    </h2>
                </div>
                <div className="flex flex-wrap gap-3 self-end">
                    <a
                        href="#are-na"
                        className="rounded-full border border-[#d5c8b7] px-4 py-2 text-xs"
                    >
                        Are.na ↗
                    </a>
                    <a
                        href="#instagram"
                        className="rounded-full border border-[#d5c8b7] px-4 py-2 text-xs"
                    >
                        Instagram ↗
                    </a>
                    <a
                        href="#linkedin"
                        className="rounded-full border border-[#d5c8b7] px-4 py-2 text-xs"
                    >
                        LinkedIn ↗
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#d5c8b7] pt-4 text-xs text-gray-500">
                © Jamie Park · Independent by design.
            </p>
        </footer>
    )
}
