// NeonTerminalCourseCatalog

// CourseCatalog04 · Learning Management Systems › Course Catalog

// Description:
// A command-line course catalogue for the fictional ByteForge Bootcamp. Under the heading
// "Compile your next career." a terminal window offers command chips such as
// `ls --level=beginner` or `ls --track=backend`; picking one types the command at the
// prompt and prints the matching bootcamp tracks with level, weeks, next start date, price,
// ASCII skill meters and an `./enrol` link. Use it for developer-focused schools and tech
// academies whose audience enjoys a terminal aesthetic.

// Design:
// - Near-black #07090c section with faint CRT scanlines; phosphor green #39ff88 text and
//   hairline borders, amber #ffb000 for levels, prices, the active chip and the cursor
// - Everything is font-mono: heading text-4xl → md:text-6xl, rows text-sm, meters text-xs
//   with whitespace-pre so the ASCII bars `[########--]` line up
// - Terminal window: rounded-lg border, title bar with three status dots and
//   "guest@byteforge: ~/catalog", chip row, prompt, results and an amber status bar
// - Results: bordered rows that fade/slide in with a 50ms stagger (plain fade for reduced
//   motion); rows stack on mobile and split into info + meters columns on lg
// - Chips wrap onto several lines at 360px; the blinking block cursor is static when reduced
//   motion is on

// What it does:
// - active (chip) and shown (executed command) state: clicking a chip types the command
//   into the prompt at 28ms per character (interval kept in a ref, cleared on re-click and
//   unmount), then filters the list; reduced motion runs it instantly
// - Chips are buttons with aria-pressed; the results list is an aria-live region that also
//   prints "total N" and the result count
// - Each `./enrol` link points to #enrol-<slug>; "Book a campus tour" to #byteforge-tour

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NeonTerminalCourseCatalog from '@/TestComponent/PageSections/learning/CourseCatalog04';

// const CoursesPage = () => (
//     <main className="space-y-6">
//         <NeonTerminalCourseCatalog />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LuArrowUpRight, LuTerminal } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const commands = [
    { id: 'all', cmd: 'ls --all', test: () => true },
    { id: 'beginner', cmd: 'ls --level=beginner', test: (c) => c.level === 'beginner' },
    { id: 'intermediate', cmd: 'ls --level=intermediate', test: (c) => c.level === 'intermediate' },
    { id: 'advanced', cmd: 'ls --level=advanced', test: (c) => c.level === 'advanced' },
    { id: 'frontend', cmd: 'ls --track=frontend', test: (c) => c.track === 'frontend' },
    { id: 'backend', cmd: 'ls --track=backend', test: (c) => c.track === 'backend' },
]

const courses = [
    { slug: 'web-foundations', title: 'Web Foundations', level: 'beginner', track: 'frontend', weeks: 10, next: '2026-10-12', price: '$3,400', skills: [['html', 90], ['css', 80], ['javascript', 50]] },
    { slug: 'python-automation', title: 'Python for Automation', level: 'beginner', track: 'backend', weeks: 8, next: '2026-10-19', price: '$2,900', skills: [['python', 70], ['cli', 60], ['rest-apis', 40]] },
    { slug: 'react-in-production', title: 'React in Production', level: 'intermediate', track: 'frontend', weeks: 12, next: '2026-11-02', price: '$6,900', skills: [['react', 90], ['testing', 70], ['perf', 60]] },
    { slug: 'node-api-design', title: 'Node API Design', level: 'intermediate', track: 'backend', weeks: 10, next: '2026-10-26', price: '$5,800', skills: [['node', 80], ['sql', 60], ['auth', 70]] },
    { slug: 'typescript-deep-dive', title: 'TypeScript Deep Dive', level: 'intermediate', track: 'frontend', weeks: 6, next: '2026-11-09', price: '$3,600', skills: [['types', 90], ['generics', 80], ['tooling', 50]] },
    { slug: 'systems-with-go', title: 'Systems with Go', level: 'advanced', track: 'backend', weeks: 12, next: '2026-11-16', price: '$7,400', skills: [['go', 90], ['concurrency', 80], ['grpc', 60]] },
    { slug: 'rust-from-scratch', title: 'Rust from Scratch', level: 'advanced', track: 'backend', weeks: 12, next: '2027-01-11', price: '$7,900', skills: [['rust', 90], ['memory', 80], ['wasm', 40]] },
    { slug: 'frontend-architecture', title: 'Frontend Architecture', level: 'advanced', track: 'frontend', weeks: 8, next: '2026-12-07', price: '$6,200', skills: [['monorepos', 80], ['perf', 90], ['a11y', 70]] },
]

const meter = (value) => {
    const filled = Math.round(value / 10)
    return `[${'#'.repeat(filled)}${'-'.repeat(10 - filled)}]`
}

export function NeonTerminalCourseCatalog({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [active, setActive] = useState('all')
    const [shown, setShown] = useState('all')
    const [typed, setTyped] = useState(commands[0].cmd)
    const typingRef = useRef(null)

    useEffect(() => () => clearInterval(typingRef.current), [])

    const run = (command) => {
        clearInterval(typingRef.current)
        setActive(command.id)
        if (reduceMotion) {
            setTyped(command.cmd)
            setShown(command.id)
            return
        }
        let index = 0
        setTyped('')
        typingRef.current = setInterval(() => {
            index += 1
            setTyped(command.cmd.slice(0, index))
            if (index >= command.cmd.length) {
                clearInterval(typingRef.current)
                setShown(command.id)
            }
        }, 28)
    }

    const executed = commands.find((c) => c.id === shown)
    const results = courses.filter(executed.test)
    const busy = active !== shown

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-[#07090c] px-4 py-16 font-mono text-base font-normal text-[#39ff88] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(57,255,136,0.035)_0,rgba(57,255,136,0.035)_1px,transparent_1px,transparent_3px)]"
                aria-hidden="true"
            />
            <div
                className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-[#39ff88]/10 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative mx-auto max-w-6xl">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
                    <div className="lg:col-span-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#39ff88]/60">
                            {'// ByteForge Bootcamp · catalog v4.2'}
                        </p>
                        <h2 className="mt-4 font-mono text-4xl font-bold leading-[1.05] tracking-tight text-[#39ff88] [text-shadow:0_0_24px_rgba(57,255,136,0.35)] sm:text-5xl md:text-6xl">
                            Compile your next career<span className="text-[#ffb000]">_</span>
                        </h2>
                    </div>
                    <div className="lg:col-span-4">
                        <p className="text-sm leading-relaxed text-[#39ff88]/70">
                            Full-time and part-time tracks, 1 mentor per 8 learners, and a 91%
                            job placement rate for the 2025 cohorts.
                        </p>
                        <a
                            href="#byteforge-tour"
                            className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#ffb000] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb000]"
                        >
                            Book a campus tour
                            <LuArrowUpRight className="h-4 w-4" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                <div className="mt-10 overflow-hidden rounded-lg border border-[#39ff88]/30 bg-[#0b0f14] shadow-[0_0_0_1px_rgba(57,255,136,0.05),0_30px_80px_-30px_rgba(57,255,136,0.25)] md:mt-14">
                    <div className="flex items-center gap-3 border-b border-[#39ff88]/20 px-4 py-3">
                        <span className="flex gap-1.5" aria-hidden="true">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ffb000]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#39ff88]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#39ff88]/25" />
                        </span>
                        <span className="flex min-w-0 items-center gap-2 truncate text-xs text-[#39ff88]/70">
                            <LuTerminal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            guest@byteforge: ~/catalog
                        </span>
                        <span className="ml-auto hidden text-xs text-[#39ff88]/40 sm:block">zsh · 120×32</span>
                    </div>

                    <div className="border-b border-[#39ff88]/15 px-4 py-4 sm:px-6">
                        <p className="text-xs text-[#39ff88]/50"># quick commands — pick one to run it</p>
                        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter commands">
                            {commands.map((command) => {
                                const on = command.id === active
                                return (
                                    <button
                                        key={command.id}
                                        type="button"
                                        aria-pressed={on}
                                        className={cn(
                                            'min-h-10 rounded-[4px] border px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000] sm:text-sm',
                                            on
                                                ? 'border-[#ffb000] bg-[#ffb000]/10 text-[#ffb000]'
                                                : 'border-[#39ff88]/25 text-[#39ff88]/80 hover:border-[#39ff88]/70 hover:text-[#39ff88]',
                                        )}
                                        onClick={() => run(command)}
                                    >
                                        <span className="text-[#39ff88]/40">$ </span>
                                        {command.cmd}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="px-4 py-5 text-sm sm:px-6">
                        <p className="break-all">
                            <span className="text-[#ffb000]">guest@byteforge</span>
                            <span className="text-[#39ff88]/50">:~/catalog$ </span>
                            <span className="text-[#e6ffef]">{typed}</span>
                            <motion.span
                                className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-[#ffb000]"
                                animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
                                transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: 'linear' }}
                                aria-hidden="true"
                            />
                        </p>

                        <div aria-live="polite" aria-busy={busy} className="mt-4">
                            {busy ? (
                                <p className="text-[#39ff88]/50">running…</p>
                            ) : (
                                <>
                                    <p className="text-[#39ff88]/60">
                                        total {results.length} · {executed.cmd}
                                    </p>
                                    <ul className="mt-3 space-y-2">
                                        <AnimatePresence initial={false}>
                                            {results.map((course, index) => (
                                                <motion.li
                                                    key={`${shown}-${course.slug}`}
                                                    initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ duration: 0.25, delay: reduceMotion ? 0 : index * 0.05 }}
                                                    className="grid gap-4 rounded-[4px] border border-[#39ff88]/20 bg-[#39ff88]/[0.02] p-4 transition-colors hover:border-[#39ff88]/60 lg:grid-cols-12 lg:items-center"
                                                >
                                                    <div className="min-w-0 lg:col-span-7">
                                                        <p className="truncate text-xs text-[#39ff88]/45">
                                                            drwxr-xr-x <span className="text-[#39ff88]/80">{course.slug}/</span>
                                                        </p>
                                                        <h3 className="mt-1 font-mono text-lg font-bold text-[#e6ffef] sm:text-xl">
                                                            {course.title}
                                                        </h3>
                                                        <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#39ff88]/70">
                                                            <span>
                                                                level=<span className="text-[#ffb000]">{course.level}</span>
                                                            </span>
                                                            <span>weeks={course.weeks}</span>
                                                            <span>next={course.next}</span>
                                                            <span>
                                                                price=<span className="text-[#ffb000]">{course.price}</span>
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:col-span-5">
                                                        <p className="sr-only">
                                                            Skills: {course.skills.map(([s, v]) => `${s} ${v}%`).join(', ')}
                                                        </p>
                                                        <pre className="font-mono text-xs leading-5 text-[#39ff88]/85" aria-hidden="true">
                                                            {course.skills.map(([skill, value]) => `${skill.padEnd(11)} ${meter(value)} ${value}%`).join('\n')}
                                                        </pre>
                                                        <a
                                                            href={`#enrol-${course.slug}`}
                                                            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 self-start rounded-[4px] border border-[#ffb000]/60 px-3 text-xs text-[#ffb000] transition-colors hover:bg-[#ffb000] hover:text-[#07090c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000] sm:self-auto"
                                                        >
                                                            ./enrol
                                                            <span className="sr-only"> in {course.title}</span>
                                                        </a>
                                                    </div>
                                                </motion.li>
                                            ))}
                                        </AnimatePresence>
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 bg-[#ffb000] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#07090c]">
                        <span>-- {busy ? 'running' : 'normal'} --</span>
                        <span>catalog.json · {courses.length} tracks · utf-8</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NeonTerminalCourseCatalog
