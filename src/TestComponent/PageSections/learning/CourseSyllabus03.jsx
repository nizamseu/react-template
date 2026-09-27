// BlueprintSheetCourseSyllabus

// CourseSyllabus03 · Learning Management Systems › Course Overview & Syllabus

// Description:
// A drafting-table course page for "ARCH-201 Housing Typologies: From Sketch to Section" at
// the fictional Studio Axis Architecture. A title block (drawing no., scale, revision, date)
// sits above three tabs — Overview, Syllabus and Requirements. The syllabus is drawn as six
// numbered drafting sheets (A-101 to A-106) with week spans, deliverables and studio hours,
// joined by dimension-line connectors. Use it for architecture, engineering or any
// technical course that wants a precise, drawn feel.

// Design:
// - Blueprint #0b3d91 with a 24px white/8 grid plus a 120px white/12 major grid
//   (bg-[linear-gradient(...)]); white hairlines, white/70 secondary text, pale cyan
//   #9cc3ff for dimension labels and the active tab
// - Mono labels everywhere (uppercase, 0.2em tracking); sans heading text-3xl → md:text-5xl;
//   square corners, 1px white/40 borders, corner tick marks on every sheet
// - Sheets: grid-cols-1 → md:grid-cols-2 → lg:grid-cols-3; each has a dimension line
//   across its top ("|← 2 WKS →|") and connectors in the gaps — vertical on mobile,
//   horizontal on md/lg (hidden at row ends so nothing overflows)
// - Tab panels crossfade and slide 8px (AnimatePresence; fade only for reduced motion)
// - Title block collapses from a 4-column strip (md+) into a 2-column grid on mobile

// What it does:
// - tab state (starts on Syllabus) switches the three panels; role="tablist" / "tab" /
//   "tabpanel", aria-selected, roving tabIndex and ArrowLeft / ArrowRight / Home / End keys
// - Requirements has a controlled checklist ("I have this") whose count ("3 of 7 ready")
//   updates live
// - "Apply for the spring studio" links to #studio-axis-apply; "Download the brief (PDF)"
//   to #arch-201-brief

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BlueprintSheetCourseSyllabus from '@/TestComponent/PageSections/learning/CourseSyllabus03';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <BlueprintSheetCourseSyllabus />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi2';
import { LuCheck, LuDraftingCompass } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'syllabus', label: 'Syllabus' },
    { id: 'requirements', label: 'Requirements' },
]

const titleBlock = [
    ['Drawing no.', 'ARCH-201'],
    ['Scale', '1:100'],
    ['Revision', 'C · Spring 2027'],
    ['Studio', 'Tue + Thu · 18:00 CET'],
]

const sheets = [
    { no: 'A-101', title: 'Site & Context', weeks: 'Wk 1–2', span: '2 WKS', hours: 14, items: ['Site walk + photo survey', 'Figure-ground at 1:500', 'Sun and wind studies'] },
    { no: 'A-102', title: 'Precedent Typologies', weeks: 'Wk 3–4', span: '2 WKS', hours: 12, items: ['Six housing precedents redrawn', 'Unit plan catalogue', 'Density comparison sheet'] },
    { no: 'A-103', title: 'Massing & Section', weeks: 'Wk 5–6', span: '2 WKS', hours: 16, items: ['Three massing models', 'Long + cross sections', 'Daylight check at 1:200'] },
    { no: 'A-104', title: 'Unit Plans', weeks: 'Wk 7–8', span: '2 WKS', hours: 16, items: ['Studio, 2-bed and family units', 'Furniture layouts at 1:50', 'Accessibility review'] },
    { no: 'A-105', title: 'Structure & Skin', weeks: 'Wk 9–10', span: '2 WKS', hours: 14, items: ['Timber frame strategy', 'Facade bay study', 'Wall section at 1:20'] },
    { no: 'A-106', title: 'Final Review Set', weeks: 'Wk 11–12', span: '2 WKS', hours: 18, items: ['Presentation boards (A1)', 'Physical model 1:200', 'Guest-critic review'] },
]

const requirements = [
    { id: 'rhino', label: 'Rhino 8 or SketchUp 2025 (student licence is fine)' },
    { id: 'cad', label: 'Basic 2D CAD — you can draw a plan to scale' },
    { id: 'portfolio', label: 'Portfolio of 2–3 projects (school or personal)' },
    { id: 'sketchbook', label: 'A3 sketchbook and 0.3 / 0.5 fineliners' },
    { id: 'ruler', label: 'Triangular scale ruler (1:20 to 1:500)' },
    { id: 'model', label: 'Model kit: cutting mat, scalpel, 2 mm greyboard' },
    { id: 'time', label: '8–10 hours a week, including two live studios' },
]

const overviewFacts = [
    ['Duration', '12 weeks'],
    ['Studio hours', `${sheets.reduce((sum, s) => sum + s.hours, 0)} h live`],
    ['Group size', '16 students'],
    ['Credit', '6 ECTS'],
]

function CornerTicks() {
    return (
        <>
            <span className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-white" aria-hidden="true" />
            <span className="absolute -right-px -top-px h-3 w-3 border-r-2 border-t-2 border-white" aria-hidden="true" />
            <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-white" aria-hidden="true" />
            <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-white" aria-hidden="true" />
        </>
    )
}

export function BlueprintSheetCourseSyllabus({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [tab, setTab] = useState('syllabus')
    const [owned, setOwned] = useState(['cad', 'sketchbook', 'time'])
    const tabRefs = useRef([])

    const onTabKeyDown = (event, index) => {
        const last = tabs.length - 1
        let next = null
        if (event.key === 'ArrowRight') next = index === last ? 0 : index + 1
        if (event.key === 'ArrowLeft') next = index === 0 ? last : index - 1
        if (event.key === 'Home') next = 0
        if (event.key === 'End') next = last
        if (next === null) return
        event.preventDefault()
        setTab(tabs[next].id)
        tabRefs.current[next]?.focus()
    }

    const toggleOwned = (id) => {
        setOwned((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#0b3d91] px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:24px_24px,24px_24px,120px_120px,120px_120px]"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-7xl">
                <div className="relative border border-white/50 bg-[#0b3d91]/80">
                    <CornerTicks />
                    <div className="flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-[#9cc3ff]">
                                <LuDraftingCompass className="h-4 w-4" aria-hidden="true" />
                                Studio Axis Architecture · Online studio
                            </p>
                            <h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl">
                                Housing Typologies: From Sketch to Section
                            </h2>
                        </div>
                        <a
                            href="#studio-axis-apply"
                            className="group inline-flex min-h-11 items-center gap-2 self-start border border-white px-5 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[#0b3d91] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:self-end"
                        >
                            Apply for the spring studio
                            <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </a>
                    </div>
                    <dl className="grid grid-cols-2 border-t border-white/40 md:grid-cols-4">
                        {titleBlock.map(([label, value], i) => (
                            <div
                                key={label}
                                className={cn(
                                    'border-white/40 px-5 py-3 sm:px-8',
                                    i % 2 === 1 && 'border-l',
                                    i > 1 && 'border-t md:border-t-0',
                                    i === 2 && 'md:border-l',
                                )}
                            >
                                <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">{label}</dt>
                                <dd className="mt-1 font-mono text-sm text-white">{value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>

                <div role="tablist" aria-label="Course information" className="mt-10 flex flex-wrap border-b border-white/40">
                    {tabs.map((t, index) => {
                        const selected = t.id === tab
                        return (
                            <button
                                key={t.id}
                                ref={(el) => {
                                    tabRefs.current[index] = el
                                }}
                                id={`axis-tab-${t.id}`}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                aria-controls={`axis-panel-${t.id}`}
                                tabIndex={selected ? 0 : -1}
                                className={cn(
                                    'relative -mb-px min-h-12 px-4 font-mono text-xs uppercase tracking-[0.22em] transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#9cc3ff] sm:px-6',
                                    selected
                                        ? 'border border-white/40 border-b-[#0b3d91] bg-[#0b3d91] text-[#9cc3ff]'
                                        : 'border border-transparent text-white/65 hover:text-white',
                                )}
                                onClick={() => setTab(t.id)}
                                onKeyDown={(event) => onTabKeyDown(event, index)}
                            >
                                <span className="mr-2 text-white/40">0{index + 1}</span>
                                {t.label}
                            </button>
                        )
                    })}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={tab}
                        id={`axis-panel-${tab}`}
                        role="tabpanel"
                        aria-labelledby={`axis-tab-${tab}`}
                        tabIndex={0}
                        initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                        transition={{ duration: 0.25 }}
                        className="pt-10 focus-visible:outline-1 focus-visible:outline-offset-8 focus-visible:outline-white/40"
                    >
                        {tab === 'overview' && (
                            <div className="grid gap-10 lg:grid-cols-12">
                                <div className="lg:col-span-7">
                                    <h3 className="font-mono text-xs font-normal uppercase tracking-[0.24em] text-[#9cc3ff]">
                                        General notes
                                    </h3>
                                    <ol className="mt-4 space-y-4 text-base leading-relaxed text-white/85">
                                        <li className="flex gap-4">
                                            <span className="font-mono text-sm text-[#9cc3ff]">01</span>
                                            Design a mid-rise housing block of 40–60 homes on a real infill site in
                                            Rotterdam, from first sketch to a 1:20 wall section.
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="font-mono text-sm text-[#9cc3ff]">02</span>
                                            Work the way practices do: weekly pin-ups, marked-up PDFs from your
                                            tutor and a mid-term review with a housing association client.
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="font-mono text-sm text-[#9cc3ff]">03</span>
                                            Leave with six portfolio-ready sheets and a physical model you can
                                            photograph for applications.
                                        </li>
                                    </ol>
                                    <a
                                        href="#arch-201-brief"
                                        className="mt-8 inline-flex min-h-10 items-center gap-2 border-b border-white/60 font-mono text-xs uppercase tracking-[0.2em] text-white hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                                    >
                                        Download the brief (PDF)
                                    </a>
                                </div>
                                <dl className="grid grid-cols-2 gap-px self-start border border-white/40 bg-white/40 lg:col-span-5">
                                    {overviewFacts.map(([label, value]) => (
                                        <div key={label} className="bg-[#0b3d91] p-5">
                                            <dt className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">{label}</dt>
                                            <dd className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}

                        {tab === 'syllabus' && (
                            <>
                                <h3 className="sr-only">Syllabus sheets</h3>
                                <ol className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                                    {sheets.map((sheet, index) => {
                                        const last = index === sheets.length - 1
                                        return (
                                            <li key={sheet.no} className="relative">
                                                <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9cc3ff]" aria-hidden="true">
                                                    <span className="h-3 w-px bg-[#9cc3ff]" />
                                                    <span className="relative h-px flex-1 bg-[#9cc3ff]/70">
                                                        <span className="absolute -top-[3px] left-0 h-0 w-0 border-y-[3.5px] border-r-[6px] border-y-transparent border-r-[#9cc3ff]" />
                                                    </span>
                                                    <span>{sheet.span}</span>
                                                    <span className="relative h-px flex-1 bg-[#9cc3ff]/70">
                                                        <span className="absolute -top-[3px] right-0 h-0 w-0 border-y-[3.5px] border-l-[6px] border-y-transparent border-l-[#9cc3ff]" />
                                                    </span>
                                                    <span className="h-3 w-px bg-[#9cc3ff]" />
                                                </div>

                                                <article className="relative border border-white/45 bg-[#0b3d91]/85 transition-colors hover:border-white hover:bg-[#0d4aa8]/85">
                                                    <CornerTicks />
                                                    <div className="flex items-start justify-between gap-4 border-b border-white/30 p-5">
                                                        <div>
                                                            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/55">{sheet.weeks}</p>
                                                            <h4 className="mt-2 text-xl font-semibold leading-tight text-white">{sheet.title}</h4>
                                                        </div>
                                                        <p className="shrink-0 border border-white/50 px-2 py-1 font-mono text-xs text-white">{sheet.no}</p>
                                                    </div>
                                                    <ul className="space-y-2 p-5 text-sm text-white/80">
                                                        {sheet.items.map((item) => (
                                                            <li key={item} className="flex gap-3">
                                                                <span className="mt-2 h-px w-3 shrink-0 bg-white/60" aria-hidden="true" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="grid grid-cols-2 border-t border-white/30 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                                                        <p className="border-r border-white/30 px-5 py-2.5">Studio {sheet.hours} h</p>
                                                        <p className="px-5 py-2.5 text-right">Sheet {index + 1} / {sheets.length}</p>
                                                    </div>
                                                </article>

                                                {!last && (
                                                    <>
                                                        <span className="absolute left-8 top-full h-10 w-px bg-white/50 md:hidden" aria-hidden="true">
                                                            <span className="absolute -left-[3px] bottom-0 h-0 w-0 border-x-[3.5px] border-t-[6px] border-x-transparent border-t-white/80" />
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                'absolute left-full top-[calc(50%+1rem)] hidden h-px w-10 bg-white/50',
                                                                index % 2 === 0 ? 'md:block' : 'md:hidden',
                                                                index % 3 !== 2 ? 'lg:block' : 'lg:hidden',
                                                            )}
                                                            aria-hidden="true"
                                                        >
                                                            <span className="absolute -top-[3px] right-0 h-0 w-0 border-y-[3.5px] border-l-[6px] border-y-transparent border-l-white/80" />
                                                        </span>
                                                    </>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ol>
                            </>
                        )}

                        {tab === 'requirements' && (
                            <div className="grid gap-10 lg:grid-cols-12">
                                <div className="lg:col-span-4">
                                    <h3 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">Before the first pin-up</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-white/70">
                                        Tick what you already have. Anything missing is covered in the free
                                        pre-studio week, starting 1 February 2027.
                                    </p>
                                    <p className="mt-6 font-mono text-sm uppercase tracking-[0.2em] text-[#9cc3ff]" aria-live="polite">
                                        {owned.length} of {requirements.length} ready
                                    </p>
                                    <div className="mt-3 h-1 w-full bg-white/15" aria-hidden="true">
                                        <motion.div
                                            className="h-full bg-[#9cc3ff]"
                                            animate={{ width: `${(owned.length / requirements.length) * 100}%` }}
                                            transition={{ duration: reduceMotion ? 0 : 0.35 }}
                                        />
                                    </div>
                                </div>
                                <ul className="border border-white/40 lg:col-span-8">
                                    {requirements.map((req, index) => {
                                        const checked = owned.includes(req.id)
                                        return (
                                            <li key={req.id} className={cn(index > 0 && 'border-t border-white/25')}>
                                                <label className="flex min-h-14 cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-white/5 sm:px-5">
                                                    <span className="w-8 shrink-0 font-mono text-[10px] tracking-[0.2em] text-white/45">
                                                        R{String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    <input
                                                        type="checkbox"
                                                        checked={checked}
                                                        className="peer sr-only"
                                                        onChange={() => toggleOwned(req.id)}
                                                    />
                                                    <span
                                                        className="grid h-6 w-6 shrink-0 place-items-center border border-white/70 text-[#0b3d91] peer-checked:bg-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#9cc3ff]"
                                                        aria-hidden="true"
                                                    >
                                                        {checked && <LuCheck className="h-4 w-4" />}
                                                    </span>
                                                    <span className={cn('flex-1 text-sm sm:text-base', checked ? 'text-white' : 'text-white/75')}>
                                                        {req.label}
                                                    </span>
                                                    <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 sm:block">
                                                        I have this
                                                    </span>
                                                </label>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    )
}

export default BlueprintSheetCourseSyllabus
