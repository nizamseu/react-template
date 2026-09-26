import { HiArrowRight } from 'react-icons/hi'
export default function Footer03() {
    return (
        <footer className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-9">
            <div className="flex flex-col justify-between gap-8 md:flex-row">
                <div>
                    <p className="font-serif text-3xl">Maison / 08</p>
                    <p className="mt-2 max-w-xs text-sm text-gray-500">
                        Objects for a life well lived. Selected with intention,
                        delivered with care.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-sm">
                    <a href="#shop">Shop all</a>
                    <a href="#about">Our story</a>
                    <a href="#shipping">Delivery & returns</a>
                    <a href="#journal">Field notes</a>
                    <a href="#faq">Frequently asked</a>
                    <a href="#contact">Get in touch</a>
                </div>
            </div>
            <div className="mt-9 flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-4 text-xs text-gray-500 dark:border-gray-700">
                <span>© Maison / 08 — Objects that stay.</span>
                <span>London · Copenhagen · Online</span>
                <a href="#instagram" className="flex items-center gap-1">
                    Instagram <HiArrowRight />
                </a>
            </div>
        </footer>
    )
}
