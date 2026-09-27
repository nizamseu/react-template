// MasonryLoadMoreLatestPosts

// LatestPosts01 · Blogs & Digital Media › Latest Posts Grid / Feed

// Description:
// A warm, outdoorsy latest-stories wall for the fictional travel blog Wanderleaf. Under the
// serif heading "Fresh from the trail" readers filter 18 posts by category chips (All, Coast,
// Mountains, Cities, Wild camping, Slow travel) and browse masonry cards with photo, place,
// title, author and read time; "Load more stories" appends six posts at a time until the list
// ends. Use it as the home-page feed or a category archive of a travel or lifestyle blog.

// Design:
// - Cream #fbf6ec background, forest green #234e3a for headings, active chips, the progress
//   bar and the button; cards are #fffdf8 with a forest/10 border, rounded-[26px] and a soft
//   green-tinted shadow on hover
// - Masonry: posts are placed greedily into the shortest of 1 → sm:2 → lg:3 flex columns
//   (photo ratios 4:5, 3:4, 1:1, 4:3), so newly loaded posts always land at the column bottoms
// - Serif headings (text-4xl → md:text-6xl, italic accent word), small uppercase place labels
//   with a pin icon, chips with counts; chip row scrolls sideways on narrow screens
// - Cards fade and rise in with a short stagger when they appear; photos zoom to 1.06 and
//   cards lift 4px on hover (both off for reduced motion)

// What it does:
// - Chips (aria-pressed) filter by category and reset the list to the first six posts
// - "Load more stories" adds six posts, moves focus to the first new card and updates
//   "Showing X of Y" (aria-live) plus the progress bar; at the end it becomes a
//   "You’ve reached the end of the trail" note
// - The column count follows (min-width: 640px) / (min-width: 1024px) media queries via
//   useSyncExternalStore (one column during server render); cards link to #wanderleaf-<id>

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MasonryLoadMoreLatestPosts from '@/TestComponent/PageSections/media/LatestPosts01';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <MasonryLoadMoreLatestPosts />
//     </main>
// )
// ```

'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HiCheck, HiOutlineMapPin, HiPlus } from 'react-icons/hi2';
import { LuLeaf } from 'react-icons/lu';
import { cn } from '@/design-system/lib/cn';

const PAGE = 6

const categories = ['All', 'Coast', 'Mountains', 'Cities', 'Wild camping', 'Slow travel']

const ratios = {
    tall: { className: 'aspect-[4/5]', height: 1.25 },
    portrait: { className: 'aspect-[3/4]', height: 1.33 },
    square: { className: 'aspect-square', height: 1 },
    wide: { className: 'aspect-[4/3]', height: 0.75 },
}

const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=700&q=80`

const posts = [
    { id: 'cinque-terre', category: 'Coast', place: 'Liguria, Italy', title: 'Five villages, one ferry pass and no plan at all', excerpt: 'We gave ourselves three days, a €39 ferry pass and a rule: no restaurant with a picture menu.', author: 'Ines Moreau', date: 'Sep 24', read: 8, ratio: 'tall', image: img('1516483638261-f4dbaf036963'), alt: 'Pastel houses stacked on a cliff above the sea' },
    { id: 'braies', category: 'Mountains', place: 'Dolomites, Italy', title: 'Rowing Lago di Braies before the day-trippers wake', author: 'Tomas Berg', date: 'Sep 22', read: 6, ratio: 'square', image: img('1476514525535-07fb3b4ae5f1'), alt: 'Wooden rowboat on a still alpine lake below mountains' },
    { id: 'paris-bridges', category: 'Cities', place: 'Paris, France', title: 'A 21 km loop of the Seine bridges, on foot', excerpt: 'All 37 bridges, two bakeries per arrondissement and one very sore pair of feet.', author: 'Amélie Roux', date: 'Sep 20', read: 11, ratio: 'wide', image: img('1499856871958-5b9627545d1a'), alt: 'Bridge over the Seine in Paris at dusk' },
    { id: 'plateau-van', category: 'Slow travel', place: 'Utah, USA', title: 'Six weeks in a 1987 camper across the Colorado Plateau', author: 'Dev & Maya Rao', date: 'Sep 18', read: 14, ratio: 'portrait', image: img('1469854523086-cc02fe5d8800'), alt: 'Camper van on a desert road between red rock formations' },
    { id: 'oia', category: 'Coast', place: 'Santorini, Greece', title: 'Oia in shoulder season, when the whitewash is yours', author: 'Nikos Pappas', date: 'Sep 16', read: 7, ratio: 'wide', image: img('1533105079780-92b9be482077'), alt: 'White cubic houses above a deep blue sea' },
    { id: 'pine-cabin', category: 'Wild camping', place: 'Telemark, Norway', title: 'An off-grid cabin week in the Norwegian pines', excerpt: 'No signal, a wood stove, and a lake cold enough to make coffee taste like a reward.', author: 'Tomas Berg', date: 'Sep 13', read: 9, ratio: 'tall', image: img('1449158743715-0a90ebb6d2d8'), alt: 'Small wooden cabin among tall forest trees' },
    { id: 'haute-route', category: 'Mountains', place: 'Chamonix to Zermatt', title: 'The Haute Route in 11 days, hut by hut', author: 'Lena Fischer', date: 'Sep 11', read: 16, ratio: 'wide', image: img('1539635278303-d4002c07eae3'), alt: 'Two hikers on a ridge with mountains behind' },
    { id: 'moraine', category: 'Mountains', place: 'Banff, Canada', title: 'Moraine Lake at 5 am: was it worth the alarm?', author: 'Jordan Blake', date: 'Sep 9', read: 5, ratio: 'square', image: img('1501785888041-af3ef285b470'), alt: 'Turquoise lake with a small boat below forested mountains' },
    { id: 'bali-month', category: 'Slow travel', place: 'Bali, Indonesia', title: 'A month in Bali without a single beach club', excerpt: 'Rice terraces, a borrowed scooter and a temple ceremony we were kindly invited to.', author: 'Ines Moreau', date: 'Sep 6', read: 12, ratio: 'portrait', image: img('1537996194471-e657df975ab4'), alt: 'Balinese temple on the edge of a misty lake' },
    { id: 'wild-camp-kit', category: 'Wild camping', place: 'Cairngorms, Scotland', title: 'What we pack for two nights of wild camping', author: 'Callum Reid', date: 'Sep 4', read: 6, ratio: 'wide', image: img('1504280390367-361c6d9f38f4'), alt: 'View from inside a tent opening onto a forest' },
    { id: 'kornati', category: 'Coast', place: 'Kornati, Croatia', title: 'Island-hopping the Kornati by sailboat', author: 'Mara Kovač', date: 'Sep 1', read: 10, ratio: 'tall', image: img('1502784444187-359ac186c5bb'), alt: 'Aerial view of boats moored in turquoise water' },
    { id: 'tram-views', category: 'Cities', place: 'Hong Kong', title: 'The best skyline viewpoints you can reach by tram', author: 'Wing Chan', date: 'Aug 29', read: 7, ratio: 'square', image: img('1514565131-fce0801e5785'), alt: 'City skyline glowing at dusk' },
    { id: 'pyrenees', category: 'Mountains', place: 'Pyrenees, Spain', title: 'Sunrise above the clouds from a 2,400 m refuge', author: 'Lena Fischer', date: 'Aug 27', read: 8, ratio: 'portrait', image: img('1506905925346-21bda4d32df4'), alt: 'Mountain peaks rising above a sea of clouds at sunset' },
    { id: 'calas', category: 'Coast', place: 'Menorca, Spain', title: 'Menorca’s hidden calas, reachable only on foot', excerpt: 'The Camí de Cavalls links 18 coves; we walked the southern six in three easy days.', author: 'Amélie Roux', date: 'Aug 24', read: 9, ratio: 'wide', image: img('1510414842594-a61c69b5ae57'), alt: 'Rocky cove with clear turquoise water' },
    { id: 'yucatan', category: 'Slow travel', place: 'Yucatán, Mexico', title: 'Pyramids at opening time, cenotes after lunch', author: 'Dev & Maya Rao', date: 'Aug 21', read: 10, ratio: 'square', image: img('1518638150340-f706e86654de'), alt: 'Stepped Mayan pyramid under a blue sky' },
    { id: 'klaralven', category: 'Wild camping', place: 'Värmland, Sweden', title: 'Canoe camping down the Klarälven river', author: 'Callum Reid', date: 'Aug 18', read: 11, ratio: 'tall', image: img('1473448912268-2022ce9509d8'), alt: 'Calm river winding through a pine forest' },
    { id: 'chicago', category: 'Cities', place: 'Chicago, USA', title: 'The architecture boat tours, ranked honestly', author: 'Jordan Blake', date: 'Aug 15', read: 6, ratio: 'wide', image: img('1480714378408-67cf0d13bc1b'), alt: 'City skyline at sunset over the water' },
    { id: 'rail-first', category: 'Slow travel', place: 'Everywhere', title: 'How we fly less: our rail-first travel rules for 2026', excerpt: 'Seven rules, one exception, and the overnight trains that made them easy to keep.', author: 'Wanderleaf team', date: 'Aug 12', read: 5, ratio: 'portrait', image: img('1530521954074-e64f6810b32d'), alt: 'Traveller relaxing by an airport window with a plane outside' },
]

const COLUMN_QUERIES = ['(min-width: 1024px)', '(min-width: 640px)']

function subscribeColumns(callback) {
    const lists = COLUMN_QUERIES.map((query) => window.matchMedia(query))
    lists.forEach((list) => list.addEventListener('change', callback))
    return () => lists.forEach((list) => list.removeEventListener('change', callback))
}

function getColumns() {
    if (window.matchMedia(COLUMN_QUERIES[0]).matches) return 3
    if (window.matchMedia(COLUMN_QUERIES[1]).matches) return 2
    return 1
}

function distribute(items, count) {
    const columns = Array.from({ length: count }, () => ({ height: 0, items: [] }))
    items.forEach((item, index) => {
        const target = columns.reduce((low, column) => (column.height < low.height ? column : low), columns[0])
        target.items.push({ ...item, order: index })
        target.height += ratios[item.ratio].height + (item.excerpt ? 0.95 : 0.7)
    })
    return columns
}

const initials = (name) =>
    name
        .split(/[\s&]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')

export function MasonryLoadMoreLatestPosts({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const reduceMotion = useReducedMotion()
    const columnCount = useSyncExternalStore(subscribeColumns, getColumns, () => 1)
    const [category, setCategory] = useState('All')
    const [shown, setShown] = useState(PAGE)
    const linkRefs = useRef({})
    const focusIndex = useRef(null)

    const filtered = category === 'All' ? posts : posts.filter((post) => post.category === category)
    const visible = filtered.slice(0, shown)
    const done = visible.length >= filtered.length
    const columns = distribute(visible, columnCount)

    useEffect(() => {
        if (focusIndex.current === null) return
        const target = visible[focusIndex.current]
        focusIndex.current = null
        if (target) linkRefs.current[target.id]?.focus()
    }, [visible])

    const chooseCategory = (name) => {
        setCategory(name)
        setShown(PAGE)
    }

    const loadMore = () => {
        focusIndex.current = visible.length
        setShown((count) => count + PAGE)
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#fbf6ec] py-16 text-base font-normal text-[#234e3a] md:py-24', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="max-w-2xl">
                        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#234e3a]/75">
                            <LuLeaf aria-hidden="true" className="size-4" />
                            Wanderleaf · Latest stories
                        </p>
                        <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.02] tracking-tight text-[#234e3a] sm:text-5xl md:text-6xl">
                            Fresh from the <em>trail</em>
                        </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed text-[#234e3a]/75 md:text-right">
                        New field notes every Tuesday and Friday from 11 writers on five continents. Muddy boots
                        encouraged.
                    </p>
                </div>

                <div
                    role="group"
                    aria-label="Filter stories by category"
                    className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                >
                    {categories.map((name) => {
                        const count = name === 'All' ? posts.length : posts.filter((post) => post.category === name).length
                        const active = category === name
                        return (
                            <button
                                key={name}
                                type="button"
                                aria-pressed={active}
                                className={cn(
                                    'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#234e3a]',
                                    active
                                        ? 'border-[#234e3a] bg-[#234e3a] text-[#fbf6ec]'
                                        : 'border-[#234e3a]/20 bg-[#fffdf8] text-[#234e3a] hover:border-[#234e3a]/60',
                                )}
                                onClick={() => chooseCategory(name)}
                            >
                                {name}
                                <span
                                    className={cn(
                                        'rounded-full px-1.5 text-[11px] tabular-nums',
                                        active ? 'bg-[#fbf6ec]/20 text-[#fbf6ec]' : 'bg-[#234e3a]/10 text-[#234e3a]',
                                    )}
                                >
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-8 flex items-start gap-6">
                    {columns.map((column, columnIndex) => (
                        <div key={`${columnCount}-${columnIndex}`} className="flex min-w-0 flex-1 flex-col gap-6">
                            {column.items.map((post) => (
                                <motion.article
                                    key={post.id}
                                    initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: (post.order % PAGE) * 0.06, ease: 'easeOut' }}
                                    className="group overflow-hidden rounded-[26px] border border-[#234e3a]/10 bg-[#fffdf8] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(35,78,58,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                                >
                                    <a
                                        ref={(node) => {
                                            linkRefs.current[post.id] = node
                                        }}
                                        href={`#wanderleaf-${post.id}`}
                                        className="block rounded-[26px] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#234e3a]"
                                    >
                                        <div className={cn('relative overflow-hidden bg-[#234e3a]/10', ratios[post.ratio].className)}>
                                            <img
                                                src={post.image}
                                                alt={post.alt}
                                                loading="lazy"
                                                className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                                            />
                                            <span className="absolute left-3 top-3 rounded-full bg-[#234e3a] px-3 py-1 text-[11px] font-semibold text-[#fbf6ec]">
                                                {post.category}
                                            </span>
                                        </div>
                                        <div className="p-5 sm:p-6">
                                            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#234e3a]/65">
                                                <HiOutlineMapPin aria-hidden="true" className="size-3.5" />
                                                {post.place}
                                            </p>
                                            <h3 className="mt-2 font-serif text-xl font-normal leading-snug text-[#234e3a] decoration-1 underline-offset-4 group-hover:underline sm:text-2xl">
                                                {post.title}
                                            </h3>
                                            {post.excerpt && (
                                                <p className="mt-2 text-sm leading-relaxed text-[#234e3a]/75">{post.excerpt}</p>
                                            )}
                                            <div className="mt-5 flex items-center gap-3 border-t border-dashed border-[#234e3a]/20 pt-4">
                                                <span
                                                    aria-hidden="true"
                                                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#234e3a]/10 text-[11px] font-bold text-[#234e3a]"
                                                >
                                                    {initials(post.author)}
                                                </span>
                                                <span className="min-w-0 text-xs leading-tight text-[#234e3a]/70">
                                                    <span className="block font-semibold text-[#234e3a]">{post.author}</span>
                                                    {post.date} · {post.read} min read
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                </motion.article>
                            ))}
                        </div>
                    ))}
                </div>

                <div className="mx-auto mt-12 flex max-w-sm flex-col items-center gap-4 text-center">
                    <p aria-live="polite" className="text-sm text-[#234e3a]/75">
                        Showing <span className="font-semibold text-[#234e3a]">{visible.length}</span> of{' '}
                        {filtered.length} {category === 'All' ? 'stories' : `${category} stories`}
                    </p>
                    <div aria-hidden="true" className="h-1 w-full overflow-hidden rounded-full bg-[#234e3a]/10">
                        <div
                            className="h-full rounded-full bg-[#234e3a] transition-[width] duration-500 motion-reduce:transition-none"
                            style={{ width: `${(visible.length / filtered.length) * 100}%` }}
                        />
                    </div>
                    {done ? (
                        <p className="inline-flex min-h-12 items-center gap-2 font-serif text-lg italic text-[#234e3a]">
                            <HiCheck aria-hidden="true" className="size-5" />
                            You’ve reached the end of the trail
                        </p>
                    ) : (
                        <button
                            type="button"
                            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#234e3a] px-7 text-sm font-semibold text-[#fbf6ec] transition-colors hover:bg-[#1a3b2c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#234e3a]"
                            onClick={loadMore}
                        >
                            <HiPlus aria-hidden="true" className="size-4" />
                            Load more stories
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}

export default MasonryLoadMoreLatestPosts
