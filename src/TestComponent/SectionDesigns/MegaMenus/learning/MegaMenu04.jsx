// CreativeExperimentLabMegaMenu

// MegaMenu04 · Learning Management & EdTech › Mega menus

// Description:
// A dark weekend-workshop dropdown for a creative-coding school. The header, "OPEN
// EXPERIMENT LAB • WEEKEND WORKSHOPS" over "What do you want to build this Saturday?",
// sits beside five filter pills (All Labs to Generative SVG). Three workshop cards show
// an image, difficulty, time, rating and "Launch Sandbox", and a banner promotes a
// "$5,000 Prize Pool" creative-code hackathon with "Submit Project".

// Design:
// - p-8 panel, 2px lime #c8ef70 top border; the header stacks on mobile and is a row at
//   md:; the card grid is one column on mobile, three at md:; a banner closes the panel
// - Dark green #11241f surface, #ebfbee text; lime #c8ef70 for the mono eyebrow, active
//   pill, difficulty badges, card hover borders/titles and CTAs; amber-400 rating star
// - Rounded-lg cards (white/10 border, white/5 fill) with an h-36 image that scales to
//   105% on hover; the banner is a #1d3d34 to #122b24 gradient, #c8ef70/30 border
// - Pills and "Submit Project" are rounded-full; the lime button turns white on hover

// What it does:
// - "Launch Sandbox" links go to #start-lab and "Submit Project" to #hackathon; all call
//   closeMenu on click
// - Filter pills are buttons with no click handler ("All Labs" is always highlighted);
//   no state or effect
// - Used by LearnLabFloatingPillNavbar: <MegaMenu category="learning" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-none border-2 border-[#c8ef70] shadow-[6px_6px_0px_0px_#c8ef70] bg-[#11241f]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CreativeExperimentLabMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/learning/MegaMenu04';

// // Inside LearnLabFloatingPillNavbar it opens from <MegaMenu category="learning" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-2 border-[#c8ef70] shadow-[6px_6px_0px_0px_#c8ef70] bg-[#11241f]">
//         <CreativeExperimentLabMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineClock, HiOutlineStar } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CreativeExperimentLabMegaMenu({
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
                'bg-[#11241f] text-[#ebfbee] p-8 border-t-2 border-[#c8ef70]',
                className,
            )}
            {...props}
        >
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

export default CreativeExperimentLabMegaMenu
