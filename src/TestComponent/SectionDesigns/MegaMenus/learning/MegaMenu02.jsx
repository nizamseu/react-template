// LiveStudioCalendarMegaMenu

// MegaMenu02 · Learning Management & EdTech › Mega menus

// Description:
// A light live-session calendar dropdown for a cohort school's student portal. Under
// "THIS WEEK'S LIVE SESSIONS • STUDIO CALENDAR" and "Broadcast from London & NYC" sit
// three dated sessions (e.g. "THU OCT 08 • 6:00 PM GMT", "Live Breakdown: Crafting
// Award-Winning Scroll Experiences"), each with a tag and "RSVP Seat". Beside them a
// "FEATURED ALUMNI CASE STUDY" card shows Maya Lindqvist's portrait, role and quote.

// Design:
// - p-8 panel with a #d8e2d8 top border; one column on mobile, a 7/5 split at lg:
//   (lg:grid-cols-12 with col-span-7 sessions and a col-span-5 case study)
// - Cream #f7f4ed surface, #142d34 text; green #3c7e5d eyebrows, mono date lines and
//   tag chips on #3c7e5d/10; white rounded-lg session rows turn green-bordered on hover
// - "RSVP Seat" is a rounded-full #142d34 pill (hover #3c7e5d); the #ede7dc case-study
//   card is rounded-lg with a serif name and an h-16 round portrait
// - Session rows stack text above the button on mobile and sit side by side from sm:

// What it does:
// - "RSVP Seat" links go to #reserve and call closeMenu on click; they are the only links
// - "Read Maya's 4-Page Case Study" and its arrow are plain text styled as a link;
//   instructor strings hold &bull; in JS, so it renders as literal "&bull;" text
// - No state or effect
// - Used by FieldnoteClassStudentPortalNavbar: <MegaMenu category="learning" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-none border-y border-[#d8e2d8] shadow-2xl bg-[#f7f4ed]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LiveStudioCalendarMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/learning/MegaMenu02';

// // Inside FieldnoteClassStudentPortalNavbar it opens from <MegaMenu category="learning" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-y border-[#d8e2d8] shadow-2xl bg-[#f7f4ed]">
//         <LiveStudioCalendarMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LiveStudioCalendarMegaMenu({
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
                'bg-[#f7f4ed] text-[#142d34] p-8 border-t border-[#d8e2d8]',
                className,
            )}
            {...props}
        >
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

export default LiveStudioCalendarMegaMenu
