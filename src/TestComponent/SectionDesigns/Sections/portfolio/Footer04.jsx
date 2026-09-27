// OpenInboxSitemapFooter

// Footer04 · Portfolios & Personal Websites › Footers

// Description:
// Dark footer for Jamie Park's site: the eyebrow "Have a question, a project,
// or a good book?", the serif headline "My inbox is open." and a "Write me a
// note" email link, next to a small 2x2 sitemap (Selected work, About Jamie,
// Credits, Accessibility) and the line "© Jamie Park 2026 · Built with care".

// Design:
// - Grid md:grid-cols-[1fr_.8fr]: contact prompt left, two-column link grid
//   right (self-end); a border-t white/15 copyright line below.
// - Dark palette: espresso #241d1a background, text #f5eee5, coral #ef6a4b
//   eyebrow, links white/60, copyright white/40.
// - Headline font-serif text-4xl (max-w-lg); xs bold uppercase eyebrow
//   (tracking-[.14em]); text-sm links; rounded-lg container.
// - Single column below md; padding p-7 → sm:p-10.

// What it does:
// - Purely presentational: no content props, no state.
// - mailto link → hello@jamie.example (HiArrowRight); sitemap anchors #work,
//   #about, #credits and #accessibility.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import OpenInboxSitemapFooter from '@/TestComponent/SectionDesigns/Sections/portfolio/Footer04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <OpenInboxSitemapFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function OpenInboxSitemapFooter({
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
                'rounded-lg bg-[#241d1a] p-7 text-[#f5eee5] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#ef6a4b]">
                        Have a question, a project, or a good book?
                    </p>
                    <h2 className="mt-3 max-w-lg font-serif text-4xl">
                        My inbox is open.
                    </h2>
                    <a
                        href="mailto:hello@jamie.example"
                        className="mt-5 inline-flex items-center gap-2 text-sm"
                    >
                        Write me a note <HiArrowRight />
                    </a>
                </div>
                <nav className="grid grid-cols-2 gap-3 self-end text-sm text-white/60">
                    <a href="#work">Selected work</a>
                    <a href="#about">About Jamie</a>
                    <a href="#credits">Credits</a>
                    <a href="#accessibility">Accessibility</a>
                </nav>
            </div>
            <p className="mt-8 border-t border-white/15 pt-4 text-xs text-white/40">
                © Jamie Park 2026 · Built with care
            </p>
        </footer>
    )
}

export default OpenInboxSitemapFooter
