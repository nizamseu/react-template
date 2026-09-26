import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#111a22] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="text-xl font-semibold">
                        northstar<span className="text-[#65e6b4]">/</span>
                    </a>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-white/50">
                        A more focused way to run work. Built for teams who make
                        things happen.
                    </p>
                </div>
                {[
                    ['Platform', 'Overview', 'Integrations', 'Security'],
                    ['Resources', 'Customer stories', 'Guides', 'API docs'],
                    ['Company', 'About', 'Careers', 'Contact'],
                ].map(([title, ...items]) => (
                    <div key={title}>
                        <h3 className="text-xs font-semibold text-[#65e6b4]">
                            {title}
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-white/55">
                            {items.map((item) => (
                                <li key={item}>
                                    <a href="#footer">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-9 flex justify-between border-t border-white/10 pt-4 text-xs text-white/40">
                <span>© 2026 Northstar Inc.</span>
                <span>
                    Status <HiArrowRight className="inline" /> · Privacy · Terms
                </span>
            </div>
        </footer>
    )
}
