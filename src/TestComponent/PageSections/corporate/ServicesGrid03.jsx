// RevealImageServicesGrid

// ServicesGrid03 · Corporate & Business › Services Grid

// Description:
// A typographic practice index for Oakwell Architects: six very large rows (Residential,
// Workplace, Civic & Cultural, Adaptive Reuse, Interiors, Landscape) under "Buildings that
// get better with age." On desktop, hovering or focusing a row wipes a project photo open
// inside that row; on phones every row shows its photo inline. Use it as the services or
// sectors overview of an architecture, interiors or design studio.

// Design:
// - White section, charcoal #1f1f1d text, olive #6b7b3a for hover titles, index numbers,
//   the "Now showing" dot and the CTA; stone #f1f0eb placeholder behind hidden photos
// - Rows: mono (01) index, titles text-[2.3rem] → lg:text-6xl → xl:text-[5.2rem] with
//   -0.045em tracking, a small note line and a round arrow button; hairline dividers
// - md+: a fixed photo slot per row (15rem → lg:20rem) whose image is clipped with
//   clip-path inset(0 100% 0 0) and wipes to inset(0) over 700ms while scaling 1.12 → 1;
//   the title slides 12px right and turns olive; transitions are off for reduced motion
// - Responsive: base/sm rows show a 16:9 photo under the title and hide the slot; md+
//   uses the 4-column row grid and the header gains a live "Now showing" label

// What it does:
// - active (row index or null) follows mouse enter / keyboard focus on each row and resets
//   when the pointer leaves the list; it drives the "Now showing (03) Civic & Cultural" label
// - Each row links to #oakwell-<practice> (e.g. #oakwell-civic); "See all 127 projects"
//   links to #oakwell-projects
// - The clip-path wipe itself is pure CSS (group-hover / group-focus-visible)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import RevealImageServicesGrid from '@/TestComponent/PageSections/corporate/ServicesGrid03';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <RevealImageServicesGrid />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { HiArrowLongRight, HiArrowUpRight } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`

const practices = [
    {
        id: 'residential',
        title: 'Residential',
        note: 'Houses and small housing schemes that age like good boots.',
        count: 38,
        image: img('1600585154340-be6161a56a0c'),
        alt: 'Dark-clad modern house under a large tree at dusk with warm light inside',
    },
    {
        id: 'workplace',
        title: 'Workplace',
        note: 'Offices people actually choose to come back to.',
        count: 21,
        image: img('1497215728101-856f4ea42174'),
        alt: 'Bright office with timber desks and plants',
    },
    {
        id: 'civic',
        title: 'Civic & Cultural',
        note: 'Libraries, galleries and town halls built for everyone.',
        count: 14,
        image: img('1493397212122-2b85dda8106b'),
        alt: 'Curved white facade against a clear blue sky',
    },
    {
        id: 'reuse',
        title: 'Adaptive Reuse',
        note: 'Mills, depots and warehouses given a second century.',
        count: 17,
        image: img('1531973576160-7125cd663d86'),
        alt: 'Open-plan office under an exposed industrial ceiling',
    },
    {
        id: 'interiors',
        title: 'Interiors',
        note: 'Joinery, light and material, right down to the door handles.',
        count: 26,
        image: img('1560448204-e02f11c3d0e2'),
        alt: 'Bright, open living room with soft furnishings',
    },
    {
        id: 'landscape',
        title: 'Landscape',
        note: 'Courtyards, woodland paths and the ground between buildings.',
        count: 11,
        image: img('1441974231531-c6227db76b6e'),
        alt: 'Sunlit path through a green forest',
    },
]

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6b7b3a]'

export function RevealImageServicesGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [active, setActive] = useState(null)
    const current = active === null ? null : practices[active]

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white py-16 font-sans text-base font-normal text-[#1f1f1d] md:py-24',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-[1fr_20rem] md:items-end">
                    <div className="min-w-0">
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#6b7b3a]">
                            Oakwell Architects — Practice areas
                        </p>
                        <h2 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-[#1f1f1d] sm:text-5xl lg:text-6xl">
                            Buildings that get <span className="font-serif font-normal italic text-[#6b7b3a]">better</span> with age.
                        </h2>
                    </div>
                    <div className="space-y-5">
                        <p className="text-sm leading-relaxed text-[#1f1f1d]/70">
                            A chartered practice of 64 architects, landscape designers and interior designers,
                            working from Leeds and Edinburgh since 2004.
                        </p>
                        <p
                            aria-hidden="true"
                            className="hidden items-center gap-3 border-t border-[#1f1f1d]/15 pt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#1f1f1d]/55 md:flex"
                        >
                            <span
                                className={cn(
                                    'size-2 rounded-full transition-colors',
                                    current ? 'bg-[#6b7b3a]' : 'bg-[#1f1f1d]/25',
                                )}
                            />
                            {current ? (
                                <span>
                                    Now showing <span className="text-[#1f1f1d]">({String(active + 1).padStart(2, '0')}) {current.title}</span>
                                </span>
                            ) : (
                                <span>Hover a practice to preview</span>
                            )}
                        </p>
                    </div>
                </div>

                <div
                    aria-hidden="true"
                    className="mt-14 hidden grid-cols-[4rem_1fr_15rem_3rem] gap-x-6 border-b border-[#1f1f1d] pb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#1f1f1d]/50 md:grid lg:grid-cols-[5rem_1fr_20rem_3rem]"
                >
                    <span>No.</span>
                    <span>Practice</span>
                    <span>Preview</span>
                    <span />
                </div>

                <ul
                    className="mt-10 border-t border-[#1f1f1d] md:mt-0 md:border-t-0"
                    onMouseLeave={() => setActive(null)}
                >
                    {practices.map((practice, index) => (
                        <li key={practice.id} className="border-b border-[#1f1f1d]/15">
                            <a
                                href={`#oakwell-${practice.id}`}
                                className={cn(
                                    'group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-3 gap-y-5 py-6 md:grid-cols-[4rem_1fr_15rem_3rem] md:gap-x-6 md:py-5 lg:grid-cols-[5rem_1fr_20rem_3rem]',
                                    focusRing,
                                )}
                                onMouseEnter={() => setActive(index)}
                                onFocus={() => setActive(index)}
                                onBlur={() => setActive(null)}
                            >
                                <span className="self-start pt-2 font-mono text-xs text-[#6b7b3a] md:self-center md:pt-0">
                                    ({String(index + 1).padStart(2, '0')})
                                </span>

                                <span className="min-w-0">
                                    <span className="block text-[2.3rem] font-medium leading-[0.95] tracking-[-0.045em] text-[#1f1f1d] transition-[translate,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-hover:text-[#6b7b3a] group-focus-visible:translate-x-3 group-focus-visible:text-[#6b7b3a] motion-reduce:transition-none sm:text-5xl lg:text-6xl xl:text-[5.2rem]">
                                        {practice.title}
                                    </span>
                                    <span className="mt-3 block text-sm text-[#1f1f1d]/60">
                                        {practice.note}{' '}
                                        <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.14em] text-[#1f1f1d]/45">
                                            · {practice.count} projects
                                        </span>
                                    </span>
                                </span>

                                <span className="relative hidden h-[8.5rem] overflow-hidden rounded-[3px] bg-[#f1f0eb] md:block lg:h-[10.5rem]">
                                    <img
                                        src={practice.image}
                                        alt={practice.alt}
                                        loading="lazy"
                                        className="absolute inset-0 size-full scale-[1.12] object-cover [clip-path:inset(0_100%_0_0)] transition-[clip-path,scale] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-100 group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:scale-100 group-focus-visible:[clip-path:inset(0_0_0_0)] motion-reduce:transition-none"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-0 grid place-items-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#1f1f1d]/35 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
                                    >
                                        {practice.count} projects
                                    </span>
                                </span>

                                <span
                                    aria-hidden="true"
                                    className="grid size-11 place-items-center self-start rounded-full border border-[#1f1f1d]/20 text-[#1f1f1d] transition-all duration-300 group-hover:rotate-45 group-hover:border-[#6b7b3a] group-hover:bg-[#6b7b3a] group-hover:text-white group-focus-visible:rotate-45 group-focus-visible:bg-[#6b7b3a] group-focus-visible:text-white motion-reduce:transition-none md:self-center"
                                >
                                    <HiArrowUpRight className="size-4" />
                                </span>

                                <span className="col-span-full block overflow-hidden rounded-[3px] md:hidden">
                                    <img
                                        src={practice.image}
                                        alt={practice.alt}
                                        loading="lazy"
                                        className="aspect-[16/9] w-full object-cover"
                                    />
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#1f1f1d]/55">
                        127 completed projects · 19 awards · 0 demolished
                    </p>
                    <a
                        href="#oakwell-projects"
                        className={cn(
                            'group inline-flex min-h-12 items-center gap-3 self-start rounded-full bg-[#1f1f1d] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#6b7b3a] sm:self-auto',
                            focusRing,
                        )}
                    >
                        See all 127 projects
                        <HiArrowLongRight aria-hidden="true" className="size-5 transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default RevealImageServicesGrid
