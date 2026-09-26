import { HiArrowRight } from 'react-icons/hi'
export default function CTA02() {
    return (
        <section className="relative isolate overflow-hidden rounded-lg bg-[#211d18] p-8 text-white sm:p-12">
            <img
                className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80"
                alt=""
            />
            <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-[#d6f36a]">
                    THE SEASONAL EDIT
                </p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
                    A new favorite is closer than you think.
                </h2>
                <a
                    href="#new"
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d6f36a] px-5 py-3 text-sm font-semibold text-[#202315]"
                >
                    See what&apos;s new <HiArrowRight />
                </a>
            </div>
        </section>
    )
}
