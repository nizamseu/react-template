// IntegrationsEcosystemMegaMenu

// MegaMenu05 · SaaS Platforms › Mega menus

// Description:
// The "Integrations Ecosystem" panel for a SaaS or developer-platform navbar. Under
// "INTEGRATION ECOSYSTEM • 80+ CONNECTORS" and "Plug Directly into Your Existing Stack"
// it shows six connector tiles (GitHub Enterprise, Slack Connect, Linear App, AWS
// CloudWatch, Snowflake, Datadog APM) marked "1-CLICK SETUP", and a partner banner
// ending in "Explore Partner Grants ($25k available) →".

// Design:
// - Header row, a grid-cols-2 md:grid-cols-3 lg:grid-cols-6 tile grid, then a
//   border-t partner banner
// - Dark #17232c surface, white text, #263640 top border; mint #65e6b4 eyebrow, tile
//   dots, "1-CLICK SETUP" labels, tile hover borders and the underlined partner link
// - Bold text-2xl title, font-mono eyebrow and tile labels, text-xs tile names;
//   rounded-lg tiles with white/5 fill and white/10 borders; no shadow of its own
// - Tiles run two per row on mobile, three from md: and six from lg:; the header
//   stacks until md: and the banner wraps (flex-wrap)

// What it does:
// - Only "Explore Partner Grants" (#partner) calls closeMenu on click
// - The six integration tiles are plain divs with a hover border, not links, and their
//   `active` flag is never read; no state or effect
// - Used by SignalStackModularGridNavbar: <MegaMenu category="saas" variant={5} />
//   opens it in a dropdown panel framed with 'rounded-none border-y border-[#263640] shadow-2xl bg-[#17232c]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import IntegrationsEcosystemMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/saas/MegaMenu05';

// // Inside SignalStackModularGridNavbar it opens from <MegaMenu category="saas" variant={5} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-y border-[#263640] shadow-2xl bg-[#17232c]">
//         <IntegrationsEcosystemMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function IntegrationsEcosystemMegaMenu({
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
                'bg-[#17232c] text-white p-8 border-t border-[#263640]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[.25em] text-[#65e6b4]">
                        INTEGRATION ECOSYSTEM &bull; 80+ CONNECTORS
                    </span>
                    <h3 className="mt-1 text-2xl font-bold">Plug Directly into Your Existing Stack</h3>
                </div>
                <div className="text-xs text-white/60">
                    Community Connectors &bull; Certified Partner Network
                </div>
            </div>

            {/* 6 Integration Tiles */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { name: 'GitHub Enterprise', tag: 'CI/CD Sync', active: true },
                    { name: 'Slack Connect', tag: 'Realtime Alerts', active: true },
                    { name: 'Linear App', tag: 'Issue Tracker', active: true },
                    { name: 'AWS CloudWatch', tag: 'Telemetry Sink', active: true },
                    { name: 'Snowflake', tag: 'Data Lakehouse', active: true },
                    { name: 'Datadog APM', tag: 'Metrics Export', active: true },
                ].map((app) => (
                    <div
                        key={app.name}
                        className="rounded-lg border border-white/10 bg-white/5 p-4 flex flex-col justify-between hover:border-[#65e6b4] transition-colors"
                    >
                        <div>
                            <span className="h-2 w-2 rounded-full bg-[#65e6b4] block mb-2" />
                            <h5 className="font-bold text-xs text-white">{app.name}</h5>
                            <span className="text-[10px] text-white/50 block mt-1">{app.tag}</span>
                        </div>
                        <span className="mt-3 font-mono text-[9px] text-[#65e6b4]">1-CLICK SETUP</span>
                    </div>
                ))}
            </div>

            {/* Partner Program Banner */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs text-white/60">
                <span>Building an internal tool or developer platform? Build on our public API and join the Partner Network.</span>
                <a href="#partner" onClick={closeMenu} className="font-bold text-[#65e6b4] underline hover:text-white">
                    Explore Partner Grants ($25k available) &rarr;
                </a>
            </div>
        </div>
    )
}

export default IntegrationsEcosystemMegaMenu
