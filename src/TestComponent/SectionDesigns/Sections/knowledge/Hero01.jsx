import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi'
export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#f6f7f4] text-[#17231f]">
            <div className="grid min-h-[400px] md:grid-cols-[1fr_.72fr]">
                <div className="flex flex-col justify-between p-7 sm:p-12">
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#41715d]">
                        DOCS / PRODUCT HANDBOOK
                    </p>
                    <div className="my-10">
                        <h2 className="max-w-xl text-5xl font-semibold leading-[.98] sm:text-6xl">
                            Good answers, close at hand.
                        </h2>
                        <p className="mt-4 max-w-md text-sm leading-6 text-gray-600">
                            Product guides, API references, and team knowledge
                            in one searchable place.
                        </p>
                        <form
                            className="mt-6 flex max-w-xl items-center gap-3 rounded-lg border border-[#d4dbd5] bg-white p-2"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <HiOutlineSearch className="ml-2 shrink-0 text-[#41715d]" />
                            <input
                                aria-label="Search documentation"
                                placeholder="Search the docs..."
                                className="min-w-0 flex-1 py-2 text-sm outline-none"
                            />
                            <kbd className="hidden rounded border px-2 py-1 text-[10px] text-gray-400 sm:block">
                                ⌘ K
                            </kbd>
                        </form>
                    </div>
                    <p className="text-xs text-gray-500">
                        Updated regularly by the people who build it.
                    </p>
                </div>
                <div className="hidden border-l border-[#e4e8e3] bg-white p-7 md:flex md:flex-col md:justify-center">
                    <p className="text-xs font-semibold text-[#41715d]">
                        POPULAR THIS WEEK
                    </p>
                    {[
                        ['01', 'Set up your workspace'],
                        ['02', 'Invite your team'],
                        ['03', 'Connect an integration'],
                        ['04', 'Manage billing'],
                    ].map(([number, title]) => (
                        <a
                            key={number}
                            href="#guide"
                            className="flex items-center gap-4 border-b border-[#edf0ec] py-4"
                        >
                            <span className="font-mono text-xs text-gray-400">
                                {number}
                            </span>
                            <span className="flex-1 text-sm">{title}</span>
                            <HiArrowRight className="text-xs text-[#41715d]" />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}
