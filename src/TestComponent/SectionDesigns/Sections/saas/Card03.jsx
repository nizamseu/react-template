// ZeroTrustSecurityComplianceCard

// Card03 · SaaS Platforms › Cards

// Description:
// An enterprise trust card headed "Enterprise assurance", with an "Audit passed"
// badge. It presents the "Continuous Zero-Trust Security Mesh" with a one-line
// summary and a checked compliance list (SOC2 Type II, HIPAA & HITECH, ISO 27001
// data centers, AES-256 GCM hardware HSM). The footer shows "Last audit: Sep 2026"
// and a "Request Security Packet" link.

// Design:
// - <article> with a header row (shield icon + label, badge), a title and summary,
//   a boxed checklist panel (black/30) and a border-t footer row.
// - Dark base #121c24 with #d9e5ed / white text and a green #17a878 accent (shield
//   icon, link). Check marks are emerald-400, the badge sits on emerald-500/15, and
//   borders are white/10.
// - Typography: sans text-lg bold title; mono for labels, checklist and footer. The
//   card is rounded-2xl with shadow-2xl, and the checklist box rounded-xl.
// - Responsive: no breakpoint classes. The card fills its grid cell.

// What it does:
// - Purely presentational: no content props, no state.
// - One link to `#compliance`. The checklist is four hard-coded rows with HiCheck
//   icons (not mapped from data).

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <article> with cn()
// - ...props: spread onto the root <article> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ZeroTrustSecurityComplianceCard from '@/TestComponent/SectionDesigns/Sections/saas/Card03';

// const CardGrid = () => (
//     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
//         <ZeroTrustSecurityComplianceCard />
//     </div>
// )
// ```

'use client'

import { HiCheck, HiOutlineShieldCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ZeroTrustSecurityComplianceCard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <article
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'overflow-hidden rounded-2xl border border-white/10 bg-[#121c24] p-5 text-[#d9e5ed] shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <HiOutlineShieldCheck className="text-xl text-[#17a878]" />
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        ENTERPRISE ASSURANCE
                    </span>
                </div>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] text-emerald-400">
                    AUDIT PASSED
                </span>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-bold text-white">
                    Continuous Zero-Trust Security Mesh
                </h3>
                <p className="mt-1 text-xs text-white/60">
                    Automated cryptographic proofs, end-to-end envelope encryption, and real-time vulnerability monitoring.
                </p>

                {/* Compliance checklist */}
                <div className="mt-4 space-y-2 rounded-xl bg-black/30 p-3.5 text-xs font-mono border border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">SOC2 Type II (Continuous)</span>
                        <HiCheck className="text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">HIPAA & HITECH Ready</span>
                        <HiCheck className="text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">ISO 27001 Certified Data Centers</span>
                        <HiCheck className="text-emerald-400" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-white/80">AES-256 GCM Hardware HSM</span>
                        <HiCheck className="text-emerald-400" />
                    </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-white/50 font-mono">Last audit: Sep 2026</span>
                    <a href="#compliance" className="font-bold text-[#17a878] hover:underline">
                        Request Security Packet &rarr;
                    </a>
                </div>
            </div>
        </article>
    )
}

export default ZeroTrustSecurityComplianceCard
