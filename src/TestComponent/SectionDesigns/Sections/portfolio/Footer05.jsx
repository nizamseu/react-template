import { HiArrowRight } from 'react-icons/hi'
export default function Footer05() {
    return (
        <footer className="rounded-lg border border-[#d5c8b7] bg-white p-7 text-[#241d1a]">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ef6a4b]">
                        A low-volume studio letter
                    </p>
                    <h2 className="mt-2 font-serif text-2xl">
                        One note when there&apos;s something to say.
                    </h2>
                </div>
                <a
                    href="#newsletter"
                    className="inline-flex items-center gap-2 rounded-full bg-[#241d1a] px-5 py-3 text-sm text-white"
                >
                    Get the occasional note <HiArrowRight />
                </a>
            </div>
            <p className="mt-7 border-t border-[#eee7df] pt-4 text-xs text-gray-500">
                No noise, no schedule. Unsubscribe whenever.
            </p>
        </footer>
    )
}
