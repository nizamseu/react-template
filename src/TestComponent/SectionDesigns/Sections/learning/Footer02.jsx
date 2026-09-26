import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#c8ef70] p-7 text-[#102d36] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em]">
                        One useful idea a week
                    </p>
                    <h2 className="mt-3 max-w-md font-serif text-4xl">
                        Keep a little room for learning.
                    </h2>
                </div>
                <form
                    className="flex items-end border-b border-[#71873e]"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <label className="sr-only" htmlFor="weekly-learn">
                        Email
                    </label>
                    <input
                        id="weekly-learn"
                        type="email"
                        placeholder="Your email"
                        className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                    />
                    <button aria-label="Subscribe" className="px-3">
                        <HiArrowRight />
                    </button>
                </form>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#a2bf58] pt-4 text-xs">
                <a href="#courses">Courses</a>
                <a href="#teachers">Teachers</a>
                <a href="#scholarships">Scholarships</a>
                <a href="#help">Help</a>
                <span className="ml-auto">© Fieldnote Learning</span>
            </div>
        </footer>
    )
}
