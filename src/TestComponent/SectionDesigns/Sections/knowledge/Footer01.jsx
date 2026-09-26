import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#17231f] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
                <div>
                    <a href="#home" className="font-semibold">
                        northstar docs
                    </a>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">
                        Clear documentation, maintained by the people closest to
                        the product.
                    </p>
                    <p className="mt-5 text-xs text-white/45">
                        Docs version 4.12 · Updated today
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/65">
                    <a href="#guides">Product guides</a>
                    <a href="#api">API reference</a>
                    <a href="#tutorials">Tutorials</a>
                    <a href="#status">
                        System status <HiArrowRight className="inline" />
                    </a>
                    <a href="#community">Developer community</a>
                    <a href="#support">Contact support</a>
                </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/40">
                <span>© Northstar · Documentation</span>
                <span>Privacy · Terms · Accessibility</span>
            </div>
        </footer>
    )
}
