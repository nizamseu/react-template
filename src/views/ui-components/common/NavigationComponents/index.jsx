import { Component, Suspense, lazy, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { HiOutlineSearch } from 'react-icons/hi';

const navigationModules = import.meta.glob(
    '@/TestComponent/Navigation/*/*.jsx',
)

const categoryLabels = {
    all: 'All Navigation',
    Dropdown: 'Dropdowns',
    Menu: 'Menus',
    Pagination: 'Pagination',
    Steps: 'Step Indicators',
    Tabs: 'Navigation Tabs',
}

const entries = Object.entries(navigationModules)
    .map(([path, load]) => {
        const parts = path.split('/')
        const file = parts[parts.length - 1]
        const category = parts[parts.length - 2]
        const name = file.replace('.jsx', '')
        return {
            category,
            load,
            name,
            path,
        }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

const categoryKeys = [
    'all',
    'Dropdown',
    'Menu',
    'Pagination',
    'Steps',
    'Tabs',
]

const initialParams = new URLSearchParams(
    typeof window === 'undefined' ? '' : window.location.search,
)

const lazyComponents = new Map()
const getLazy = (entry) => {
    if (!lazyComponents.has(entry.path)) {
        lazyComponents.set(entry.path, lazy(entry.load))
    }
    return lazyComponents.get(entry.path)
}

class PreviewBoundary extends Component {
    state = { error: null }

    static getDerivedStateFromError(error) {
        return { error }
    }

    render() {
        if (this.state.error) {
            return (
                <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                    {this.props.name} failed to render:{' '}
                    {String(this.state.error.message || this.state.error)}
                </p>
            )
        }
        return this.props.children
    }
}

const NavigationComponents = () => {
    const [selectedCategory, setSelectedCategory] = useState(
        categoryKeys.includes(initialParams.get('category'))
            ? initialParams.get('category')
            : 'all',
    )
    const [searchQuery, setSearchQuery] = useState('')

    const filteredComponents = useMemo(() => {
        return entries.filter((entry) => {
            const matchesCat =
                selectedCategory === 'all' || entry.category === selectedCategory
            const matchesSearch =
                !searchQuery.trim() ||
                entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                entry.category.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCat && matchesSearch
        })
    }, [selectedCategory, searchQuery])

    const categoryCounts = useMemo(() => {
        const counts = { all: entries.length }
        entries.forEach((e) => {
            counts[e.category] = (counts[e.category] || 0) + 1
        })
        return counts
    }, [])

    return (
        <main className="space-y-6 pb-12">
            {/* Header */}
            <header className="flex flex-col justify-between gap-5 border-b border-gray-200 pb-5 dark:border-gray-700 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2a85ff]">
                        Design library / Navigation variants
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Navigation component studio
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                        Individual variant single-file navigation components with pure Tailwind CSS,
                        interactive states, and fluid responsive styling.
                    </p>
                    <nav
                        aria-label="Design library"
                        className="mt-4 inline-flex flex-wrap rounded-md border border-gray-200 bg-white p-1 text-xs font-semibold dark:border-gray-700 dark:bg-gray-800"
                    >
                        <Link
                            className="rounded px-3 py-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            to="/design-studio"
                        >
                            Section designs
                        </Link>
                        <Link
                            className="rounded px-3 py-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            to="/page-sections"
                        >
                            Page sections
                        </Link>
                        <Link
                            className="rounded px-3 py-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            to="/form-components"
                        >
                            Form components
                        </Link>
                        <Link
                            className="rounded px-3 py-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            to="/feedback-components"
                        >
                            Feedback components
                        </Link>
                        <Link
                            aria-current="page"
                            className="rounded bg-[#2a85ff] px-3 py-1.5 text-white"
                            to="/navigation-components"
                        >
                            Navigation components
                        </Link>
                    </nav>
                </div>

                {/* Search */}
                <div className="relative min-w-[260px]">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-gray-400" />
                    <input
                        aria-label="Search navigation variants"
                        className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#2a85ff] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        placeholder="Search navigation variants..."
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </header>

            {/* Category Filter Pills */}
            <div
                aria-label="Navigation component categories"
                className="flex flex-wrap gap-2"
                role="tablist"
            >
                {categoryKeys.map((catKey) => {
                    const isSelected = selectedCategory === catKey
                    const count = categoryCounts[catKey] || 0
                    return (
                        <button
                            key={catKey}
                            aria-selected={isSelected}
                            className={`min-h-9 rounded-md px-3.5 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                                isSelected
                                    ? 'bg-[#2a85ff] text-white shadow-sm'
                                    : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'
                            }`}
                            role="tab"
                            type="button"
                            onClick={() => setSelectedCategory(catKey)}
                        >
                            <span>{categoryLabels[catKey] || catKey}</span>
                            <span
                                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                                    isSelected
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {count}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Category Title & Count */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {categoryLabels[selectedCategory] || selectedCategory}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                        Showing {filteredComponents.length} component variant{filteredComponents.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Component Cards Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {filteredComponents.map((entry, index) => {
                    const Comp = getLazy(entry)
                    return (
                        <div
                            key={entry.path}
                            className="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800/80 transition hover:border-gray-300 dark:hover:border-gray-600"
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-700/60">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-[#2a85ff]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                        {entry.name}
                                    </span>
                                </div>
                                <span className="rounded bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-[#2a85ff] dark:bg-blue-950/40 dark:text-blue-300">
                                    {entry.category}
                                </span>
                            </div>

                            {/* Card Preview Body */}
                            <div className="flex flex-1 items-center justify-center p-6 bg-gray-50/40 dark:bg-gray-900/30 min-h-[140px]">
                                <div className="w-full max-w-md flex justify-center">
                                    <PreviewBoundary name={entry.name}>
                                        <Suspense
                                            fallback={
                                                <div className="flex h-20 items-center justify-center text-xs text-gray-400">
                                                    Loading preview...
                                                </div>
                                            }
                                        >
                                            <Comp />
                                        </Suspense>
                                    </PreviewBoundary>
                                </div>
                            </div>
                        </div>
                    )
                })}

                {filteredComponents.length === 0 && (
                    <div className="col-span-full rounded-lg border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500 dark:border-gray-700">
                        No navigation components match your search criteria.
                    </div>
                )}
            </div>
        </main>
    )
}

export default NavigationComponents;
