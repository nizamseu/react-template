import { Component, Suspense, lazy, useMemo, useState } from 'react'
import { Link } from 'react-router'

const sectionModules = import.meta.glob(
    '@/TestComponent/PageSections/*/*.jsx',
)

const categoryLabels = {
    ecommerce: 'E-commerce & Marketplaces',
    learning: 'Learning Management Systems',
    saas: 'SaaS Platforms',
    media: 'Blogs & Digital Media',
    community: 'Social Networks & Communities',
    corporate: 'Corporate & Business',
    portfolio: 'Portfolios & Personal Websites',
    booking: 'Booking & Reservations',
    directory: 'Directories & Search Aggregators',
    knowledge: 'Knowledge Bases & Documentation',
}

const typeLabels = {
    CategoryGrid: 'Category Grid',
    BestSellers: 'Featured / Best Sellers',
    FlashDeals: 'Flash Deals / Countdown',
    ProductQuickView: 'Product Card / Quick View',
    TrustBadges: 'Trust Badges & Policies',
    CustomerReviews: 'Customer Reviews & UGC',
    Slider: 'Animated Sliders',
}

const splitWords = (value) => value.replace(/([a-z])([A-Z])/g, '$1 $2')

const entries = Object.entries(sectionModules)
    .map(([path, load]) => {
        const [category, file] = path.split('/').slice(-2)
        const name = file.replace('.jsx', '')
        return { path, load, category, name, type: name.replace(/\d+$/, '') }
    })
    .sort((a, b) => a.path.localeCompare(b.path))

const categories = [...new Set(entries.map((entry) => entry.category))]

const typeOrder = Object.keys(typeLabels)
const byTypeOrder = (a, b) =>
    (typeOrder.indexOf(a) + 1 || 99) - (typeOrder.indexOf(b) + 1 || 99)

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
                <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {this.props.name} failed to render:{' '}
                    {String(this.state.error.message || this.state.error)}
                </p>
            )
        }
        return this.props.children
    }
}

const PageSections = () => {
    const [categorySlug, setCategorySlug] = useState(
        categories.includes(initialParams.get('category'))
            ? initialParams.get('category')
            : categories[0],
    )
    const types = useMemo(
        () => [
            ...new Set(
                entries
                    .filter((entry) => entry.category === categorySlug)
                    .map((entry) => entry.type),
            ),
        ].sort(byTypeOrder),
        [categorySlug],
    )
    const [selectedType, setSelectedType] = useState(initialParams.get('type'))
    const sectionType = types.includes(selectedType) ? selectedType : types[0]
    const components = entries.filter(
        (entry) =>
            entry.category === categorySlug && entry.type === sectionType,
    )

    return (
        <main className="space-y-6 pb-10">
            <header className="flex flex-col justify-between gap-5 border-b border-gray-200 pb-5 dark:border-gray-700 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2a85ff]">
                        Design library / Page sections
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Page section library
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                        Five responsive designs per section type, plus animated
                        sliders, for each kind of website.
                    </p>
                    <nav
                        aria-label="Design library"
                        className="mt-4 inline-flex rounded-md border border-gray-200 bg-white p-1 text-xs font-semibold dark:border-gray-700 dark:bg-gray-800"
                    >
                        <Link
                            to="/design-studio"
                            className="rounded px-3 py-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                        >
                            Section designs
                        </Link>
                        <Link
                            to="/page-sections"
                            aria-current="page"
                            className="rounded bg-[#2a85ff] px-3 py-1.5 text-white"
                        >
                            Page sections
                        </Link>
                    </nav>
                </div>
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Website category
                    <select
                        value={categorySlug}
                        className="h-10 min-w-64 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#2a85ff] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        onChange={(event) =>
                            setCategorySlug(event.target.value)
                        }
                    >
                        {categories.map((slug) => (
                            <option key={slug} value={slug}>
                                {categoryLabels[slug] || slug}
                            </option>
                        ))}
                    </select>
                </label>
            </header>

            <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Page section type"
            >
                {types.map((type) => (
                    <button
                        key={type}
                        type="button"
                        role="tab"
                        aria-selected={sectionType === type}
                        className={`min-h-10 rounded-md px-4 text-sm font-semibold transition ${sectionType === type ? 'bg-[#2a85ff] text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                        onClick={() => setSelectedType(type)}
                    >
                        {typeLabels[type] || splitWords(type)}
                    </button>
                ))}
            </div>

            <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {categoryLabels[categorySlug] || categorySlug}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {typeLabels[sectionType] || splitWords(sectionType || '')}{' '}
                    · {components.length} designs
                </p>
            </div>

            <div className="space-y-10">
                {components.map((entry) => {
                    const Preview = getLazy(entry)
                    return (
                        <div key={entry.path} className="space-y-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                {entry.name}
                            </p>
                            <PreviewBoundary name={entry.name}>
                                <Suspense
                                    fallback={
                                        <div className="h-48 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                                    }
                                >
                                    <Preview />
                                </Suspense>
                            </PreviewBoundary>
                        </div>
                    )
                })}
                {components.length === 0 && (
                    <p className="rounded-lg border border-dashed border-gray-300 p-8 text-sm text-gray-500 dark:border-gray-700">
                        No page sections have been added for this category
                        yet.
                    </p>
                )}
            </div>
        </main>
    )
}

export default PageSections
