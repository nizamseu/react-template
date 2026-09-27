// CareerRoadmapSkillsMatrixMegaMenu

// MegaMenu03 · Learning Management & EdTech › Mega menus

// Description:
// A white, Swiss-style career-roadmap dropdown for a design and front-end bootcamp.
// The header, "CAREER PROGRESSION ENGINE • 2026 ROADMAP" over "From Junior Designer to
// Design Technologist", sits beside $124,000 / yr salary and 94.2% 90-day hire stats.
// Four phase cards (Phase 01 "Foundations & Mental Models" to Phase 04 "Capstone &
// Placement") list four skills each, and a footer offers "Start Diagnostic Test".

// Design:
// - p-8 panel with a gray-200 top border; the header stacks on mobile and is a
//   bottom-aligned row at md:; the phase grid is one column on mobile, four at md:
// - White surface, #102d36 text; green #3c7e5d eyebrow, stat values, phase chips on
//   #3c7e5d/10, skill dots and the CTA button (hover #2d5f46)
// - Bold tracking-tight text-2xl title, font-mono stats box on gray-50; rounded-lg
//   phase cards on gray-50/50 go white with a green border on hover
// - The footer is a wrapping flex row with a gray-100 top border and a rounded-md CTA

// What it does:
// - "Start Diagnostic Test" goes to #diagnostic and calls closeMenu; it is the only link
// - Stats, phase cards and skills are display only; no state or effect
// - Used by FieldnoteAcademyThreeTierMastheadNavbar: <MegaMenu category="learning" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-xl border border-gray-200 shadow-2xl bg-white'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CareerRoadmapSkillsMatrixMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/learning/MegaMenu03';

// // Inside FieldnoteAcademyThreeTierMastheadNavbar it opens from <MegaMenu category="learning" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border border-gray-200 shadow-2xl bg-white">
//         <CareerRoadmapSkillsMatrixMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CareerRoadmapSkillsMatrixMegaMenu({
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
                'bg-white text-[#102d36] p-8 border-t border-gray-200',
                className,
            )}
            {...props}
        >
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

export default CareerRoadmapSkillsMatrixMegaMenu
