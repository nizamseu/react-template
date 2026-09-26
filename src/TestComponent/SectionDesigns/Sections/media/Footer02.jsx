import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#e7d9c7] p-7 text-[#28221e] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a84f34]">
                        The Sunday edition
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        One letter. A few good stories.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-[#a99a85]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="margin-sunday">
                        Email address
                    </label>
                    <input
                        id="margin-sunday"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#c4b39d] pt-4 text-xs">
                <a href="#latest">Latest</a>
                <a href="#archive">Archive</a>
                <a href="#membership">Membership</a>
                <a href="#contact">Contact</a>
                <span className="ml-auto">© Margin Journal</span>
            </div>
        </footer>
    )
}
