export default function Footer05() {
    return (
        <footer className="rounded-lg border border-[#d7cec0] bg-white p-7 text-[#28221e] sm:p-10">
            <div className="flex flex-col justify-between gap-6 md:flex-row">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a84f34]">
                        The paper, in your pocket
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">
                        Take the conversation with you.
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Listen to Margin on your favorite podcast app.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 self-start">
                    <a
                        href="#apple"
                        className="rounded-full border px-4 py-2 text-xs"
                    >
                        Apple Podcasts ↗
                    </a>
                    <a
                        href="#spotify"
                        className="rounded-full border px-4 py-2 text-xs"
                    >
                        Spotify ↗
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#e8e1d7] pt-4 text-xs text-gray-500">
                © Margin · Editorial independence matters.
            </p>
        </footer>
    )
}
