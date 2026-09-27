// KnowledgeBaseDeveloperDocsMegaMenuCollection

// KnowledgeMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for a developer documentation / help-center website (fictional
// "Northstar" platform). Depending on `variant` the visitor sees docs and SDK links,
// a mock self-service search with popular articles, a trust/compliance center,
// starter-template recipes or support and escalation channels.

// Design:
// - Five hard-coded layouts in dark green tones (plus one light variant) with mint #9bd2a7 highlights (#41715d on the light variant) and responsive grids (1 column on mobile, 3-4 from md/lg).
// - Variant 1 — "API & SDK Docs": #0f1a16 panel, "API v4.2" header with protocol list, three icon-headed link columns (Getting Started, Core API Reference, Official SDKs) and a community card with a "Join Discord Guild" link.
// - Variant 2 — "Self-Service Hub": light #f4f8f5 panel, read-only search field with a "Press Enter" hint and three popular-article cards (category, title, helpfulness/read time, "Read Full Article" link).
// - Variant 3 — "Trust & Security": #121f1a panel, SOC2 / HIPAA / ISO 27001 badges and three shield-icon security cards each with a "Download Technical Whitepaper (PDF)" link.
// - Variant 4 — "Cookbook Recipes": #101c17 panel, GitHub-stars header and three starter-template cards (stack, name, description) with "Clone on GitHub" links.
// - Variant 5 — "Support SLA": #172721 panel, response-time/CSAT header and three support cards (Enterprise SLA, Architecture Office Hours, Urgent Incident Ticket) with links and an "Open Incident Ticket" button-link.

// What it does:
// - variant picks one of five panel files in MegaMenus/knowledge/: 1 → MegaMenu01 (APISDKDocsMegaMenu),
//   2 → MegaMenu02 (SelfServiceHubMegaMenu), 3 → MegaMenu03 (TrustSecurityMegaMenu),
//   4 → MegaMenu04 (CookbookRecipesMegaMenu), 5 → MegaMenu05 (SupportSLAMegaMenu).
//   Any other value renders MegaMenu05.
// - Every anchor calls `closeMenu` on click; hrefs are placeholders (e.g. "#doc", "#art", "#whitepaper", "#clone", "#submit-ticket").
// - Purely presentational: the Variant 2 search field is read-only with no search logic; no state, effects or data fetching.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "knowledge"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of every link/CTA so the parent mega menu can close.
// @param {string} [props.accent='#41715d'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import KnowledgeBaseDeveloperDocsMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/KnowledgeMegaMenu';

// function DocsMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <KnowledgeBaseDeveloperDocsMegaMenuCollection variant={1} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="knowledge"
// // <MegaMenu category="knowledge" variant={1} accent="#41715d" label="API & SDKs" />
// ```


'use client'

import APISDKDocsMegaMenu from './knowledge/MegaMenu01';
import SelfServiceHubMegaMenu from './knowledge/MegaMenu02';
import TrustSecurityMegaMenu from './knowledge/MegaMenu03';
import CookbookRecipesMegaMenu from './knowledge/MegaMenu04';
import SupportSLAMegaMenu from './knowledge/MegaMenu05';

const menus = {
    1: APISDKDocsMegaMenu,
    2: SelfServiceHubMegaMenu,
    3: TrustSecurityMegaMenu,
    4: CookbookRecipesMegaMenu,
    5: SupportSLAMegaMenu,
}

export function KnowledgeBaseDeveloperDocsMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#41715d',
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

export default KnowledgeBaseDeveloperDocsMegaMenuCollection