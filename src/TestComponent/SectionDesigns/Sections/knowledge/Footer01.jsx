// NorthstarDocsForestFooter

// Footer01 · Knowledge Bases & Documentation › Footers

// Description:
// A compact dark footer for the "northstar docs" documentation site. It shows
// the brand with a short mission line and a "Docs version 4.12 · Updated today"
// stamp, a two-column block of documentation links, and a bottom legal bar.

// Design:
// - Rounded footer with a two-column grid (md:grid-cols-[1.1fr_1fr]): brand block
//   on the left, a 2x3 link grid on the right, then a bottom bar separated by a
//   top border.
// - Dark palette: background #17231f (deep forest) with white text stepped by
//   opacity (white/65 links, white/55 tagline, white/45 version, white/40 legal
//   bar) and a white/15 divider.
// - font-semibold brand; text-sm links and tagline; text-xs meta; no icons except
//   an inline HiArrowRight after "System status".
// - Padding p-7 → sm:p-10; the brand and link blocks stack below md; the bottom
//   bar uses flex-wrap so the copyright and legal text wrap on narrow screens.

// What it does:
// - Purely presentational: no content props, no state.
// - Anchors: brand → #home; #guides, #api, #tutorials, #status, #community and
//   #support. "Privacy · Terms · Accessibility" is plain text, not links.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NorthstarDocsForestFooter from '@/TestComponent/SectionDesigns/Sections/knowledge/Footer01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NorthstarDocsForestFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NorthstarDocsForestFooter({
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
                'rounded-lg bg-[#17231f] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
                <div>
                    <a href="#home" className="font-semibold">
                        northstar docs
                    </a>
                    <p className="mt-3 max-w-sm text-sm leading-6 text-white/55">
                        Clear documentation, maintained by the people closest to
                        the product.
                    </p>
                    <p className="mt-5 text-xs text-white/45">
                        Docs version 4.12 · Updated today
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/65">
                    <a href="#guides">Product guides</a>
                    <a href="#api">API reference</a>
                    <a href="#tutorials">Tutorials</a>
                    <a href="#status">
                        System status <HiArrowRight className="inline" />
                    </a>
                    <a href="#community">Developer community</a>
                    <a href="#support">Contact support</a>
                </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-4 text-xs text-white/40">
                <span>© Northstar · Documentation</span>
                <span>Privacy · Terms · Accessibility</span>
            </div>
        </footer>
    )
}

export default NorthstarDocsForestFooter
