import { HiArrowRight } from 'react-icons/hi'
export default function Footer03() {
    return (
        <footer className="rounded-lg bg-[#e3ebdd] p-7 text-[#102d36] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.1fr_.9fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#3c7e5d]">
                        Fieldnote / Open curriculum
                    </p>
                    <h2 className="mt-3 max-w-md text-4xl font-semibold">
                        Knowledge grows when it gets shared.
                    </h2>
                    <p className="mt-3 text-sm text-gray-600">
                        Explore free guides and exercises for every curious
                        mind.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <a href="#open">
                        Open lessons <HiArrowRight className="inline" />
                    </a>
                    <a href="#access">Accessibility</a>
                    <a href="#teachers">For educators</a>
                    <a href="#license">Open license</a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#c5d3c5] pt-4 text-xs text-gray-500">
                © 2026 Fieldnote · Learning belongs to everyone.
            </p>
        </footer>
    )
}
