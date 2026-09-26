import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#28221e] p-7 text-[#f3eee5] sm:p-10">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <p className="text-xs uppercase tracking-[.16em] text-[#e7a37c]">
                        Keep a little wonder close
                    </p>
                    <h2 className="mt-3 max-w-xl font-serif text-4xl">
                        Read something that changes the question.
                    </h2>
                </div>
                <a
                    href="#archive"
                    className="inline-flex items-center gap-2 border-b border-[#e7a37c] pb-2 text-sm"
                >
                    Explore the archive <HiArrowRight />
                </a>
            </div>
            <div className="mt-9 flex justify-between border-t border-white/15 pt-4 text-xs text-white/45">
                <span>© Margin</span>
                <span>Instagram · Bluesky · Contact</span>
            </div>
        </footer>
    )
}
