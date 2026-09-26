import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#f3eee6] p-7 text-[#1c1b19] dark:bg-[#26231f] dark:text-white sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                    <span className="text-xs font-bold uppercase tracking-[.16em]">
                        A note from the shop
                    </span>
                    <h2 className="mt-3 max-w-xl font-serif text-4xl leading-tight">
                        Good things, and the people who make them.
                    </h2>
                    <form
                        className="mt-6 flex max-w-md border-b border-[#8a8174]"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type="email"
                            aria-label="Email for the newsletter"
                            placeholder="Your email"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                        />
                        <button aria-label="Join newsletter" className="px-3">
                            <HiArrowRight />
                        </button>
                    </form>
                </div>
                <div className="grid grid-cols-2 gap-5 text-sm">
                    <div>
                        <p className="font-semibold">Visit</p>
                        <p className="mt-3 text-gray-600 dark:text-gray-300">
                            12 Market Lane
                            <br />
                            Copenhagen, DK
                        </p>
                    </div>
                    <div>
                        <p className="font-semibold">Follow along</p>
                        <a
                            href="#instagram"
                            className="mt-3 block text-gray-600 dark:text-gray-300"
                        >
                            Instagram ↗
                        </a>
                        <a
                            href="#pinterest"
                            className="mt-2 block text-gray-600 dark:text-gray-300"
                        >
                            Pinterest ↗
                        </a>
                    </div>
                </div>
            </div>
            <p className="mt-9 border-t border-black/10 pt-4 text-xs text-gray-500">
                © 2026 Goodform · Terms · Privacy · Made thoughtfully
            </p>
        </footer>
    )
}
