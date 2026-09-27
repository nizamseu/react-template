// SageMinimalLinkGridFooter

// Footer03 · SaaS Platforms › Footers

// Description:
// A light, compact footer for "northstar." It has the tagline "Less process. More
// progress. Software for teams moving work forward.", a two-column grid of six
// links (Platform, Customers, Security, Careers, API status, Contact) and the line
// "© 2026 Northstar · Built for focused teams."

// Design:
// - <footer> with a flex-col -> md:flex-row justify-between top area (brand block |
//   link grid) and a border-t copyright line.
// - Light sage base #edf3ee with ink #111a22 text, a green #137d62 dot in the
//   wordmark, gray-500 secondary text and a #d6e0d7 divider.
// - Typography: text-sm semibold wordmark, text-sm links and an xs copyright line.
//   The footer is rounded-lg, with padding p-7 -> sm:p-10.
// - Responsive: the brand block sits above the links below md and beside them from
//   md. The link grid stays 2 columns (gap-x-10).

// What it does:
// - Purely presentational: no content props, no state.
// - Anchors: `#platform`, `#customers`, `#security`, `#careers`, `#api` (with an
//   inline HiArrowRight), `#contact`. The wordmark is a <p>, not a link.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SageMinimalLinkGridFooter from '@/TestComponent/SectionDesigns/Sections/saas/Footer03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <SageMinimalLinkGridFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SageMinimalLinkGridFooter({
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
                'rounded-lg bg-[#edf3ee] p-7 text-[#111a22] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-8 md:flex-row">
                <div>
                    <p className="text-sm font-semibold">
                        northstar<span className="text-[#137d62]">.</span>
                    </p>
                    <p className="mt-3 max-w-xs text-sm text-gray-500">
                        Less process. More progress. Software for teams moving
                        work forward.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
                    <a href="#platform">Platform</a>
                    <a href="#customers">Customers</a>
                    <a href="#security">Security</a>
                    <a href="#careers">Careers</a>
                    <a href="#api">
                        API status <HiArrowRight className="inline" />
                    </a>
                    <a href="#contact">Contact</a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#d6e0d7] pt-4 text-xs text-gray-500">
                © 2026 Northstar · Built for focused teams.
            </p>
        </footer>
    )
}

export default SageMinimalLinkGridFooter
