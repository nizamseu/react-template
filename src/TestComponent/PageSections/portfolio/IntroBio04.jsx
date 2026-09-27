// NotebookPageIntroBio

// IntroBio04 · Portfolios & Personal Websites › Intro / Bio

// Description:
// A page torn from illustrator Sam Okafor's notebook: ruled paper, a red margin and punch
// holes, with the blue-ink headline "Hi, I'm Sam Okafor — I draw small worlds for big
// stories." underlined by a hand-drawn scribble. A taped polaroid, doodled arrows and
// notes, a tickable "Today's page" to-do list, a "Flip through my sketchbook" link and a
// sticky-note "Commission a drawing" CTA. Use it to open a playful illustrator portfolio.

// Design:
// - Paper #fffdf6 with 32px ruled lines #dbe5f5 (repeating-linear-gradient), a double red
//   #d9534f margin line and three punched holes; ink #1f3c9e, lighter ink #4a63c4
// - Italic font-serif headline text-[2.5rem] → sm:6xl → lg:[4.5rem] and "handwritten"
//   notes; SVG doodles (star, spiral, squiggle, arrows) in ink with round caps
// - Polaroid rotated 3deg with two translucent washi-tape strips; the yellow #fff1a8
//   sticky note tilts -2deg and straightens on hover; soft paper shadows throughout
// - Motion: the headline underline and the arrow draw themselves in view, a scribbled oval
//   draws round the sketchbook link on hover/focus, ticks draw on and a wavy strike-
//   through fades in; reduced motion shows every stroke immediately
// - Responsive: the margin sits at left-10 → sm:left-20 → lg:left-28 with content padded
//   past it; one column on mobile, 7 / 5 columns from lg

// What it does:
// - "Today's page" is four real checkboxes (visually custom); done starts at one item, the
//   counter and its cheerful message update as boxes are ticked
// - "Flip through my sketchbook" links to #sketchbook and the sticky note to #commission
// - Doodles, tape and holes are decorative (aria-hidden)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NotebookPageIntroBio from '@/TestComponent/PageSections/portfolio/IntroBio04';

// const PortfolioPage = () => (
//     <main className="space-y-6">
//         <NotebookPageIntroBio />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/design-system/lib/cn';

const INK = '#1f3c9e'

const initialTasks = [
    { id: 'lighthouse', label: 'Ink spread 14 of “The Lighthouse Cat”', done: true },
    { id: 'orchard', label: 'Colour the Orchard Review autumn cover', done: false },
    { id: 'kite', label: 'Sketch three creatures for Kite & Kettle', done: false },
    { id: 'reply', label: 'Reply to your commission email ✉', done: false },
]

const cheer = [
    'the kettle is on.',
    'warming up.',
    'halfway — biscuit break.',
    'one to go!',
    'page complete ✶ time to draw for fun.',
]

const clients = ['Penhallow Books', 'The Orchard Review', 'Kite & Kettle Games', 'Moss & Maple']

function Doodle({ className, children, viewBox = '0 0 60 60' }) {
    return (
        <svg
            aria-hidden="true"
            viewBox={viewBox}
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('pointer-events-none absolute', className)}
        >
            {children}
        </svg>
    )
}

export function NotebookPageIntroBio({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [tasks, setTasks] = useState(initialTasks)
    const done = tasks.filter((t) => t.done).length
    const draw = reduceMotion ? false : { pathLength: 0 }

    const toggle = (id) => setTasks((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#fffdf6] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_31px,#dbe5f5_31px,#dbe5f5_32px)] text-base font-normal text-[#1f3c9e]',
                className,
            )}
            {...props}
        >
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-10 -z-10 flex gap-1 sm:left-20 lg:left-28">
                <span className="w-[2px] bg-[#d9534f]/55" />
                <span className="w-px bg-[#d9534f]/30" />
            </div>
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-2.5 flex flex-col justify-around sm:left-6 lg:left-9">
                {[0, 1, 2].map((hole) => (
                    <span
                        key={hole}
                        className="size-4 rounded-full bg-[#ebe4d2] shadow-[inset_0_2px_4px_rgba(60,48,20,0.25)] sm:size-5"
                    />
                ))}
            </div>

            <div className="relative py-16 pl-16 pr-4 sm:pl-28 sm:pr-8 md:py-24 lg:pl-40 lg:pr-14">
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
                    <div className="relative lg:col-span-7">
                        <p className="flex items-baseline justify-between font-serif text-lg italic text-[#4a63c4]">
                            <span>about me —</span>
                            <span className="text-sm not-italic tracking-[0.2em] text-[#d9534f]/80 lg:hidden">p. 01</span>
                        </p>

                        <h2 className="relative mt-6 font-serif text-[2.5rem] font-normal italic leading-[1.08] tracking-[-0.01em] text-[#1f3c9e] sm:text-6xl lg:text-[4.5rem]">
                            Hi, I&apos;m Sam Okafor — I draw{' '}
                            <span className="relative inline-block whitespace-nowrap">
                                small worlds
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 300 24"
                                    preserveAspectRatio="none"
                                    fill="none"
                                    className="absolute -bottom-3 left-0 h-4 w-full sm:h-5"
                                >
                                    <motion.path
                                        d="M4 14 C 44 6, 86 18, 128 11 S 206 5, 246 12 S 286 15, 296 8"
                                        stroke={INK}
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        initial={draw}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.9, delay: 0.3, ease: 'easeInOut' }}
                                    />
                                    <motion.path
                                        d="M14 20 C 70 14, 150 22, 214 16 S 272 16, 290 15"
                                        stroke={INK}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        opacity="0.7"
                                        initial={draw}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.7, delay: 1.1, ease: 'easeInOut' }}
                                    />
                                </svg>
                            </span>{' '}
                            for big stories.
                        </h2>

                        <Doodle className="-top-6 right-4 hidden size-14 rotate-12 opacity-80 sm:block">
                            <path d="M30 6 L35.5 22 L52 22.5 L39 32.5 L44 49 L30 39.5 L16 49.5 L21 33 L8 23 L24.5 22 Z" />
                        </Doodle>

                        <p className="mt-10 max-w-xl font-serif text-lg leading-8 text-[#1f3c9e]/85 sm:text-xl sm:leading-8">
                            Illustrator between Lagos and London. I make picture books, editorial spots and
                            game art with ink, gouache and far too many pencils — usually with a cat hiding
                            somewhere in the frame.
                        </p>

                        <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-serif leading-8 text-[#1f3c9e]">
                            <span className="italic text-[#4a63c4]">drawn for:</span>
                            {clients.map((client, index) => (
                                <span key={client} className="inline-flex items-baseline gap-3">
                                    <span className="font-semibold">{client}</span>
                                    {index < clients.length - 1 && (
                                        <span aria-hidden="true" className="text-[#d9534f]">
                                            ✶
                                        </span>
                                    )}
                                </span>
                            ))}
                        </div>

                        <div className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-12">
                            <motion.a
                                href="#sketchbook"
                                initial="rest"
                                animate="rest"
                                whileHover="draw"
                                whileFocus="draw"
                                className="relative inline-flex min-h-11 items-center px-2 font-serif text-lg italic sm:text-xl text-[#1f3c9e] focus-visible:outline-none"
                            >
                                <span>
                                    Flip through my sketchbook <span aria-hidden="true">→</span>
                                </span>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 240 60"
                                    preserveAspectRatio="none"
                                    fill="none"
                                    className="pointer-events-none absolute -inset-x-4 -inset-y-3 h-[calc(100%+1.5rem)] w-[calc(100%+2rem)]"
                                >
                                    <motion.path
                                        d="M14 32 C 10 10, 110 3, 190 9 C 238 14, 238 44, 182 51 C 112 58, 22 55, 9 37 C 4 27, 30 15, 64 12"
                                        stroke="#d9534f"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        variants={{ rest: { pathLength: 0, opacity: 0 }, draw: { pathLength: 1, opacity: 1 } }}
                                        transition={{ duration: reduceMotion ? 0 : 0.55, ease: 'easeOut' }}
                                    />
                                </svg>
                            </motion.a>

                            <a
                                href="#commission"
                                className="group relative block w-52 -rotate-2 bg-[#fff1a8] px-5 pb-5 pt-6 shadow-[0_14px_22px_-14px_rgba(60,48,20,0.55)] transition-transform duration-300 hover:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1f3c9e] motion-reduce:transition-none"
                            >
                                <span
                                    aria-hidden="true"
                                    className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2 bg-[#9fb6e8]/55"
                                />
                                <span className="block font-serif text-xl italic leading-snug text-[#1f3c9e]">
                                    Commission a drawing →
                                </span>
                                <span className="mt-1 block font-serif text-sm text-[#1f3c9e]/70">
                                    books open for Jan 2027
                                </span>
                            </a>
                        </div>
                    </div>

                    <div className="relative lg:col-span-5">
                        <p className="hidden text-right font-serif text-sm tracking-[0.2em] text-[#d9534f]/80 lg:block">p. 01</p>

                        <div className="relative mx-auto mt-2 w-[min(100%,18rem)] sm:w-72 lg:mr-6 lg:mt-6">
                            <figure className="relative rotate-3 bg-white p-3 pb-12 shadow-[0_24px_40px_-22px_rgba(31,60,158,0.45),0_2px_6px_rgba(0,0,0,0.06)]">
                                <span
                                    aria-hidden="true"
                                    className="absolute -left-5 top-3 z-10 h-6 w-20 -rotate-[32deg] bg-[#9fb6e8]/55"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute -right-5 top-4 z-10 h-6 w-20 rotate-[28deg] bg-[#f3b3a8]/55"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=700&q=80"
                                    alt="Sam Okafor smiling in a striped shirt in front of a graffiti wall"
                                    className="aspect-square w-full object-cover"
                                />
                                <figcaption className="absolute inset-x-3 bottom-3 text-center font-serif text-base italic text-[#1f3c9e]">
                                    me, mid-doodle · Lagos 2026
                                </figcaption>
                            </figure>

                            <div className="absolute -bottom-20 -left-4 w-40 sm:-left-28 sm:bottom-auto sm:top-1/2 sm:w-32 lg:-left-36">
                                <p className="-rotate-6 font-serif text-base italic leading-tight text-[#4a63c4]">
                                    that&apos;s me! (usually covered in ink)
                                </p>
                                <svg
                                    aria-hidden="true"
                                    viewBox="0 0 100 60"
                                    fill="none"
                                    className="mt-1 hidden h-12 w-24 sm:block"
                                >
                                    <motion.path
                                        d="M6 10 C 30 50, 60 50, 88 30"
                                        stroke={INK}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        initial={draw}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.7, delay: 0.4 }}
                                    />
                                    <path d="M76 24 L89 30 L80 41" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <Doodle className="right-0 top-0 hidden size-16 opacity-70 sm:block lg:-right-4 lg:top-auto lg:bottom-[42%]" viewBox="0 0 60 60">
                            <path d="M30 30 C 30 26, 36 26, 36 30 C 36 36, 26 37, 24 30 C 22 22, 36 18, 41 27 C 46 37, 34 46, 24 42 C 13 38, 12 22, 22 16 C 32 10, 48 14, 51 28" />
                        </Doodle>

                        <fieldset className="relative mt-28 sm:mt-14 lg:ml-2">
                            <legend className="font-serif text-2xl italic text-[#1f3c9e]">
                                Today&apos;s page:
                            </legend>
                            <ul className="mt-3">
                                {tasks.map((task) => (
                                    <li key={task.id}>
                                        <label className="group flex min-h-10 cursor-pointer items-center gap-3 py-1 font-serif text-base leading-snug text-[#1f3c9e] sm:text-lg">
                                            <input
                                                type="checkbox"
                                                className="peer sr-only"
                                                checked={task.done}
                                                onChange={() => toggle(task.id)}
                                            />
                                            <svg
                                                aria-hidden="true"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="size-6 shrink-0 rounded-sm peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#d9534f]"
                                            >
                                                <path
                                                    d="M3.5 4.2 C 9 3.6, 15 3.2, 20.6 3.8 C 21 9, 21.2 15, 20.4 20.7 C 14.8 21.3, 9 21, 3.8 20.4 C 3.2 15, 3.4 9, 3.5 4.2 Z"
                                                    stroke={INK}
                                                    strokeWidth="1.6"
                                                    className="transition-colors group-hover:fill-[#dbe5f5]"
                                                />
                                                <motion.path
                                                    d="M6 12.5 L10.5 17 L20 4"
                                                    stroke="#d9534f"
                                                    strokeWidth="2.6"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    initial={false}
                                                    animate={{ pathLength: task.done ? 1 : 0, opacity: task.done ? 1 : 0 }}
                                                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                                                />
                                            </svg>
                                            <span
                                                className={cn(
                                                    'line-through decoration-wavy decoration-[1.5px] transition-[opacity,text-decoration-color] duration-300',
                                                    task.done
                                                        ? 'decoration-[#1f3c9e] opacity-60'
                                                        : 'decoration-transparent',
                                                )}
                                            >
                                                {task.label}
                                            </span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                            <p aria-live="polite" className="mt-3 font-serif text-base italic text-[#4a63c4]">
                                {done} of {tasks.length} done — {cheer[done]}
                            </p>
                        </fieldset>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default NotebookPageIntroBio
