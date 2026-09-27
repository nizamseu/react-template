// SaaSPlatformMegaMenuCollection

// SaasMegaMenu · Section designs › Mega menus

// Description:
// The panel content for software-product navbars, normally rendered by MegaMenu (category="saas").
// It shows one of five B2B SaaS designs: a product feature suite, a developer and API hub,
// solutions by team and industry, an AI command center, or an integrations marketplace.
// Links are hash anchors that close the menu when clicked.

// Design:
// - Mostly dark slate backgrounds (#0b1319 to #17232c) with emerald #17a878 / mint #65e6b4 accents and monospace labels; static data arrays mapped into link lists and cards.
// - Variant 1 — "Enterprise Platform Suite": dark #0b1319 with emerald top border; uptime and compliance status bar, three feature columns (Platform Core, Automation & AI, Analytics & BI) and a case-study card.
// - Variant 2 — "Developer & API Hub": #0e161c; six SDK language tiles with an npm install line and copy icon, a syntax-coloured TypeScript code window, and a changelog with an "Open API Playground" CTA.
// - Variant 3 — "Solutions Matrix": #121c24; columns for solutions by department and by industry (compliance badges) plus a "+140%" ROI case-study card.
// - Variant 4 — "AI Command Center": light mint #edf3ee; read-only ⌘K search bar, quick-action links, an LLM model/latency matrix and a dark BYOC card ("Schedule Architecture Review").
// - Variant 5 — "Integrations Ecosystem": #17232c; six integration tiles marked "1-CLICK SETUP" and a partner-grants link.

// What it does:
// - variant picks one of five panel files in MegaMenus/saas/: 1 → MegaMenu01 (EnterprisePlatformSuiteMegaMenu),
//   2 → MegaMenu02 (DeveloperAPIHubMegaMenu), 3 → MegaMenu03 (SolutionsMatrixMegaMenu),
//   4 → MegaMenu04 (AICommandCenterMegaMenu), 5 → MegaMenu05 (IntegrationsEcosystemMegaMenu).
//   Any other value renders MegaMenu05.
// - Every <a> calls closeMenu on click; there is no state or effect.
// - Some controls are visual only: the Variant 2 copy button has no handler, the Variant 4 search input is readOnly with a fixed value, the Variant 1 "Read Whitepaper (12p)" line is text, and the Variant 5 integration tiles are not links.
// - Colours are hard-coded; the accent prop is accepted but not used anywhere in the markup.

// @param {object} props
// @param {number} [props.variant=1] Design to render: 1–4, any other value falls back to Variant 5.
// @param {Function} props.closeMenu Called when any link in the panel is clicked (MegaMenu passes its own close handler).
// @param {string} [props.accent='#17a878'] Accepted for API consistency with the other category menus; currently unused.
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import SaaSPlatformMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/SaasMegaMenu';

// // Normally rendered for you by <MegaMenu category="saas" variant={2} />
// export default function DevMenuPreview() {
//     const [open, setOpen] = useState(true)
//     if (!open) return null
//     return (
//         <div className="rounded-none border border-[#263640] shadow-2xl">
//             <SaaSPlatformMegaMenuCollection variant={2} closeMenu={() => setOpen(false)} />
//         </div>
//     )
// }
// ```


'use client'

import EnterprisePlatformSuiteMegaMenu from './saas/MegaMenu01';
import DeveloperAPIHubMegaMenu from './saas/MegaMenu02';
import SolutionsMatrixMegaMenu from './saas/MegaMenu03';
import AICommandCenterMegaMenu from './saas/MegaMenu04';
import IntegrationsEcosystemMegaMenu from './saas/MegaMenu05';

const menus = {
    1: EnterprisePlatformSuiteMegaMenu,
    2: DeveloperAPIHubMegaMenu,
    3: SolutionsMatrixMegaMenu,
    4: AICommandCenterMegaMenu,
    5: IntegrationsEcosystemMegaMenu,
}

export function SaaSPlatformMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#17a878',
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

export default SaaSPlatformMegaMenuCollection