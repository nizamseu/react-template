// BeforeAfterCaseStudies

// CaseStudies02 · Corporate & Business › Case Studies / Portfolio Preview

// Description:
// A retrofit casebook for the fictional practice Oakwell Architects. Under "Keep the bones.
// Change the life inside." a large draggable before/after comparison shows one project at a
// time (Fernhill Cabin or Cooper’s Yard), with a fact sheet beside it (location, completed,
// floor area, budget, EPC rating before → after, structure retained, carbon saved) and a
// "Read the full project" link. Use it on an architecture or construction site to prove
// transformation work.

// Design:
// - White #ffffff section, charcoal #232320 type and handle, olive #6b7b3a for the eyebrow
//   rule, active tab underline, EPC "after" badge and focus rings
// - lg: 12-column split — comparison col-span-8 (aspect 4/3 → md:16/10, rounded-[28px]),
//   fact sheet col-span-4 as a hairline definition list; stacks below lg
// - Comparison: "after" photo full-bleed, "before" photo on top clipped with clip-path
//   inset() and shown grayscale + slightly dark like a survey photo; a white 2px divider
//   with a round charcoal handle; corner labels ("Before", "After", plus dates from sm) fade
//   out when their side is covered
// - Project tabs are large numbered serif labels ("01 Fernhill Cabin"); photos and facts
//   cross-fade on switch (fade only with reduced motion)
// - Quick-set pills (Before / Split / After) and a live readout sit under the image; they
//   wrap on narrow screens

// What it does:
// - pos (0–100) drives the clip; pointer drag anywhere on the image (pointer capture,
//   touch-action pan-y so vertical page scroll still works) or the visually hidden range
//   input (arrow keys / Home / End) change it; after a drag the input takes focus so the
//   arrow keys keep working, and the handle shows its focus ring
// - project (0 or 1) is set by role="tab" buttons (arrow keys move between tabs); switching
//   resets pos to 50
// - "Read the full project" links to #project-<id>; "All 38 retrofits" links to
//   #oakwell-retrofits

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BeforeAfterCaseStudies from '@/TestComponent/PageSections/corporate/CaseStudies02';

// const CompanyPage = () => (
//     <main className="space-y-6">
//         <BeforeAfterCaseStudies />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowLongRight, HiArrowsRightLeft } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const projects = [
    {
        id: 'fernhill-cabin',
        name: 'Fernhill Cabin',
        place: 'Kielder Forest, Northumberland',
        summary:
            'A damp 1974 timber cabin, re-clad in charred larch and opened to the forest with a glazed living room that sits on the original stone footings.',
        before: {
            src: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1400&q=80',
            alt: 'The original weathered log cabin among tall pines before the retrofit',
            caption: 'Survey · Mar 2021',
        },
        after: {
            src: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80',
            alt: 'The finished cabin with dark cladding and large glowing windows at dusk',
            caption: 'Completed · Oct 2024',
        },
        facts: [
            { label: 'Completed', value: 'October 2024' },
            { label: 'Floor area', value: '86 → 132 m²' },
            { label: 'Budget', value: '£418,000' },
            { label: 'Structure retained', value: '71%' },
            { label: 'Carbon saved vs. rebuild', value: '38 t CO₂e' },
        ],
        epc: { from: 'F', to: 'A' },
    },
    {
        id: 'coopers-yard',
        name: 'Cooper’s Yard',
        place: 'Bermondsey, London SE1',
        summary:
            'A 1920s printworks turned into studios for 140 people. We kept the steel roof trusses and cast-iron columns and built everything new between them.',
        before: {
            src: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=80',
            alt: 'The dim industrial hall with exposed ducts and brickwork before conversion',
            caption: 'Survey · Jun 2021',
        },
        after: {
            src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80',
            alt: 'The converted bright open-plan studio with concrete ceiling and long desks',
            caption: 'Completed · Feb 2023',
        },
        facts: [
            { label: 'Completed', value: 'February 2023' },
            { label: 'Floor area', value: '1,850 m²' },
            { label: 'Budget', value: '£3.9m' },
            { label: 'Structure retained', value: '84%' },
            { label: 'Carbon saved vs. rebuild', value: '612 t CO₂e' },
        ],
        epc: { from: 'E', to: 'B' },
    },
]

const presets = [
    { label: 'Before', value: 100 },
    { label: 'Split', value: 50 },
    { label: 'After', value: 0 },
]

export function BeforeAfterCaseStudies({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState(0)
    const [pos, setPos] = useState(50)
    const frameRef = useRef(null)
    const inputRef = useRef(null)
    const tabRefs = useRef([])
    const dragging = useRef(false)

    const project = projects[active]
    const rounded = Math.round(pos)

    const selectProject = (index) => {
        setActive(index)
        setPos(50)
    }

    const onTabKeyDown = (event, index) => {
        let next = null
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % projects.length
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + projects.length) % projects.length
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = projects.length - 1
        if (next === null) return
        event.preventDefault()
        selectProject(next)
        tabRefs.current[next]?.focus()
    }

    const setFromClientX = (clientX) => {
        const frame = frameRef.current
        if (!frame) return
        const rect = frame.getBoundingClientRect()
        const pct = ((clientX - rect.left) / rect.width) * 100
        setPos(Math.min(100, Math.max(0, pct)))
    }

    const onPointerDown = (event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return
        dragging.current = true
        event.currentTarget.setPointerCapture?.(event.pointerId)
        setFromClientX(event.clientX)
    }

    const onPointerMove = (event) => {
        if (dragging.current) setFromClientX(event.clientX)
    }

    const endDrag = () => {
        if (!dragging.current) return
        dragging.current = false
        inputRef.current?.focus({ preventScroll: true })
    }

    const fade = {
        initial: { opacity: 0, scale: reduceMotion ? 1 : 1.03 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
        transition: { duration: reduceMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] },
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-white px-4 py-20 text-base font-normal text-[#232320] sm:px-6 md:py-28 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#232320]/60">
                            <span aria-hidden="true" className="h-px w-10 bg-[#6b7b3a]" />
                            Oakwell Architects · Retrofit casebook
                        </p>
                        <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#232320] sm:text-5xl md:text-6xl">
                            Keep the bones.
                            <span className="block font-serif font-normal italic tracking-tight text-[#232320]/55">
                                Change the life inside.
                            </span>
                        </h2>
                    </div>

                    <div role="tablist" aria-label="Choose a project" className="flex gap-2 sm:gap-8">
                        {projects.map((item, index) => {
                            const selected = index === active
                            return (
                                <button
                                    key={item.id}
                                    ref={(el) => {
                                        tabRefs.current[index] = el
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`oakwell-tab-${item.id}`}
                                    aria-selected={selected}
                                    aria-controls="oakwell-panel"
                                    tabIndex={selected ? 0 : -1}
                                    className={cn(
                                        'group relative flex min-h-12 flex-1 flex-col items-start pb-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6b7b3a] sm:flex-none',
                                        selected ? 'text-[#232320]' : 'text-[#232320]/40 hover:text-[#232320]/70',
                                    )}
                                    onClick={() => selectProject(index)}
                                    onKeyDown={(event) => onTabKeyDown(event, index)}
                                >
                                    <span className="font-mono text-[11px] tracking-[0.2em]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="font-serif text-xl leading-tight sm:text-2xl">{item.name}</span>
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            'absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[#6b7b3a] transition-transform duration-500',
                                            selected ? 'scale-x-100' : 'scale-x-0',
                                        )}
                                    />
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div
                    id="oakwell-panel"
                    role="tabpanel"
                    aria-labelledby={`oakwell-tab-${project.id}`}
                    className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12"
                >
                    <div className="lg:col-span-8">
                        <div
                            ref={frameRef}
                            className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] bg-[#e9e8e3] md:aspect-[16/10]"
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={endDrag}
                            onPointerCancel={endDrag}
                            onLostPointerCapture={endDrag}
                        >
                            <AnimatePresence initial={false}>
                                <motion.div key={project.id} className="absolute inset-0" {...fade}>
                                    <img
                                        src={project.after.src}
                                        alt={project.after.alt}
                                        loading="lazy"
                                        draggable={false}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div
                                        className="absolute inset-0"
                                        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                                    >
                                        <img
                                            src={project.before.src}
                                            alt={project.before.alt}
                                            loading="lazy"
                                            draggable={false}
                                            className="absolute inset-0 h-full w-full object-cover brightness-90 contrast-110 grayscale"
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <span
                                className={cn(
                                    'pointer-events-none absolute left-4 top-4 rounded-full bg-[#232320]/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur transition-opacity duration-300 sm:left-5 sm:top-5',
                                    pos < 18 ? 'opacity-0' : 'opacity-100',
                                )}
                            >
                                Before<span className="hidden sm:inline"> · {project.before.caption.split(' · ')[1]}</span>
                            </span>
                            <span
                                className={cn(
                                    'pointer-events-none absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#232320] backdrop-blur transition-opacity duration-300 sm:right-5 sm:top-5',
                                    pos > 82 ? 'opacity-0' : 'opacity-100',
                                )}
                            >
                                After<span className="hidden sm:inline"> · {project.after.caption.split(' · ')[1]}</span>
                            </span>

                            <input
                                ref={inputRef}
                                type="range"
                                min={0}
                                max={100}
                                step={1}
                                value={rounded}
                                aria-label={`Before and after comparison for ${project.name}`}
                                aria-valuetext={`${rounded}% before photo, ${100 - rounded}% after photo`}
                                className="peer sr-only"
                                onChange={(event) => setPos(Number(event.target.value))}
                            />

                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(35,35,32,0.15)]"
                                style={{ left: `${pos}%` }}
                            />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-[#232320] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-shadow peer-focus-visible:ring-4 peer-focus-visible:ring-[#6b7b3a] sm:size-14"
                                style={{ left: `${pos}%` }}
                            >
                                <HiArrowsRightLeft className="size-5" />
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2" role="group" aria-label="Jump to a view">
                                {presets.map((preset) => {
                                    const on = rounded === preset.value
                                    return (
                                        <button
                                            key={preset.label}
                                            type="button"
                                            aria-pressed={on}
                                            className={cn(
                                                'min-h-10 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b7b3a]',
                                                on
                                                    ? 'border-[#232320] bg-[#232320] text-white'
                                                    : 'border-[#232320]/20 text-[#232320] hover:border-[#232320]/60',
                                            )}
                                            onClick={() => setPos(preset.value)}
                                        >
                                            {preset.label}
                                        </button>
                                    )
                                })}
                            </div>
                            <p className="font-mono text-xs tabular-nums text-[#232320]/55">
                                Drag or use ← → · {rounded}% before / {100 - rounded}% after
                            </p>
                        </div>
                    </div>

                    <AnimatePresence mode="wait" initial={false}>
                        <motion.aside
                            key={project.id}
                            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="flex flex-col lg:col-span-4"
                        >
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7b3a]">
                                {project.place}
                            </p>
                            <h3 className="mt-3 font-serif text-3xl font-normal leading-tight text-[#232320] md:text-4xl">
                                {project.name}
                            </h3>
                            <p className="mt-4 text-sm leading-relaxed text-[#232320]/70">{project.summary}</p>

                            <dl className="mt-8 border-t border-[#232320]/15">
                                {project.facts.map((fact) => (
                                    <div
                                        key={fact.label}
                                        className="flex items-baseline justify-between gap-4 border-b border-[#232320]/10 py-3.5"
                                    >
                                        <dt className="text-sm text-[#232320]/55">{fact.label}</dt>
                                        <dd className="text-right text-sm font-semibold tabular-nums text-[#232320]">
                                            {fact.value}
                                        </dd>
                                    </div>
                                ))}
                                <div className="flex items-center justify-between gap-4 border-b border-[#232320]/10 py-3.5">
                                    <dt className="text-sm text-[#232320]/55">Energy rating (EPC)</dt>
                                    <dd className="flex items-center gap-2 text-sm font-semibold">
                                        <span className="grid size-8 place-items-center rounded-md bg-[#c2492f] text-white">
                                            {project.epc.from}
                                        </span>
                                        <HiArrowLongRight aria-hidden="true" className="size-4 text-[#232320]/40" />
                                        <span className="grid size-8 place-items-center rounded-md bg-[#6b7b3a] text-white">
                                            {project.epc.to}
                                        </span>
                                        <span className="sr-only">
                                            improved from {project.epc.from} to {project.epc.to}
                                        </span>
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                                <a
                                    href={`#project-${project.id}`}
                                    className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-[#232320] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#6b7b3a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6b7b3a]"
                                >
                                    Read the full project
                                    <HiArrowLongRight
                                        aria-hidden="true"
                                        className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </a>
                                <a
                                    href="#oakwell-retrofits"
                                    className="inline-flex min-h-10 items-center border-b border-[#232320]/30 text-sm font-medium text-[#232320] hover:border-[#232320] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6b7b3a]"
                                >
                                    All 38 retrofits
                                </a>
                            </div>
                        </motion.aside>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}

export default BeforeAfterCaseStudies
