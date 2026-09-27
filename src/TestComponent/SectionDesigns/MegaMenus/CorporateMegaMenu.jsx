// CorporateMegaMenuCollection

// CorporateMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for a corporate / professional-services website (fictional
// "Northstar" brand). Depending on `variant` the visitor sees advisory practice areas,
// investor-relations filings, audited client case studies, research papers or
// private-capital strategies, each with CTA links that close the menu when clicked.

// Design:
// - Five hard-coded dark-navy layouts with sky-blue (#84b9ff) highlights, serif headlines, mono uppercase eyebrows and responsive grids (1 column on mobile, 3-4 from md/lg); meant to sit inside MegaMenu's positioned panel.
// - Variant 1 — "Global Advisory Practices": #0e1724 panel, header with office cities (Zurich … Singapore), three icon-headed practice columns of bullet links (M&A, AI & Digital, ESG) and an "Executive Briefing" PDF download card.
// - Variant 2 — "Investor Relations Hub": #0b111a panel, stock-ticker banner (NYSE: NST, price, market cap, earnings call), Regulatory Filings and Corporate Governance link lists, and an Investor Day card with a "Register for Webcast" button-link.
// - Variant 3 — "Quantified Client Impact": #101b2a panel, three case-study cards with a large mono metric ($140,000,000 / 99.999% / -42%), label, description and "Read Full Audit Report" link.
// - Variant 4 — "Research Institute": #0d1520 panel, patents/affiliates header and three research-paper cards (date, citations, title, authors) each with a "Download Open-Access Preprint" link.
// - Variant 5 — "Private Capital": #0a0f17 panel, AUM header, two static investment-strategy cards and an "LP Portal" card with a "Sign in with Security Key" button-link.

// What it does:
// - variant picks one of five panel files in MegaMenus/corporate/: 1 → MegaMenu01 (GlobalAdvisoryPracticesMegaMenu),
//   2 → MegaMenu02 (InvestorRelationsHubMegaMenu), 3 → MegaMenu03 (QuantifiedClientImpactMegaMenu),
//   4 → MegaMenu04 (ResearchInstituteMegaMenu), 5 → MegaMenu05 (PrivateCapitalMegaMenu).
//   Any other value renders MegaMenu05.
// - Every anchor calls `closeMenu` on click; all hrefs are in-page placeholders (e.g. "#ma", "#filing", "#case-study", "#lp-login").
// - Purely presentational: no state, effects or data fetching; interactivity is limited to hover colour/border changes.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "corporate"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of every link/CTA so the parent mega menu can close.
// @param {string} [props.accent='#3476c5'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import CorporateMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/CorporateMegaMenu';

// function InvestorMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <CorporateMegaMenuCollection variant={2} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="corporate"
// // <MegaMenu category="corporate" variant={2} accent="#84b9ff" label="Investor Relations" />
// ```


'use client'

import GlobalAdvisoryPracticesMegaMenu from './corporate/MegaMenu01';
import InvestorRelationsHubMegaMenu from './corporate/MegaMenu02';
import QuantifiedClientImpactMegaMenu from './corporate/MegaMenu03';
import ResearchInstituteMegaMenu from './corporate/MegaMenu04';
import PrivateCapitalMegaMenu from './corporate/MegaMenu05';

const menus = {
    1: GlobalAdvisoryPracticesMegaMenu,
    2: InvestorRelationsHubMegaMenu,
    3: QuantifiedClientImpactMegaMenu,
    4: ResearchInstituteMegaMenu,
    5: PrivateCapitalMegaMenu,
}

export function CorporateMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#3476c5',
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

export default CorporateMegaMenuCollection