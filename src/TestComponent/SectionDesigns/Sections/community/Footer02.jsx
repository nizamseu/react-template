import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#ffccad] p-7 text-[#27201d] sm:p-10">
            <div className="grid gap-7 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        A note from your neighbors
                    </p>
                    <h2 className="mt-3 text-4xl font-black">
                        Good things are happening nearby.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-[#d99477]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="room-email">
                        Email
                    </label>
                    <input
                        id="room-email"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[#d99477] pt-4 text-xs">
                <span>© Commonroom</span>
                <span>Community guidelines · Safety · Contact</span>
            </div>
        </footer>
    )
}
