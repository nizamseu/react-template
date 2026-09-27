// LiftCardsServicesGrid

// ServicesGrid02 · Corporate & Business › Services Grid

// Description:
// A dark, blueprint-style services grid for Vectorline Engineering: six discipline cards
// (Structural, Civil & Infrastructure, MEP Systems, Geotechnical, Digital Twin & BIM,
// Energy Retrofit), each with an icon, discipline code, short description, one proof
// figure, standards tags and "Learn more →". The heading reads "Engineering that holds up
// on paper, on site and for a hundred years." Use it as the services overview of an
// engineering, construction or technical consultancy.

// Design:
// - Slate #0f172a section on a faint 48px blueprint grid, slate-100 #e2e8f0 text, cyan
//   #06b6d4 for icons, codes, figures and links; cards #111c33 with a 1px slate border
// - Each card is a link with a 1px gradient frame: slate at rest, cyan-tinted on hover
//   and a full cyan → sky → violet (#06b6d4 → #38bdf8 → #8b5cf6) gradient on keyboard focus
// - Hover lifts the card 6px with a deeper cyan-tinted shadow and a pointer-following
//   radial spotlight; the "Learn more" arrow slides; lift is off for reduced motion
// - Cards fade up with a 60ms stagger when scrolled into view (fade only for reduced motion)
// - Responsive: 1 column on base, 2 from md, 3 from lg; header stacks on base and splits
//   on md; the stat strip wraps from 1 to 3 columns

// What it does:
// - Pointer move on a card writes --spot-x / --spot-y CSS variables that position the
//   spotlight; nothing else is stateful
// - Each card links to #vectorline-<discipline> (e.g. #vectorline-structural); "Brief an
//   engineer" links to #vectorline-contact
// - The corner registration marks and dimension line in the header are visual only

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import LiftCardsServicesGrid from '@/TestComponent/PageSections/corporate/ServicesGrid02';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <LiftCardsServicesGrid />
//     </main>
// )
// ```

'use client'

import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { LuBox, LuBuilding2, LuCable, LuLeaf, LuMountain, LuRoute } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const services = [
    {
        id: 'structural',
        code: 'VL-STR',
        icon: LuBuilding2,
        title: 'Structural Engineering',
        text: 'Steel, timber and concrete frames from 4-storey schools to 58-storey towers, designed for the loads nobody budgets for.',
        figure: '212',
        figureLabel: 'buildings signed off since 2016',
        tags: ['Eurocode', 'CLT', 'Seismic'],
    },
    {
        id: 'civil',
        code: 'VL-CIV',
        icon: LuRoute,
        title: 'Civil & Infrastructure',
        text: 'Bridges, rail interfaces and drainage that keep cities moving while they are being rebuilt around them.',
        figure: '46 km',
        figureLabel: 'of light-rail alignment delivered',
        tags: ['Bridges', 'Rail', 'SuDS'],
    },
    {
        id: 'mep',
        code: 'VL-MEP',
        icon: LuCable,
        title: 'MEP Systems',
        text: 'Mechanical, electrical and plumbing design that is coordinated in the model, not on site with a hacksaw.',
        figure: '31%',
        figureLabel: 'average energy saving vs. baseline',
        tags: ['HVAC', 'Power', 'Fire'],
    },
    {
        id: 'geotechnical',
        code: 'VL-GEO',
        icon: LuMountain,
        title: 'Geotechnical',
        text: 'Site investigation, foundations and retaining structures, backed by our own lab and a 9-rig drilling fleet.',
        figure: '1,900',
        figureLabel: 'boreholes logged last year',
        tags: ['Piling', 'Slopes', 'Lab'],
    },
    {
        id: 'digital',
        code: 'VL-DGT',
        icon: LuBox,
        title: 'Digital Twin & BIM',
        text: 'Federated models, clash detection and live asset twins that owners keep using long after handover.',
        figure: '0',
        figureLabel: 'unresolved clashes at issue for 3 years',
        tags: ['ISO 19650', 'IFC', 'IoT'],
    },
    {
        id: 'retrofit',
        code: 'VL-NRG',
        icon: LuLeaf,
        title: 'Energy Retrofit',
        text: 'Deep retrofits of post-war offices and housing blocks, keeping the frame and cutting the carbon.',
        figure: '−64%',
        figureLabel: 'operational carbon, Harbour House',
        tags: ['Passivhaus', 'Heat pumps', 'Façades'],
    },
]

const stats = [
    { value: '180', label: 'Chartered engineers' },
    { value: '9', label: 'Studios across 4 countries' },
    { value: '1998', label: 'Drawing since' },
]

export function LiftCardsServicesGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    const moveSpot = (event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty('--spot-x', `${event.clientX - rect.left}px`)
        event.currentTarget.style.setProperty('--spot-y', `${event.clientY - rect.top}px`)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0f172a] py-16 font-sans text-base font-normal text-[#e2e8f0] md:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-[#06b6d4]/10 blur-3xl"
            />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#06b6d4]">
                            Vectorline Engineering / Disciplines
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
                            Engineering that holds up on paper, on site{' '}
                            <span className="text-[#06b6d4]">and for a hundred years.</span>
                        </h2>
                        <div aria-hidden="true" className="mt-6 flex items-center gap-2 font-mono text-[10px] text-[#94a3b8]">
                            <span className="h-3 w-px bg-[#94a3b8]" />
                            <span className="h-px flex-1 bg-[#94a3b8]/50" />
                            <span>6 DISCIPLINES · 1 MODEL</span>
                            <span className="h-px flex-1 bg-[#94a3b8]/50" />
                            <span className="h-3 w-px bg-[#94a3b8]" />
                        </div>
                    </div>
                    <div className="max-w-sm">
                        <p className="leading-relaxed text-[#94a3b8]">
                            One multidisciplinary team, one federated model and one engineer of record who
                            answers for every sheet we issue.
                        </p>
                        <a
                            href="#vectorline-contact"
                            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#06b6d4] px-5 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-[#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                        >
                            Brief an engineer
                            <HiArrowRight aria-hidden="true" className="size-4" />
                        </a>
                    </div>
                </div>

                <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                    {services.map((service, index) => {
                        const Icon = service.icon
                        return (
                            <motion.li
                                key={service.id}
                                initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full"
                            >
                                <a
                                    href={`#vectorline-${service.id}`}
                                    className="group relative block h-full rounded-2xl bg-[#1e293b] from-[#06b6d4] via-[#38bdf8] to-[#8b5cf6] p-px shadow-[0_0_0_rgba(6,182,212,0)] transition-[translate,box-shadow,background-color] duration-300 ease-out hover:-translate-y-1.5 hover:bg-[#0e7490] hover:shadow-[0_24px_50px_-20px_rgba(6,182,212,0.45)] focus-visible:-translate-y-1.5 focus-visible:bg-linear-to-br focus-visible:shadow-[0_24px_60px_-18px_rgba(56,189,248,0.55)] focus-visible:outline-none motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
                                    onPointerMove={moveSpot}
                                >
                                    <div className="relative flex h-full flex-col overflow-hidden rounded-[15px] bg-[#111c33] p-6 sm:p-7">
                                        <div
                                            aria-hidden="true"
                                            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(260px_circle_at_var(--spot-x,50%)_var(--spot-y,0%),rgba(6,182,212,0.16),transparent_70%)]"
                                        />
                                        <span aria-hidden="true" className="absolute right-3 top-3 size-2 border-r border-t border-[#06b6d4]/60" />
                                        <span aria-hidden="true" className="absolute bottom-3 left-3 size-2 border-b border-l border-[#06b6d4]/60" />

                                        <div className="relative flex items-center justify-between">
                                            <span className="grid size-12 place-items-center rounded-xl border border-[#06b6d4]/40 bg-[#06b6d4]/10 text-[#06b6d4] transition-colors group-hover:bg-[#06b6d4] group-hover:text-[#0f172a] group-focus-visible:bg-[#06b6d4] group-focus-visible:text-[#0f172a]">
                                                <Icon aria-hidden="true" className="size-6" />
                                            </span>
                                            <span className="font-mono text-[11px] tracking-[0.18em] text-[#64748b]">{service.code}</span>
                                        </div>

                                        <h3 className="relative mt-6 text-xl font-semibold tracking-tight text-white">{service.title}</h3>
                                        <p className="relative mt-3 text-sm leading-relaxed text-[#94a3b8]">{service.text}</p>

                                        <p className="relative mt-6 flex items-baseline gap-2 border-t border-dashed border-[#334155] pt-5">
                                            <span className="font-mono text-2xl font-semibold tabular-nums text-[#06b6d4]">{service.figure}</span>
                                            <span className="text-xs text-[#94a3b8]">{service.figureLabel}</span>
                                        </p>

                                        <ul className="relative mt-4 flex flex-wrap gap-1.5">
                                            {service.tags.map((tag) => (
                                                <li
                                                    key={tag}
                                                    className="rounded-md border border-[#334155] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[#cbd5e1]"
                                                >
                                                    {tag}
                                                </li>
                                            ))}
                                        </ul>

                                        <span className="relative mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-[#06b6d4]">
                                            Learn more
                                            <HiArrowRight
                                                aria-hidden="true"
                                                className="size-4 transition-transform duration-300 group-hover:translate-x-1.5"
                                            />
                                        </span>
                                    </div>
                                </a>
                            </motion.li>
                        )
                    })}
                </ul>

                <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[#1e293b] bg-[#1e293b] sm:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-row-reverse items-baseline justify-end gap-3 bg-[#0f172a] px-6 py-5">
                            <dt className="text-sm text-[#94a3b8]">{stat.label}</dt>
                            <dd className="font-mono text-3xl font-semibold tabular-nums text-white">{stat.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}

export default LiftCardsServicesGrid
