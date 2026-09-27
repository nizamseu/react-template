// SocialTilesContactSocials

// ContactSocials04 · Portfolios & Personal Websites › Contact / Socials

// Description:
// An editorial wall of oversized social tiles for photographer and art director Theo
// Laurent. Under the serif heading "Follow the work between commissions." four framed
// tiles — Instagram (48.2k followers, with three recent frames), Behance (212k project
// views), LinkedIn (9,840 followers) and a wide Email tile with a copy button — flood with
// their own colour from whichever edge the pointer enters. Use it as the contact/footer
// block of a photographer, studio or creative-director portfolio.

// Design:
// - Asymmetric grid: 1 column → md:grid-cols-2 → lg:grid-cols-12 with auto-rows
//   minmax(260px,auto); Instagram is a tall 7×2 tile, Behance and LinkedIn stack in 5
//   columns, Email runs the full width
// - Cream #ede6da background, ink #111111 text and 1px ink frames; hover fills are rust
//   #c2502e (Instagram), ultramarine #2443c9 (Behance), deep teal #1d5b6e (LinkedIn) and
//   ink #111111 (Email), all with cream text
// - Serif display heading (text-5xl → lg:text-7xl) and serif counts (text-6xl → sm:7xl);
//   mono platform labels and handles; square 2px-radius tiles; thumbnails grayscale in the
//   base layer and full colour in the fill layer
// - The fill is a duplicate, cream-on-colour layer revealed with an animated clip-path
//   inset from the entry edge and hidden toward the exit edge (framer-motion, 0.5 s),
//   so text changes colour exactly along the wipe; instant for reduced motion
// - Responsive: base stacks the header and tiles; md header splits and tiles pair up; lg
//   switches to the 12-column bento with the tall Instagram tile

// What it does:
// - fills state ({ [id]: { on, edge } }) is set on pointer enter/leave by the nearest edge
//   of the pointer and on keyboard focus/blur (from the bottom edge)
// - Each tile is a stretched link to #instagram, #behance, #linkedin or #email; the Email
//   tile’s "Copy address" button (navigator.clipboard with an execCommand fallback) shows
//   "Copied!" / "Copy failed" for 2.2 s and is announced through an aria-live region
// - While the fill covers the Email tile, a focus-visible "Copy address" is mirrored as a
//   cream outline on the fill layer; "Agency bookings" links to #agency

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SocialTilesContactSocials from '@/TestComponent/PageSections/portfolio/ContactSocials04';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <SocialTilesContactSocials />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FaBehance, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';
import { HiArrowUpRight, HiCheck, HiOutlineClipboardDocument, HiOutlineEnvelope } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const EMAIL = 'studio@theolaurent.fr'

const tiles = [
    {
        id: 'instagram',
        platform: 'Instagram',
        icon: FaInstagram,
        handle: '@theolaurent.photo',
        count: '48.2k',
        unit: 'followers',
        blurb: 'Frames from the road, most days before 9 a.m.',
        fill: 'bg-[#c2502e]',
        span: 'md:col-span-2 lg:col-span-7 lg:row-span-2',
        thumbs: [
            {
                src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=400&q=80',
                alt: 'Bridge over the Seine in Paris at dusk',
            },
            {
                src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=400&q=80',
                alt: 'Angular white modern building against the sky',
            },
            {
                src: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=400&q=80',
                alt: 'Black-and-white portrait of a woman on a dark background',
            },
        ],
    },
    {
        id: 'behance',
        platform: 'Behance',
        icon: FaBehance,
        handle: 'behance.net/theolaurent',
        count: '212k',
        unit: 'project views',
        blurb: 'Fourteen full case studies, credits included.',
        fill: 'bg-[#2443c9]',
        span: 'lg:col-span-5',
    },
    {
        id: 'linkedin',
        platform: 'LinkedIn',
        icon: FaLinkedinIn,
        handle: 'in/theo-laurent',
        count: '9,840',
        unit: 'followers',
        blurb: 'Commissions, credits and the occasional essay.',
        fill: 'bg-[#1d5b6e]',
        span: 'lg:col-span-5',
    },
    {
        id: 'email',
        platform: 'Email',
        icon: HiOutlineEnvelope,
        handle: EMAIL,
        count: '48 h',
        unit: 'reply time',
        blurb: 'Commissions, licensing and fine-art prints.',
        fill: 'bg-[#111111]',
        span: 'md:col-span-2 lg:col-span-12',
        email: true,
    },
]

const HIDDEN = {
    top: 'inset(0% 0% 100% 0%)',
    bottom: 'inset(100% 0% 0% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
}
const FULL = 'inset(0% 0% 0% 0%)'

function nearestEdge(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const distances = { top: y, bottom: rect.height - y, left: x, right: rect.width - x }
    return Object.keys(distances).reduce((best, edge) => (distances[edge] < distances[best] ? edge : best), 'bottom')
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

function TileContent({ tile, inverse, copyState, copyFocus, onCopy, onCopyFocus }) {
    const Icon = tile.icon
    const Title = inverse ? 'p' : 'h3'
    const copyLabel = copyState === 'copied' ? 'Copied!' : copyState === 'failed' ? 'Copy failed' : 'Copy address'

    const copyButton = tile.email && (
        <button
            type="button"
            tabIndex={inverse ? -1 : undefined}
            className={cn(
                'relative z-20 inline-flex min-h-11 items-center gap-2 self-start rounded-full px-5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2502e]',
                inverse ? 'bg-[#ede6da] text-[#111111]' : 'bg-[#111111] text-[#ede6da]',
                inverse && copyFocus && 'outline-2 outline-offset-2 outline-[#ede6da]',
            )}
            onClick={inverse ? undefined : onCopy}
            onFocus={inverse ? undefined : (event) => onCopyFocus(event.currentTarget.matches(':focus-visible'))}
            onBlur={inverse ? undefined : () => onCopyFocus(false)}
        >
            {copyState === 'copied' ? (
                <HiCheck aria-hidden="true" className="size-4" />
            ) : (
                <HiOutlineClipboardDocument aria-hidden="true" className="size-4" />
            )}
            {copyLabel}
        </button>
    )

    return (
        <div
            className={cn(
                'relative flex h-full min-h-[240px] flex-col justify-between gap-8 p-6 sm:p-8',
                inverse ? 'text-[#ede6da]' : 'text-[#111111]',
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-3">
                    <Icon aria-hidden="true" className="size-6" />
                    <Title className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-current">
                        {tile.platform}
                    </Title>
                </span>
                <HiArrowUpRight aria-hidden="true" className="size-6" />
            </div>

            {tile.thumbs && (
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {tile.thumbs.map((thumb) => (
                        <img
                            key={thumb.src}
                            src={thumb.src}
                            alt={inverse ? '' : thumb.alt}
                            loading="lazy"
                            className={cn(
                                'aspect-square w-full object-cover',
                                inverse ? 'grayscale-0' : 'grayscale',
                            )}
                        />
                    ))}
                </div>
            )}

            {tile.email ? (
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                        <p className="font-serif text-[clamp(1.6rem,6vw,4.75rem)] leading-[1.05] tracking-tight [overflow-wrap:anywhere]">
                            {EMAIL}
                        </p>
                        <p className="mt-3 text-sm opacity-75">{tile.blurb}</p>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-end gap-6">
                        <p className="font-serif text-5xl leading-none">
                            {tile.count}
                            <span className="ml-2 font-sans text-sm opacity-70">{tile.unit}</span>
                        </p>
                        {copyButton}
                    </div>
                </div>
            ) : (
                <div>
                    <p className="font-serif text-6xl leading-none tracking-tight sm:text-7xl">
                        {tile.count}
                        <span className="ml-2 font-sans text-sm tracking-normal opacity-70">{tile.unit}</span>
                    </p>
                    <p className="mt-3 max-w-xs text-sm opacity-75">{tile.blurb}</p>
                    <p className="mt-4 truncate font-mono text-xs">{tile.handle}</p>
                </div>
            )}
        </div>
    )
}

export function SocialTilesContactSocials({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [fills, setFills] = useState({})
    const [copyState, setCopyState] = useState('idle')
    const [copyFocus, setCopyFocus] = useState(false)

    useEffect(() => {
        if (copyState === 'idle') return undefined
        const id = setTimeout(() => setCopyState('idle'), 2200)
        return () => clearTimeout(id)
    }, [copyState])

    const setFill = (id, on, edge) => setFills((prev) => ({ ...prev, [id]: { on, edge } }))

    const copyEmail = async () => {
        let ok = false
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(EMAIL)
                ok = true
            }
        } catch {
            ok = false
        }
        if (!ok) ok = legacyCopy(EMAIL)
        setCopyState(ok ? 'copied' : 'failed')
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#ede6da] px-4 py-16 text-base font-normal text-[#111111] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-3xl">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#111111]/65">
                            Theo Laurent — Elsewhere
                        </p>
                        <h2 className="mt-5 font-serif text-5xl font-normal leading-[0.98] tracking-tight text-[#111111] sm:text-6xl lg:text-7xl">
                            Follow the work <em className="italic">between</em> commissions.
                        </h2>
                    </div>
                    <div className="max-w-xs">
                        <p className="text-sm leading-relaxed text-[#111111]/70">
                            Based in Marseille, shooting worldwide. Represented in Paris by Atelier Nord for
                            advertising work.
                        </p>
                        <a
                            href="#agency"
                            className="group mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]"
                        >
                            <span className="border-b border-[#111111] pb-0.5">Agency bookings</span>
                            <HiArrowUpRight
                                aria-hidden="true"
                                className="size-4 transition-transform duration-300 group-hover:rotate-45"
                            />
                        </a>
                    </div>
                </div>

                <ul className="mt-12 grid gap-3 md:mt-16 md:grid-cols-2 lg:auto-rows-[minmax(260px,auto)] lg:grid-cols-12">
                    {tiles.map((tile) => {
                        const fill = fills[tile.id] || { on: false, edge: 'bottom' }
                        return (
                            <li
                                key={tile.id}
                                className={cn(
                                    'relative isolate overflow-hidden rounded-[2px] ring-1 ring-[#111111] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-[#111111]',
                                    tile.span,
                                )}
                                onPointerEnter={(event) => setFill(tile.id, true, nearestEdge(event))}
                                onPointerLeave={(event) => setFill(tile.id, false, nearestEdge(event))}
                                onFocus={() => setFill(tile.id, true, 'bottom')}
                                onBlur={(event) => {
                                    if (!event.currentTarget.contains(event.relatedTarget)) setFill(tile.id, false, 'bottom')
                                }}
                            >
                                <TileContent
                                    tile={tile}
                                    inverse={false}
                                    copyState={copyState}
                                    onCopy={copyEmail}
                                    onCopyFocus={setCopyFocus}
                                />
                                <a
                                    href={`#${tile.id}`}
                                    aria-label={`${tile.platform}: ${tile.handle}, ${tile.count} ${tile.unit}`}
                                    className="absolute inset-0 z-10 focus-visible:outline-none"
                                />
                                <motion.div
                                    aria-hidden="true"
                                    initial={false}
                                    animate={{ clipPath: fill.on ? [HIDDEN[fill.edge], FULL] : HIDDEN[fill.edge] }}
                                    transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.65, 0, 0.35, 1] }}
                                    className={cn('pointer-events-none absolute inset-0 z-30', tile.fill)}
                                >
                                    <TileContent inverse tile={tile} copyState={copyState} copyFocus={copyFocus} />
                                </motion.div>
                            </li>
                        )
                    })}
                </ul>
                <p aria-live="polite" className="sr-only">
                    {copyState === 'copied' ? `${EMAIL} copied to clipboard` : copyState === 'failed' ? 'Could not copy the address' : ''}
                </p>
            </div>
        </section>
    )
}

export default SocialTilesContactSocials
