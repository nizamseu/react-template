import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#102d36] p-7 text-white sm:p-10">
            <div className="grid gap-9 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="font-serif text-3xl">
                        fieldnote.
                    </a>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
                        A learning studio for curious people building what comes
                        next.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/70">
                    <a href="#courses">Browse courses</a>
                    <a href="#teachers">Teach with us</a>
                    <a href="#paths">Career paths</a>
                    <a href="#access">Accessibility</a>
                </div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <label
                        htmlFor="learn-email"
                        className="text-sm font-semibold"
                    >
                        One good lesson in your inbox.
                    </label>
                    <div className="mt-3 flex border-b border-white/35">
                        <input
                            id="learn-email"
                            type="email"
                            placeholder="Email address"
                            className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                        />
                        <button
                            aria-label="Subscribe"
                            className="px-3 text-[#c8ef70]"
                        >
                            <HiArrowRight />
                        </button>
                    </div>
                </form>
            </div>
            <p className="mt-9 border-t border-white/15 pt-4 text-xs text-white/45">
                © Fieldnote Learning · Terms · Privacy
            </p>
        </footer>
    )
}
