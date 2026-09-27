// SundayBroadsheetMegaMenu

// MegaMenu01 · Blogs & Digital Media › Mega menus

// Description:
// The "Sunday Broadsheet" panel for a magazine or long-form blog navbar. It leads with
// a "COVER ESSAY • ISSUE NO. 48" (photo, "The Architecture of Solitude…" headline,
// standfirst and byline), lists four stories under "THE CULTURAL INDEX" with section and
// read time, and ends with a "The Saturday Morning Letter" newsletter box (email field
// and a "Receive Dispatch" button).

// Design:
// - lg:grid-cols-12 layout: cover story (lg:col-span-5, border-r divider), story index
//   (lg:col-span-4) and newsletter box (lg:col-span-3)
// - Paper #f2efe9 surface, #1c1d1a ink; rust #a8472b top border (border-t-2), eyebrows,
//   story hover and button fill (#863720 on hover); #ded8cb rules, #e8e3d8 newsletter box
// - Serif headlines (text-2xl cover, text-sm stories, text-lg letter), font-mono
//   metadata, wide-tracked uppercase eyebrows; rounded h-48 image, rounded-lg letter box
// - Columns stack below lg:; the cover column keeps its border-r and pr-6 on mobile too

// What it does:
// - The four index stories (#story) and the "Receive Dispatch" button call closeMenu on
//   click; the button only closes the menu, the email input is uncontrolled and never sent
// - The cover headline has hover:underline and cursor-pointer but is not a link; the
//   cover image zooms on hover (CSS only); no state or effect
// - Used by MarginBroadsheetSearchNavbar: <MegaMenu category="media" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-none border-t-2 border-[#a8472b] border-b border-black/20 shadow-2xl bg-[#f2efe9]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SundayBroadsheetMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/media/MegaMenu01';

// // Inside MarginBroadsheetSearchNavbar it opens from <MegaMenu category="media" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-t-2 border-[#a8472b] border-b border-black/20 shadow-2xl bg-[#f2efe9]">
//         <SundayBroadsheetMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function SundayBroadsheetMegaMenu({
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
                'bg-[#f2efe9] text-[#1c1d1a] p-8 border-t-2 border-[#a8472b]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Lead Cover Story */}
                <div className="lg:col-span-5 space-y-4 border-r border-[#ded8cb] pr-6">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="font-bold text-[#a8472b] uppercase tracking-widest">
                            COVER ESSAY &bull; ISSUE NO. 48
                        </span>
                        <span className="text-black/50">14 MIN READ</span>
                    </div>
                    <div className="relative h-48 overflow-hidden rounded">
                        <img
                            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                            alt="Cover Essay Landscape"
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </div>
                    <h3 className="font-serif text-2xl font-bold leading-tight hover:underline cursor-pointer">
                        The Architecture of Solitude: Why Modern Spaces are Built for Silence
                    </h3>
                    <p className="text-xs text-black/70 leading-relaxed">
                        From Kyoto meditation pavilions to brutalist concrete chapels in the Swiss Alps, a quiet revolution is rejecting architectural noise.
                    </p>
                    <div className="text-[11px] text-black/50">
                        By Arthur Pendelton &bull; Photography by Emi Yoshikawa
                    </div>
                </div>

                {/* Center: The Cultural Beats */}
                <div className="lg:col-span-4 space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#a8472b]">
                        THE CULTURAL INDEX
                    </span>
                    <div className="space-y-3 text-xs">
                        {[
                            {
                                section: 'DESIGN CRITIQUE',
                                title: 'When Interfaces Stole the Joy of Tactility',
                                time: '6m',
                            },
                            {
                                section: 'SPECULATIVE FUTURE',
                                title: 'Autonomous Micro-Forests: Re-wilding Tokyo’s Rooftops',
                                time: '9m',
                            },
                            {
                                section: 'SOUND & ARCHIVE',
                                title: 'Preserving the Disappearing Dialects of the Hebrides',
                                time: '11m',
                            },
                            {
                                section: 'THE PHILOSOPHICAL ESSAY',
                                title: 'The Lost Art of Waiting Without Reaching for a Screen',
                                time: '8m',
                            },
                        ].map((story) => (
                            <a
                                key={story.title}
                                href="#story"
                                onClick={closeMenu}
                                className="group block border-b border-[#ded8cb] pb-2.5 hover:text-[#a8472b] transition-colors"
                            >
                                <div className="flex items-center justify-between text-[10px] font-mono text-black/40">
                                    <span>{story.section}</span>
                                    <span>{story.time}</span>
                                </div>
                                <h5 className="mt-1 font-serif text-sm font-semibold text-black/90 group-hover:text-[#a8472b]">
                                    {story.title}
                                </h5>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Right: The Weekend Dispatch Newsletter */}
                <div className="lg:col-span-3 space-y-4 bg-[#e8e3d8] p-5 rounded-lg border border-[#ded8cb]">
                    <span className="text-[9px] font-bold uppercase tracking-[.25em] text-[#a8472b]">
                        DISPATCH NO. 142
                    </span>
                    <h4 className="font-serif text-lg font-bold">The Saturday Morning Letter</h4>
                    <p className="text-xs text-black/70 leading-relaxed">
                        A weekly curation of five unhurried essays, one photographic folio, and an audio field recording. Read by 84,000 curious minds.
                    </p>
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full rounded border border-black/20 bg-white px-3 py-2 text-xs outline-none"
                    />
                    <button
                        type="button"
                        onClick={closeMenu}
                        className="w-full rounded bg-[#a8472b] py-2 text-xs font-bold text-white hover:bg-[#863720] transition-colors"
                    >
                        Receive Dispatch
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SundayBroadsheetMegaMenu
