// LearningCoursesMegaMenuCollection

// LearningMegaMenu · Section designs › Mega menus

// Description:
// The panel content for education / online-academy navbars, normally rendered by MegaMenu
// (category="learning"). It shows one of five course-platform designs: cohort curriculum tracks,
// a live session calendar, a career roadmap, weekend workshop labs, or a mentor booking directory.
// Links are hash anchors that close the menu when clicked.

// Design:
// - Static demo data mapped into Tailwind card grids; deep teal/green backgrounds with lime #c8ef70 highlights on the dark variants and green #3c7e5d on the light ones.
// - Variant 1 — "Academy Curriculum Tracks": dark teal #0e272f with lime top border; cohort header with a pinging "4 spots remaining" pill, four track cards (weeks, mentor, "Syllabus & Tuition") and a certificate footer with a catalog link.
// - Variant 2 — "Live Studio Calendar": cream #f7f4ed; 7/5 split with three dated live-session rows ("RSVP Seat") and a featured alumni case-study card.
// - Variant 3 — "Career Roadmap & Skills Matrix": white Swiss-style layout; salary and hire-rate stats, a four-phase skills roadmap (Phase 01–04) and a "Start Diagnostic Test" CTA.
// - Variant 4 — "Creative Experiment Lab": dark green #11241f with lime; header with filter pills, three workshop cards (image, difficulty, time, rating, "Launch Sandbox") and a hackathon banner ("Submit Project").
// - Variant 5 — "Mentorship Residency": dark #12282e with soft green #95c77b; "Mentors Online" header, three mentor profile cards (rating, expertise, rate, "Book Slot") and an async critique link.

// What it does:
// - variant picks one of five panel files in MegaMenus/learning/: 1 → MegaMenu01 (AcademyCurriculumTracksMegaMenu),
//   2 → MegaMenu02 (LiveStudioCalendarMegaMenu), 3 → MegaMenu03 (CareerRoadmapSkillsMatrixMegaMenu),
//   4 → MegaMenu04 (CreativeExperimentLabMegaMenu), 5 → MegaMenu05 (MentorshipResidencyMegaMenu).
//   Any other value renders MegaMenu05.
// - Every <a> calls closeMenu on click; there is no state or effect.
// - The Variant 4 filter pills are static buttons without a click handler ("All Labs" is always highlighted), and the Variant 2 "Read Maya's 4-Page Case Study" line is plain text, not a link.
// - Colours are hard-coded; the accent prop is accepted but not used anywhere in the markup.

// @param {object} props
// @param {number} [props.variant=1] Design to render: 1–4, any other value falls back to Variant 5.
// @param {Function} props.closeMenu Called when any link in the panel is clicked (MegaMenu passes its own close handler).
// @param {string} [props.accent='#3c7e5d'] Accepted for API consistency with the other category menus; currently unused.
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import LearningCoursesMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/LearningMegaMenu';

// // Normally rendered for you by <MegaMenu category="learning" variant={2} />
// export default function CoursesMenuPreview() {
//     const [open, setOpen] = useState(true)
//     if (!open) return null
//     return (
//         <div className="rounded-none border-y border-[#d8e2d8] shadow-2xl">
//             <LearningCoursesMegaMenuCollection variant={2} closeMenu={() => setOpen(false)} />
//         </div>
//     )
// }
// ```


'use client'

import AcademyCurriculumTracksMegaMenu from './learning/MegaMenu01';
import LiveStudioCalendarMegaMenu from './learning/MegaMenu02';
import CareerRoadmapSkillsMatrixMegaMenu from './learning/MegaMenu03';
import CreativeExperimentLabMegaMenu from './learning/MegaMenu04';
import MentorshipResidencyMegaMenu from './learning/MegaMenu05';

const menus = {
    1: AcademyCurriculumTracksMegaMenu,
    2: LiveStudioCalendarMegaMenu,
    3: CareerRoadmapSkillsMatrixMegaMenu,
    4: CreativeExperimentLabMegaMenu,
    5: MentorshipResidencyMegaMenu,
}

export function LearningCoursesMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#3c7e5d',
    className,
    ...props
}) {
    const Menu = menus[variant] || menus[5]

    return (
        <Menu
            size={size}
            disabled={disabled}
            loading={loading}
            closeMenu={closeMenu}
            className={className}
            {...props}
        />
    )
}

export default LearningCoursesMegaMenuCollection