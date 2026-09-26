import {
    HiArrowRight,
    HiOutlineBriefcase,
    HiOutlineChartSquareBar,
    HiOutlineDocumentReport,
    HiOutlineGlobeAlt,
    HiOutlineScale,
    HiOutlineTrendingUp,
} from 'react-icons/hi'

export default function CorporateMegaMenu({ variant = 1, closeMenu, accent = '#3476c5' }) {
    // VARIANT 1: Global Advisory & Strategic Practice Areas (NORTHSTAR / ADVISORY)
    if (variant === 1) {
        return (
            <div className="bg-[#0e1724] text-[#d9e4f2] p-8 border-t-2 border-[#84b9ff]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#84b9ff]">
                            NORTHSTAR ADVISORY &bull; GLOBAL STRATEGY & TRANSFORMATION
                        </span>
                        <h3 className="mt-1 font-serif text-2xl text-white">
                            Counsel for Defining Moments in Enterprise History
                        </h3>
                    </div>
                    <div className="flex items-center gap-6 font-mono text-xs text-white/50">
                        <span>ZURICH</span>
                        <span>LONDON</span>
                        <span>NEW YORK</span>
                        <span>TOKYO</span>
                        <span>SINGAPORE</span>
                    </div>
                </div>

                {/* 4 Practice Columns */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84b9ff]">
                            <HiOutlineBriefcase className="text-base" /> M&A & Capital Strategy
                        </div>
                        <ul className="mt-4 space-y-2 text-xs">
                            {['Cross-Border Transactions', 'Carve-Outs & Spin-Offs', 'Post-Merger Integration', 'Due Diligence & Valuation'].map((s) => (
                                <li key={s}>
                                    <a href="#ma" onClick={closeMenu} className="block py-1 hover:text-[#84b9ff] transition-colors">
                                        &bull; {s}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84b9ff]">
                            <HiOutlineTrendingUp className="text-base" /> AI & Digital Transformation
                        </div>
                        <ul className="mt-4 space-y-2 text-xs">
                            {['Enterprise LLM Architectures', 'Cloud Migration at Scale', 'Data Governance & Sovereign AI', 'Legacy Core Modernization'].map((s) => (
                                <li key={s}>
                                    <a href="#digital" onClick={closeMenu} className="block py-1 hover:text-[#84b9ff] transition-colors">
                                        &bull; {s}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#84b9ff]">
                            <HiOutlineScale className="text-base" /> ESG & Energy Transition
                        </div>
                        <ul className="mt-4 space-y-2 text-xs">
                            {['Scope 1-3 Decarbonization', 'EU CSRD Regulatory Compliance', 'Renewable Infrastructure Capital', 'Supply Chain Circularity'].map((s) => (
                                <li key={s}>
                                    <a href="#esg" onClick={closeMenu} className="block py-1 hover:text-[#84b9ff] transition-colors">
                                        &bull; {s}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Executive Report Card */}
                    <div className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-wider block">
                                EXECUTIVE BRIEFING &bull; 2026
                            </span>
                            <h4 className="mt-2 font-serif text-base text-white">The Geopolitics of Sovereign Technology</h4>
                            <p className="mt-2 text-xs text-white/60">
                                Comprehensive 48-page strategic study for Global 2000 CEOs and board directors.
                            </p>
                        </div>
                        <a
                            href="#download-briefing"
                            onClick={closeMenu}
                            className="mt-4 flex items-center justify-between text-xs font-bold text-[#84b9ff] underline hover:text-white"
                        >
                            <span>Download Executive Briefing (PDF)</span>
                            <HiArrowRight />
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 2: Investor Relations & Public Markets Hub
    if (variant === 2) {
        return (
            <div className="bg-[#0b111a] text-[#cdd8e6] p-8 border-t border-white/15">
                {/* Stock Ticker Banner */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-white/5 p-4 border border-white/10 font-mono text-xs">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-white">NYSE: NST</span>
                        <span className="text-emerald-400 font-bold">$148.60 ▲ +3.2%</span>
                        <span className="text-white/40">Market Cap: $18.4B</span>
                    </div>
                    <div className="text-white/60">
                        Q3 2026 Earnings Call: Oct 28 &bull; 9:00 AM EST (Live Webcast)
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-widest block">
                            REGULATORY FILINGS
                        </span>
                        <div className="space-y-2 text-xs">
                            {['Form 10-K Annual Report 2025', 'Form 10-Q Second Quarter 2026', 'Proxy Statement & Schedule 14A', 'Shareholder Letters by CEO'].map((doc) => (
                                <a
                                    key={doc}
                                    href="#filing"
                                    onClick={closeMenu}
                                    className="flex items-center justify-between border-b border-white/10 py-1.5 hover:text-white"
                                >
                                    <span>&bull; {doc}</span>
                                    <span className="font-mono text-[10px] text-white/40">PDF</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-widest block">
                            CORPORATE GOVERNANCE
                        </span>
                        <div className="space-y-2 text-xs">
                            {['Board of Directors & Committees', 'Code of Business Conduct & Ethics', 'Whistleblower & Audit Policies', 'Executive Compensation Disclosures'].map((doc) => (
                                <a
                                    key={doc}
                                    href="#gov"
                                    onClick={closeMenu}
                                    className="block border-b border-white/10 py-1.5 hover:text-white"
                                >
                                    &bull; {doc}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-[#121c2c] to-[#0a111a] p-5 border border-[#84b9ff]/30 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] text-[#84b9ff] block">INVESTOR DAY 2026</span>
                            <h4 className="mt-2 font-serif text-lg text-white">Long-Term Capital Allocation & Dividends</h4>
                            <p className="mt-2 text-xs text-white/60">
                                Reaffirming 2026 guidance: 18-22% free cash flow margin expansion.
                            </p>
                        </div>
                        <a
                            href="#webcast"
                            onClick={closeMenu}
                            className="mt-4 inline-flex items-center justify-center rounded bg-[#84b9ff] py-2 text-xs font-bold text-[#0b111a] hover:bg-white transition-colors"
                        >
                            Register for Webcast
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 3: Client Case Studies & Quantified Impact
    if (variant === 3) {
        return (
            <div className="bg-[#101b2a] text-white p-8 border-t border-white/10">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-[.25em]">
                            PROVEN TRANSFORMATION AT SCALE
                        </span>
                        <h3 className="mt-1 text-2xl font-bold font-serif">Quantified Enterprise Outcomes</h3>
                    </div>
                    <span className="text-xs text-white/50">Independent Audited Impact Metrics</span>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            client: 'Global Industrial Conglomerate',
                            metric: '$140,000,000',
                            label: 'Annual Operating Expenditure Saved',
                            desc: 'Modernized 18 international factories with predictive telemetry and automated parts procurement.',
                        },
                        {
                            client: 'Tier-1 European Investment Bank',
                            metric: '99.999%',
                            label: 'Core Settlement Ledger Availability',
                            desc: 'Architected sovereign cloud transaction pipeline handling €420B daily volume.',
                        },
                        {
                            client: 'Nordic Clean Mobility Leader',
                            metric: '-42%',
                            label: 'Lifecycle Carbon Intensity Reduction',
                            desc: 'Executed end-to-end supply chain trace audit spanning 3,200 sub-tier suppliers.',
                        },
                    ].map((item) => (
                        <div
                            key={item.client}
                            className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between hover:border-[#84b9ff] transition-colors"
                        >
                            <div>
                                <span className="font-mono text-[10px] text-white/40 uppercase">{item.client}</span>
                                <div className="mt-3 font-mono text-3xl font-extrabold text-[#84b9ff]">{item.metric}</div>
                                <span className="block text-xs font-bold text-white mt-1">{item.label}</span>
                                <p className="mt-2 text-xs text-white/60 leading-relaxed">{item.desc}</p>
                            </div>
                            <a
                                href="#case-study"
                                onClick={closeMenu}
                                className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#84b9ff] hover:underline"
                            >
                                <span>Read Full Audit Report</span>
                                <HiArrowRight />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 4: Innovation Lab, Research Institute & Whitepapers
    if (variant === 4) {
        return (
            <div className="bg-[#0d1520] text-[#d6e3f2] p-8 border-t border-[#3476c5]">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-4 gap-4">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#84b9ff]">
                            NORTHSTAR INSTITUTE OF APPLIED COMPUTING & POLICY
                        </span>
                        <h3 className="mt-1 text-2xl font-bold font-serif text-white">Peer-Reviewed Research Papers</h3>
                    </div>
                    <div className="font-mono text-xs text-white/60">
                        340+ Patents Awarded &bull; Academic Affiliates: MIT, ETH Zurich, Cambridge
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Cryptographic Guarantees for Synthetic Data Generation in Healthcare',
                            authors: 'Dr. Evelyn Ward, Dr. Hiroshi Tanaka',
                            date: 'September 2026',
                            citations: '142 Citations',
                        },
                        {
                            title: 'Decentralized Grid Balancing Under 90% Renewable Intermittency',
                            authors: 'Prof. Lars Lindgren, Elena Rostova',
                            date: 'August 2026',
                            citations: '98 Citations',
                        },
                        {
                            title: 'Sub-Millisecond Byzantine Consensus Across Terrestrial Satellite Links',
                            authors: 'Dr. Marcus Vance, Clara Diaz',
                            date: 'July 2026',
                            citations: '210 Citations',
                        },
                    ].map((paper) => (
                        <div
                            key={paper.title}
                            className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between font-mono text-[10px] text-white/40">
                                    <span>{paper.date}</span>
                                    <span className="text-[#84b9ff]">{paper.citations}</span>
                                </div>
                                <h4 className="mt-2 text-sm font-bold text-white hover:underline cursor-pointer">
                                    {paper.title}
                                </h4>
                                <p className="mt-2 text-xs text-white/50">{paper.authors}</p>
                            </div>
                            <a
                                href="#pdf"
                                onClick={closeMenu}
                                className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#84b9ff] font-semibold"
                            >
                                <span>Download Open-Access Preprint</span>
                                <HiArrowRight />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // VARIANT 5: Private Equity & Boutique Asset Management
    return (
        <div className="bg-[#0a0f17] text-[#c9d6e6] p-8 border-t-2 border-[#84b9ff]">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#84b9ff] uppercase tracking-[.25em]">
                        NORTHSTAR CAPITAL PARTNERS &bull; PRIVATE MARKETS
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">Discreet Long-Term Capital for Category Leaders</h3>
                </div>
                <div className="font-mono text-xs text-white/60">
                    $18.4B AUM &bull; 82 Active Portfolio Companies
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded border border-white/10 bg-white/5">
                    <span className="font-mono text-[10px] text-[#84b9ff] block">STRATEGY 01</span>
                    <h4 className="mt-1 font-serif text-base font-bold text-white">Growth Equity in Mission-Critical Software</h4>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                        Minority and majority investments in founder-led enterprise infrastructure with €10M–€50M ARR.
                    </p>
                </div>
                <div className="p-4 rounded border border-white/10 bg-white/5">
                    <span className="font-mono text-[10px] text-[#84b9ff] block">STRATEGY 02</span>
                    <h4 className="mt-1 font-serif text-base font-bold text-white">Clean Energy & Infrastructure Transition</h4>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                        Direct asset development across green hydrogen, battery storage, and Nordic grid interconnectors.
                    </p>
                </div>
                <div className="p-4 rounded border border-white/10 bg-white/5 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-[#84b9ff] block">LP PORTAL</span>
                        <h4 className="mt-1 font-serif text-base font-bold text-white">Accredited Investor Room</h4>
                        <p className="mt-2 text-xs text-white/60">Secure audited quarterly statements and capital calls.</p>
                    </div>
                    <a
                        href="#lp-login"
                        onClick={closeMenu}
                        className="mt-3 inline-flex items-center justify-center rounded bg-[#84b9ff] py-1.5 text-xs font-bold text-[#0a0f17] hover:bg-white"
                    >
                        Sign in with Security Key
                    </a>
                </div>
            </div>
        </div>
    )
}
