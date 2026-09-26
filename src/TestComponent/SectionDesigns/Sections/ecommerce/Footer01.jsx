import { HiArrowRight } from 'react-icons/hi'
export default function Footer01() {
    return (
        <footer className="rounded-lg bg-[#1c1b19] p-7 text-white sm:p-10">
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="font-serif text-3xl">
                        goodform.
                    </a>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
                        Useful objects, made with care, chosen to be kept.
                    </p>
                </div>
                {[
                    ['Explore', 'New arrivals', 'Home objects', 'Gift guide'],
                    ['Our world', 'Meet makers', 'Materials', 'Journal'],
                    ['Help', 'Shipping & returns', 'Care guide', 'Contact'],
                ].map(([title, ...links]) => (
                    <div key={title}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#d6f36a]">
                            {title}
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-white/70">
                            {links.map((link) => (
                                <li key={link}>
                                    <a href="#footer">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/45 sm:flex-row">
                <span>© 2026 Goodform Goods</span>
                <span>
                    Instagram <HiArrowRight className="inline" /> &nbsp; Terms
                    &nbsp; Privacy
                </span>
            </div>
        </footer>
    )
}
