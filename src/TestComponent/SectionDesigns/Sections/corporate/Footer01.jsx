import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#121c2c] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.1fr_1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#84b9ff]">
                        The next move starts here
                    </p>
                    <h2 className="mt-3 max-w-sm text-4xl font-semibold">
                        Bring us your hardest question.
                    </h2>
                    <a
                        href="#contact"
                        className="mt-5 inline-flex items-center gap-2 text-sm"
                    >
                        Start a conversation <HiArrowRight />
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                    <a href="#services">Capabilities</a>
                    <a href="#careers">Careers</a>
                    <a href="#work">Client work</a>
                    <a href="#contact">Contact</a>
                </div>
                <div className="text-sm text-white/60">
                    <p>New York · London · Singapore</p>
                    <p className="mt-2">hello@northstar.example</p>
                    <p className="mt-5 text-xs">
                        LinkedIn ↗ &nbsp; Instagram ↗
                    </p>
                </div>
            </div>
            <p className="mt-9 border-t border-white/15 pt-4 text-xs text-white/40">
                © Northstar Advisory 2026 · Privacy · Terms
            </p>
        </footer>
    )
}
