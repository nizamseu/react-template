// TrustSecurityMegaMenu

// MegaMenu03 · Knowledge Bases & Documentation › Mega menus

// Description:
// A dark trust-center panel for a developer platform's documentation site. The kicker
// "SYSTEM ARCHITECTURE & TRUST CENTER" sits over the serif title "Enterprise Compliance &
// Guarantees" with SOC2 TYPE II, HIPAA BAA and ISO 27001 labels, followed by three security
// cards (envelope encryption, Raft storage fabric, EU sovereign data boundary), each with a
// shield icon, a short description and a "Download Technical Whitepaper (PDF) →" link.

// Design:
// - Header row (stacked on mobile, side by side with items-end from md:), then cards in 1
//   column on mobile and 3 from md:
// - Dark green #121f1a surface with #d9e8e0 text and a #41715d top border; mint #9bd2a7
//   kicker, shield icons and links; white/60 compliance labels and descriptions
// - Serif bold text-2xl title, text-sm bold card titles, leading-relaxed text-xs copy;
//   rounded-lg white/5 cards with white/10 borders and a divider above each link
// - Cards use flex-col justify-between so the links line up at the bottom

// What it does:
// - Each whitepaper link points to #whitepaper and calls closeMenu on click
// - Compliance labels are plain font-mono text, not badges or links; the Raft card's
//   "&lt; 800ms" sits in a JS string, so it renders as literal "&lt;"; no state or effects
// - Used by NorthstarAPIKernelThreeTierMasthead: <MegaMenu category="knowledge" variant={3} />
//   opens it in a dropdown panel framed with 'rounded-none border-t border-[#41715d] shadow-2xl bg-[#121f1a]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TrustSecurityMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/knowledge/MegaMenu03';

// // Inside NorthstarAPIKernelThreeTierMasthead it opens from <MegaMenu category="knowledge" variant={3} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border-t border-[#41715d] shadow-2xl bg-[#121f1a]">
//         <TrustSecurityMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineShieldCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TrustSecurityMegaMenu({
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
                'bg-[#121f1a] text-[#d9e8e0] p-8 border-t border-[#41715d]',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4">
                <div>
                    <span className="font-mono text-[10px] text-[#9bd2a7] uppercase tracking-[.25em]">
                        SYSTEM ARCHITECTURE & TRUST CENTER
                    </span>
                    <h3 className="mt-1 text-2xl font-bold font-serif text-white">Enterprise Compliance & Guarantees</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                    <span>SOC2 TYPE II</span>
                    <span>HIPAA BAA</span>
                    <span>ISO 27001</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Zero-Knowledge Cryptographic Envelope Encryption',
                        desc: 'Every database column is encrypted client-side before touching disk. Customer-managed KMS keys supported.',
                    },
                    {
                        title: 'Distributed Consensus & Raft Storage Fabric',
                        desc: 'Automatic 3-datacenter quorum failover with zero manual operator intervention in &lt; 800ms.',
                    },
                    {
                        title: 'EU Sovereign Data Boundary & GDPR Guarantees',
                        desc: 'Data never transits outside EU-central-1 (Frankfurt) or Swiss data centers.',
                    },
                ].map((sec) => (
                    <div key={sec.title} className="rounded-lg border border-white/10 bg-white/5 p-5 flex flex-col justify-between">
                        <div>
                            <HiOutlineShieldCheck className="text-xl text-[#9bd2a7]" />
                            <h4 className="mt-2 font-bold text-sm text-white">{sec.title}</h4>
                            <p className="mt-2 text-xs text-white/60 leading-relaxed">{sec.desc}</p>
                        </div>
                        <a href="#whitepaper" onClick={closeMenu} className="mt-4 pt-3 border-t border-white/10 text-xs text-[#9bd2a7] underline">
                            Download Technical Whitepaper (PDF) &rarr;
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrustSecurityMegaMenu
