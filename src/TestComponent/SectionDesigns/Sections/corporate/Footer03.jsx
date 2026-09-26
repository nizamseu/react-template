import { HiArrowRight } from 'react-icons/hi'
export default function Footer03() {
    return (
        <footer className="rounded-lg bg-[#121c2c] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
                <div>
                    <a
                        href="#home"
                        className="text-sm font-bold tracking-[.12em]"
                    >
                        NORTHSTAR / ADVISORY
                    </a>
                    <p className="mt-4 max-w-xs text-sm text-white/50">
                        Independent perspective for complex moments.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/65">
                    <a href="#expertise">Expertise</a>
                    <a href="#people">People</a>
                    <a href="#sectors">Sectors</a>
                    <a href="#careers">Careers</a>
                </div>
                <div className="text-sm text-white/60">
                    <p>New York / London / Singapore</p>
                    <a
                        href="#linkedin"
                        className="mt-4 inline-flex items-center gap-1 text-[#84b9ff]"
                    >
                        LinkedIn <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © 2026 Northstar · Legal · Privacy · Accessibility
            </p>
        </footer>
    )
}
