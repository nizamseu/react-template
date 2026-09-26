import {
    HiArrowRight,
    HiOutlineAcademicCap,
    HiOutlineClock,
    HiOutlineSparkles,
    HiOutlineStar,
    HiOutlineUserGroup,
    HiOutlineVideoCamera,
    HiOutlineCheckCircle,
    HiOutlineCalendar,
} from 'react-icons/hi'

export default function LearningMegaMenu({ variant = 1, closeMenu, accent = '#3c7e5d' }) {
    // VARIANT 1: Multi-Track Creative Academy & Live Cohorts (fieldnote.)
    if (variant === 1) {
        return (
            <div className="bg-[#0e272f] text-[#e8f3ea] p-8 border-t-2 border-[#c8ef70]">
                {/* Header status bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#c8ef70]">
                            FIELDNOTE STUDIO &bull; ADVANCED CRAFT COHORTS
                        </span>
                        <h3 className="mt-1 font-serif text-2xl text-white">
                            Intensive Practical Curriculum for Modern Creators
                        </h3>
                    </div>
                    <div className="flex items-center gap-3 rounded-full bg-[#1b3e49] px-4 py-1.5 text-xs">
                        <span className="h-2 w-2 rounded-full bg-[#c8ef70] animate-ping" />
                        <span className="text-white/80">Next Cohort starts Oct 15 &bull; 4 spots remaining</span>
                    </div>
                </div>

                {/* 4 Curriculum Tracks & Cohort Spotlight */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {[
                        {
                            num: '01',
                            title: 'Creative Code & Three.js',
                            desc: 'Shaders, raymarching, WebGL particle systems, and interactive canvas physics.',
                            weeks: '8 Weeks',
                            level: 'Intermediate',
                            mentor: 'Kenji Sato (Ex-Stripe)',
                        },
                        {
                            num: '02',
                            title: 'Design Systems Architecture',
                            desc: 'Multi-brand Figma variables, semantic tokens, and production React component libraries.',
                            weeks: '6 Weeks',
                            level: 'All Levels',
                            mentor: 'Sarah Lin (Staff Designer)',
                        },
                        {
                            num: '03',
                            title: 'Editorial Typography & Art Direction',
                            desc: 'Micro-typography, variable font kinetics, Swiss layouts, and generative book design.',
                            weeks: '6 Weeks',
                            level: 'Advanced',
                            mentor: 'Paul Bouvet (Atelier PB)',
                        },
                        {
                            num: '04',
                            title: 'Spatial UI & VisionOS Prototyping',
                            desc: 'Figma to Reality Composer, 3D volume interfaces, and spatial audio interactions.',
                            weeks: '10 Weeks',
                            level: 'Advanced',
                            mentor: 'Chloe Kim (Spatial Lab)',
                        },
                    ].map((track) => (
                        <div
                            key={track.num}
                            className="group flex flex-col justify-between rounded-lg border border-white/10 bg-white/[0.04] p-5 hover:border-[#c8ef70] transition-colors"
                        >
                            <div>
                                <div className="flex items-center justify-between text-[11px] font-mono text-[#c8ef70]">
                                    <span>TRACK {track.num}</span>
                                    <span>{track.weeks}</span>
                                </div>
                                <h4 className="mt-2 text-base font-bold text-white group-hover:text-[#c8ef70] transition-colors">
                                    {track.title}
                                </h4>
                                <p className="mt-2 text-xs text-white/65 leading-relaxed">
                                    {track.desc}
                                </p>
                            </div>
                            <div className="mt-5 border-t border-white/10 pt-3">
                                <span className="block text-[10px] text-white/45">MENTOR</span>
                                <span className="text-xs font-semibold text-white/90">{track.mentor}</span>
                                <a
                                    href="#enroll"
                                    onClick={closeMenu}
                                    className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#c8ef70] hover:underline"
                                >
                                    Syllabus & Tuition <HiArrowRight />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer certifications */}
                <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <HiOutlineCheckCircle className="text-[#c8ef70]" /> Verified Industry Certificate
                        </span>
                        <span className="flex items-center gap-1.5">
                            <HiOutlineUserGroup className="text-[#c8ef70]" /> 1-on-1 Weekly Code Critique
                        </span>
                        <span className="flex items-center gap-1.5">
                            <HiOutlineVideoCamera className="text-[#c8ef70]" /> Lifetime Recording Archive
                        </span>
                    </div>
                    <a href="#all-courses" onClick={closeMenu} className="font-semibold text-white underline hover:text-[#c8ef70]">
                        Download 2026 Academic Catalog (PDF)
                    </a>
                </div>
            </div>
        )
    }

    // VARIANT 2: Masterclass Studio & Mentorship Hub (Fieldnote Class)
    if (variant === 2) {
        return (
            <div className="bg-[#f7f4ed] text-[#142d34] p-8 border-t border-[#d8e2d8]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Upcoming Live Studio Sessions */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#d8e2d8] pb-3">
                            <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#3c7e5d]">
                                THIS WEEK'S LIVE SESSIONS &bull; STUDIO CALENDAR
                            </span>
                            <span className="text-xs font-semibold text-[#3c7e5d]">Broadcast from London & NYC</span>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    date: 'THU OCT 08',
                                    time: '6:00 PM GMT',
                                    title: 'Live Breakdown: Crafting Award-Winning Scroll Experiences',
                                    instructor: 'Marcus Vance &bull; Lead Engineer @ Locomotive',
                                    tag: 'Front-end & WebGL',
                                },
                                {
                                    date: 'SAT OCT 10',
                                    time: '3:00 PM GMT',
                                    title: 'Portfolio Surgery: Live Roasts & Structure Diagnostics',
                                    instructor: 'Jessica Reed &bull; Design Partner @ Obvious',
                                    tag: 'Career & Pitching',
                                },
                                {
                                    date: 'TUE OCT 13',
                                    time: '7:30 PM GMT',
                                    title: 'Design Systems at Scale: 4,000 Components in Production',
                                    instructor: 'David Rossi &bull; Head of Design @ Linear',
                                    tag: 'Systems & Figma',
                                },
                            ].map((session) => (
                                <div
                                    key={session.title}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-white p-4 border border-[#d8e2d8] hover:border-[#3c7e5d] transition-colors"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 font-mono text-[10px] text-[#3c7e5d]">
                                            <span className="font-bold">{session.date}</span>
                                            <span>&bull;</span>
                                            <span>{session.time}</span>
                                            <span className="rounded bg-[#3c7e5d]/10 px-2 py-0.5 text-[#3c7e5d]">
                                                {session.tag}
                                            </span>
                                        </div>
                                        <h5 className="mt-1 font-bold text-sm text-[#142d34]">{session.title}</h5>
                                        <p className="text-xs text-black/60">{session.instructor}</p>
                                    </div>
                                    <a
                                        href="#reserve"
                                        onClick={closeMenu}
                                        className="shrink-0 rounded-full bg-[#142d34] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#3c7e5d] transition-colors self-start sm:self-center"
                                    >
                                        RSVP Seat
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Mentor Spotlight & Student Success Story */}
                    <div className="lg:col-span-5 space-y-5 bg-[#ede7dc] p-6 rounded-lg border border-[#d8e2d8]">
                        <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#3c7e5d]">
                            FEATURED ALUMNI CASE STUDY
                        </span>
                        <div className="flex items-center gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                                alt="Alumni portrait"
                                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                                <h4 className="font-serif text-lg font-bold">Maya Lindqvist</h4>
                                <p className="text-xs text-black/60">Now Design Director @ Resend &bull; Cohort 04</p>
                            </div>
                        </div>
                        <p className="text-xs text-black/70 italic leading-relaxed">
                            "Before Fieldnote, my portfolio had good taste but zero technical rigor. The mentor critiques pushed me to build custom WebGL interactions that changed my career trajectory."
                        </p>
                        <div className="pt-3 border-t border-[#d8e2d8] flex items-center justify-between text-xs">
                            <span className="font-semibold text-[#3c7e5d]">Read Maya's 4-Page Case Study</span>
                            <HiArrowRight className="text-[#3c7e5d]" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // VARIANT 3: Career Path Roadmap & Skills Matrix (FIELDNOTE / SCHOOL)
    if (variant === 3) {
        return (
            <div className="bg-white text-[#102d36] p-8 border-t border-gray-200">
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-4 gap-4">
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#3c7e5d]">
                            CAREER PROGRESSION ENGINE &bull; 2026 ROADMAP
                        </span>
                        <h3 className="mt-1 font-bold text-2xl tracking-tight">
                            From Junior Designer to Design Technologist
                        </h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        <div>
                            <span className="text-gray-400 block text-[10px]">AVG GRAD SALARY</span>
                            <span className="font-bold text-[#3c7e5d]">$124,000 / yr</span>
                        </div>
                        <div className="border-l border-gray-200 pl-4">
                            <span className="text-gray-400 block text-[10px]">HIRE RATE (90 DAYS)</span>
                            <span className="font-bold text-[#3c7e5d]">94.2%</span>
                        </div>
                    </div>
                </div>

                {/* Horizontal Step Roadmap */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        {
                            step: 'Phase 01',
                            title: 'Foundations & Mental Models',
                            skills: ['Design Systems', 'Modern JS / ESNext', 'Git Workflows', 'Accessible HTML'],
                            timeline: 'Month 1',
                        },
                        {
                            step: 'Phase 02',
                            title: 'Component Engineering',
                            skills: ['React 19 & Tailwind', 'State Management', 'Complex Animations (Framer)', 'Unit Testing'],
                            timeline: 'Months 2–3',
                        },
                        {
                            step: 'Phase 03',
                            title: 'Creative Math & WebGL',
                            skills: ['Canvas2D / Three.js', 'Custom GLSL Shaders', 'Audio Reactive Visuals', 'Micro-interactions'],
                            timeline: 'Month 4',
                        },
                        {
                            step: 'Phase 04',
                            title: 'Capstone & Placement',
                            skills: ['Production Client Build', 'Portfolio Storytelling', 'System Design Interview', 'Salary Negotiation'],
                            timeline: 'Months 5–6',
                        },
                    ].map((phase, idx) => (
                        <div
                            key={phase.step}
                            className="relative rounded-lg border border-gray-200 bg-gray-50/50 p-5 hover:bg-white hover:border-[#3c7e5d] transition-all"
                        >
                            <span className="rounded bg-[#3c7e5d]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#3c7e5d]">
                                {phase.step} &bull; {phase.timeline}
                            </span>
                            <h4 className="mt-3 font-bold text-sm text-gray-900">{phase.title}</h4>
                            <ul className="mt-3 space-y-1.5 text-xs text-gray-600">
                                {phase.skills.map((skill) => (
                                    <li key={skill} className="flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#3c7e5d]" />
                                        <span>{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Consultation CTA */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-4 text-xs">
                    <span className="text-gray-500">
                        Unsure which path fits your current background? Take our 3-minute skill diagnostic.
                    </span>
                    <a
                        href="#diagnostic"
                        onClick={closeMenu}
                        className="inline-flex items-center gap-2 rounded-md bg-[#3c7e5d] px-4 py-2 font-semibold text-white hover:bg-[#2d5f46] transition-colors"
                    >
                        Start Diagnostic Test <HiArrowRight />
                    </a>
                </div>
            </div>
        )
    }

    // VARIANT 4: Creative Lab & Weekend Workshops (LEARN / LAB)
    if (variant === 4) {
        return (
            <div className="bg-[#11241f] text-[#ebfbee] p-8 border-t-2 border-[#c8ef70]">
                {/* Search Bar & Filter Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#c8ef70]">
                            OPEN EXPERIMENT LAB &bull; WEEKEND WORKSHOPS
                        </span>
                        <h3 className="mt-1 font-bold text-xl text-white">
                            What do you want to build this Saturday?
                        </h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {['All Labs', 'Audio Shaders', 'Physics Canvas', 'Spatial 3D', 'Generative SVG'].map((filter, i) => (
                            <button
                                key={filter}
                                type="button"
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${i === 0 ? 'bg-[#c8ef70] text-[#11241f]' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3 Interactive Workshop Cards */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Build a Physics-Based Generative Synthesizer',
                            time: '3h 30m',
                            difficulty: 'Intermediate',
                            enrolled: '1,420 students',
                            rating: '4.98',
                            image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
                        },
                        {
                            title: 'Fluid Simulation with WebGL Shaders & Canvas2D',
                            time: '4h 15m',
                            difficulty: 'Advanced',
                            enrolled: '2,180 students',
                            rating: '5.00',
                            image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
                        },
                        {
                            title: 'Procedural Kinetic Typography with Variable Fonts',
                            time: '2h 45m',
                            difficulty: 'All Levels',
                            enrolled: '3,840 students',
                            rating: '4.95',
                            image: 'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&w=600&q=80',
                        },
                    ].map((lab) => (
                        <div
                            key={lab.title}
                            className="group flex flex-col justify-between overflow-hidden rounded-lg border border-white/10 bg-white/5 hover:border-[#c8ef70] transition-all"
                        >
                            <div className="relative h-36 overflow-hidden">
                                <img
                                    src={lab.image}
                                    alt={lab.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2 rounded bg-black/75 px-2 py-0.5 font-mono text-[10px] text-[#c8ef70]">
                                    {lab.difficulty}
                                </div>
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 text-[11px] text-white/50">
                                        <span className="flex items-center gap-1">
                                            <HiOutlineClock /> {lab.time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <HiOutlineStar className="text-amber-400" /> {lab.rating}
                                        </span>
                                    </div>
                                    <h4 className="mt-2 text-sm font-bold text-white group-hover:text-[#c8ef70] transition-colors">
                                        {lab.title}
                                    </h4>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                                    <span className="text-white/60">{lab.enrolled}</span>
                                    <a
                                        href="#start-lab"
                                        onClick={closeMenu}
                                        className="font-bold text-[#c8ef70] underline hover:text-white"
                                    >
                                        Launch Sandbox
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Weekend Hackathon Banner */}
                <div className="mt-6 rounded-lg bg-gradient-to-r from-[#1d3d34] to-[#122b24] p-4 border border-[#c8ef70]/30 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🏆</span>
                        <div>
                            <span className="font-bold text-sm text-white">Monthly Creative Code Hackathon: $5,000 Prize Pool</span>
                            <p className="text-xs text-white/70">Submissions close Sunday midnight &bull; Community judged</p>
                        </div>
                    </div>
                    <a
                        href="#hackathon"
                        onClick={closeMenu}
                        className="rounded-full bg-[#c8ef70] px-4 py-1.5 text-xs font-bold text-[#11241f] hover:bg-white transition-colors"
                    >
                        Submit Project
                    </a>
                </div>
            </div>
        )
    }

    // VARIANT 5: The Mentors Directory & 1-on-1 Office Hours
    return (
        <div className="bg-[#12282e] text-[#e8f1f5] p-8 border-t border-[#3c7e5d]">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/15 pb-4 gap-4">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-[.22em] text-[#95c77b]">
                        FIELDNOTE &bull; 1-ON-1 MENTORSHIP RESIDENCY
                    </span>
                    <h3 className="mt-1 font-serif text-2xl text-white">
                        Book direct 45-minute critique sessions with industry directors
                    </h3>
                </div>
                <div className="text-xs text-white/70 font-mono">
                    🟢 14 Mentors Online Now &bull; Response Time &lt; 2 hrs
                </div>
            </div>

            {/* 3 Mentor Profile Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        name: 'Tobias Van Schneider',
                        role: 'Ex-Design Lead @ Spotify',
                        focus: 'Portfolio Review & Brand Identity',
                        rate: '$180 / session',
                        rating: '5.0 (82 reviews)',
                        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                    },
                    {
                        name: 'Aniko Fehervari',
                        role: 'Principal Creative Dev @ MediaMonks',
                        focus: 'WebGL Shaders & Three.js Optimization',
                        rate: '$160 / session',
                        rating: '4.9 (64 reviews)',
                        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
                    },
                    {
                        name: 'Soren Bækgaard',
                        role: 'VP Product Design @ Klarna',
                        focus: 'Design Systems & Career Strategy',
                        rate: '$190 / session',
                        rating: '5.0 (110 reviews)',
                        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
                    },
                ].map((mentor) => (
                    <div
                        key={mentor.name}
                        className="rounded-lg border border-white/10 bg-white/[0.04] p-5 flex flex-col justify-between hover:border-[#95c77b] transition-colors"
                    >
                        <div>
                            <div className="flex items-center gap-4">
                                <img
                                    src={mentor.image}
                                    alt={mentor.name}
                                    className="h-14 w-14 rounded-full object-cover border border-[#95c77b]/50"
                                />
                                <div>
                                    <h4 className="font-bold text-sm text-white">{mentor.name}</h4>
                                    <p className="text-xs text-[#95c77b]">{mentor.role}</p>
                                    <span className="text-[11px] text-white/50 block mt-0.5">{mentor.rating}</span>
                                </div>
                            </div>
                            <div className="mt-4 rounded bg-black/20 p-3 text-xs">
                                <span className="text-white/40 block text-[10px] font-mono">CORE EXPERTISE</span>
                                <span className="font-medium text-white/90">{mentor.focus}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                            <span className="font-mono text-xs text-white/80">{mentor.rate}</span>
                            <a
                                href="#book-mentor"
                                onClick={closeMenu}
                                className="rounded bg-[#95c77b] px-3 py-1.5 text-xs font-bold text-[#12282e] hover:bg-white transition-colors"
                            >
                                Book Slot
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Critique Callout */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-white/70">
                <span>Need immediate feedback on your Figma file or site? Request an Async 15-min Loom critique.</span>
                <a href="#async-critique" onClick={closeMenu} className="font-bold text-[#95c77b] underline hover:text-white">
                    Submit File for 24h Critique &rarr;
                </a>
            </div>
        </div>
    )
}
