// LPDataRoomAccessCTA

// CTA04 · Corporate & Business › Banner CTAs

// Description:
// Dark private-equity banner for the "INSTITUTIONAL LP PORTAL · FUND VI DATA ROOM". The
// headline "Access Confidential Fund Audits & Quarterly Performance Portfolios" is backed
// by a note on authenticated access for QIBs and family offices, and an outlined
// "Request LP Data Room Token" button.

// Design:
// - flex-col -> lg:flex-row lg:items-center justify-between gap-6; button shrink-0
// - Navy #0d1520 background with a #3476c5/20 bottom border; sky-blue #84b9ff eyebrow and
//   outlined button (hover fills #84b9ff with #0d1520 text); body copy white/60
// - Headline text-2xl -> sm:text-3xl font-black; font-mono eyebrow (with HiOutlineKey),
//   copy and button; square section (rounded-none), rounded button
// - Below lg the button stacks under the copy; padding p-8 -> sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor CTA -> #lp-dataroom with an HiArrowRight icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LPDataRoomAccessCTA from '@/TestComponent/SectionDesigns/Sections/corporate/CTA04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <LPDataRoomAccessCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineKey } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LPDataRoomAccessCTA({
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
                'rounded-none border-b border-[#3476c5]/20 bg-[#0d1520] p-8 text-white sm:p-12',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#84b9ff]">
                        <HiOutlineKey /> INSTITUTIONAL LP PORTAL &bull; FUND VI DATA ROOM
                    </span>
                    <h2 className="mt-2 text-2xl sm:text-3xl font-black">
                        Access Confidential Fund Audits & Quarterly Performance Portfolios
                    </h2>
                    <p className="mt-2 font-mono text-xs text-white/60 max-w-xl">
                        Authenticated access for qualified institutional buyers (QIBs) and family office partners. Includes vintage-year IRR metrics, portfolio debt profiles, and capital call schedules.
                    </p>
                </div>

                <a
                    href="#lp-dataroom"
                    className="inline-flex items-center justify-center gap-2 rounded border border-[#84b9ff] px-6 py-3.5 font-mono text-xs font-bold text-[#84b9ff] hover:bg-[#84b9ff] hover:text-[#0d1520] transition-colors shrink-0"
                >
                    <span>Request LP Data Room Token</span>
                    <HiArrowRight />
                </a>
            </div>
        </section>
    )
}

export default LPDataRoomAccessCTA
