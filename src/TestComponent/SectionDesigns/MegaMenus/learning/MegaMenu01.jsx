// AcademyCurriculumTracksMegaMenu

// MegaMenu01 · Learning Management & EdTech › Mega menus

// Description:
// A dark cohort-curriculum dropdown for a craft academy or bootcamp. A header reads
// "FIELDNOTE STUDIO • ADVANCED CRAFT COHORTS" over "Intensive Practical Curriculum for
// Modern Creators", beside a "Next Cohort starts Oct 15 • 4 spots remaining" pill.
// Four track cards (TRACK 01–04) show weeks, a blurb, a mentor and "Syllabus & Tuition";
// the footer lists three perks and "Download 2026 Academic Catalog (PDF)".

// Design:
// - p-8 panel, 2px lime #c8ef70 top border: a wrapping flex header, a track grid that is
//   one column on mobile and four at lg:, and a footer, split by white/10 rules
// - Deep teal #0e272f surface with #e8f3ea text; lime #c8ef70 for the eyebrow, pinging
//   status dot, TRACK/weeks labels, perk icons and links; the status pill is #1b3e49
// - Serif text-2xl title, font-mono text-[11px] track labels, text-xs blurbs at white/65;
//   rounded-lg cards (white/10 border, white/[0.04] fill) turn lime-bordered on hover
// - The footer wraps, but its three perks sit in a non-wrapping row that can crowd mobile

// What it does:
// - Each "Syllabus & Tuition" link goes to #enroll and the footer catalog link goes to
//   #all-courses (no actual PDF); all call closeMenu on click
// - Header pill, mentor names and perks are display only; no state or effect
// - Used by FieldnoteCohortAdmissionsNavbar: <MegaMenu category="learning" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-xl border-t-2 border-[#c8ef70] shadow-2xl bg-[#0e272f]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AcademyCurriculumTracksMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/learning/MegaMenu01';

// // Inside FieldnoteCohortAdmissionsNavbar it opens from <MegaMenu category="learning" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border-t-2 border-[#c8ef70] shadow-2xl bg-[#0e272f]">
//         <AcademyCurriculumTracksMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineUserGroup,
    HiOutlineVideoCamera,
    HiOutlineCheckCircle,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AcademyCurriculumTracksMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#0e272f] text-[#e8f3ea] p-8 border-t-2 border-[#c8ef70]',
                className,
            )}
            {...props}
        >
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

export default AcademyCurriculumTracksMegaMenu
