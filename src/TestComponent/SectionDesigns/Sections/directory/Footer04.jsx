import { HiArrowRight } from 'react-icons/hi'
export default function Footer04() {
    return (
        <footer className="rounded-lg bg-[#edf1e6] p-7 text-[#1a2826] sm:p-10">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#527354]">
                        Know a place people should know?
                    </p>
                    <h2 className="mt-3 max-w-xl text-4xl font-black">
                        Pass along a good recommendation.
                    </h2>
                </div>
                <a
                    href="#recommend"
                    className="inline-flex items-center gap-2 rounded-full bg-[#1a2826] px-5 py-3 text-sm text-white"
                >
                    Recommend a business <HiArrowRight />
                </a>
            </div>
            <p className="mt-8 border-t border-[#d4ddd1] pt-4 text-xs text-gray-500">
                © Good Neighbor · Built with local knowledge.
            </p>
        </footer>
    )
}
