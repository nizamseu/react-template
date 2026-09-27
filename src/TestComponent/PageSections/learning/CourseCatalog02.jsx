// SwissIndexCourseCatalog

// CourseCatalog02 · Learning Management Systems › Course Catalog

// Description:
// A strict, Swiss-style course index for the fictional Grid & Grain School of Design. A
// giant "Index" headline and a meta strip (Autumn Term 2026, 12 courses, Zurich / Online)
// sit above a typographic table of twelve courses — No. / Course / Level / Weeks / Price —
// that can be sorted by any column. Use it as the full course list of a design school or
// any catalogue where people compare courses on a few hard facts.

// Design:
// - Pure white #ffffff, black #0a0a0a type and 1px black rules; signal red #ff3b1f only for
//   the dot, sort arrows, row numbers on hover and focus outlines
// - Sans type throughout: headline text-7xl → md:text-9xl → lg:text-[11rem] with -0.06em
//   tracking; column labels in tiny uppercase; numbers tabular; no radius, no shadows
// - md+: a real <table> on a 12-column rhythm; hovering or focusing a row turns its number
//   red, slides in an arrow and reveals a 112×80 thumbnail beside the course name
// - Below md the header row is hidden and each row becomes a stacked entry (No. + title, then
//   Level · Weeks · Price); a row of sort buttons replaces the column headers
// - Rows re-order with framer-motion layout animation (disabled for reduced motion)

// What it does:
// - sort state { key, dir } — clicking a header (or a mobile sort button) sorts by that
//   column, clicking again flips the direction; <th> carries aria-sort and buttons
//   aria-pressed on mobile
// - Levels sort in teaching order (Foundation → Intermediate → Advanced), not alphabetically
// - Course names link to #course-<slug>; "Download the prospectus" links to
//   #grid-grain-prospectus; thumbnails are decorative (empty alt)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SwissIndexCourseCatalog from '@/TestComponent/PageSections/learning/CourseCatalog02';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <SwissIndexCourseCatalog />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowDown, HiArrowRight, HiArrowUp, HiArrowsUpDown } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`

const levelOrder = { Foundation: 1, Intermediate: 2, Advanced: 3 }

const courses = [
    { no: 1, slug: 'typography-i', title: 'Typography I: Letterform & Rhythm', level: 'Foundation', weeks: 8, price: 640, image: img('photo-1516962215378-7fa2e137ae93') },
    { no: 2, slug: 'grid-systems', title: 'Grid Systems', level: 'Foundation', weeks: 6, price: 520, image: img('photo-1543286386-713bdd548da4') },
    { no: 3, slug: 'colour-theory', title: 'Colour Theory & Contrast', level: 'Foundation', weeks: 4, price: 380, image: img('photo-1579546929518-9e396f3cc809') },
    { no: 4, slug: 'digital-illustration', title: 'Digital Illustration', level: 'Foundation', weeks: 6, price: 560, image: img('photo-1558655146-9f40138edfeb') },
    { no: 5, slug: 'editorial-design', title: 'Editorial Design & the Magazine', level: 'Intermediate', weeks: 10, price: 860, image: img('photo-1504711434969-e33886168f5c') },
    { no: 6, slug: 'photography-for-designers', title: 'Photography for Designers', level: 'Intermediate', weeks: 6, price: 590, image: img('photo-1516035069371-29a1b244cc32') },
    { no: 7, slug: 'typewriter-studio', title: 'Analogue Type: Typewriter Studio', level: 'Intermediate', weeks: 5, price: 610, image: img('photo-1585829365295-ab7cd400c167') },
    { no: 8, slug: 'bookmaking', title: 'Bookmaking & Binding', level: 'Intermediate', weeks: 6, price: 540, image: img('photo-1497633762265-9d179a990aa6') },
    { no: 9, slug: 'type-design', title: 'Type Design: Drawing a Typeface', level: 'Advanced', weeks: 12, price: 1180, image: img('photo-1455390582262-044cdead277a') },
    { no: 10, slug: 'brand-identity', title: 'Brand Identity Systems', level: 'Advanced', weeks: 10, price: 980, image: img('photo-1552664730-d307ca884978') },
    { no: 11, slug: 'wayfinding', title: 'Wayfinding & Signage', level: 'Advanced', weeks: 8, price: 940, image: img('photo-1493397212122-2b85dda8106b') },
    { no: 12, slug: 'motion-grids', title: 'Motion on the Grid', level: 'Advanced', weeks: 6, price: 720, image: img('photo-1557683316-973673baf926') },
]

const columns = [
    { key: 'no', label: 'No.', className: 'w-[9%]' },
    { key: 'title', label: 'Course', className: 'w-[49%]' },
    { key: 'level', label: 'Level', className: 'w-[16%]' },
    { key: 'weeks', label: 'Weeks', className: 'w-[11%] text-right' },
    { key: 'price', label: 'Price', className: 'w-[15%] text-right' },
]

const compare = (a, b, key) => {
    if (key === 'title') return a.title.localeCompare(b.title)
    if (key === 'level') return levelOrder[a.level] - levelOrder[b.level] || a.no - b.no
    return a[key] - b[key]
}

const pad = (n) => String(n).padStart(2, '0')

const euro = (n) => `€${n.toLocaleString('en-US')}`

export function SwissIndexCourseCatalog({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [sort, setSort] = useState({ key: 'no', dir: 'asc' })

    const sorted = [...courses].sort((a, b) => {
        const result = compare(a, b, sort.key)
        return sort.dir === 'asc' ? result : -result
    })

    const toggleSort = (key) => {
        setSort((prev) => (prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
    }

    const sortIcon = (columnKey) => {
        if (sort.key !== columnKey) return <HiArrowsUpDown className="h-3.5 w-3.5 text-[#0a0a0a]/35" aria-hidden="true" />
        if (sort.dir === 'asc') return <HiArrowUp className="h-3.5 w-3.5 text-[#ff3b1f]" aria-hidden="true" />
        return <HiArrowDown className="h-3.5 w-3.5 text-[#ff3b1f]" aria-hidden="true" />
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 font-sans text-base font-normal text-[#0a0a0a] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t-2 border-[#0a0a0a] pt-4 text-xs uppercase tracking-[0.14em] md:grid-cols-12">
                    <p className="font-semibold md:col-span-4">Grid &amp; Grain School of Design</p>
                    <p className="text-[#0a0a0a]/60 md:col-span-3">Autumn Term 2026</p>
                    <p className="text-[#0a0a0a]/60 md:col-span-3">12 courses · Zurich / Online</p>
                    <p className="text-[#0a0a0a]/60 md:col-span-2 md:text-right">Enrolment open</p>
                </div>

                <div className="mt-8 grid gap-8 md:mt-10 md:grid-cols-12 md:items-end">
                    <h2 className="flex items-start text-7xl font-bold leading-[0.82] tracking-[-0.06em] text-[#0a0a0a] sm:text-8xl md:col-span-8 md:text-9xl lg:text-[11rem]">
                        Index
                        <span
                            className="ml-2 mt-2 inline-block h-4 w-4 shrink-0 rounded-full bg-[#ff3b1f] sm:h-5 sm:w-5 md:h-7 md:w-7"
                            aria-hidden="true"
                        />
                    </h2>
                    <div className="md:col-span-4">
                        <p className="max-w-sm text-base leading-snug text-[#0a0a0a]">
                            Twelve courses in type, image and system. Taught in small studios of
                            fourteen, critiqued every Friday.
                        </p>
                        <a
                            href="#grid-grain-prospectus"
                            className="group mt-5 inline-flex min-h-10 items-center gap-3 border-b border-[#0a0a0a] pb-1 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b1f]"
                        >
                            Download the prospectus
                            <HiArrowRight
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                aria-hidden="true"
                            />
                        </a>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-[#0a0a0a] pt-4 md:hidden" role="group" aria-label="Sort courses">
                    <span className="mr-1 text-[11px] uppercase tracking-[0.14em] text-[#0a0a0a]/60">Sort</span>
                    {columns.map((column) => {
                        const active = sort.key === column.key
                        return (
                            <button
                                key={column.key}
                                type="button"
                                aria-pressed={active}
                                className={cn(
                                    'inline-flex min-h-10 items-center gap-1.5 border px-3 text-xs font-semibold uppercase tracking-[0.1em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3b1f]',
                                    active ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white' : 'border-[#0a0a0a]/25 text-[#0a0a0a]',
                                )}
                                onClick={() => toggleSort(column.key)}
                            >
                                {column.label}
                                {active && (sort.dir === 'asc' ? <HiArrowUp className="h-3 w-3 text-[#ff3b1f]" aria-hidden="true" /> : <HiArrowDown className="h-3 w-3 text-[#ff3b1f]" aria-hidden="true" />)}
                                {active && <span className="sr-only">{sort.dir === 'asc' ? ', ascending' : ', descending'}</span>}
                            </button>
                        )
                    })}
                </div>

                <table className="mt-6 block w-full border-collapse text-left md:mt-16 md:table md:table-fixed">
                    <caption className="sr-only">
                        Grid &amp; Grain courses, sorted by {columns.find((c) => c.key === sort.key).label}{' '}
                        {sort.dir === 'asc' ? 'ascending' : 'descending'}
                    </caption>
                    <thead className="hidden md:table-header-group">
                        <tr className="border-b-2 border-[#0a0a0a]">
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    scope="col"
                                    aria-sort={sort.key === column.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                                    className={cn('pb-3 font-normal', column.className)}
                                >
                                    <button
                                        type="button"
                                        className={cn(
                                            'inline-flex min-h-10 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0a0a0a] hover:text-[#ff3b1f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff3b1f]',
                                            column.key === 'weeks' || column.key === 'price' ? 'flex-row-reverse' : '',
                                        )}
                                        onClick={() => toggleSort(column.key)}
                                    >
                                        {column.label}
                                        {sortIcon(column.key)}
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="block border-t border-[#0a0a0a] md:table-row-group md:border-t-0">
                        {sorted.map((course) => (
                            <motion.tr
                                key={course.slug}
                                layout={reduceMotion ? false : 'position'}
                                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                className="group grid grid-cols-[3rem_1fr] gap-x-3 border-b border-[#0a0a0a]/20 py-4 transition-colors hover:bg-[#f5f5f3] focus-within:bg-[#f5f5f3] md:table-row md:py-0"
                            >
                                <td className="row-span-2 block align-top font-mono text-2xl font-bold tabular-nums leading-none text-[#0a0a0a] transition-colors group-hover:text-[#ff3b1f] group-focus-within:text-[#ff3b1f] md:table-cell md:py-5 md:text-lg md:font-semibold">
                                    {pad(course.no)}
                                </td>
                                <td className="block align-middle md:table-cell md:py-5">
                                    <div className="relative flex items-center gap-3 md:pr-32">
                                        <a
                                            href={`#course-${course.slug}`}
                                            className="text-lg font-semibold leading-tight tracking-tight text-[#0a0a0a] hover:underline hover:decoration-[#ff3b1f] hover:decoration-2 hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b1f] md:text-xl"
                                        >
                                            {course.title}
                                        </a>
                                        <HiArrowRight
                                            className="hidden h-4 w-4 shrink-0 -translate-x-2 text-[#ff3b1f] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 md:block"
                                            aria-hidden="true"
                                        />
                                        <img
                                            src={course.image}
                                            alt=""
                                            loading="lazy"
                                            className="pointer-events-none absolute right-2 top-1/2 hidden aspect-[7/5] w-28 -translate-y-1/2 scale-90 object-cover opacity-0 grayscale transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 group-hover:grayscale-0 group-focus-within:scale-100 group-focus-within:opacity-100 group-focus-within:grayscale-0 md:block"
                                        />
                                    </div>
                                </td>
                                <td className="col-start-2 mt-2 block text-sm text-[#0a0a0a]/70 md:mt-0 md:table-cell md:py-5 md:align-middle md:text-base md:text-[#0a0a0a]">
                                    <span className="md:hidden">Level </span>
                                    {course.level}
                                    <span className="md:hidden">
                                        {' · '}
                                        {course.weeks} weeks
                                        {' · '}
                                        <span className="font-semibold text-[#0a0a0a]">{euro(course.price)}</span>
                                    </span>
                                </td>
                                <td className="hidden text-right font-mono tabular-nums md:table-cell md:py-5 md:align-middle">
                                    {course.weeks}
                                </td>
                                <td className="hidden text-right font-mono font-semibold tabular-nums md:table-cell md:py-5 md:align-middle">
                                    {euro(course.price)}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>

                <p className="mt-6 text-xs uppercase tracking-[0.14em] text-[#0a0a0a]/55">
                    Prices per course incl. VAT · Studio materials and print costs included
                </p>
            </div>
        </section>
    )
}

export default SwissIndexCourseCatalog
