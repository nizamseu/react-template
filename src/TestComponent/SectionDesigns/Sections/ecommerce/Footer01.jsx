// GoodformFourColumnLinkFooter

// Footer01 · E-commerce & Marketplaces › Footers

// Description:
// Dark shop footer for "goodform.": the brand and tagline "Useful objects, made with care,
// chosen to be kept." followed by three link columns (Explore, Our world, Help) and a
// bottom bar with "© 2026 Goodform Goods" and Instagram / Terms / Privacy text.

// Design:
// - Grid md:grid-cols-[1.4fr_1fr_1fr_1fr] (brand column wider); bottom bar separated by
//   border-t white/15.
// - Always dark: #1c1b19 background, white text, white/60–70 copy and links, lime #d6f36a
//   column headings, white/45 legal line.
// - Serif brand text-3xl; headings text-xs bold uppercase tracking-widest; links text-sm
//   with space-y-3; rounded-lg shell.
// - Single column on mobile, four columns from md; bottom bar flex-col → sm:flex-row;
//   padding p-7 → sm:p-10.

// What it does:
// - Purely presentational: no content props, no state.
// - Columns are mapped from an inline array of [title, ...links]; every column link points
//   to #footer; the brand links to #home; the bottom-bar items are plain text, not links.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GoodformFourColumnLinkFooter from '@/TestComponent/SectionDesigns/Sections/ecommerce/Footer01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <GoodformFourColumnLinkFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function GoodformFourColumnLinkFooter({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <footer
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-lg bg-[#1c1b19] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="font-serif text-3xl">
                        goodform.
                    </a>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-white/60">
                        Useful objects, made with care, chosen to be kept.
                    </p>
                </div>
                {[
                    ['Explore', 'New arrivals', 'Home objects', 'Gift guide'],
                    ['Our world', 'Meet makers', 'Materials', 'Journal'],
                    ['Help', 'Shipping & returns', 'Care guide', 'Contact'],
                ].map(([title, ...links]) => (
                    <div key={title}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#d6f36a]">
                            {title}
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-white/70">
                            {links.map((link) => (
                                <li key={link}>
                                    <a href="#footer">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/45 sm:flex-row">
                <span>© 2026 Goodform Goods</span>
                <span>
                    Instagram <HiArrowRight className="inline" /> &nbsp; Terms
                    &nbsp; Privacy
                </span>
            </div>
        </footer>
    )
}

export default GoodformFourColumnLinkFooter
