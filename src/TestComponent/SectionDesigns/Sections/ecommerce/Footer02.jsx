import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#d6f36a] p-7 text-[#202315] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em]">
                        The circular edit
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-black uppercase leading-[.92]">
                        Better things
                        <br />
                        move around.
                    </h2>
                    <p className="mt-4 text-sm">
                        Wear, repair, return, repeat.
                    </p>
                </div>
                <form
                    className="flex flex-col justify-end gap-3"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label
                        htmlFor="circular-email"
                        className="text-sm font-semibold"
                    >
                        Get the monthly material note.
                    </label>
                    <div className="flex border-b border-[#69752d]">
                        <input
                            id="circular-email"
                            type="email"
                            placeholder="Your email address"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-[#58602f]"
                        />
                        <button aria-label="Subscribe" className="px-3">
                            <HiArrowRight />
                        </button>
                    </div>
                    <span className="text-xs text-[#58602f]">
                        No noise. Unsubscribe whenever.
                    </span>
                </form>
            </div>
            <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-[#899344] pt-4 text-xs">
                <span>© 2026 Good Circular</span>
                <span>Instagram · Materials · Shipping · Privacy</span>
            </div>
        </footer>
    )
}
