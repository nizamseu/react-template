// MustHaveFilterAmenityChecklist

// AmenityChecklist04 · Booking & Reservations › Amenity & Service Checklist

// Description:
// A "must-have" amenity filter for the London coworking network Deskhive. Members toggle
// what they can't work without (Gigabit Wi-Fi, Standing desk, Phone booth, Parking…) or
// pick a preset such as "Deep focus", and the headline "4 of 9 spaces match" counts up or
// down live while matching spaces reshuffle and near-misses list what they're missing.
// Use it on a location finder, a day-pass booking flow or a workspace comparison page.

// Design:
// - lg: 4/12 sticky filter card + 8/12 results; results grid 1 → sm: 2 → xl: 3 columns,
//   "Almost there" cards below in a denser grid; everything stacks below lg
// - Mint #ecfdf5 page, emerald #047857 accents, deep green #064e3b text, white cards
//   with #d1fae5 borders; missing amenities in amber #b45309 chips
// - Filter rows are 48px switches with icon, label and a live facet count; presets are
//   pill buttons; the counter is a large tabular number with a progress bar
// - Cards: 16:10 photo, name, area · tube walk, £ per day, amenity icon row where the
//   required ones are emerald and the rest muted
// - framer-motion counts the number, animates the progress bar and uses layout +
//   AnimatePresence to reflow cards; all instant with reduced motion

// What it does:
// - required (Set) holds the toggled amenities; a space matches when it has all of them
// - Facet counts show how many current matches offer each amenity; presets replace the
//   set and "Clear all" empties it; the count is announced politely
// - Non-matching spaces that miss one or two amenities appear as "Almost there" with the
//   missing ones listed; "Book a day pass" links point to #book-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MustHaveFilterAmenityChecklist from '@/TestComponent/PageSections/booking/AmenityChecklist04';

// const BookingPage = () => (
//     <main className="space-y-6">
//         <MustHaveFilterAmenityChecklist />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import {
    LuBike,
    LuClock,
    LuCoffee,
    LuDog,
    LuLock,
    LuMonitor,
    LuPhone,
    LuPersonStanding,
    LuPresentation,
    LuShowerHead,
    LuSquareParking,
    LuTrainFront,
    LuWifi,
    LuX,
} from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const amenities = [
    { id: 'wifi', label: 'Gigabit Wi-Fi', Icon: LuWifi },
    { id: 'standing', label: 'Standing desk', Icon: LuPersonStanding },
    { id: 'booth', label: 'Phone booth', Icon: LuPhone },
    { id: 'monitor', label: 'External monitor', Icon: LuMonitor },
    { id: 'meeting', label: 'Meeting room', Icon: LuPresentation },
    { id: 'kitchen', label: 'Kitchen & coffee', Icon: LuCoffee },
    { id: 'lockers', label: 'Lockers', Icon: LuLock },
    { id: 'parking', label: 'Parking', Icon: LuSquareParking },
    { id: 'showers', label: 'Showers', Icon: LuShowerHead },
    { id: 'bikes', label: 'Bike storage', Icon: LuBike },
    { id: 'pets', label: 'Pet friendly', Icon: LuDog },
    { id: 'always', label: '24/7 access', Icon: LuClock },
]

const amenityById = Object.fromEntries(amenities.map((a) => [a.id, a]))

const spaces = [
    {
        id: 'kings-cross',
        name: 'Kings Cross, Floor 3',
        area: 'King’s Cross',
        walk: '3 min from King’s Cross St Pancras',
        price: 32,
        has: ['wifi', 'standing', 'booth', 'monitor', 'meeting', 'kitchen', 'lockers', 'showers', 'bikes', 'always'],
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
        alt: 'Open-plan office with long desks and big windows',
    },
    {
        id: 'shoreditch-loft',
        name: 'Shoreditch Loft',
        area: 'Shoreditch',
        walk: '5 min from Old Street',
        price: 28,
        has: ['wifi', 'standing', 'booth', 'kitchen', 'lockers', 'bikes', 'pets', 'showers'],
        image: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=600&q=80',
        alt: 'Open office under an exposed industrial ceiling',
    },
    {
        id: 'canary-wharf',
        name: 'Canary Wharf Tower',
        area: 'Canary Wharf',
        walk: '2 min from Canary Wharf',
        price: 39,
        has: ['wifi', 'standing', 'booth', 'parking', 'kitchen', 'lockers', 'monitor', 'meeting', 'showers', 'always'],
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=600&q=80',
        alt: 'Meeting room with a long table and a city view',
    },
    {
        id: 'hackney-wick',
        name: 'Hackney Wick Studio',
        area: 'Hackney Wick',
        walk: '6 min from Hackney Wick',
        price: 22,
        has: ['wifi', 'kitchen', 'bikes', 'pets', 'standing'],
        image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=80',
        alt: 'Industrial café-style workspace with wooden tables',
    },
    {
        id: 'soho-square',
        name: 'Soho Square',
        area: 'Soho',
        walk: '4 min from Tottenham Court Road',
        price: 35,
        has: ['wifi', 'booth', 'kitchen', 'monitor', 'meeting', 'lockers'],
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=600&q=80',
        alt: 'Glass-walled office corridor with meeting pods',
    },
    {
        id: 'clerkenwell',
        name: 'Clerkenwell Library',
        area: 'Clerkenwell',
        walk: '5 min from Farringdon',
        price: 26,
        has: ['wifi', 'booth', 'kitchen', 'lockers', 'monitor'],
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80',
        alt: 'People working quietly at long library tables',
    },
    {
        id: 'battersea',
        name: 'Battersea Power Station',
        area: 'Battersea',
        walk: '4 min from Battersea Power Station',
        price: 30,
        has: ['wifi', 'standing', 'parking', 'kitchen', 'showers', 'bikes', 'pets', 'always'],
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
        alt: 'Bright office with plants between the desks',
    },
    {
        id: 'brixton',
        name: 'Brixton Hub',
        area: 'Brixton',
        walk: '3 min from Brixton',
        price: 20,
        has: ['wifi', 'kitchen', 'bikes', 'pets'],
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
        alt: 'Friends working together on laptops at a café table',
    },
    {
        id: 'paddington',
        name: 'Paddington Basin',
        area: 'Paddington',
        walk: '5 min from Paddington',
        price: 33,
        has: ['wifi', 'standing', 'booth', 'parking', 'kitchen', 'lockers', 'monitor', 'meeting', 'showers', 'bikes', 'always'],
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80',
        alt: 'Large open-plan office with rows of desks',
    },
]

const presets = [
    { id: 'focus', label: 'Deep focus', ids: ['wifi', 'booth', 'monitor'] },
    { id: 'cycle', label: 'Cycle commuter', ids: ['bikes', 'showers', 'lockers'] },
    { id: 'team', label: 'Team day', ids: ['meeting', 'kitchen', 'parking'] },
]

export function MustHaveFilterAmenityChecklist({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [required, setRequired] = useState(() => new Set(['wifi', 'booth']))

    const missingFor = (space) => [...required].filter((id) => !space.has.includes(id))
    const matches = spaces.filter((s) => missingFor(s).length === 0)
    const nearMisses = spaces
        .map((s) => ({ space: s, missing: missingFor(s) }))
        .filter((m) => m.missing.length > 0 && m.missing.length <= 2)
        .sort((a, b) => a.missing.length - b.missing.length || a.space.price - b.space.price)

    const count = useMotionValue(matches.length)
    const rounded = useTransform(count, (v) => Math.round(v))
    useEffect(() => {
        const controls = animate(count, matches.length, { duration: reduceMotion ? 0 : 0.5, ease: 'easeOut' })
        return () => controls.stop()
    }, [count, matches.length, reduceMotion])

    const toggle = (id) => {
        setRequired((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const activePreset = presets.find((p) => p.ids.length === required.size && p.ids.every((id) => required.has(id)))
    const layoutTransition = reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#ecfdf5] py-16 text-base font-normal text-[#064e3b] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                    <p className="inline-flex items-center gap-2 rounded-full bg-[#047857] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#ecfdf5]">
                        <span className="grid size-4 place-items-center rounded-[4px] bg-[#ecfdf5] text-[9px] font-black text-[#047857]">D</span>
                        Deskhive · London
                    </p>
                    <h2 className="mt-5 text-4xl font-extrabold leading-[1.02] tracking-tight text-[#064e3b] sm:text-5xl lg:text-6xl">
                        Only show me desks with…
                    </h2>
                    <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#065f46]/80">
                        Toggle the things you can’t work without. We’ll hide every space that doesn’t
                        have all of them — and tell you which ones came close.
                    </p>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <div className="rounded-3xl border border-[#d1fae5] bg-white p-5 shadow-[0_20px_50px_-30px_rgba(4,120,87,0.45)] sm:p-6 lg:sticky lg:top-6">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-lg font-bold text-[#064e3b]">Must-haves</h3>
                                <button
                                    type="button"
                                    disabled={required.size === 0}
                                    className="min-h-10 rounded-full px-3 text-sm font-semibold text-[#047857] hover:bg-[#ecfdf5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857] disabled:cursor-not-allowed disabled:opacity-40"
                                    onClick={() => setRequired(new Set())}
                                >
                                    Clear all
                                </button>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Presets">
                                {presets.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        aria-pressed={activePreset?.id === p.id}
                                        className={cn(
                                            'min-h-10 rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]',
                                            activePreset?.id === p.id
                                                ? 'border-[#047857] bg-[#047857] text-white'
                                                : 'border-[#a7f3d0] text-[#065f46] hover:border-[#047857]',
                                        )}
                                        onClick={() => setRequired(new Set(p.ids))}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            <ul className="mt-5 divide-y divide-[#ecfdf5]">
                                {amenities.map((a) => {
                                    const on = required.has(a.id)
                                    const facet = matches.filter((s) => s.has.includes(a.id)).length
                                    const Icon = a.Icon
                                    return (
                                        <li key={a.id}>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={on}
                                                className="flex min-h-12 w-full items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-[#f0fdf8] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#047857]"
                                                onClick={() => toggle(a.id)}
                                            >
                                                <span
                                                    className={cn(
                                                        'grid size-9 shrink-0 place-items-center rounded-lg transition-colors',
                                                        on ? 'bg-[#047857] text-white' : 'bg-[#ecfdf5] text-[#047857]',
                                                    )}
                                                >
                                                    <Icon className="size-4" aria-hidden="true" />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block text-sm font-semibold text-[#064e3b]">{a.label}</span>
                                                    <span className="block text-xs text-[#065f46]/60">
                                                        {facet} of {matches.length} matches
                                                    </span>
                                                </span>
                                                <span
                                                    className={cn(
                                                        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                                                        on ? 'bg-[#047857]' : 'bg-[#d1d5db]',
                                                    )}
                                                    aria-hidden="true"
                                                >
                                                    <motion.span
                                                        initial={false}
                                                        animate={{ x: on ? 20 : 0 }}
                                                        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 600, damping: 34 }}
                                                        className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow"
                                                    />
                                                </span>
                                            </button>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="rounded-3xl bg-[#047857] p-6 text-[#ecfdf5] sm:p-7">
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <p className="flex items-baseline gap-3" aria-hidden="true">
                                    <motion.span className="text-6xl font-extrabold tabular-nums leading-none sm:text-7xl">{rounded}</motion.span>
                                    <span className="text-lg font-semibold">of {spaces.length} spaces match</span>
                                </p>
                                <p className="sr-only" aria-live="polite">
                                    {matches.length} of {spaces.length} spaces match
                                </p>
                                <div className="flex max-w-full flex-wrap gap-1.5">
                                    {required.size === 0 && <span className="text-sm text-[#a7f3d0]">No must-haves yet — showing everything</span>}
                                    {[...required].map((id) => (
                                        <button
                                            key={id}
                                            type="button"
                                            aria-label={`Remove ${amenityById[id].label}`}
                                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-[#065f46] px-3 text-xs font-semibold text-[#ecfdf5] hover:bg-[#064e3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                            onClick={() => toggle(id)}
                                        >
                                            {amenityById[id].label}
                                            <LuX className="size-3.5" aria-hidden="true" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#065f46]">
                                <motion.div
                                    className="h-full rounded-full bg-[#6ee7b7]"
                                    initial={false}
                                    animate={{ width: `${(matches.length / spaces.length) * 100}%` }}
                                    transition={reduceMotion ? { duration: 0 } : { duration: 0.5, ease: 'easeOut' }}
                                />
                            </div>
                        </div>

                        <motion.ul layout={!reduceMotion} className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <AnimatePresence initial={false} mode="popLayout">
                                {matches.map((s) => (
                                    <motion.li
                                        key={s.id}
                                        layout
                                        initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.94 }}
                                        transition={layoutTransition}
                                        className="flex flex-col overflow-hidden rounded-2xl border border-[#d1fae5] bg-white"
                                    >
                                        <div className="relative aspect-[16/10] bg-[#d1fae5]">
                                            <img src={s.image} alt={s.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                                            <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#064e3b]">
                                                £{s.price}
                                                <span className="font-medium text-[#065f46]/70">/day</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col p-4">
                                            <h3 className="text-base font-bold leading-snug text-[#064e3b]">{s.name}</h3>
                                            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#065f46]/70">
                                                <LuTrainFront className="size-3.5 shrink-0" aria-hidden="true" />
                                                {s.walk}
                                            </p>
                                            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`Amenities at ${s.name}`}>
                                                {s.has.map((id) => {
                                                    const a = amenityById[id]
                                                    const Icon = a.Icon
                                                    const req = required.has(id)
                                                    return (
                                                        <li
                                                            key={id}
                                                            title={a.label}
                                                            className={cn(
                                                                'grid size-7 place-items-center rounded-md',
                                                                req ? 'bg-[#047857] text-white' : 'bg-[#ecfdf5] text-[#047857]/70',
                                                            )}
                                                        >
                                                            <Icon className="size-3.5" aria-hidden="true" />
                                                            <span className="sr-only">{a.label}</span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                            <div className="mt-auto pt-4">
                                                <a
                                                    href={`#book-${s.id}`}
                                                    className="inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#064e3b] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#047857] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#047857]"
                                                >
                                                    Book a day pass
                                                </a>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </motion.ul>

                        {matches.length === 0 && (
                            <p className="mt-6 rounded-2xl border border-dashed border-[#6ee7b7] bg-white/60 p-6 text-sm text-[#065f46]">
                                No space has everything on your list yet. Drop one must-have — the near misses
                                below show exactly what’s missing.
                            </p>
                        )}

                        {nearMisses.length > 0 && (
                            <div className="mt-10">
                                <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-[#065f46]/70">
                                    Almost there · {nearMisses.length}
                                </h3>
                                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                                    {nearMisses.map(({ space, missing }) => (
                                        <li key={space.id} className="flex items-center gap-3 rounded-2xl border border-[#d1fae5] bg-white/70 p-3">
                                            <img src={space.image} alt="" loading="lazy" className="size-14 shrink-0 rounded-xl object-cover opacity-80" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-[#064e3b]">
                                                    {space.name} <span className="font-medium text-[#065f46]/60">· £{space.price}</span>
                                                </p>
                                                <p className="mt-1 flex flex-wrap gap-1">
                                                    {missing.map((id) => (
                                                        <span key={id} className="rounded-full bg-[#fef3c7] px-2 py-0.5 text-[11px] font-semibold text-[#b45309]">
                                                            No {amenityById[id].label.toLowerCase()}
                                                        </span>
                                                    ))}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MustHaveFilterAmenityChecklist
