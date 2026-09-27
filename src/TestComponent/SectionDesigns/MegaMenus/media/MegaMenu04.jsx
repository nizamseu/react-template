// BreakingNewsWireMegaMenu

// MegaMenu04 · Blogs & Digital Media › Mega menus

// Description:
// The "Breaking News Wire" panel for a news-site or live-blog navbar. A red "BREAKING
// WIRE" banner carries a pinging dot and one headline on a new net-zero timber code;
// below it, four timestamped wire cards ("4m ago" to "1h 10m ago") are tagged #POLICY,
// #DESIGN, #AI ETHICS and #URBANISM, each with a "Wire Feed" footer and a "Save" button.

// Design:
// - Full-width banner, then a grid-cols-1 md:grid-cols-4 row of wire cards
// - Off-white #f7f5f2 surface, #222 text, black/10 top border; red-600 banner and
//   timestamps, white cards with black/10 borders, gray-400/500 metadata
// - font-mono text-[10px] banner label, times and tags; text-xs bold headlines; rounded
//   banner, rounded-lg cards that gain shadow-sm on hover
// - Cards stack on mobile and sit four across from md:; the banner headline truncates

// What it does:
// - Nothing calls closeMenu: the panel has no links, and the four "Save" buttons have no
//   onClick; the pinging dot (animate-ping) and card shadow are CSS only
// - No state or effect
// - Used by FloatingLiveWirePillNavbar: <MegaMenu category="media" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-lg border border-black/15 shadow-xl bg-[#f7f5f2]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: accepted like the other panels, but nothing in this design calls it
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BreakingNewsWireMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/media/MegaMenu04';

// // Inside FloatingLiveWirePillNavbar it opens from <MegaMenu category="media" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-lg border border-black/15 shadow-xl bg-[#f7f5f2]">
//         <BreakingNewsWireMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineBookmark } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BreakingNewsWireMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    // eslint-disable-next-line no-unused-vars -- kept so it is not spread onto the <div>
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
                'bg-[#f7f5f2] text-[#222] p-8 border-t border-black/10',
                className,
            )}
            {...props}
        >
            {/* Breaking Wire Banner */}
            <div className="flex items-center gap-3 rounded bg-red-600 px-4 py-2 text-xs font-bold text-white">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                <span className="uppercase tracking-widest font-mono text-[10px]">BREAKING WIRE</span>
                <span className="truncate">International Union for Architecture sets new net-zero timber construction code for 2028.</span>
            </div>

            {/* 4 Live Timestamp Feed Items */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    {
                        time: '4m ago',
                        tag: 'POLICY',
                        title: 'EU approves strict open-source protections for creative developers',
                    },
                    {
                        time: '18m ago',
                        tag: 'DESIGN',
                        title: 'Dieter Rams donates personal prototype archives to Frankfurt Museum',
                    },
                    {
                        time: '42m ago',
                        tag: 'AI ETHICS',
                        title: 'Major photographers guild files landmark lawsuit over synthetic training models',
                    },
                    {
                        time: '1h 10m ago',
                        tag: 'URBANISM',
                        title: 'Paris completes 100% car-free transformation of Central Riverfront',
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="rounded-lg border border-black/10 bg-white p-4 flex flex-col justify-between hover:shadow-sm transition-shadow"
                    >
                        <div>
                            <div className="flex items-center justify-between font-mono text-[10px] text-gray-500">
                                <span className="font-bold text-red-600">{item.time}</span>
                                <span>#{item.tag}</span>
                            </div>
                            <h5 className="mt-2 text-xs font-bold leading-snug">{item.title}</h5>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
                            <span>Wire Feed</span>
                            <button type="button" className="hover:text-black">
                                <HiOutlineBookmark /> Save
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BreakingNewsWireMegaMenu
