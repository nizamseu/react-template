// AssignmentLedgerLearnerDashboard

// LearnerDashboard04 · Learning Management Systems › Interactive Dashboard

// Description:
// A scholarly, ruled-ledger view of a student's coursework for the fictional Scholarly Hub.
// Under the serif heading "Autumn term ledger" it lists seven assignments with course code,
// due date, a Due / Submitted / Graded status chip and a grade column, plus a term summary
// row. Filter tabs narrow the list, and due rows have an "Attach file" input that shows the
// chosen file name and a "Submit" button. Use it as the assignments page of a student portal.

// Design:
// - Beige #f6f1ea paper with navy #1d3557 ink; navy/15 hairline rules between rows and a
//   double rule under the header, like a printed ledger
// - Serif display heading and assignment titles, mono dates, course codes and grades;
//   chips: Due = dashed navy outline, Submitted = navy/10 tint, Graded = solid navy
// - Summary strip of four ruled figures (term average, due, submitted, graded); tabs are
//   underlined text with a sliding navy bar (layoutId) under the active one
// - Rows fade in when the filter changes; the sliding bar is instant for reduced motion
// - Responsive: a real <table> on md+; below md each row becomes a stacked card whose cells
//   show their column name via data-label (before:content-[attr(data-label)])

// What it does:
// - filter state (all / due / submitted / graded) filters the rows; counts in each tab and
//   in the summary are derived from the items state
// - Choosing a file stores its name per row (files state) and shows it; "Submit" without a
//   file shows an inline error, with a file it flips the row to Submitted on Sun 27 Sep
// - Graded rows link "Feedback" to #feedback-<id>; nothing is uploaded (no network calls)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AssignmentLedgerLearnerDashboard from '@/TestComponent/PageSections/learning/LearnerDashboard04';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <AssignmentLedgerLearnerDashboard />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiCheck, HiOutlinePaperClip } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const initialItems = [
    { id: 'his-essay', code: 'HIS 214', course: 'Medieval Europe', title: 'Essay: The Hanseatic League and early trade law', due: 'Tue 29 Sep', time: '23:59', status: 'due' },
    { id: 'sta-ps4', code: 'STA 120', course: 'Intro Statistics', title: 'Problem set 4: Confidence intervals', due: 'Thu 1 Oct', time: '17:00', status: 'due' },
    { id: 'phi-hume', code: 'PHI 101', course: 'Philosophy I', title: 'Response paper: Hume on causation', due: 'Thu 24 Sep', time: '12:00', status: 'submitted', file: 'hume-response-final.pdf' },
    { id: 'lit-close', code: 'LIT 230', course: 'Modernist Novel', title: 'Close reading: Mrs Dalloway, pp. 1–40', due: 'Fri 25 Sep', time: '09:00', status: 'submitted', file: 'dalloway-close-reading.docx' },
    { id: 'sta-ps3', code: 'STA 120', course: 'Intro Statistics', title: 'Problem set 3: Sampling distributions', due: 'Thu 17 Sep', time: '17:00', status: 'graded', grade: 'A−', score: 91 },
    { id: 'his-source', code: 'HIS 214', course: 'Medieval Europe', title: 'Source analysis: the Lübeck town charter', due: 'Mon 14 Sep', time: '23:59', status: 'graded', grade: 'B', score: 84 },
    { id: 'phi-quiz', code: 'PHI 101', course: 'Philosophy I', title: 'Quiz: Descartes’ first two Meditations', due: 'Fri 11 Sep', time: '10:00', status: 'graded', grade: 'A', score: 95 },
]

const filters = [
    { id: 'all', label: 'All' },
    { id: 'due', label: 'Due' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'graded', label: 'Graded' },
]

const chip = {
    due: 'border border-dashed border-[#1d3557] text-[#1d3557]',
    submitted: 'bg-[#1d3557]/10 text-[#1d3557]',
    graded: 'bg-[#1d3557] text-[#f6f1ea]',
}

const cell =
    'flex items-start justify-between gap-4 py-1.5 before:shrink-0 before:font-mono before:text-[10px] before:uppercase before:tracking-[0.16em] before:text-[#1d3557]/55 before:content-[attr(data-label)] md:table-cell md:py-4 md:align-middle md:before:content-none'

export function AssignmentLedgerLearnerDashboard({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduce = useReducedMotion()
    const [items, setItems] = useState(initialItems)
    const [filter, setFilter] = useState('all')
    const [files, setFiles] = useState({})
    const [errors, setErrors] = useState({})

    const count = (status) => (status === 'all' ? items.length : items.filter((i) => i.status === status).length)
    const graded = items.filter((i) => i.status === 'graded')
    const average = graded.length ? (graded.reduce((s, i) => s + i.score, 0) / graded.length).toFixed(1) : '—'
    const visible = filter === 'all' ? items : items.filter((i) => i.status === filter)

    const pickFile = (id, event) => {
        const file = event.target.files && event.target.files[0]
        setFiles((f) => ({ ...f, [id]: file ? file.name : undefined }))
        setErrors((e) => ({ ...e, [id]: undefined }))
    }

    const submit = (id) => {
        if (!files[id]) {
            setErrors((e) => ({ ...e, [id]: 'Attach a PDF or Word file first.' }))
            return
        }
        setItems((list) =>
            list.map((i) => (i.id === id ? { ...i, status: 'submitted', file: files[id], submittedOn: 'Sun 27 Sep' } : i)),
        )
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#f6f1ea] px-4 py-16 text-base font-normal text-[#1d3557] antialiased sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col gap-4 border-b-4 border-double border-[#1d3557] pb-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#1d3557]/70">
                            Scholarly Hub · Student no. 2026-0417 · Eleanor Vance
                        </p>
                        <h2 className="mt-3 font-serif text-4xl font-normal leading-none tracking-tight text-[#1d3557] sm:text-5xl lg:text-6xl">
                            Autumn term <em>ledger</em>
                        </h2>
                    </div>
                    <p className="font-mono text-xs text-[#1d3557]/70">Week 5 of 12 · updated Sun 27 Sep, 08:15</p>
                </div>

                <dl className="grid grid-cols-2 border-b border-[#1d3557]/20 md:grid-cols-4">
                    {[
                        ['Term average', `${average}%`],
                        ['Due', count('due')],
                        ['Submitted', count('submitted')],
                        ['Graded', count('graded')],
                    ].map(([k, v], i) => (
                        <div
                            key={k}
                            className={cn(
                                'py-5 pr-4',
                                i % 2 === 1 && 'border-l border-[#1d3557]/20 pl-4',
                                i === 2 && 'border-t border-[#1d3557]/20 md:border-t-0 md:border-l md:pl-4',
                                i === 3 && 'border-t border-[#1d3557]/20 md:border-t-0',
                            )}
                        >
                            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1d3557]/60">{k}</dt>
                            <dd className="mt-1 font-serif text-3xl tabular-nums text-[#1d3557] sm:text-4xl">{v}</dd>
                        </div>
                    ))}
                </dl>

                <div role="tablist" aria-label="Filter assignments" className="mt-8 flex gap-1 overflow-x-auto [scrollbar-width:none]">
                    {filters.map((f) => {
                        const selected = filter === f.id
                        return (
                            <button
                                key={f.id}
                                type="button"
                                role="tab"
                                aria-selected={selected}
                                aria-controls="ledger-table"
                                className={cn(
                                    'relative flex min-h-11 shrink-0 items-center gap-2 px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d3557]',
                                    selected ? 'font-semibold text-[#1d3557]' : 'text-[#1d3557]/60 hover:text-[#1d3557]',
                                )}
                                onClick={() => setFilter(f.id)}
                            >
                                {f.label}
                                <span className="font-mono text-xs tabular-nums opacity-70">{count(f.id)}</span>
                                {selected && (
                                    <motion.span
                                        layoutId="ledger-tab-bar"
                                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 32 }}
                                        className="absolute inset-x-2 bottom-0 h-0.5 bg-[#1d3557]"
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        )
                    })}
                </div>

                <div id="ledger-table" role="tabpanel" className="mt-2 border-t border-[#1d3557]">
                    <table className="w-full border-collapse text-left">
                        <caption className="sr-only">Assignments, filtered by: {filter}</caption>
                        <thead className="hidden border-b border-[#1d3557]/20 md:table-header-group">
                            <tr className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#1d3557]/60">
                                <th scope="col" className="py-3 pr-4 font-normal">Assignment</th>
                                <th scope="col" className="py-3 pr-4 font-normal">Due</th>
                                <th scope="col" className="py-3 pr-4 font-normal">Status</th>
                                <th scope="col" className="py-3 pr-4 font-normal">Grade</th>
                                <th scope="col" className="py-3 text-right font-normal">Hand-in</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {visible.map((item) => (
                                <motion.tr
                                    key={item.id}
                                    initial={reduce ? false : { opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="block border-b border-[#1d3557]/15 py-4 md:table-row md:py-0"
                                >
                                    <td className="block pb-2 md:table-cell md:py-4 md:pr-6 md:align-middle">
                                        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#1d3557]/60">
                                            {item.code} · {item.course}
                                        </p>
                                        <p className="mt-1 font-serif text-lg leading-snug text-[#1d3557]">{item.title}</p>
                                    </td>
                                    <td data-label="Due" className={cn(cell, 'md:pr-4')}>
                                        <span className="text-right font-mono text-sm tabular-nums md:text-left">
                                            {item.due}
                                            <span className="text-[#1d3557]/55"> · {item.time}</span>
                                        </span>
                                    </td>
                                    <td data-label="Status" className={cn(cell, 'md:pr-4')}>
                                        <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', chip[item.status])}>
                                            {item.status === 'graded' && <HiCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                                            {item.status === 'due' ? 'Due' : item.status === 'submitted' ? 'Submitted' : 'Graded'}
                                        </span>
                                    </td>
                                    <td data-label="Grade" className={cn(cell, 'md:pr-4')}>
                                        {item.status === 'graded' ? (
                                            <span className="font-mono text-sm tabular-nums">
                                                <span className="font-serif text-xl">{item.grade}</span> {item.score}/100
                                            </span>
                                        ) : (
                                            <span className="font-mono text-sm text-[#1d3557]/40">
                                                <span aria-hidden="true">—</span>
                                                <span className="sr-only">Not graded yet</span>
                                            </span>
                                        )}
                                    </td>
                                    <td data-label="Hand-in" className={cn(cell, 'md:text-right')}>
                                        {item.status === 'due' && (
                                            <div className="flex min-w-0 flex-col items-end gap-2">
                                                <div className="flex flex-wrap items-center justify-end gap-2">
                                                    <label
                                                        htmlFor={`file-${item.id}`}
                                                        className="inline-flex min-h-10 max-w-[12rem] cursor-pointer items-center gap-1.5 rounded-lg border border-[#1d3557]/30 bg-white/60 px-3 text-sm text-[#1d3557] transition-colors hover:border-[#1d3557] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#1d3557]"
                                                    >
                                                        <HiOutlinePaperClip className="h-4 w-4 shrink-0" aria-hidden="true" />
                                                        <span className="truncate">{files[item.id] || 'Attach file'}</span>
                                                        <input
                                                            id={`file-${item.id}`}
                                                            type="file"
                                                            accept=".pdf,.doc,.docx"
                                                            className="sr-only"
                                                            aria-describedby={errors[item.id] ? `err-${item.id}` : undefined}
                                                            aria-label={`Attach file for ${item.title}`}
                                                            onChange={(e) => pickFile(item.id, e)}
                                                        />
                                                    </label>
                                                    <button
                                                        type="button"
                                                        className="inline-flex min-h-10 items-center rounded-lg bg-[#1d3557] px-4 text-sm font-semibold text-[#f6f1ea] transition-colors hover:bg-[#274a78] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d3557]"
                                                        onClick={() => submit(item.id)}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                                {errors[item.id] && (
                                                    <p id={`err-${item.id}`} role="alert" className="text-xs italic text-[#9b2c2c]">
                                                        {errors[item.id]}
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                        {item.status === 'submitted' && (
                                            <span className="inline-flex min-w-0 max-w-[14rem] items-center gap-1.5 font-mono text-xs text-[#1d3557]/70 md:justify-end">
                                                <HiCheck className="h-4 w-4 shrink-0 text-[#1d3557]" aria-hidden="true" />
                                                <span className="truncate">{item.file}</span>
                                                {item.submittedOn && <span className="sr-only">, submitted {item.submittedOn}</span>}
                                            </span>
                                        )}
                                        {item.status === 'graded' && (
                                            <a
                                                href={`#feedback-${item.id}`}
                                                className="inline-flex min-h-10 items-center gap-1 text-sm font-semibold underline decoration-[#1d3557]/30 underline-offset-4 hover:decoration-[#1d3557] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d3557]"
                                            >
                                                Feedback
                                                <HiArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                            </a>
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {visible.length === 0 && (
                        <p className="border-b border-[#1d3557]/15 py-10 text-center font-serif text-xl italic text-[#1d3557]/70">
                            Nothing here. Enjoy the quiet week.
                        </p>
                    )}
                </div>
                <p className="mt-4 font-mono text-[11px] text-[#1d3557]/55">
                    Files are checked for plagiarism on hand-in. Late work loses 5% per day unless an extension is approved.
                </p>
            </div>
        </section>
    )
}

export default AssignmentLedgerLearnerDashboard
