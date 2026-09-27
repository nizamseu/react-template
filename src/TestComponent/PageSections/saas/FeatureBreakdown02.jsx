// BentoMockupFeatureBreakdown

// FeatureBreakdown02 · SaaS Platforms › Feature Breakdown

// Description:
// A dark bento-grid feature overview for the work-management app Taskflow. Under the heading
// "Plan it, talk it through, ship it. One tab." four cards each carry a small working-looking
// UI built in markup: a kanban board, a team chat thread linked to task TF-482, a week
// calendar (Sep 28 – Oct 2) and an automation rule. Use it on a homepage or features page to
// show breadth at a glance before deeper feature sections.

// Design:
// - Near-black #09090b section, cards #121214 with white/8 borders and rounded-3xl corners;
//   headings zinc-50 #fafafa, body zinc-400 #a1a1aa, lime #d9f99d as the only accent
// - Bento: 1 column → md:2 → lg:6 columns; kanban spans 4 lg columns, chat spans 2 columns
//   and 2 rows, calendar and automation take 2 columns each (automation spans 2 at md)
// - Mockups are nested zinc-900 panels with tiny 10–11px UI type, initials avatars, tag chips
//   and a lime connector line; titles are text-xl semibold, body text-sm
// - Hover (motion-safe only): the dragged kanban card lifts and tilts with a lime ring, a chat
//   reaction pops in, the "Sprint review" event glows and the rule's run counter lights up;
//   cards rise in with a 70ms stagger when scrolled into view
// - Responsive: the kanban drops its third column below sm, the calendar keeps five narrow
//   day columns with truncated labels; the root is overflow-hidden

// What it does:
// - No state: all hover effects are CSS group-hover transitions, visual only
// - The automation connector runs a lime dot top to bottom every 2.4s via framer-motion;
//   useReducedMotion() parks it and removes the entrance offset (typing dots use
//   motion-safe:animate-bounce)
// - Mockups are aria-hidden; each card's heading and copy carry the meaning. "Take the
//   3-minute tour" links to #taskflow-tour

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BentoMockupFeatureBreakdown from '@/TestComponent/PageSections/saas/FeatureBreakdown02';

// const ProductPage = () => (
//     <main className="space-y-6">
//         <BentoMockupFeatureBreakdown />
//     </main>
// )
// ```

'use client'

import { motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowLongRight,
    HiOutlineBolt,
    HiOutlineCalendarDays,
    HiOutlineChatBubbleLeftRight,
    HiOutlineCursorArrowRays,
    HiOutlineViewColumns,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const board = [
    {
        id: 'backlog',
        name: 'Backlog',
        count: 6,
        cards: [
            { id: 'tf-471', title: 'Audit onboarding copy', tag: 'Content', who: 'AK' },
            { id: 'tf-476', title: 'Dark mode tokens', tag: 'Design', who: 'MR' },
        ],
    },
    {
        id: 'progress',
        name: 'In progress',
        count: 2,
        cards: [
            { id: 'tf-482', title: 'Billing page v2', tag: 'Eng', who: 'JK', dragged: true },
            { id: 'tf-479', title: 'Churn survey', tag: 'Research', who: 'PS' },
        ],
    },
    {
        id: 'review',
        name: 'Review',
        count: 3,
        cards: [
            { id: 'tf-468', title: 'iOS widget QA', tag: 'QA', who: 'AO' },
            { id: 'tf-465', title: 'Referral emails', tag: 'Growth', who: 'MR' },
        ],
    },
]

const chat = [
    { id: 'm1', who: 'MR', name: 'Maya R.', time: '10:12', text: 'Billing v2 is ready for eyes. Can someone check the proration copy?' },
    { id: 'm2', who: 'JK', name: 'Jon K.', time: '10:14', text: 'On it. Linked the task so QA sees it too.', task: true },
    { id: 'm3', who: 'PS', name: 'Priya S.', time: '10:21', text: 'Copy fixed, tokens updated in the design file as well.' },
]

const week = [
    { day: 'Mon', date: 28, events: [{ id: 'plan', title: 'Sprint planning', time: '9:30', offset: 'mt-0', lime: true }] },
    { day: 'Tue', date: 29, events: [{ id: 'crit', title: 'Design crit', time: '14:00', offset: 'mt-8' }] },
    { day: 'Wed', date: 30, events: [{ id: 'call', title: 'Oakline call', time: '10:00', offset: 'mt-2' }] },
    { day: 'Thu', date: 1, events: [{ id: 'review', title: 'Sprint review', time: '16:00', offset: 'mt-12', lime: true, glow: true }] },
    { day: 'Fri', date: 2, events: [{ id: 'retro', title: 'Retro', time: '11:00', offset: 'mt-4' }] },
]

const rule = [
    { id: 'when', label: 'When', text: 'Status changes to Review' },
    { id: 'if', label: 'If', text: 'Label is Billing' },
    { id: 'then', label: 'Then', text: 'Assign @Jon · post in #eng-billing' },
]

function Avatar({ initials, className }) {
    return (
        <span
            className={cn(
                'grid h-6 w-6 shrink-0 place-items-center rounded-full bg-zinc-700 text-[9px] font-bold text-zinc-100',
                className,
            )}
        >
            {initials}
        </span>
    )
}

function Card({ icon: Icon, title, body, className, children, index, reduceMotion }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
                'group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[#121214] p-5 transition-colors duration-300 hover:border-[#d9f99d]/25 sm:p-6',
                className,
            )}
        >
            <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#d9f99d]/10 text-[#d9f99d]">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-[#fafafa]">{title}</h3>
            </div>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[#a1a1aa]">{body}</p>
            <div className="mt-6 flex-1" aria-hidden="true">
                {children}
            </div>
        </motion.article>
    )
}

export function BentoMockupFeatureBreakdown({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-[#09090b] py-16 text-base font-normal text-[#a1a1aa] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#d9f99d]">Taskflow · What’s inside</p>
                        <h2 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#fafafa] sm:text-5xl lg:text-6xl">
                            Plan it, talk it through, ship it.{' '}
                            <span className="bg-[#d9f99d] px-2 text-[#09090b] [box-decoration-break:clone]">One tab.</span>
                        </h2>
                    </div>
                    <p className="max-w-sm text-base leading-relaxed">
                        Boards, chat, calendar and automations share one data model, so a comment, a date
                        and a status change all land on the same task.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
                    <Card
                        index={0}
                        reduceMotion={reduceMotion}
                        icon={HiOutlineViewColumns}
                        title="Boards that keep up with standup"
                        body="Drag work between columns, set WIP limits and see who is overloaded before Friday."
                        className="md:col-span-2 lg:col-span-4"
                    >
                        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/5 bg-[#18181b] p-3 sm:grid-cols-3">
                            {board.map((column, columnIndex) => (
                                <div key={column.id} className={cn('min-w-0 space-y-2', columnIndex === 2 && 'hidden sm:block')}>
                                    <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-zinc-300">
                                        <span className="truncate">{column.name}</span>
                                        <span className="rounded bg-white/5 px-1.5 text-[10px] text-zinc-400">{column.count}</span>
                                    </div>
                                    {column.cards.map((card) => (
                                        <div
                                            key={card.id}
                                            className={cn(
                                                'relative rounded-xl border border-white/[0.06] bg-[#232326] p-2.5 transition duration-300',
                                                card.dragged &&
                                                    'motion-safe:group-hover:-translate-y-1.5 motion-safe:group-hover:translate-x-2 motion-safe:group-hover:-rotate-2 group-hover:shadow-[0_18px_30px_-12px_rgba(0,0,0,0.8)] group-hover:ring-1 group-hover:ring-[#d9f99d]/70',
                                            )}
                                        >
                                            <p className="font-mono text-[9px] uppercase text-zinc-500">{card.id}</p>
                                            <p className="mt-1 truncate text-[12px] font-medium text-zinc-100">{card.title}</p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span
                                                    className={cn(
                                                        'rounded-full px-1.5 py-0.5 text-[9px] font-semibold',
                                                        card.dragged ? 'bg-[#d9f99d] text-[#09090b]' : 'bg-white/5 text-zinc-400',
                                                    )}
                                                >
                                                    {card.tag}
                                                </span>
                                                <Avatar initials={card.who} className="h-5 w-5 text-[8px]" />
                                            </div>
                                            {card.dragged && (
                                                <HiOutlineCursorArrowRays className="absolute -bottom-2 -right-1 h-5 w-5 text-[#d9f99d] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card
                        index={1}
                        reduceMotion={reduceMotion}
                        icon={HiOutlineChatBubbleLeftRight}
                        title="Chat that knows the task"
                        body="Threads live on the work itself. Mention a task and everyone sees its status inline."
                        className="lg:col-span-2 lg:row-span-2"
                    >
                        <div className="flex h-full flex-col gap-3 rounded-2xl border border-white/5 bg-[#18181b] p-3">
                            <p className="flex items-center gap-2 border-b border-white/5 pb-2 text-[11px] font-semibold text-zinc-300">
                                <span className="text-[#d9f99d]">#</span>billing-launch
                                <span className="ml-auto text-[10px] font-normal text-zinc-500">5 members</span>
                            </p>
                            {chat.map((message, index) => (
                                <div key={message.id} className="flex gap-2">
                                    <Avatar
                                        initials={message.who}
                                        className={index === 0 ? 'bg-[#d9f99d] text-[#09090b]' : undefined}
                                    />
                                    <div className="relative min-w-0 flex-1">
                                        <p className="text-[11px]">
                                            <span className="font-semibold text-zinc-100">{message.name}</span>
                                            <span className="ml-1.5 text-[10px] text-zinc-500">{message.time}</span>
                                        </p>
                                        <p className="mt-0.5 text-[12px] leading-snug text-zinc-300">{message.text}</p>
                                        {message.task && (
                                            <span className="mt-2 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-[#232326] px-2 py-1.5 text-[11px]">
                                                <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                                                <span className="font-mono text-[10px] text-zinc-500">TF-482</span>
                                                <span className="truncate text-zinc-200">Billing page v2</span>
                                                <span className="ml-auto shrink-0 text-[10px] text-amber-300">In progress</span>
                                            </span>
                                        )}
                                        {index === chat.length - 1 && (
                                            <span className="mt-1.5 inline-flex scale-75 items-center gap-1 rounded-full bg-[#d9f99d]/10 px-2 py-0.5 text-[10px] font-semibold text-[#d9f99d] opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100">
                                                ✓ 3
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <p className="mt-auto flex items-center gap-2 text-[10px] text-zinc-500">
                                <span className="flex gap-0.5">
                                    {[0, 150, 300].map((delay) => (
                                        <span
                                            key={delay}
                                            className="h-1.5 w-1.5 rounded-full bg-zinc-500 motion-safe:animate-bounce"
                                            style={{ animationDelay: `${delay}ms` }}
                                        />
                                    ))}
                                </span>
                                Ade is typing…
                            </p>
                            <div className="rounded-xl border border-white/[0.06] bg-[#232326] px-3 py-2 text-[11px] text-zinc-500">
                                Message #billing-launch
                            </div>
                        </div>
                    </Card>

                    <Card
                        index={2}
                        reduceMotion={reduceMotion}
                        icon={HiOutlineCalendarDays}
                        title="A calendar that books itself"
                        body="Taskflow finds a slot everyone has free and drops the agenda in."
                        className="lg:col-span-2"
                    >
                        <div className="grid grid-cols-5 gap-1.5 rounded-2xl border border-white/5 bg-[#18181b] p-2.5 sm:gap-2 sm:p-3">
                            {week.map((day) => (
                                <div key={day.day} className="min-w-0">
                                    <p className="text-center text-[10px] text-zinc-500">{day.day}</p>
                                    <p className="text-center text-[13px] font-semibold text-zinc-200">{day.date}</p>
                                    <div className="relative mt-2 h-28 rounded-lg bg-white/[0.02] p-0.5">
                                        {day.events.map((event) => (
                                            <div
                                                key={event.id}
                                                className={cn(
                                                    'rounded-md px-1 py-1 transition duration-300',
                                                    event.offset,
                                                    event.lime ? 'bg-[#d9f99d] text-[#09090b]' : 'bg-[#2a2a2e] text-zinc-300',
                                                    event.glow &&
                                                        'group-hover:shadow-[0_0_0_2px_#09090b,0_0_0_4px_#d9f99d,0_0_24px_rgba(217,249,157,0.45)] motion-safe:group-hover:-translate-y-0.5',
                                                )}
                                            >
                                                <p className="truncate text-[9px] font-bold leading-tight">{event.title}</p>
                                                <p className="text-[9px] leading-tight opacity-70">{event.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card
                        index={3}
                        reduceMotion={reduceMotion}
                        icon={HiOutlineBolt}
                        title="Automations in plain English"
                        body="When this happens, do that. No scripts, and every run is logged."
                        className="md:col-span-2 lg:col-span-2"
                    >
                        <div className="relative rounded-2xl border border-white/5 bg-[#18181b] p-3">
                            <div className="relative">
                                <span className="absolute bottom-6 left-3.5 top-6 w-px bg-white/10">
                                    <motion.span
                                        className="absolute -left-[3px] h-[7px] w-[7px] rounded-full bg-[#d9f99d] shadow-[0_0_10px_#d9f99d]"
                                        initial={{ top: '0%' }}
                                        animate={reduceMotion ? { top: '0%' } : { top: ['0%', '100%'] }}
                                        transition={reduceMotion ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                                    />
                                </span>
                                <ol className="relative space-y-2.5">
                                    {rule.map((step) => (
                                        <li key={step.id} className="flex items-center gap-3">
                                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-[#232326] text-[9px] font-bold uppercase text-[#d9f99d]">
                                                {step.label.slice(0, 2)}
                                            </span>
                                            <span className="min-w-0 flex-1 rounded-xl border border-white/[0.06] bg-[#232326] px-3 py-2">
                                                <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                                    {step.label}
                                                </span>
                                                <span className="block truncate text-[12px] text-zinc-100">{step.text}</span>
                                            </span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <p className="mt-3 flex items-center justify-between gap-2 border-t border-white/5 pt-2.5 text-[10px] text-zinc-500">
                                <span>Last run 2 min ago</span>
                                <span className="rounded-full bg-white/5 px-2 py-0.5 font-semibold text-zinc-400 transition-colors duration-300 group-hover:bg-[#d9f99d] group-hover:text-[#09090b]">
                                    1,284 runs this month
                                </span>
                            </p>
                        </div>
                    </Card>
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.08] pt-8 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm">
                        Plus docs, whiteboards, time tracking and 60+ integrations.{' '}
                        <span className="text-[#fafafa]">Free for teams up to 10.</span>
                    </p>
                    <a
                        href="#taskflow-tour"
                        className="group inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-[#d9f99d] px-5 text-sm font-semibold text-[#09090b] transition-colors hover:bg-[#ecfccb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d9f99d] sm:self-auto"
                    >
                        Take the 3-minute tour
                        <HiArrowLongRight
                            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default BentoMockupFeatureBreakdown
