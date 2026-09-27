// ContributorCardAuthorByline

// AuthorByline02 · Blogs & Digital Media › Author Bylines

// Description:
// A deep-space contributor card for the science magazine Parallax Science. It introduces
// "Dr. Amara Nwosu", Senior Science Correspondent, with a tilting portrait, bio, expertise
// tags, social links, a Follow toggle, stats ("24 articles", followers, "Writing since
// 2019") and her latest three stories with dates and read times. Use it at the end of an
// article, on author pages or in a "Meet the writer" sidebar.

// Design:
// - Midnight #0b0f1a section with a faint star field and 64px grid (inline SVG + CSS
//   gradients), cyan #22d3ee accents, #e2e8f0 text and #94a3b8 secondary text
// - Card: rounded-[32px], #0f1526 fill, cyan/15 border and a cyan glow; the portrait sits
//   in an arched frame circled by a dashed orbit ring with a small cyan "moon"
// - Mono uppercase labels, sans headings (text-3xl → sm:text-4xl), outlined tag chips and
//   40px round social buttons; latest stories are ruled rows with a cyan arrow on hover
// - Portrait tilts in 3D and the photo shifts against the orbit ring as the pointer moves
//   (useMotionValue + useTransform); the effect is disabled for reduced motion
// - Responsive: one column on mobile (portrait, identity, then details); from lg a
//   340px left column and flexible right column

// What it does:
// - following state toggles with the Follow button (aria-pressed); the label changes to
//   "Following" with a check and the follower count adds one
// - Pointer moves over the portrait update two motion values; leaving springs them back
//   to centre
// - Social buttons link to #amara-nwosu-website / -rss / -newsletter / -fediverse; stories
//   link to #parallax-<slug>; "All 24 articles" links to #amara-nwosu-articles

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ContributorCardAuthorByline from '@/TestComponent/PageSections/media/AuthorByline02';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <ContributorCardAuthorByline />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowUpRight, HiCheck, HiPlus } from 'react-icons/hi2';
import { LuAtSign, LuGlobe, LuMail, LuRss } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const tags = ['Exoplanets', 'Radio astronomy', 'Dark matter', 'Telescope engineering', 'Science policy']

const socials = [
    { id: 'website', label: 'Personal website', icon: LuGlobe },
    { id: 'rss', label: 'RSS feed of her articles', icon: LuRss },
    { id: 'newsletter', label: 'Email newsletter', icon: LuMail },
    { id: 'fediverse', label: 'Fediverse profile', icon: LuAtSign },
]

const latest = [
    {
        slug: 'hot-jupiter-weather',
        title: 'The planet where it rains molten glass sideways, measured for the first time',
        date: '22 Sep 2026',
        read: 9,
        topic: 'Exoplanets',
    },
    {
        slug: 'karoo-dish-array',
        title: 'Inside the desert array listening for the universe’s first hydrogen',
        date: '8 Sep 2026',
        read: 14,
        topic: 'Radio astronomy',
    },
    {
        slug: 'missing-satellites',
        title: 'The “missing satellite” problem just got smaller. Here’s why that matters',
        date: '27 Aug 2026',
        read: 7,
        topic: 'Dark matter',
    },
]

const stars = [
    [6, 12, 1.2], [14, 70, 0.8], [22, 34, 1.4], [31, 88, 0.9], [38, 18, 0.7], [44, 56, 1.1], [52, 8, 0.9],
    [58, 76, 1.3], [66, 30, 0.8], [72, 92, 1], [79, 48, 1.4], [85, 14, 0.9], [91, 66, 1.2], [96, 38, 0.7],
    [10, 46, 0.7], [27, 60, 1], [48, 94, 0.8], [63, 52, 0.7], [82, 80, 0.9], [94, 4, 1.1],
]

export function ContributorCardAuthorByline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [following, setFollowing] = useState(false)
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const rotateY = useTransform(mx, [-0.5, 0.5], [10, -10])
    const rotateX = useTransform(my, [-0.5, 0.5], [-8, 8])
    const photoX = useTransform(mx, [-0.5, 0.5], [-12, 12])
    const photoY = useTransform(my, [-0.5, 0.5], [-10, 10])
    const ringX = useTransform(mx, [-0.5, 0.5], [10, -10])
    const ringY = useTransform(my, [-0.5, 0.5], [8, -8])

    const onPointerMove = (event) => {
        if (reduceMotion) return
        const rect = event.currentTarget.getBoundingClientRect()
        mx.set((event.clientX - rect.left) / rect.width - 0.5)
        my.set((event.clientY - rect.top) / rect.height - 0.5)
    }

    const onPointerLeave = () => {
        animate(mx, 0, { type: 'spring', stiffness: 200, damping: 20 })
        animate(my, 0, { type: 'spring', stiffness: 200, damping: 20 })
    }

    const followers = 12480 + (following ? 1 : 0)

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0b0f1a] px-4 py-16 text-base font-normal text-[#e2e8f0] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.06)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
            />
            <svg aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full">
                {stars.map(([x, y, r]) => (
                    <circle key={`${x}-${y}`} cx={`${x}%`} cy={`${y}%`} r={r} fill="#e2e8f0" opacity={0.25 + r * 0.25} />
                ))}
            </svg>
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/3 -z-10 size-[36rem] -translate-x-1/2 rounded-full bg-[#22d3ee]/10 blur-[120px]"
            />

            <div className="mx-auto max-w-6xl">
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#22d3ee]">
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-[#22d3ee] shadow-[0_0_12px_#22d3ee]" />
                    Parallax Science · About the author
                </p>

                <article className="mt-8 grid overflow-hidden rounded-[32px] border border-[#22d3ee]/15 bg-[#0f1526]/90 shadow-[0_0_80px_-30px_rgba(34,211,238,0.45)] backdrop-blur lg:grid-cols-[340px_1fr]">
                    <div className="relative flex flex-col items-center border-b border-[#22d3ee]/10 p-6 text-center sm:p-10 lg:border-b-0 lg:border-r">
                        <div
                            className="relative w-full max-w-[240px] [perspective:900px]"
                            onPointerMove={onPointerMove}
                            onPointerLeave={onPointerLeave}
                        >
                            <motion.div
                                aria-hidden="true"
                                style={{ x: ringX, y: ringY }}
                                className="pointer-events-none absolute -inset-5 rounded-full border border-dashed border-[#22d3ee]/35"
                            >
                                <span className="absolute left-[12%] top-[8%] size-3 rounded-full bg-[#22d3ee] shadow-[0_0_16px_#22d3ee]" />
                            </motion.div>
                            <motion.div
                                style={{ rotateX, rotateY }}
                                className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[28px] border border-[#22d3ee]/30 bg-[#131b30]"
                            >
                                <motion.img
                                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80"
                                    alt="Portrait of Dr. Amara Nwosu, smiling, in a dark blazer"
                                    loading="lazy"
                                    style={{ x: photoX, y: photoY }}
                                    className="absolute -inset-4 h-[calc(100%+2rem)] w-[calc(100%+2rem)] max-w-none object-cover"
                                />
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-linear-to-t from-[#0b0f1a]/70 via-transparent to-transparent"
                                />
                            </motion.div>
                        </div>

                        <h2 className="mt-10 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                            Dr. Amara Nwosu
                        </h2>
                        <p className="mt-2 text-sm text-[#94a3b8]">Senior Science Correspondent · Astrophysics</p>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#94a3b8]/80">
                            Cape Town · PhD, radio astronomy
                        </p>

                        <button
                            type="button"
                            aria-pressed={following}
                            className={cn(
                                'mt-6 inline-flex min-h-11 w-full max-w-[240px] items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22d3ee]',
                                following
                                    ? 'border border-[#22d3ee]/50 bg-[#22d3ee]/10 text-[#22d3ee] hover:bg-[#22d3ee]/20'
                                    : 'bg-[#22d3ee] text-[#0b0f1a] shadow-[0_0_30px_-6px_rgba(34,211,238,0.7)] hover:bg-[#67e8f9]',
                            )}
                            onClick={() => setFollowing((v) => !v)}
                        >
                            {following ? (
                                <HiCheck aria-hidden="true" className="size-4" />
                            ) : (
                                <HiPlus aria-hidden="true" className="size-4" />
                            )}
                            {following ? 'Following' : 'Follow Amara'}
                        </button>

                        <ul className="mt-5 flex items-center gap-2">
                            {socials.map(({ id, label, icon: Icon }) => (
                                <li key={id}>
                                    <a
                                        href={`#amara-nwosu-${id}`}
                                        aria-label={label}
                                        className="grid size-10 place-items-center rounded-full border border-[#22d3ee]/20 text-[#94a3b8] transition-colors duration-200 hover:border-[#22d3ee] hover:text-[#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                                    >
                                        <Icon aria-hidden="true" className="size-4" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="min-w-0 p-6 sm:p-10">
                        <dl className="grid grid-cols-3 divide-x divide-[#22d3ee]/10 rounded-2xl border border-[#22d3ee]/10 bg-[#0b0f1a]/60">
                            <div className="px-2.5 py-4 sm:px-5">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">Articles</dt>
                                <dd className="mt-1 text-lg font-semibold tabular-nums text-white sm:text-3xl">24</dd>
                            </div>
                            <div className="px-2.5 py-4 sm:px-5">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">Followers</dt>
                                <dd className="mt-1 text-lg font-semibold tabular-nums text-white sm:text-3xl" aria-live="polite">
                                    {followers.toLocaleString('en-US')}
                                </dd>
                            </div>
                            <div className="px-2.5 py-4 sm:px-5">
                                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">Since</dt>
                                <dd className="mt-1 text-lg font-semibold tabular-nums text-white sm:text-3xl">2019</dd>
                            </div>
                        </dl>

                        <h3 className="mt-8 font-mono text-[11px] font-normal uppercase tracking-[0.3em] text-[#22d3ee]">
                            Bio
                        </h3>
                        <p className="mt-3 text-base leading-relaxed text-[#cbd5e1] sm:text-lg">
                            Amara spent six years building receivers for a radio telescope in the Karoo before
                            deciding she would rather explain the universe than calibrate it. She covers
                            exoplanets, the dark sector and the politics of big-science funding, and has reported
                            from observatories on four continents.
                        </p>

                        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Areas of expertise">
                            {tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full border border-[#22d3ee]/25 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#a5f3fc]"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10 flex items-end justify-between gap-4">
                            <h3 className="font-mono text-[11px] font-normal uppercase tracking-[0.3em] text-[#22d3ee]">
                                Latest from Amara
                            </h3>
                            <a
                                href="#amara-nwosu-articles"
                                className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-white transition-colors hover:text-[#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                            >
                                All 24 articles
                                <HiArrowUpRight aria-hidden="true" className="size-4" />
                            </a>
                        </div>
                        <ol className="mt-3 border-t border-[#22d3ee]/10">
                            {latest.map((story, index) => (
                                <li key={story.slug} className="border-b border-[#22d3ee]/10">
                                    <a
                                        href={`#parallax-${story.slug}`}
                                        className="group grid grid-cols-[2rem_1fr_auto] items-start gap-3 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee] sm:gap-4"
                                    >
                                        <span className="pt-0.5 font-mono text-xs text-[#22d3ee]/70">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="min-w-0">
                                            <span className="block text-base font-medium leading-snug text-white transition-colors group-hover:text-[#a5f3fc]">
                                                {story.title}
                                            </span>
                                            <span className="mt-1.5 flex flex-wrap gap-x-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[#94a3b8]">
                                                <span>{story.topic}</span>
                                                <span>{story.date}</span>
                                                <span>{story.read} min</span>
                                            </span>
                                        </span>
                                        <HiArrowUpRight
                                            aria-hidden="true"
                                            className="mt-1 size-4 text-[#94a3b8] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#22d3ee]"
                                        />
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </div>
                </article>
            </div>
        </section>
    )
}

export default ContributorCardAuthorByline
