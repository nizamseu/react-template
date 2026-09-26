import { HiArrowRight } from 'react-icons/hi'
export default function Footer02() {
    return (
        <footer className="rounded-lg bg-[#65e6b4] p-7 text-[#111a22] sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em]">
                        Your next release can feel different.
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-semibold">
                        Give your team a clearer way to work.
                    </h2>
                </div>
                <a
                    href="#trial"
                    className="inline-flex items-center gap-2 self-end text-sm font-bold"
                >
                    Start a free workspace <HiArrowRight />
                </a>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-4 border-t border-[#4bb98f] pt-4 text-xs sm:grid-cols-4">
                <a href="#product">Product</a>
                <a href="#security">Security</a>
                <a href="#docs">Docs</a>
                <a href="#support">Support</a>
            </div>
            <p className="mt-6 text-xs text-[#35644f]">
                © Northstar Software · Privacy · Terms
            </p>
        </footer>
    )
}
