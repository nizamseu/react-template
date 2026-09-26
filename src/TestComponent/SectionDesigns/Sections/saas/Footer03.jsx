import { HiArrowRight } from 'react-icons/hi'
export default function Footer03() {
    return (
        <footer className="rounded-lg bg-[#edf3ee] p-7 text-[#111a22] sm:p-10">
            <div className="flex flex-col justify-between gap-8 md:flex-row">
                <div>
                    <p className="text-sm font-semibold">
                        northstar<span className="text-[#137d62]">.</span>
                    </p>
                    <p className="mt-3 max-w-xs text-sm text-gray-500">
                        Less process. More progress. Software for teams moving
                        work forward.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
                    <a href="#platform">Platform</a>
                    <a href="#customers">Customers</a>
                    <a href="#security">Security</a>
                    <a href="#careers">Careers</a>
                    <a href="#api">
                        API status <HiArrowRight className="inline" />
                    </a>
                    <a href="#contact">Contact</a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#d6e0d7] pt-4 text-xs text-gray-500">
                © 2026 Northstar · Built for focused teams.
            </p>
        </footer>
    )
}
