import { HiArrowRight } from 'react-icons/hi'
export default function Footer03() {
    return (
        <footer className="rounded-lg bg-[#f7ede6] p-7 text-[#27201d] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <p className="text-xl font-black">COMMONROOM</p>
                    <p className="mt-3 max-w-xs text-sm text-gray-600">
                        More room for the things that bring us together.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <a href="#discover">Find a group</a>
                    <a href="#events">Local events</a>
                    <a href="#hosts">Host a meetup</a>
                    <a href="#safety">Safety center</a>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase">
                        Find us elsewhere
                    </p>
                    <div className="mt-3 flex gap-3 text-xs">
                        <a href="#instagram">Instagram ↗</a>
                        <a href="#tiktok">TikTok ↗</a>
                    </div>
                </div>
            </div>
            <p className="mt-8 border-t border-[#e7d4c8] pt-4 text-xs text-gray-500">
                © Commonroom 2026 · Privacy · Terms{' '}
                <HiArrowRight className="inline" />
            </p>
        </footer>
    )
}
