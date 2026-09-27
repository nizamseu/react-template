// CookbookRecipesMegaMenu

// MegaMenu04 · Knowledge Bases & Documentation › Mega menus

// Description:
// A dark cookbook panel of starter templates for a developer platform's docs. The kicker
// "DEVELOPER RECIPES & STARTER TEMPLATES" sits over the title "1-Click Deployable
// Production Architectures" and a "★ 14,820 GitHub Stars" note, followed by three repo
// cards (Next.js 15 App Router + Northstar Auth, Real-Time Multiplayer Canvas Sync, Stripe
// Metered Billing Integration) with stack, name, description and a "Clone on GitHub" link.

// Design:
// - Header row (stacked on mobile, side by side with items-end from md:), then repo cards
//   in 1 column on mobile and 3 from md:
// - Very dark green #101c17 surface, white text, white/15 top border; mint #9bd2a7 kicker,
//   stack labels and clone links (white on hover); white/60 descriptions
// - Bold sans text-2xl title, text-sm bold card names, font-mono text-[10px] stacks and
//   font-mono text-xs links; rounded-lg white/5 cards with white/10 borders
// - Cards use flex-col justify-between so the links line up at the bottom

// What it does:
// - Each "Clone on GitHub" link (with an arrow icon) points to #clone, not to GitHub, and
//   calls closeMenu on click
// - The GitHub-stars note is static text; no state or effects
// - Used by TeamHandbookFloatingPillNavbar: <MegaMenu category="knowledge" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-lg border border-white/20 shadow-2xl bg-[#101c17]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CookbookRecipesMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/knowledge/MegaMenu04';

// // Inside TeamHandbookFloatingPillNavbar it opens from <MegaMenu category="knowledge" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-lg border border-white/20 shadow-2xl bg-[#101c17]">
//         <CookbookRecipesMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CookbookRecipesMegaMenu({
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
                'bg-[#101c17] text-white p-8 border-t border-white/15',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-[.25em]">
                        DEVELOPER RECIPES & STARTER TEMPLATES
                    </span>
                    <h3 className="mt-1 text-2xl font-bold">1-Click Deployable Production Architectures</h3>
                </div>
                <span className="font-mono text-xs text-white/60">★ 14,820 GitHub Stars</span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        name: 'Next.js 15 App Router + Northstar Auth',
                        stack: 'TypeScript, Tailwind, React 19',
                        desc: 'Complete multi-tenant organization management, session tokens, and team invites out of the box.',
                    },
                    {
                        name: 'Real-Time Multiplayer Canvas Sync',
                        stack: 'WebSockets, CRDTs, Redis',
                        desc: 'Figma-style multiplayer live cursor presence and state synchronization boilerplate.',
                    },
                    {
                        name: 'Stripe Metered Billing Integration',
                        stack: 'Node.js, Stripe SDK, Webhooks',
                        desc: 'Idempotent webhook consumers and usage-based usage calculation engine.',
                    },
                ].map((repo) => (
                    <div key={repo.name} className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                        <div>
                            <span className="font-mono text-[10px] text-[#9bd2a7]">{repo.stack}</span>
                            <h4 className="mt-2 font-bold text-sm text-white">{repo.name}</h4>
                            <p className="mt-2 text-xs text-white/60">{repo.desc}</p>
                        </div>
                        <a
                            href="#clone"
                            onClick={closeMenu}
                            className="mt-4 flex items-center justify-between text-xs font-mono text-[#9bd2a7] underline hover:text-white"
                        >
                            <span>Clone on GitHub</span>
                            <HiArrowRight />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CookbookRecipesMegaMenu
