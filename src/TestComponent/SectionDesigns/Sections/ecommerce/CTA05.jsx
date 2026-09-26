import { HiArrowRight } from 'react-icons/hi'
export default function CTA05() {
    return (
        <section className="rounded-lg border border-[#d8cbbc] bg-[#faf8f3] p-7 text-[#26211b] sm:p-9">
            <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#8a6144]">
                    NOTES FROM THE SHOP
                </p>
                <h2 className="mt-2 font-serif text-3xl">
                    Good finds, occasionally.
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    New makers, pieces, and stories. Never noise.
                </p>
                <form
                    className="mx-auto mt-5 flex max-w-md border-b border-[#bca890]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="goodform-email">
                        Email address
                    </label>
                    <input
                        id="goodform-email"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button
                        aria-label="Subscribe"
                        className="px-3 text-[#8a6144]"
                    >
                        <HiArrowRight />
                    </button>
                </form>
            </div>
        </section>
    )
}
