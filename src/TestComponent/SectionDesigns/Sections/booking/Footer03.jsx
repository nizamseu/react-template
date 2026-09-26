import { HiArrowRight } from 'react-icons/hi'
export default function Footer03() {
    return (
        <footer className="rounded-lg bg-[#132d3a] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="font-serif text-2xl">
                        elsewhere.
                    </a>
                    <p className="mt-3 text-sm text-white/55">
                        Travel less like a checklist. More like a guest.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/65">
                    <a href="#stays">Stays</a>
                    <a href="#hosts">Hosts</a>
                    <a href="#experiences">Experiences</a>
                    <a href="#journal">Journal</a>
                </div>
                <div className="text-sm text-white/55">
                    <p>For thoughtful travelers</p>
                    <a
                        href="#instagram"
                        className="mt-3 inline-flex items-center gap-1 text-[#f0aa8d]"
                    >
                        Instagram <HiArrowRight />
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © Elsewhere · Terms · Privacy · Local impact
            </p>
        </footer>
    )
}
