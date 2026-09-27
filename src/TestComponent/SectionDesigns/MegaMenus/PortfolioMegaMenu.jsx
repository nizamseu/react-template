// DesignerPortfolioMegaMenuCollection

// PortfolioMegaMenu · Section designs › Mega menus

// Description:
// Dropdown panel content for an independent designer's portfolio site (fictional
// "Jamie Park" studio). Depending on `variant` the visitor sees selected case studies,
// creative-code experiments, a design manifesto with talks, service/retainer packages
// or a photographic contact sheet.

// Design:
// - Five hard-coded layouts in warm charcoal tones (plus one light cream variant) with coral #ef6a4b highlights, serif or mono headlines and responsive card grids.
// - Variant 1 — "Selected Works": #1c1816 panel, header with a pulsing "Available for select Q4 commissions" badge, four clickable project cards (number, year, client, title, award) and a footer with contact e-mail and "Browse Complete 12-Year Archive" link.
// - Variant 2 — "Shader Laboratory": #111 panel, mono "WebGL / WebGPU Sandbox" header with award counts and four "LAB 0x" cards (title, tech stack, description) each with a "Run WebGL Demo" link.
// - Variant 3 — "Design Manifesto": light #f9f7f4 panel in two columns: italic serif manifesto quote with a "Download Full CV / Monograph (PDF)" button-link, and a static list of keynotes/lectures.
// - Variant 4 — "Services & Retainers": #241d1a panel, three service cards (Design Sprint, Fractional Design Director, End-to-End Product Build) with duration and deliverable, plus a "Book Exploration Call on Cal.com" link.
// - Variant 5 — "Visual Notes": #181412 panel, four-photo contact sheet (Unsplash images with title and location, zoom on hover), 2 columns on mobile and 4 from md.

// What it does:
// - variant picks one of five panel files in MegaMenus/portfolio/: 1 → MegaMenu01 (SelectedWorksMegaMenu),
//   2 → MegaMenu02 (ShaderLaboratoryMegaMenu), 3 → MegaMenu03 (DesignManifestoMegaMenu),
//   4 → MegaMenu04 (ServicesRetainersMegaMenu), 5 → MegaMenu05 (VisualNotesMegaMenu).
//   Any other value renders MegaMenu05.
// - Every anchor calls `closeMenu` on click (placeholder hrefs such as "#case-study", "#launch-demo", "#resume", "#cal").
// - Variant 5 contains no links and never calls `closeMenu`; the Variant 3 lecture list and Variant 4 service cards are static.
// - Purely presentational: no state or effects; interactivity is limited to hover styles.
// - `accent` is destructured with a default but never referenced; all colours are hard-coded Tailwind values.
// - Normally rendered by MegaMenu (category "portfolio"), which normalises `variant` to 1-5 and supplies `closeMenu`.

// @param {object} props
// @param {number} [props.variant=1] Design to render (1-5); unknown values render Variant 5.
// @param {Function} props.closeMenu Called on click of every link/CTA so the parent mega menu can close.
// @param {string} [props.accent='#ef6a4b'] Accent colour; accepted but currently unused (colours are hard-coded).
// @param {'md'} [props.size='md'] Only size; exposed as data-size (no visual change).
// @param {boolean} [props.disabled=false] Exposed as data-disabled (no visual change).
// @param {boolean} [props.loading=false] Exposed as data-disabled (no visual change).
// @param {string} [props.className] Passed to the chosen panel, which merges it onto its root <div> with cn().
// @param {object} [props.rest] Any other props (id, aria-*, ref, handlers) are passed to the chosen panel.

// Usage example:
// ```jsx
// import { useState } from 'react';
// import DesignerPortfolioMegaMenuCollection from '@/TestComponent/SectionDesigns/MegaMenus/PortfolioMegaMenu';

// function WorkMenu() {
//     const [open, setOpen] = useState(true)
//     return open ? <DesignerPortfolioMegaMenuCollection variant={1} closeMenu={() => setOpen(false)} /> : null
// }

// // Usual route: MegaMenu picks this component for category="portfolio"
// // <MegaMenu category="portfolio" variant={1} accent="#ef6a4b" label="Selected Works" />
// ```


'use client'

import SelectedWorksMegaMenu from './portfolio/MegaMenu01';
import ShaderLaboratoryMegaMenu from './portfolio/MegaMenu02';
import DesignManifestoMegaMenu from './portfolio/MegaMenu03';
import ServicesRetainersMegaMenu from './portfolio/MegaMenu04';
import VisualNotesMegaMenu from './portfolio/MegaMenu05';

const menus = {
    1: SelectedWorksMegaMenu,
    2: ShaderLaboratoryMegaMenu,
    3: DesignManifestoMegaMenu,
    4: ServicesRetainersMegaMenu,
    5: VisualNotesMegaMenu,
}

export function DesignerPortfolioMegaMenuCollection({
    variant = 1,
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    accent = '#ef6a4b',
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

export default DesignerPortfolioMegaMenuCollection