// GuildsSpacesMegaMenu

// MegaMenu01 · Social Networks & Communities › Mega menus

// Description:
// A dark guild-discovery panel for a community / forum site ("COMMONROOM • EXPLORE 120+
// ACTIVE GUILDS"). Under "Find Your Community of Practice" and a "3,842 members active
// right now" pill it shows three guild cards (Creative Code & Shaders, Independent
// Founders Salon, Type Designers Worldwide) with online count, latest topic, hashtags,
// member count and a "Join Guild" button, plus a "Create a Guild →" footer link.

// Design:
// - Flex-wrap header row, a grid-cols-1 md:grid-cols-3 gap-6 card grid mapped from a
//   static array, and a full-width footer row above a white/10 rule
// - Warm brown #241c19 surface, #f7e6de text, 2px peach #ffccad top border; peach for the
//   eyebrow, GUILD / online labels, the pill (#352520 bg, animate-ping dot) and CTAs;
//   white/5 cards with white/10 borders that turn peach on hover
// - Mono uppercase text-[10px] eyebrow (tracking-[.25em]), bold text-2xl white heading,
//   italic text-xs topics; rounded-lg cards, rounded-full pill, rounded peach "Join Guild"
//   chips with #241c19 text (hover:bg-white)
// - Cards stack to one column below md; the footer row does not wrap, so its note and
//   link stay side by side at every width

// What it does:
// - "Join Guild" (all three → #join-guild) and "Create a Guild →" (#new-guild) call
//   closeMenu on click; hashtags, counts and the members pill are static text
// - No state or effect; the hover border and ping dot are CSS only
// - Used by CommonroomGuildsPeachNavbar: <MegaMenu category="community" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-2xl border-t-2 border-[#ffccad] shadow-2xl bg-[#241c19]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GuildsSpacesMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/community/MegaMenu01';

// // Inside CommonroomGuildsPeachNavbar it opens from <MegaMenu category="community" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-2xl border-t-2 border-[#ffccad] shadow-2xl bg-[#241c19]">
//         <GuildsSpacesMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function GuildsSpacesMegaMenu({
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
                'bg-[#241c19] text-[#f7e6de] p-8 border-t-2 border-[#ffccad]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#ffccad]">
                        COMMONROOM &bull; EXPLORE 120+ ACTIVE GUILDS
                    </span>
                    <h3 className="mt-1 font-bold text-2xl text-white">Find Your Community of Practice</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#352520] px-4 py-1.5 text-xs text-[#ffccad]">
                    <span className="h-2 w-2 rounded-full bg-[#ffccad] animate-ping" />
                    <span>3,842 members active right now</span>
                </div>
            </div>

            {/* 3 Guild Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        name: 'Creative Code & Shaders',
                        members: '4,820 members',
                        online: '142 online',
                        topic: 'Latest: "Raymarching SDF optimization in WebGL"',
                        tags: ['Three.js', 'GLSL', 'Math'],
                    },
                    {
                        name: 'Independent Founders Salon',
                        members: '2,190 members',
                        online: '89 online',
                        topic: 'Latest: "Bootstrapping B2B tools to $1M ARR"',
                        tags: ['SaaS', 'Revenue', 'Playbooks'],
                    },
                    {
                        name: 'Type Designers Worldwide',
                        members: '3,410 members',
                        online: '67 online',
                        topic: 'Latest: "Variable font optical sizing in CSS"',
                        tags: ['Typography', 'Glyphs', 'Foundry'],
                    },
                ].map((guild) => (
                    <div
                        key={guild.name}
                        className="flex flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-5 hover:border-[#ffccad] transition-colors"
                    >
                        <div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#ffccad]">
                                <span>GUILD</span>
                                <span>{guild.online}</span>
                            </div>
                            <h4 className="mt-2 text-base font-bold text-white">{guild.name}</h4>
                            <p className="mt-2 text-xs text-white/70 italic">{guild.topic}</p>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {guild.tags.map((t) => (
                                    <span key={t} className="rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/80">
                                        #{t}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                            <span className="text-white/50">{guild.members}</span>
                            <a
                                href="#join-guild"
                                onClick={closeMenu}
                                className="rounded bg-[#ffccad] px-3 py-1 font-bold text-[#241c19] hover:bg-white transition-colors"
                            >
                                Join Guild
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/60">
                <span>Have an idea for a new specialty guild? Start one with 5 founding members.</span>
                <a href="#new-guild" onClick={closeMenu} className="font-bold text-[#ffccad] underline">
                    Create a Guild &rarr;
                </a>
            </div>
        </div>
    )
}

export default GuildsSpacesMegaMenu
