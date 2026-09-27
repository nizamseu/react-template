import { useState } from 'react'
import { Link } from 'react-router'

const sectionModules = import.meta.glob(
    '@/TestComponent/SectionDesigns/Sections/*/*.jsx',
    { eager: true },
)

const categories = [
    { slug: 'ecommerce', label: 'E-commerce & Marketplaces' },
    { slug: 'learning', label: 'Learning Management & EdTech' },
    { slug: 'saas', label: 'SaaS Platforms' },
    { slug: 'media', label: 'Blogs & Digital Media' },
    { slug: 'community', label: 'Social Networks & Communities' },
    { slug: 'corporate', label: 'Corporate & Business' },
    { slug: 'portfolio', label: 'Portfolios & Personal Websites' },
    { slug: 'booking', label: 'Booking & Reservations' },
    { slug: 'directory', label: 'Directories & Search Aggregators' },
    { slug: 'knowledge', label: 'Knowledge Bases & Documentation' },
]

const sectionTypes = [
    { key: 'heroes', prefix: 'Hero', label: 'Hero sections' },
    { key: 'cards', prefix: 'Card', label: 'Cards' },
    { key: 'navbars', prefix: 'Navbar', label: 'Navbars' },
    { key: 'footers', prefix: 'Footer', label: 'Footers' },
    { key: 'ctas', prefix: 'CTA', label: 'Banner CTAs' },
]

const SectionDesigns = () => {
    const [categorySlug, setCategorySlug] = useState(categories[0].slug)
    const [sectionType, setSectionType] = useState('heroes')
    const category = categories.find((item) => item.slug === categorySlug)
    const section = sectionTypes.find((item) => item.key === sectionType)
    const components = Object.entries(sectionModules)
        .filter(([path]) => {
            const fileName = path.split('/').pop()
            return (
                path.includes(`/Sections/${categorySlug}/`) &&
                fileName.startsWith(section.prefix)
            )
        })
        .sort(([firstPath], [secondPath]) =>
            firstPath.localeCompare(secondPath),
        )
        .map(([path, module]) => ({
            Component: module.default,
            name: path.split('/').pop().replace('.jsx', ''),
        }))

    return (
        <main className="space-y-6 pb-10">
            <header className="flex flex-col justify-between gap-5 border-b border-gray-200 pb-5 dark:border-gray-700 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#2a85ff]">
                        Design library / Awwwards-inspired
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Website section studio
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                        Art-directed, responsive sections for different kinds of
                        websites.
                    </p>
                    <nav
                        aria-label="Design library"
                        className="mt-4 inline-flex rounded-md border border-gray-200 bg-white p-1 text-xs font-semibold dark:border-gray-700 dark:bg-gray-800"
                    >
                        <Link
                            to="/design-studio"
                            aria-current="page"
                            className="rounded bg-[#2a85ff] px-3 py-1.5 text-white"
                        >
                            Section designs
                        </Link>
                        <Link
                            to="/page-sections"
                            className="rounded px-3 py-1.5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
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
                        {categories.map((item) => (
                            <option key={item.slug} value={item.slug}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </label>
            </header>

            <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label="Website section type"
            >
                {sectionTypes.map((type) => (
                    <button
                        key={type.key}
                        type="button"
                        role="tab"
                        aria-selected={sectionType === type.key}
                        className={`min-h-10 rounded-md px-4 text-sm font-semibold transition ${sectionType === type.key ? 'bg-[#2a85ff] text-white' : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                        onClick={() => setSectionType(type.key)}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {category.label}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {section.label} · {components.length} designs
                    </p>
                </div>
            </div>

            <div
                className={
                    sectionType === 'cards'
                        ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'
                        : 'space-y-6'
                }
            >
                {components.map(({ Component, name }, index) => (
                    <div key={name} className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {String(index + 1).padStart(2, '0')} / {name}
                        </p>
                        <Component />
                    </div>
                ))}
                {components.length === 0 && (
                    <p className="rounded-lg border border-dashed border-gray-300 p-8 text-sm text-gray-500 dark:border-gray-700">
                        No {section.label.toLowerCase()} have been added for
                        this category yet.
                    </p>
                )}
            </div>
        </main>
    )
}

export default SectionDesigns
