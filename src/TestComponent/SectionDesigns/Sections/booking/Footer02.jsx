import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#e5ede8] p-7 text-[#132d3a] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#346a62]">
                        The Elsewhere letter
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        A good place to start dreaming.
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Local favorites and quiet places, once a month.
                    </p>
                </div>
                <form
                    className="flex items-end border-b border-[#9cb2a8]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="elsewhere-email">
                        Email
                    </label>
                    <input
                        id="elsewhere-email"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <p className="mt-8 border-t border-[#c3d1c8] pt-4 text-xs text-gray-500">
                © Elsewhere Travel · Go gently, go well.
            </p>
        </footer>
    )
}
