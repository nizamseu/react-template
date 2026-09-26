import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#ef6a4b] p-7 text-[#241d1a] sm:p-10">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em]">
                        LET&apos;S MAKE THE USEFUL THING
                    </p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-black uppercase leading-[.9]">
                        Beautifully, together.
                    </h2>
                </div>
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 border-b border-[#241d1a] pb-2 text-sm font-semibold"
                >
                    Start a project <HiArrowRight />
                </a>
            </div>
            <div className="mt-9 flex justify-between border-t border-[#c95038] pt-4 text-xs">
                <span>© Jamie Park 2026</span>
                <span>Brooklyn · Everywhere</span>
            </div>
        </footer>
    )
}
