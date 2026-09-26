import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { HiArrowRight, HiChevronDown, HiOutlineSearch } from 'react-icons/hi'

const menuContent = {
    ecommerce: {
        eyebrow: 'THE SHOP, THOUGHTFULLY EDITED',
        title: 'Find your next favorite.',
        links: [
            'New arrivals',
            'Everyday objects',
            'Independent makers',
            'The gift edit',
            'Circular collection',
            'Materials & care',
        ],
        note: 'Small-batch goods and makers worth knowing.',
    },
    learning: {
        eyebrow: 'LEARN BY MAKING',
        title: 'Choose your next step.',
        links: [
            'Browse every course',
            'Career learning paths',
            'Live studio classes',
            'Meet the mentors',
            'Project library',
            'Free field notes',
        ],
        note: 'Short lessons. Real practice. A clear next step.',
    },
    saas: {
        eyebrow: 'NORTHSTAR / PLATFORM',
        title: 'A clearer way to move work.',
        links: [
            'Platform overview',
            'Team workspaces',
            'Automation & workflows',
            'Integrations',
            'Customer stories',
            'Trust & security',
        ],
        note: 'One calm command center for focused teams.',
    },
    media: {
        eyebrow: 'MARGIN / THE EDITION',
        title: 'Follow a good question.',
        links: [
            'Latest stories',
            'The long read',
            'Culture & ideas',
            'Audio conversations',
            'Sunday edition',
            'From the archive',
        ],
        note: 'Independent stories for people who look closer.',
    },
    community: {
        eyebrow: 'COMMONROOM / FIND YOUR PEOPLE',
        title: 'There is room for your thing.',
        links: [
            'Discover groups',
            'What is happening nearby',
            'Member stories',
            'Start a community',
            'Community guidelines',
            'Meet in real life',
        ],
        note: 'Curious, generous, and better together.',
    },
    corporate: {
        eyebrow: 'NORTHSTAR / ADVISORY',
        title: 'Perspective for what comes next.',
        links: [
            'Strategy & growth',
            'Transformation',
            'Organization design',
            'Client outcomes',
            'Ideas & insights',
            'Meet the team',
        ],
        note: 'Independent thinking for complex moments.',
    },
    portfolio: {
        eyebrow: 'JAMIE PARK / INDEPENDENT DESIGN',
        title: 'A little more about the work.',
        links: [
            'Selected projects',
            'Brand & identity',
            'Digital products',
            'Experiments',
            'Studio notes',
            'About Jamie',
        ],
        note: 'Useful things, made with feeling.',
    },
    booking: {
        eyebrow: 'ELSEWHERE / PLACES & PEOPLE',
        title: 'Find somewhere that stays with you.',
        links: [
            'Coastal stays',
            'Cabins & countryside',
            'City hideaways',
            'Local experiences',
            'Meet the hosts',
            'Travel field notes',
        ],
        note: 'Go gently. Get to know the place.',
    },
    directory: {
        eyebrow: 'GOOD NEIGHBOR / LOCAL INDEX',
        title: 'Good work is closer than you think.',
        links: [
            'Home & repair',
            'Food & independent shops',
            'Health & care',
            'Creative services',
            'Verified listings',
            'List your business',
        ],
        note: 'Independent people, useful details, no sponsored surprises.',
    },
    knowledge: {
        eyebrow: 'NORTHSTAR / DOCUMENTATION',
        title: 'Get unstuck. Keep building.',
        links: [
            'Quickstart guides',
            'Product handbook',
            'API reference',
            'SDKs & examples',
            'Release notes',
            'Get support',
        ],
        note: 'Clear answers, kept fresh by the people who know.',
    },
}

const menuLabels = {
    ecommerce: 'Shop',
    learning: 'Learn',
    saas: 'Platform',
    media: 'Stories',
    community: 'Community',
    corporate: 'Expertise',
    portfolio: 'Work',
    booking: 'Places',
    directory: 'Local index',
    knowledge: 'Documentation',
}

const menuVisuals = {
    ecommerce: {
        surface: '#f3eee6',
        ink: '#1c1b19',
        photo: 'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85',
        accents: ['#9a704b', '#d6f36a', '#a84f34', '#8b6243', '#d9ba98'],
    },
    learning: {
        surface: '#f5f1e8',
        ink: '#102d36',
        photo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85',
        accents: ['#3c7e5d', '#c8ef70', '#41715d', '#7fac58', '#95c77b'],
    },
    saas: {
        surface: '#edf3ee',
        ink: '#111a22',
        photo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85',
        accents: ['#17a878', '#65e6b4', '#375899', '#a8d5ff', '#4bc79a'],
    },
    media: {
        surface: '#f3eee5',
        ink: '#28221e',
        photo: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85',
        accents: ['#a84f34', '#e7a37c', '#b55b42', '#c57a56', '#8c3b2c'],
    },
    community: {
        surface: '#f7ede6',
        ink: '#27201d',
        photo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85',
        accents: ['#a34c38', '#ffccad', '#d2785a', '#ed9b76', '#863a2b'],
    },
    corporate: {
        surface: '#e9edf1',
        ink: '#121c2c',
        photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85',
        accents: ['#3476c5', '#84b9ff', '#4e8bd1', '#7aa8d9', '#285a98'],
    },
    portfolio: {
        surface: '#f1e9de',
        ink: '#241d1a',
        photo: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=85',
        accents: ['#ef6a4b', '#f1e9de', '#d45a3c', '#f29c7b', '#be472e'],
    },
    booking: {
        surface: '#e5ede8',
        ink: '#132d3a',
        photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85',
        accents: ['#b65f47', '#f0aa8d', '#e07d5b', '#d5836c', '#93442f'],
    },
    directory: {
        surface: '#edf1e6',
        ink: '#1a2826',
        photo: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85',
        accents: ['#527354', '#d9f064', '#72926d', '#a7c33d', '#365a3c'],
    },
    knowledge: {
        surface: '#e8f0eb',
        ink: '#17231f',
        photo: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=85',
        accents: ['#41715d', '#9bd2a7', '#5b8e76', '#78a88a', '#2f5b48'],
    },
}

const MegaMenu = ({ category, accent, variant = 1, className = '' }) => {
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [panelPosition, setPanelPosition] = useState(null)
    const triggerRef = useRef(null)
    const panelRef = useRef(null)
    const closeTimerRef = useRef(null)
    const content = menuContent[category] || menuContent.ecommerce
    const visual = menuVisuals[category] || menuVisuals.ecommerce
    const menuVariant = ((variant - 1) % 5) + 1
    const menuAccent = visual.accents[menuVariant - 1] || accent
    const filteredLinks = content.links.filter((link) =>
        link.toLowerCase().includes(filter.toLowerCase()),
    )

    const updatePanelPosition = () => {
        const header = triggerRef.current?.closest('header')
        if (!header) return

        const bounds = header.getBoundingClientRect()
        const width = Math.min(bounds.width, window.innerWidth - 32)
        const left = Math.min(
            Math.max(bounds.left, 16),
            window.innerWidth - width - 16,
        )

        setPanelPosition({
            top: bounds.bottom + 8,
            left,
            width,
        })
    }

    useLayoutEffect(() => {
        if (!open) return undefined

        updatePanelPosition()
        window.addEventListener('resize', updatePanelPosition)
        window.addEventListener('scroll', updatePanelPosition, true)

        return () => {
            window.removeEventListener('resize', updatePanelPosition)
            window.removeEventListener('scroll', updatePanelPosition, true)
        }
    }, [open])

    const cancelClose = () => {
        window.clearTimeout(closeTimerRef.current)
    }

    const scheduleClose = () => {
        cancelClose()
        closeTimerRef.current = window.setTimeout(() => setOpen(false), 140)
    }

    const closeMenu = () => {
        cancelClose()
        setOpen(false)
    }

    const handleBlur = (event) => {
        if (
            !triggerRef.current?.contains(event.relatedTarget) &&
            !panelRef.current?.contains(event.relatedTarget)
        ) {
            scheduleClose()
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Escape') closeMenu()
    }

    const renderLink = (link, index, className = '') => (
        <a
            key={link}
            href={`#${category}-menu-${index + 1}`}
            className={className}
            onClick={closeMenu}
        >
            {link}
        </a>
    )

    const renderLayout = () => {
        if (menuVariant === 1) {
            return (
                <div className="grid min-h-72 md:grid-cols-[.82fr_1.18fr]">
                    <div className="relative flex min-h-56 flex-col justify-end overflow-hidden p-6 text-white sm:p-8">
                        <img
                            src={visual.photo}
                            alt=""
                            className="absolute inset-0 -z-10 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/80">
                            {content.eyebrow}
                        </p>
                        <h2 className="mt-3 max-w-sm font-serif text-3xl leading-tight">
                            {content.title}
                        </h2>
                        <p className="mt-3 max-w-xs text-xs leading-5 text-white/80">
                            {content.note}
                        </p>
                    </div>
                    <nav
                        aria-label={`${menuLabels[category]} destinations`}
                        className="grid grid-cols-1 content-center gap-x-5 px-5 py-4 sm:grid-cols-2 sm:px-7"
                    >
                        {content.links.map((link, index) =>
                            renderLink(
                                link,
                                index,
                                'group flex min-h-12 items-center justify-between gap-3 border-t border-gray-200/80 py-3 text-sm font-medium text-gray-800 transition-colors hover:text-gray-500 dark:border-gray-700 dark:text-gray-100 dark:hover:text-gray-300',
                            ),
                        )}
                    </nav>
                </div>
            )
        }

        if (menuVariant === 2) {
            return (
                <div
                    className="grid gap-8 p-6 text-white sm:p-9 lg:grid-cols-[.8fr_1.2fr]"
                    style={{ backgroundColor: visual.ink }}
                >
                    <div className="flex flex-col justify-between gap-7">
                        <div>
                            <p
                                className="text-[10px] font-bold uppercase tracking-[.16em]"
                                style={{ color: menuAccent }}
                            >
                                {content.eyebrow}
                            </p>
                            <h2 className="mt-4 max-w-sm text-3xl font-semibold leading-tight sm:text-4xl">
                                {content.title}
                            </h2>
                        </div>
                        <p className="max-w-xs text-xs leading-5 text-white/65">
                            {content.note}
                        </p>
                    </div>
                    <nav
                        aria-label={`${menuLabels[category]} destinations`}
                        className="grid grid-cols-1 gap-x-5 sm:grid-cols-2"
                    >
                        {content.links.map((link, index) =>
                            renderLink(
                                link,
                                index,
                                'group flex min-h-14 items-center justify-between gap-3 border-t border-white/15 py-3 text-base font-medium text-white transition-colors hover:text-white/60',
                            ),
                        )}
                    </nav>
                </div>
            )
        }

        if (menuVariant === 3) {
            return (
                <div
                    className="p-6 sm:p-8"
                    style={{
                        backgroundColor: visual.surface,
                        color: visual.ink,
                    }}
                >
                    <div className="flex flex-col justify-between gap-5 border-b border-black/10 pb-6 sm:flex-row sm:items-end">
                        <div>
                            <p
                                className="text-[10px] font-bold uppercase tracking-[.16em]"
                                style={{ color: menuAccent }}
                            >
                                {content.eyebrow}
                            </p>
                            <h2 className="mt-3 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl">
                                {content.title}
                            </h2>
                        </div>
                        <p className="max-w-xs text-xs leading-5 opacity-70">
                            {content.note}
                        </p>
                    </div>
                    <nav
                        aria-label={`${menuLabels[category]} destinations`}
                        className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {content.links.map((link, index) =>
                            renderLink(
                                link,
                                index,
                                'group flex min-h-20 flex-col justify-between rounded-md border border-black/10 bg-white/60 p-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-1 hover:bg-white',
                            ),
                        )}
                    </nav>
                </div>
            )
        }

        if (menuVariant === 4) {
            return (
                <div
                    className="p-6 sm:p-8"
                    style={{
                        backgroundColor: visual.surface,
                        color: visual.ink,
                    }}
                >
                    <div className="grid gap-6 md:grid-cols-[.8fr_1.2fr]">
                        <div>
                            <p
                                className="text-[10px] font-bold uppercase tracking-[.16em]"
                                style={{ color: menuAccent }}
                            >
                                {content.eyebrow}
                            </p>
                            <h2 className="mt-3 max-w-xs text-3xl font-semibold leading-tight">
                                {content.title}
                            </h2>
                            <p className="mt-3 max-w-xs text-xs leading-5 opacity-70">
                                {content.note}
                            </p>
                        </div>
                        <div>
                            <label className="flex min-h-12 items-center gap-3 rounded-md border border-black/15 bg-white px-4">
                                <HiOutlineSearch aria-hidden="true" />
                                <input
                                    type="search"
                                    value={filter}
                                    placeholder={`Search ${menuLabels[category].toLowerCase()}...`}
                                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500"
                                    onChange={(event) =>
                                        setFilter(event.target.value)
                                    }
                                />
                            </label>
                            <nav
                                aria-label={`${menuLabels[category]} search results`}
                                className="mt-3 grid grid-cols-1 gap-x-5 sm:grid-cols-2"
                            >
                                {filteredLinks.length ? (
                                    filteredLinks.map((link) => {
                                        const index =
                                            content.links.indexOf(link)
                                        return renderLink(
                                            link,
                                            index,
                                            'flex min-h-10 items-center border-b border-black/10 py-2 text-sm transition-colors hover:opacity-60',
                                        )
                                    })
                                ) : (
                                    <p className="py-4 text-sm opacity-65">
                                        No matches. Try another search.
                                    </p>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className="grid gap-3 bg-[#111a22] p-5 text-white sm:grid-cols-3 sm:p-7">
                <div className="relative min-h-52 overflow-hidden rounded-md sm:row-span-2">
                    <img
                        src={visual.photo}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-white/80">
                            {content.eyebrow}
                        </p>
                        <h2 className="mt-2 font-serif text-2xl">
                            {content.title}
                        </h2>
                    </div>
                </div>
                {content.links.map((link, index) => (
                    <a
                        key={link}
                        href={`#${category}-menu-${index + 1}`}
                        className="group flex min-h-20 items-end justify-between gap-3 rounded-md p-4 text-sm font-semibold transition-transform duration-200 hover:-translate-y-1"
                        style={{
                            backgroundColor:
                                index % 2 ? visual.surface : menuAccent,
                            color: visual.ink,
                        }}
                        onClick={closeMenu}
                    >
                        <span>
                            <span className="mb-2 block font-mono text-[10px] opacity-65">
                                0{index + 1}
                            </span>
                            {link}
                        </span>
                        <HiArrowRight
                            aria-hidden="true"
                            className="mb-1 transition-transform group-hover:translate-x-1"
                        />
                    </a>
                ))}
            </div>
        )
    }

    return (
        <div
            ref={triggerRef}
            className={`relative z-40 w-fit ${className}`}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            onFocusCapture={() => {
                cancelClose()
                setOpen(true)
            }}
            onBlurCapture={handleBlur}
            onKeyDown={handleKeyDown}
        >
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="true"
                aria-controls={`mega-menu-${category}-${variant}`}
                className="inline-flex min-h-9 items-center gap-2 rounded-full border border-current/15 px-3 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
                style={{ outlineColor: accent }}
                onClick={() => {
                    cancelClose()
                    setOpen((value) => !value)
                }}
            >
                Explore {menuLabels[category] || 'the collection'}
                <HiChevronDown
                    aria-hidden="true"
                    className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open &&
                panelPosition &&
                createPortal(
                    <div
                        ref={panelRef}
                        id={`mega-menu-${category}-${variant}`}
                        aria-hidden={!open}
                        className="fixed z-[9999] overflow-auto rounded-xl border border-black/10 shadow-2xl transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none"
                        style={{
                            top: panelPosition.top,
                            left: panelPosition.left,
                            width: panelPosition.width,
                            maxHeight: `calc(100vh - ${panelPosition.top}px - 16px)`,
                            transformOrigin: 'top center',
                        }}
                        inert={!open}
                        onMouseEnter={() => {
                            cancelClose()
                            setOpen(true)
                        }}
                        onMouseLeave={scheduleClose}
                        onBlurCapture={handleBlur}
                        onKeyDown={handleKeyDown}
                    >
                        {renderLayout()}
                    </div>,
                    document.body,
                )}
        </div>
    )
}

export default MegaMenu
