// SOC2AuditPacketDownloadCTA

// CTA04 · SaaS Platforms › Banner CTAs

// Description:
// A light security and compliance banner. A shield-icon eyebrow reads "Security
// audit artifacts", above the headline "Download Our Complete SOC2 Type II Audit
// Packet". The copy lists the auditor attestation report, penetration-test
// summaries and compliance control mappings. A dark pill button reads "Instant
// Security Packet Access".

// Design:
// - <section> with flex-col -> md:flex-row (md:items-center, justify-between):
//   copy (max-w-xl) on the left, and a shrink-0 button on the right.
// - Light sage base #edf3ee with a black/10 border, ink #111a22 text and gray-600
//   copy. Green #17a878 is used for the eyebrow and the button hover; the button is
//   #111a22.
// - Typography: 10px mono bold uppercase eyebrow (tracking-wider) and a text-3xl
//   font-black headline. The section is rounded-2xl and the button rounded-full.
// - Responsive: the button sits under the copy below md and to its right from md.
//   Padding goes p-8 -> sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One CTA anchor to `#download-audit` with a HiArrowRight icon. It is a hash
//   link, not an actual file download.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SOC2AuditPacketDownloadCTA from '@/TestComponent/SectionDesigns/Sections/saas/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SOC2AuditPacketDownloadCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineShieldCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SOC2AuditPacketDownloadCTA({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-2xl border border-black/10 bg-[#edf3ee] p-8 text-[#111a22] sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="max-w-xl">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#17a878]">
                        <HiOutlineShieldCheck className="text-sm" /> SECURITY AUDIT ARTIFACTS
                    </span>
                    <h2 className="mt-2 text-3xl font-black leading-tight">
                        Download Our Complete SOC2 Type II Audit Packet
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Includes independent auditor attestation report, third-party penetration test executive summaries, and continuous compliance control mappings.
                    </p>
                </div>

                <a
                    href="#download-audit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111a22] px-6 py-3.5 font-mono text-xs font-bold text-white hover:bg-[#17a878] transition-colors shrink-0"
                >
                    <span>Instant Security Packet Access</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default SOC2AuditPacketDownloadCTA
