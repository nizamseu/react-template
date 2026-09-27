// APISDKDocsMegaMenu

// MegaMenu01 · Knowledge Bases & Documentation › Mega menus

// Description:
// A dark developer-docs panel for an API platform's knowledge base (fictional "Northstar").
// The kicker "NORTHSTAR DEVELOPER KNOWLEDGE BASE • API v4.2" sits over the title
// "Production Guides & Architecture References" and an "OPENAPI 3.1 • REST • GRAPHQL •
// GRPC" note, followed by three icon-headed link lists (Getting Started, Core API
// Reference, Official SDKs) and an "Ask Platform Engineers Live" community card.

// Design:
// - Header row, then a grid of 1 column on mobile, 2 from md: and 4 from lg: (three link
//   lists + the community card)
// - Near-black green #0f1a16 surface with #e0ece6 text; mint #9bd2a7 for the 2px top
//   border, kicker, protocol note, column headings, link hover and the Discord link
// - Bold text-2xl white title; text-xs uppercase tracked headings with book, terminal and
//   code icons; bulleted text-xs links; rounded-lg white/5 card with a white/10 border
// - Header row uses flex-wrap, so the protocol note drops below the title on narrow screens

// What it does:
// - The twelve doc links all point to #doc and "Join Discord Guild" to #discord; each
//   calls closeMenu on click
// - Header and card copy are static text; no state or effects
// - Used by NorthstarDeveloperDocsNavbar: <MegaMenu category="knowledge" variant={1} />
//   opens it in a dropdown panel framed with 'rounded-xl border-t-2 border-[#9bd2a7] shadow-2xl bg-[#0f1a16]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import APISDKDocsMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/knowledge/MegaMenu01';

// // Inside NorthstarDeveloperDocsNavbar it opens from <MegaMenu category="knowledge" variant={1} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-xl border-t-2 border-[#9bd2a7] shadow-2xl bg-[#0f1a16]">
//         <APISDKDocsMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineBookOpen,
    HiOutlineCode,
    HiOutlineTerminal,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function APISDKDocsMegaMenu({
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
                'bg-[#0f1a16] text-[#e0ece6] p-8 border-t-2 border-[#9bd2a7]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                    <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-[.25em]">
                        NORTHSTAR DEVELOPER KNOWLEDGE BASE &bull; API v4.2
                    </span>
                    <h3 className="mt-1 font-bold text-2xl text-white">Production Guides & Architecture References</h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#9bd2a7]">
                    <span>OPENAPI 3.1 &bull; REST &bull; GRAPHQL &bull; GRPC</span>
                </div>
            </div>

            {/* 4 Documentation Pillars */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9bd2a7]">
                        <HiOutlineBookOpen className="text-base" /> Getting Started
                    </div>
                    <ul className="mt-3 space-y-2 text-xs">
                        {['5-Minute Quickstart', 'Authentication & Tokens', 'SDK Installation', 'Handling First Webhook'].map((s) => (
                            <li key={s}>
                                <a href="#doc" onClick={closeMenu} className="block py-1 hover:text-[#9bd2a7] transition-colors">
                                    &bull; {s}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9bd2a7]">
                        <HiOutlineTerminal className="text-base" /> Core API Reference
                    </div>
                    <ul className="mt-3 space-y-2 text-xs">
                        {['Workspaces & Tenancy', 'Event Streaming API', 'Edge Worker Functions', 'Database Replication'].map((s) => (
                            <li key={s}>
                                <a href="#doc" onClick={closeMenu} className="block py-1 hover:text-[#9bd2a7] transition-colors">
                                    &bull; {s}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9bd2a7]">
                        <HiOutlineCode className="text-base" /> Official SDKs
                    </div>
                    <ul className="mt-3 space-y-2 text-xs">
                        {['TypeScript / Node.js', 'Python 3.11+ / FastAPI', 'Go Lang v1.22', 'Rust / Tokio Runtime'].map((s) => (
                            <li key={s}>
                                <a href="#doc" onClick={closeMenu} className="block py-1 hover:text-[#9bd2a7] transition-colors">
                                    &bull; {s}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Developer Discord & Status Card */}
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-wider block">
                            COMMUNITY SUPPORT
                        </span>
                        <h4 className="mt-1 text-sm font-bold text-white">Ask Platform Engineers Live</h4>
                        <p className="mt-1 text-xs text-white/60">
                            8,400+ developers online. Get instant code debugging from core library contributors.
                        </p>
                    </div>
                    <a
                        href="#discord"
                        onClick={closeMenu}
                        className="mt-4 flex items-center justify-between text-xs font-bold text-[#9bd2a7] underline hover:text-white"
                    >
                        <span>Join Discord Guild</span>
                        <HiArrowRight />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default APISDKDocsMegaMenu
