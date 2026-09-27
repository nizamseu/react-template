// ConnectToggleIntegrationsGrid

// IntegrationsGrid04 · SaaS Platforms › Integrations Grid

// Description:
// A playful settings-style integrations grid for the fictional team workspace Stackmate.
// Under "Plug Stackmate into the stack you already have." twelve pastel cards for fictional
// apps (Calendra, Chatwise, Codebase Hub, Pagecraft, Framewell, Tracklane and more) each
// carry a Connect / Connected switch, and a live counter reads "3 of 12 connected" above
// a 12-segment progress strip. Use it on onboarding, settings or product pages to show and
// try out integrations.

// Design:
// - Warm off-white #fffdf7 section, stone ink #1c1917 and #57534e text; cards rotate
//   through pastel blocks #e0f2fe, #fef3c7, #fce7f3 and #dcfce7 with rounded-[26px] corners
// - Each card: an icon disc in the app's colour with a white generic (lucide) icon, bold
//   name, category, one-line benefit and a pill switch; connected cards gain a 2px ink ring
//   and a check badge on the disc
// - Switch: 52×30 track (stone-300 → ink) with a white knob that springs across via layout
//   animation; "Connecting…" shows a spinning ring in the knob for 0.7 s
// - Counter card: white, 2px ink border, hard 6px ink drop; big tabular "3 of 12" and 12
//   segments tinted with each card's pastel that fill with ink as apps connect
// - Responsive: header stacks on mobile, splits on lg; grid 1 → sm:2 → lg:3 → xl:4 columns

// What it does:
// - connected state (a list of ids; Calendra, Chatwise and Codebase Hub by default) and a
//   pending list drive every card; switches are buttons with aria-pressed and a fixed
//   "Connect <app>" label
// - Connecting waits 0.7 s (timeout kept in a ref map, cleared on unmount); disconnecting is
//   instant; clicks during "Connecting…" are ignored
// - The counter is aria-live="polite"; "Manage in settings" links to #stackmate-settings;
//   "Disconnect all" empties the list

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ConnectToggleIntegrationsGrid from '@/TestComponent/PageSections/saas/IntegrationsGrid04';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <ConnectToggleIntegrationsGrid />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiArrowRight, HiCheck } from 'react-icons/hi2';
import {
    LuCalendarClock,
    LuCalendarDays,
    LuClipboardList,
    LuFileText,
    LuFolder,
    LuGitBranch,
    LuListTodo,
    LuMessagesSquare,
    LuPenTool,
    LuShapes,
    LuSquareKanban,
    LuVideo,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const pastels = ['bg-[#e0f2fe]', 'bg-[#fef3c7]', 'bg-[#fce7f3]', 'bg-[#dcfce7]']

const apps = [
    { id: 'calendra', name: 'Calendra', icon: LuCalendarDays, color: '#2563eb', kind: 'Calendar', blurb: 'Block focus time around every meeting.' },
    { id: 'chatwise', name: 'Chatwise', icon: LuMessagesSquare, color: '#6366f1', kind: 'Chat', blurb: 'Turn any message into a Stackmate task.' },
    { id: 'pagecraft', name: 'Pagecraft', icon: LuFileText, color: '#1c1917', kind: 'Docs', blurb: 'Link specs to the work that ships them.' },
    { id: 'framewell', name: 'Framewell', icon: LuPenTool, color: '#e11d48', kind: 'Design', blurb: 'Preview frames right inside a task.' },
    { id: 'codebase-hub', name: 'Codebase Hub', icon: LuGitBranch, color: '#44403c', kind: 'Code', blurb: 'Close tasks when the pull request merges.' },
    { id: 'tracklane', name: 'Tracklane', icon: LuListTodo, color: '#7c3aed', kind: 'Issues', blurb: 'Mirror issues both ways, statuses included.' },
    { id: 'huddlo', name: 'Huddlo', icon: LuVideo, color: '#0284c7', kind: 'Meetings', blurb: 'Drop recordings and notes on the agenda.' },
    { id: 'boxvault', name: 'Boxvault', icon: LuFolder, color: '#ca8a04', kind: 'Files', blurb: 'Attach files without downloading them.' },
    { id: 'taskpond', name: 'Taskpond', icon: LuSquareKanban, color: '#0d9488', kind: 'Boards', blurb: 'Import boards in one click, labels intact.' },
    { id: 'roadnest', name: 'Roadnest', icon: LuClipboardList, color: '#ea580c', kind: 'Projects', blurb: 'Sync projects while your team migrates.' },
    { id: 'bookslot', name: 'Bookslot', icon: LuCalendarClock, color: '#0891b2', kind: 'Scheduling', blurb: 'Create a prep task for every booking.' },
    { id: 'whiteloop', name: 'Whiteloop', icon: LuShapes, color: '#9333ea', kind: 'Whiteboard', blurb: 'Pin boards to the sprint they belong to.' },
]

const CONNECT_MS = 700

export function ConnectToggleIntegrationsGrid({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [connected, setConnected] = useState(['calendra', 'chatwise', 'codebase-hub'])
    const [pending, setPending] = useState([])
    const timers = useRef(new Map())
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        const map = timers.current
        return () => {
            map.forEach((id) => clearTimeout(id))
            map.clear()
        }
    }, [])

    const toggle = (id) => {
        if (pending.includes(id)) return
        if (connected.includes(id)) {
            setConnected((prev) => prev.filter((c) => c !== id))
            return
        }
        setPending((prev) => [...prev, id])
        const timer = setTimeout(() => {
            timers.current.delete(id)
            setPending((prev) => prev.filter((p) => p !== id))
            setConnected((prev) => (prev.includes(id) ? prev : [...prev, id]))
        }, CONNECT_MS)
        timers.current.set(id, timer)
    }

    const disconnectAll = () => {
        timers.current.forEach((t) => clearTimeout(t))
        timers.current.clear()
        setPending([])
        setConnected([])
    }

    const count = connected.length

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#fffdf7] px-4 py-16 text-base font-normal text-[#1c1917] sm:px-6 md:py-24 lg:px-8', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#57534e]">
                            <span className="flex gap-1" aria-hidden="true">
                                <span className="size-2.5 rounded-full bg-[#7dd3fc]" />
                                <span className="size-2.5 rounded-full bg-[#fcd34d]" />
                                <span className="size-2.5 rounded-full bg-[#f9a8d4]" />
                                <span className="size-2.5 rounded-full bg-[#86efac]" />
                            </span>
                            Stackmate integrations
                        </p>
                        <h2 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight text-[#1c1917] sm:text-5xl lg:text-6xl">
                            Plug Stackmate into the stack you already have.
                        </h2>
                        <p className="mt-5 max-w-lg text-base leading-relaxed text-[#57534e]">
                            Flip a switch and your tools start talking. No API keys, no admin ticket, and you can undo
                            it just as fast.
                        </p>
                    </div>

                    <div className="w-full rounded-[26px] border-2 border-[#1c1917] bg-white p-5 shadow-[0_6px_0_#1c1917] sm:max-w-sm">
                        <div className="flex items-end justify-between gap-4">
                            <p aria-live="polite" className="leading-none">
                                <span className="text-5xl font-extrabold tracking-tight tabular-nums text-[#1c1917]">{count}</span>
                                <span className="ml-2 text-lg font-semibold text-[#57534e]">of {apps.length} connected</span>
                            </p>
                            <button
                                type="button"
                                disabled={count === 0 && pending.length === 0}
                                className="min-h-10 shrink-0 rounded-full px-3 text-xs font-semibold text-[#57534e] underline underline-offset-4 hover:text-[#1c1917] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1917] disabled:no-underline disabled:opacity-40"
                                onClick={disconnectAll}
                            >
                                Disconnect all
                            </button>
                        </div>
                        <div aria-hidden="true" className="mt-4 grid grid-cols-12 gap-1">
                            {apps.map((app, i) => (
                                <span
                                    key={app.id}
                                    className={cn(
                                        'h-3 rounded-full transition-colors duration-500',
                                        connected.includes(app.id) ? 'bg-[#1c1917]' : pastels[i % pastels.length],
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {apps.map((app, i) => {
                        const Icon = app.icon
                        const isOn = connected.includes(app.id)
                        const isPending = pending.includes(app.id)
                        return (
                            <li
                                key={app.id}
                                className={cn(
                                    'flex flex-col rounded-[26px] p-5 transition-shadow duration-300',
                                    pastels[i % pastels.length],
                                    isOn ? 'shadow-[inset_0_0_0_2px_#1c1917]' : 'shadow-[inset_0_0_0_2px_transparent]',
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span
                                        className="relative grid size-14 place-items-center rounded-full text-white shadow-[0_6px_16px_-10px_rgba(28,25,23,0.6)]"
                                        style={{ backgroundColor: app.color }}
                                    >
                                        <Icon aria-hidden="true" className="size-7" />
                                        {isOn && (
                                            <motion.span
                                                initial={{ scale: reduceMotion ? 1 : 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                                                className="absolute -bottom-0.5 -right-0.5 grid size-5 place-items-center rounded-full border-2 border-white bg-[#1c1917] text-white"
                                            >
                                                <HiCheck aria-hidden="true" className="size-3" />
                                            </motion.span>
                                        )}
                                    </span>
                                    <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-[#57534e]">
                                        {app.kind}
                                    </span>
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-[#1c1917]">{app.name}</h3>
                                <p className="mt-1 flex-1 text-sm leading-relaxed text-[#57534e]">{app.blurb}</p>

                                <div className="mt-6 flex items-center justify-between gap-3">
                                    <span
                                        className={cn(
                                            'text-sm font-semibold',
                                            isOn ? 'text-[#1c1917]' : 'text-[#57534e]',
                                        )}
                                    >
                                        {isPending ? 'Connecting…' : isOn ? 'Connected' : 'Connect'}
                                    </span>
                                    <button
                                        type="button"
                                        aria-pressed={isOn}
                                        aria-busy={isPending}
                                        aria-label={`Connect ${app.name}`}
                                        className="grid min-h-11 min-w-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1917]"
                                        onClick={() => toggle(app.id)}
                                    >
                                        <span
                                            className={cn(
                                                'flex h-[30px] w-[52px] items-center rounded-full p-[3px] transition-colors duration-300',
                                                isOn || isPending ? 'justify-end' : 'justify-start',
                                                isOn ? 'bg-[#1c1917]' : isPending ? 'bg-[#78716c]' : 'bg-[#d6d3d1]',
                                            )}
                                        >
                                            <motion.span
                                                layout
                                                transition={
                                                    reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 600, damping: 34 }
                                                }
                                                className="grid size-6 place-items-center rounded-full bg-white shadow-sm"
                                            >
                                                {isPending && (
                                                    <span className="size-3.5 animate-spin rounded-full border-2 border-[#78716c] border-t-transparent motion-reduce:animate-none" />
                                                )}
                                                {isOn && <HiCheck aria-hidden="true" className="size-3.5 text-[#1c1917]" />}
                                            </motion.span>
                                        </span>
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>

                <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t-2 border-dashed border-[#1c1917]/15 pt-6 sm:flex-row sm:items-center">
                    <p className="text-sm text-[#57534e]">Missing something? 60 more apps live in settings.</p>
                    <a
                        href="#stackmate-settings"
                        className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1c1917] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1c1917] motion-reduce:hover:translate-y-0"
                    >
                        Manage in settings
                        <HiArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default ConnectToggleIntegrationsGrid
