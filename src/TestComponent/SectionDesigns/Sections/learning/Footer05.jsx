import { HiArrowRight } from 'react-icons/hi'
export default function Footer05() {
    return (
        <footer className="rounded-lg border border-[#dce5dc] bg-white p-7 text-[#102d36] sm:p-10">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                <div>
                    <a href="#home" className="font-serif text-2xl">
                        fieldnote.
                    </a>
                    <p className="mt-2 max-w-sm text-sm text-gray-500">
                        Learn one thing deeply. Then pass it on.
                    </p>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs">
                    <a href="#about">Our story</a>
                    <a href="#teach">Teach with us</a>
                    <a href="#support">Support</a>
                    <a href="#community">Community</a>
                </div>
            </div>
            <div className="mt-8 flex justify-between border-t border-[#dce5dc] pt-4 text-xs text-gray-500">
                <span>© 2026 Fieldnote</span>
                <a href="#social" className="flex items-center gap-1">
                    Follow the work <HiArrowRight />
                </a>
            </div>
        </footer>
    )
}
