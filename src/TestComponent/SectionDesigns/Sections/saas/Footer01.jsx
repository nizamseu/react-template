// NorthstarFourColumnSitemapFooter

// Footer01 · SaaS Platforms › Footers

// Description:
// A dark, classic sitemap footer for "northstar/". It has a brand column with the
// tagline "A more focused way to run work. Built for teams who make things
// happen.", three link columns (Platform, Resources, Company) and a bottom bar with
// "© 2026 Northstar Inc." and "Status → · Privacy · Terms".

// Design:
// - <footer> grid `md:grid-cols-[1.4fr_1fr_1fr_1fr]` (brand column wider), then a
//   bottom bar (flex justify-between) above a border-t.
// - Dark base #111a22 with a mint #65e6b4 slash and column headings, white/40-55
//   link and meta text, and a white/10 divider.
// - Typography: text-xl semibold wordmark, xs semibold headings and text-sm links.
//   The footer is rounded-lg, with padding p-7 -> sm:p-10.
// - Responsive: the four columns stack below md. The bottom bar stays a two-item
//   row at all sizes.

// What it does:
// - Purely presentational: no content props, no state.
// - The link columns are mapped from an array of [title, ...items]. Every column
//   link points to the placeholder `#footer`, and the brand links to `#home`.
//   "Status · Privacy · Terms" is plain text, not links.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NorthstarFourColumnSitemapFooter from '@/TestComponent/SectionDesigns/Sections/saas/Footer01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NorthstarFourColumnSitemapFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NorthstarFourColumnSitemapFooter({
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
                'rounded-lg bg-[#111a22] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <a href="#home" className="text-xl font-semibold">
                        northstar<span className="text-[#65e6b4]">/</span>
                    </a>
                    <p className="mt-3 max-w-xs text-sm leading-6 text-white/50">
                        A more focused way to run work. Built for teams who make
                        things happen.
                    </p>
                </div>
                {[
                    ['Platform', 'Overview', 'Integrations', 'Security'],
                    ['Resources', 'Customer stories', 'Guides', 'API docs'],
                    ['Company', 'About', 'Careers', 'Contact'],
                ].map(([title, ...items]) => (
                    <div key={title}>
                        <h3 className="text-xs font-semibold text-[#65e6b4]">
                            {title}
                        </h3>
                        <ul className="mt-4 space-y-3 text-sm text-white/55">
                            {items.map((item) => (
                                <li key={item}>
                                    <a href="#footer">{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="mt-9 flex justify-between border-t border-white/10 pt-4 text-xs text-white/40">
                <span>© 2026 Northstar Inc.</span>
                <span>
                    Status <HiArrowRight className="inline" /> · Privacy · Terms
                </span>
            </div>
        </footer>
    )
}

export default NorthstarFourColumnSitemapFooter
