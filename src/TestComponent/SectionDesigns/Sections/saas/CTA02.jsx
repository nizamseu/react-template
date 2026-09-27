// ZeroDowntimeMigrationDiscoveryCTA

// CTA02 · SaaS Platforms › Banner CTAs

// Description:
// A dark, sales-led banner for infrastructure migration. It has the eyebrow
// "Zero-downtime infrastructure migration", the headline "Migrating from AWS or
// Datadog? We Do the Heavy Lifting." and copy about a dedicated team that maps
// schemas, dual-writes data and runs DNS failover. A mint "Schedule Migration
// Discovery Call" button carries the note "Includes complimentary $10k migration
// credit".

// Design:
// - <section> grid `lg:grid-cols-[1.3fr_0.7fr]` (items-center, gap-8): copy on the
//   left, and a CTA column (button + note) on the right.
// - Dark base #0e161c with a #263640 border. Mint #65e6b4 is used for the eyebrow
//   and the button (text #0e161c, hover white), and white/50-70 for secondary text.
// - Typography: xs mono bold uppercase eyebrow (tracking-widest) and a font-black
//   headline at text-3xl -> sm:text-4xl. The section is rounded-xl and the button
//   rounded-lg.
// - Responsive: the copy and CTA stack below lg and sit side by side from lg.
//   Padding goes p-8 -> sm:p-12.

// What it does:
// - Purely presentational: no content props, no state.
// - One CTA anchor to `#schedule-migration` with a HiArrowRight icon.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ZeroDowntimeMigrationDiscoveryCTA from '@/TestComponent/SectionDesigns/Sections/saas/CTA02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ZeroDowntimeMigrationDiscoveryCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ZeroDowntimeMigrationDiscoveryCTA({
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
                'rounded-xl border border-[#263640] bg-[#0e161c] p-8 text-white sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
                <div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#65e6b4]">
                        ZERO-DOWNTIME INFRASTRUCTURE MIGRATION
                    </span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-black leading-tight">
                        Migrating from AWS or Datadog? We Do the Heavy Lifting.
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                        Our dedicated distributed systems team collaborates with your engineering leads to map schemas, dual-write data, and execute DNS failover with zero production interruption.
                    </p>
                </div>

                <div className="flex flex-col gap-3 justify-end">
                    <a
                        href="#schedule-migration"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#65e6b4] px-6 py-3.5 font-mono text-xs font-bold text-[#0e161c] hover:bg-white transition-colors"
                    >
                        <span>Schedule Migration Discovery Call</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-[11px] text-white/50 text-center">
                        Includes complimentary $10k migration credit
                    </span>
                </div>
            </div>
        </section>
    )
}

export default ZeroDowntimeMigrationDiscoveryCTA
