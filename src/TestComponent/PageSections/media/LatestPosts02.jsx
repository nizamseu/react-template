// PaginatedRowsLatestPosts

// LatestPosts02 · Blogs & Digital Media › Latest Posts Grid / Feed

// Description:
// A crisp, index-style list of recent articles for the fictional developer blog Byte Notes.
// Under "Latest notes from the terminal." each row shows a mono date, tags, a headline,
// a one-line summary, author and read time, with a thumbnail on the right; numbered
// pagination (Prev 1 2 3 Next) swaps between three pages of five posts. Use it for tech
// blogs, engineering changelogs or any archive that reads best as a scannable list.

// Design:
// - White #ffffff background, black #0a0a0a text, electric blue #2563eb for tags, the active
//   page, hover titles, the row accent bar and focus rings; gray #6b7280 for meta
// - Rows are separated by 1px black/10 rules; each is a grid of mono date column (from sm) ·
//   content · thumbnail (w-24 → sm:w-40 → md:w-56, 4:3, rounded-lg)
// - Headline text-lg → sm:text-2xl semibold tight; tags are mono "#rust" links; the summary is
//   line-clamped to two lines and hidden below sm to keep rows compact
// - Hover/focus: a 3px blue bar grows on the row's left edge, the title turns blue and the
//   photo zooms slightly; the whole row is clickable via a stretched link
// - Pages slide 24px in the direction of travel with AnimatePresence (fade only for reduced
//   motion); the pager wraps under the status line on mobile

// What it does:
// - page state (1–3) drives which five posts render; Prev/Next are disabled at the ends and
//   number buttons carry aria-current="page"
// - After a page change the "Page X of 3" status (aria-live) receives focus and, when it is
//   above the viewport, the list scrolls back into view
// - Titles link to #byte-notes-<id>, tags to #byte-notes-tag-<tag>, "RSS feed" to
//   #byte-notes-rss

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PaginatedRowsLatestPosts from '@/TestComponent/PageSections/media/LatestPosts02';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <PaginatedRowsLatestPosts />
//     </main>
// )
// ```

'use client'

import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { HiArrowUpRight, HiChevronLeft, HiChevronRight, HiOutlineClock, HiOutlineRss } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const PER_PAGE = 5

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=80`

const posts = [
    { id: '40kb-web-app', date: '2026-09-24', day: 'Thu', title: 'Shipping a 40 KB web app in 2026: our budget, line by line', summary: 'Every dependency had to earn its bytes. Here is the spreadsheet we used, and the three libraries that did not make the cut.', tags: ['performance', 'javascript'], author: 'Priya Raman', read: 12, image: img('1461749280684-dccba630e2f6'), alt: 'Lines of code glowing on a dark screen' },
    { id: 'ownership-coffee', date: '2026-09-21', day: 'Mon', title: 'Rust ownership, explained with a coffee shop queue', summary: 'Borrowing, moving and lifetimes, mapped onto cups, baristas and the one customer who never leaves.', tags: ['rust', 'beginners'], author: 'Leo Hartmann', read: 9, image: img('1515879218367-8466d910aaa4'), alt: 'Close-up of colourful source code on a monitor' },
    { id: 'deleted-indexes', date: '2026-09-18', day: 'Fri', title: 'The Postgres indexes we deleted, and why queries got faster', summary: 'Nineteen unused indexes were slowing every write. How we found them with pg_stat_user_indexes and a week of patience.', tags: ['postgres', 'databases'], author: 'Sara Lindqvist', read: 14, image: img('1551288049-bebda4e38f71'), alt: 'Dark analytics dashboard with charts and figures' },
    { id: 'container-queries', date: '2026-09-15', day: 'Tue', title: 'A field guide to CSS container queries', summary: 'Twelve real components we rewrote from media queries, with before-and-after snippets you can copy.', tags: ['css', 'frontend'], author: 'Mina Park', read: 8, image: img('1498050108023-c5249f4df085'), alt: 'Laptop showing code on a wooden desk' },
    { id: 'on-call-312', date: '2026-09-12', day: 'Sat', title: 'What our on-call rota learned from 312 pages', summary: 'Two-thirds of alerts were noise. The dashboard, runbook and rota changes that got us to four pages a week.', tags: ['devops', 'sre'], author: 'Tomasz Wójcik', read: 11, image: img('1558494949-ef010cbdcc31'), alt: 'Bundles of network cables plugged into a server' },
    { id: 'edge-vs-vps', date: '2026-09-09', day: 'Wed', title: 'Edge functions vs. a boring VPS: a three-month cost diary', summary: 'Same app, two deployments, every invoice logged. The winner depended on one surprising number.', tags: ['cloud', 'infrastructure'], author: 'Leo Hartmann', read: 10, image: img('1544197150-b99a580bb7a8'), alt: 'Network patch panel with rows of connected cables' },
    { id: 'typed-sql', date: '2026-09-06', day: 'Sun', title: 'Type-safe SQL without an ORM', summary: 'Generating TypeScript types from migrations so the compiler catches the query bugs your tests miss.', tags: ['typescript', 'databases'], author: 'Sara Lindqvist', read: 7, image: img('1555066931-4365d14bab8c'), alt: 'Code editor open on a monitor' },
    { id: 'canvas-timeline', date: '2026-09-03', day: 'Thu', title: 'Building a 60 fps canvas timeline for 50,000 events', summary: 'Culling, dirty rectangles and an OffscreenCanvas worker: the three steps that stopped our timeline from stuttering.', tags: ['canvas', 'performance'], author: 'Mina Park', read: 13, image: img('1517336714731-489689fd1ca8'), alt: 'Laptop lit by purple neon light' },
    { id: 'shortcuts', date: '2026-08-31', day: 'Mon', title: 'The keyboard shortcuts that save me an hour a week', summary: 'Editor, terminal and browser shortcuts ranked by the minutes they actually saved over a month of tracking.', tags: ['tooling', 'productivity'], author: 'Priya Raman', read: 5, image: img('1486312338219-ce68d2c6f44d'), alt: 'Hands typing on a laptop keyboard' },
    { id: 'slm-pi', date: '2026-08-28', day: 'Fri', title: 'Running small language models on a Raspberry Pi 5', summary: 'Quantisation settings, tokens per second and the thermal pad that doubled our throughput.', tags: ['ai', 'hardware'], author: 'Tomasz Wójcik', read: 15, image: img('1518770660439-4636190af475'), alt: 'Close-up of a green circuit board' },
    { id: 'plain-markdown', date: '2026-08-25', day: 'Tue', title: 'Why we moved our docs back to plain Markdown', summary: 'After two docs platforms and one migration script too many, fewer features turned out to mean more writing.', tags: ['docs', 'writing'], author: 'Mina Park', read: 6, image: img('1517694712202-14dd9538aa97'), alt: 'Laptop with code beside a small plant' },
    { id: 'stream-leak', date: '2026-08-22', day: 'Sat', title: 'Debugging a memory leak in a Node.js stream', summary: 'Heap snapshots, a forgotten listener and the one-line fix that dropped memory from 2.1 GB to 180 MB.', tags: ['node', 'debugging'], author: 'Leo Hartmann', read: 12, image: img('1504639725590-34d0984388bd'), alt: 'Pair of glasses in front of monitors showing code' },
    { id: 'git-worktrees', date: '2026-08-19', day: 'Wed', title: 'Git worktrees are the feature you are not using', summary: 'Review a PR, run a hotfix and keep your half-finished branch intact, all without a single stash.', tags: ['git', 'tooling'], author: 'Priya Raman', read: 6, image: img('1496181133206-80ce9b88a853'), alt: 'Open laptop on a clean desk' },
    { id: 'a11y-ci', date: '2026-08-16', day: 'Sun', title: 'Accessibility audits in CI with zero new dependencies', summary: 'A 90-line script, the browser you already test with, and a report your designers will actually read.', tags: ['accessibility', 'testing'], author: 'Sara Lindqvist', read: 9, image: img('1511707171634-5f897ff02aa9'), alt: 'Smartphone resting on a laptop keyboard' },
    { id: 'snake-1983', date: '2026-08-13', day: 'Thu', title: 'Retro weekend: porting Snake to a 1983 home micro', summary: '16 KB of RAM, a 3.5 MHz CPU and a surprising amount of joy. Source code included.', tags: ['retro', 'fun'], author: 'Tomasz Wójcik', read: 8, image: img('1550745165-9bc0b252726f'), alt: 'Vintage computers lit by pink neon' },
]

const PAGES = Math.ceil(posts.length / PER_PAGE)

export function PaginatedRowsLatestPosts({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const [page, setPage] = useState(1)
    const [direction, setDirection] = useState(1)
    const statusRef = useRef(null)

    const start = (page - 1) * PER_PAGE
    const pagePosts = posts.slice(start, start + PER_PAGE)

    const goTo = (next) => {
        if (next < 1 || next > PAGES || next === page) return
        setDirection(next > page ? 1 : -1)
        setPage(next)
        const status = statusRef.current
        if (status) {
            status.focus({ preventScroll: true })
            if (status.getBoundingClientRect().top < 0) {
                status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
            }
        }
    }

    const shift = reduceMotion ? 0 : 24
    const pageVariants = {
        enter: (dir) => ({ opacity: 0, x: dir * shift }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => ({ opacity: 0, x: -dir * shift }),
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative overflow-hidden bg-white py-16 text-base font-normal text-[#0a0a0a] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 border-b-2 border-[#0a0a0a] pb-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-sm font-bold text-[#0a0a0a]">
                            byte<span className="text-[#2563eb]">_</span>notes
                            <span className="ml-3 font-normal text-[#6b7280]">/ latest</span>
                        </p>
                        <h2 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.02] tracking-tight text-[#0a0a0a] sm:text-5xl lg:text-6xl">
                            Latest notes from the terminal<span className="text-[#2563eb]">.</span>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-3 md:items-end md:text-right">
                        <p className="max-w-xs text-sm leading-relaxed text-[#6b7280]">
                            Deep dives on performance, Rust, databases and the tools we use daily. 15 posts this
                            quarter.
                        </p>
                        <a
                            href="#byte-notes-rss"
                            className="inline-flex min-h-10 items-center gap-2 self-start rounded-full border border-[#0a0a0a]/15 px-4 font-mono text-xs font-semibold text-[#0a0a0a] transition-colors hover:border-[#2563eb] hover:text-[#2563eb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] md:self-end"
                        >
                            <HiOutlineRss aria-hidden="true" className="size-4" />
                            RSS feed
                        </a>
                    </div>
                </div>

                <p
                    ref={statusRef}
                    tabIndex={-1}
                    aria-live="polite"
                    className="scroll-mt-6 pt-5 font-mono text-xs text-[#6b7280] focus:outline-none"
                >
                    Page {page} of {PAGES} · posts {start + 1}–{start + pagePosts.length} of {posts.length}
                </p>

                <div className="relative">
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                        <motion.ol
                            key={page}
                            custom={direction}
                            variants={pageVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.28, ease: 'easeOut' }}
                            className="mt-2 divide-y divide-[#0a0a0a]/10"
                        >
                            {pagePosts.map((post) => (
                                <li key={post.id}>
                                    <article className="group relative grid grid-cols-[1fr_auto] items-start gap-4 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-6 md:py-8">
                                        <span
                                            aria-hidden="true"
                                            className="absolute -left-3 top-6 bottom-6 w-[3px] origin-top scale-y-0 rounded-full bg-[#2563eb] transition-transform duration-300 group-focus-within:scale-y-100 group-hover:scale-y-100 motion-reduce:transition-none sm:-left-5"
                                        />
                                        <p className="hidden pt-1 font-mono text-xs leading-relaxed text-[#6b7280] sm:block">
                                            <time dateTime={post.date} className="block text-[#0a0a0a]">
                                                {post.date}
                                            </time>
                                            {post.day}
                                        </p>
                                        <div className="min-w-0">
                                            <ul className="relative z-10 flex flex-wrap gap-x-3 gap-y-1">
                                                {post.tags.map((tag) => (
                                                    <li key={tag}>
                                                        <a
                                                            href={`#byte-notes-tag-${tag}`}
                                                            className="inline-flex min-h-6 items-center font-mono text-xs font-semibold text-[#2563eb] hover:underline focus-visible:outline-2 focus-visible:outline-[#2563eb]"
                                                        >
                                                            #{tag}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                            <h3 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-[#0a0a0a] transition-colors group-hover:text-[#2563eb] sm:text-2xl">
                                                <a
                                                    href={`#byte-notes-${post.id}`}
                                                    className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-[#2563eb]"
                                                >
                                                    {post.title}
                                                </a>
                                            </h3>
                                            <p className="mt-2 hidden text-sm leading-relaxed text-[#6b7280] sm:block">
                                                <span className="line-clamp-2">{post.summary}</span>
                                            </p>
                                            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6b7280]">
                                                <time dateTime={post.date} className="font-mono sm:hidden">
                                                    {post.date}
                                                </time>
                                                <span className="font-semibold text-[#0a0a0a]">{post.author}</span>
                                                <span className="inline-flex items-center gap-1">
                                                    <HiOutlineClock aria-hidden="true" className="size-3.5" />
                                                    {post.read} min read
                                                </span>
                                            </p>
                                        </div>
                                        <div className="relative aspect-[4/3] w-24 overflow-hidden rounded-lg bg-[#0a0a0a]/5 sm:w-40 md:w-56">
                                            <img
                                                src={post.image}
                                                alt={post.alt}
                                                loading="lazy"
                                                className="size-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                            />
                                            <span
                                                aria-hidden="true"
                                                className="absolute right-2 top-2 hidden size-8 items-center justify-center rounded-full bg-white text-[#2563eb] opacity-0 transition-opacity group-hover:opacity-100 md:flex"
                                            >
                                                <HiArrowUpRight className="size-4" />
                                            </span>
                                        </div>
                                    </article>
                                </li>
                            ))}
                        </motion.ol>
                    </AnimatePresence>
                </div>

                <nav
                    aria-label="Latest posts pages"
                    className="mt-4 flex flex-col items-center justify-between gap-4 border-t-2 border-[#0a0a0a] pt-6 sm:flex-row"
                >
                    <p className="font-mono text-xs text-[#6b7280]">
                        Showing {start + 1}–{start + pagePosts.length} of {posts.length}
                    </p>
                    <ul className="flex items-center gap-1.5">
                        <li>
                            <button
                                type="button"
                                disabled={page === 1}
                                aria-label="Previous page"
                                className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a]/5 focus-visible:outline-2 focus-visible:outline-[#2563eb] disabled:cursor-not-allowed disabled:text-[#0a0a0a]/30 disabled:hover:bg-transparent"
                                onClick={() => goTo(page - 1)}
                            >
                                <HiChevronLeft aria-hidden="true" className="size-4" />
                                Prev
                            </button>
                        </li>
                        {Array.from({ length: PAGES }, (_, index) => index + 1).map((number) => (
                            <li key={number}>
                                <button
                                    type="button"
                                    aria-label={`Page ${number}`}
                                    aria-current={page === number ? 'page' : undefined}
                                    className={cn(
                                        'flex size-10 items-center justify-center rounded-lg font-mono text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb]',
                                        page === number
                                            ? 'bg-[#2563eb] text-white'
                                            : 'border border-[#0a0a0a]/15 text-[#0a0a0a] hover:border-[#2563eb] hover:text-[#2563eb]',
                                    )}
                                    onClick={() => goTo(number)}
                                >
                                    {number}
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                type="button"
                                disabled={page === PAGES}
                                aria-label="Next page"
                                className="inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a]/5 focus-visible:outline-2 focus-visible:outline-[#2563eb] disabled:cursor-not-allowed disabled:text-[#0a0a0a]/30 disabled:hover:bg-transparent"
                                onClick={() => goTo(page + 1)}
                            >
                                Next
                                <HiChevronRight aria-hidden="true" className="size-4" />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>
    )
}

export default PaginatedRowsLatestPosts
