// CouponTicketFlashDeals

// FlashDeals05 · E-commerce & Marketplaces › Flash Deals / Countdown

// Description:
// A retro, newspaper-circular style coupon wall for the fictional general store Receipt Co.
// The header "This week’s clippings." sits next to a rubber-stamp countdown ("Coupons void
// in"), followed by six tear-off coupons (e.g. "25% off whole-bean coffee", "Free 2-day
// shipping") with monospace codes, barcodes and a "Copy code" button. Use it for promo-code
// campaigns, weekly specials or a deals page with a nostalgic tone.

// Design:
// - Off-white #fffaf0 section, ink #1b1b1b text, stamp red #d7263d accents; mono eyebrow
//   "Receipt Co. ★ General Store ★ Est. 1974" and a serif display heading (text-5xl → lg:7xl)
// - Stamp timer: -rotate-3 box with a 3px red border, inner hairline frame, mono tabular
//   digits and mix-blend-multiply so it reads like ink; a scissors + dashed cut line below
// - Coupons: muted paper tints, rounded-2xl, dashed inner frame, dashed perforation between
//   body and an 8rem stub, round notch cut-outs top and bottom, soft drop shadow
// - Stub: "Code" label, dashed code box, decorative barcode and a pill "Copy code" button
//   that turns red with "Copied!"; coupons lift and tilt slightly on hover (motion-reduce off)
// - Responsive: header stacks on mobile and splits on md; coupons grid-cols-1 →
//   md:grid-cols-2 → xl:grid-cols-3 so the stub never squeezes the discount text

// What it does:
// - remaining (ms) starts at a fixed 06:12:40 for a stable server render; on mount a
//   deadline is set and a 1 s interval (cleared on unmount or at zero) ticks it down
// - "Copy code" uses navigator.clipboard.writeText, falling back to a hidden textarea +
//   execCommand('copy'); the button shows "Copied!" (or "Copy failed") for 2 s via a
//   timeout that is cleared on re-click/unmount, announced in an aria-live region
// - "See the full circular" links to #receipt-co-circular; stamps and barcodes are visual-only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CouponTicketFlashDeals from '@/TestComponent/PageSections/ecommerce/FlashDeals05';

// const ShopPage = () => (
//     <main className="space-y-6">
//         <CouponTicketFlashDeals />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { HiArrowRight, HiCheck, HiOutlineClipboardDocument, HiOutlineScissors } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const INITIAL_LEFT = 6 * 3600e3 + 12 * 60e3 + 40e3

const coupons = [
    {
        id: 'brew25',
        dept: 'Coffee & Tea',
        big: '25%',
        small: 'off',
        detail: 'Any bag of whole-bean coffee from the roastery shelf.',
        terms: 'Min. spend $30 · Valid thru 10/04/26',
        code: 'BREW25',
        paper: 'bg-[#f7e6c4]',
        stamp: 'Staff pick',
    },
    {
        id: 'ink15',
        dept: 'Stationery',
        big: '$15',
        small: 'off',
        detail: 'Notebooks, fountain pens and letterpress desk paper.',
        terms: 'Min. spend $60 · Valid thru 10/04/26',
        code: 'INK15',
        paper: 'bg-[#e3ecda]',
    },
    {
        id: 'shipfree',
        dept: 'Everything',
        big: 'Free',
        small: '2-day shipping',
        detail: 'On any order, no minimum, anywhere in the lower 48.',
        terms: 'No minimum · Valid thru 09/30/26',
        code: 'SHIPFREE',
        paper: 'bg-[#f6d9d3]',
        stamp: 'Last days',
    },
    {
        id: 'twofer',
        dept: 'Home',
        big: '2 for 1',
        small: 'candles',
        detail: 'Mix and match soy candles and reed diffusers.',
        terms: 'Lower price item free · Valid thru 10/04/26',
        code: 'TWOFER',
        paper: 'bg-[#e5e1f0]',
    },
    {
        id: 'spin30',
        dept: 'Records',
        big: '30%',
        small: 'off',
        detail: 'Used and reissued vinyl from the back room crates.',
        terms: 'Excludes box sets · Valid thru 10/11/26',
        code: 'SPIN30',
        paper: 'bg-[#d8e8ee]',
    },
    {
        id: 'bonus20',
        dept: 'Gift cards',
        big: '+$20',
        small: 'bonus',
        detail: 'Free store credit with every $100 gift card you buy.',
        terms: 'Credit issued by email · Valid thru 10/11/26',
        code: 'BONUS20',
        paper: 'bg-[#f2e3c9]',
    },
]

const pad = (n) => String(n).padStart(2, '0')

function barcodeBars(code) {
    return `${code}${code}`.split('').flatMap((char, i) => {
        const n = char.charCodeAt(0)
        return [
            { key: `${i}a`, w: (n % 3) + 1 },
            { key: `${i}b`, w: ((n >> 2) % 2) + 1 },
        ]
    })
}

function legacyCopy(text) {
    try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        return ok
    } catch {
        return false
    }
}

export function CouponTicketFlashDeals({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [remaining, setRemaining] = useState(INITIAL_LEFT)
    const [status, setStatus] = useState(null)

    useEffect(() => {
        const deadline = Date.now() + INITIAL_LEFT
        const id = setInterval(() => {
            const left = Math.max(0, deadline - Date.now())
            setRemaining(left)
            if (left === 0) clearInterval(id)
        }, 1000)
        return () => clearInterval(id)
    }, [])

    useEffect(() => {
        if (!status) return undefined
        const id = setTimeout(() => setStatus(null), 2000)
        return () => clearTimeout(id)
    }, [status])

    const copyCode = async (coupon) => {
        let ok = false
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(coupon.code)
                ok = true
            }
        } catch {
            ok = false
        }
        if (!ok) ok = legacyCopy(coupon.code)
        setStatus({ id: coupon.id, code: coupon.code, ok })
    }

    const total = Math.max(0, Math.round(remaining / 1000))
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('bg-[#fffaf0] py-16 text-[#1b1b1b] md:py-24 text-base font-normal', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#1b1b1b]/70">
                    <span>Receipt Co. ★ General Store ★ Est. 1974</span>
                    <span aria-hidden="true" className="hidden h-px flex-1 border-t border-dashed border-[#1b1b1b]/40 sm:block" />
                </p>

                <div className="mt-8 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="font-serif text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl text-[#1b1b1b]">
                            This week’s <em className="text-[#d7263d]">clippings.</em>
                        </h2>
                        <p className="mt-5 max-w-md text-base leading-relaxed text-[#1b1b1b]/70">
                            Six coupons, cut fresh every Monday. Copy a code, paste it at checkout, and enjoy the
                            small thrill of paying less.
                        </p>
                    </div>

                    <div
                        role="timer"
                        aria-label={`Coupons void in ${h} hours ${m} minutes ${s} seconds`}
                        className="-rotate-3 self-start rounded-lg border-[3px] border-[#d7263d] p-1.5 text-[#d7263d] mix-blend-multiply md:self-auto"
                    >
                        <div className="rounded-[4px] border border-[#d7263d] px-5 py-3 text-center">
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.35em]">
                                {total === 0 ? 'Coupons are' : 'Coupons void in'}
                            </p>
                            <p className="mt-1 font-mono text-4xl font-black tabular-nums tracking-tight sm:text-5xl">
                                {total === 0 ? 'VOID' : `${pad(h)}:${pad(m)}:${pad(s)}`}
                            </p>
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] opacity-80">
                                Hrs · Min · Sec
                            </p>
                        </div>
                    </div>
                </div>

                <div aria-hidden="true" className="mt-12 flex items-center gap-3 text-[#1b1b1b]/50">
                    <HiOutlineScissors className="size-5 -scale-x-100" />
                    <span className="h-px flex-1 border-t-2 border-dashed border-[#1b1b1b]/30" />
                </div>

                <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
                    {coupons.map((coupon, index) => {
                        const isCurrent = status?.id === coupon.id
                        const copied = isCurrent && status.ok
                        const failed = isCurrent && !status.ok
                        return (
                            <li key={coupon.id}>
                                <article
                                    className={cn(
                                        'relative flex h-full rounded-2xl shadow-[0_1px_0_rgba(27,27,27,0.06),0_14px_28px_-16px_rgba(27,27,27,0.35)] transition-transform duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                                        index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1',
                                        'motion-reduce:hover:rotate-0',
                                        coupon.paper,
                                    )}
                                >
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-[#1b1b1b]/30"
                                    />

                                    <div className="relative min-w-0 flex-1 p-5 sm:p-6">
                                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#1b1b1b]/60">
                                            № {pad(index + 1)} · {coupon.dept}
                                        </p>
                                        <p className="mt-3 text-4xl font-black leading-none tracking-tight xl:text-5xl">
                                            {coupon.big}
                                        </p>
                                        <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#d7263d]">
                                            {coupon.small}
                                        </p>
                                        <p className="mt-3 text-sm leading-snug">{coupon.detail}</p>
                                        <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[#1b1b1b]/55">
                                            {coupon.terms}
                                        </p>
                                        {coupon.stamp && (
                                            <span className="absolute right-4 top-12 rotate-[-10deg] rounded border-2 border-[#d7263d] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#d7263d] mix-blend-multiply">
                                                {coupon.stamp}
                                            </span>
                                        )}
                                    </div>

                                    <div className="relative flex w-32 shrink-0 flex-col items-center justify-between gap-3 border-l-2 border-dashed border-[#1b1b1b]/35 px-3 py-6 text-center">
                                        <div className="w-full">
                                            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#1b1b1b]/55">
                                                Code
                                            </p>
                                            <p className="mt-1.5 break-all rounded-md border border-dashed border-[#1b1b1b]/50 bg-[#fffaf0]/60 px-1 py-1.5 font-mono text-sm font-bold tracking-wider">
                                                {coupon.code}
                                            </p>
                                        </div>
                                        <div aria-hidden="true" className="flex h-8 items-stretch gap-px opacity-80">
                                            {barcodeBars(coupon.code).slice(0, 22).map((bar) => (
                                                <span key={bar.key} className="bg-[#1b1b1b]" style={{ width: bar.w }} />
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            aria-label={`Copy code ${coupon.code}`}
                                            className={cn(
                                                'inline-flex min-h-10 w-full items-center justify-center gap-1 whitespace-nowrap rounded-full px-1.5 text-xs font-bold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d7263d]',
                                                copied || failed
                                                    ? 'bg-[#d7263d] text-[#fffaf0]'
                                                    : 'bg-[#1b1b1b] text-[#fffaf0] hover:bg-[#d7263d]',
                                            )}
                                            onClick={() => copyCode(coupon)}
                                        >
                                            {copied ? (
                                                <HiCheck aria-hidden="true" className="size-3.5" />
                                            ) : (
                                                <HiOutlineClipboardDocument aria-hidden="true" className="size-3.5" />
                                            )}
                                            {copied ? 'Copied!' : failed ? 'Copy failed' : 'Copy code'}
                                        </button>
                                    </div>

                                    <span
                                        aria-hidden="true"
                                        className="absolute -top-3 right-[7.25rem] size-6 rounded-full bg-[#fffaf0]"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute -bottom-3 right-[7.25rem] size-6 rounded-full bg-[#fffaf0]"
                                    />
                                </article>
                            </li>
                        )
                    })}
                </ul>

                <p aria-live="polite" className="sr-only">
                    {status ? (status.ok ? `Code ${status.code} copied` : `Could not copy ${status.code}`) : ''}
                </p>

                <div className="mt-12 flex flex-col gap-4 border-t border-dashed border-[#1b1b1b]/30 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#1b1b1b]/60 sm:flex-row sm:items-center sm:justify-between">
                    <p>One code per order · Stacks with Receipt Club points</p>
                    <a
                        href="#receipt-co-circular"
                        className="group inline-flex min-h-11 items-center gap-2 font-bold text-[#1b1b1b] hover:text-[#d7263d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d7263d]"
                    >
                        See the full circular
                        <HiArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default CouponTicketFlashDeals
