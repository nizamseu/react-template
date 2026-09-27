// MintFreeWorkspaceCTAFooter

// Footer02 · SaaS Platforms › Footers

// Description:
// A bright mint footer that doubles as a final call to action. It opens with the
// eyebrow "Your next release can feel different.", the headline "Give your team a
// clearer way to work." and a "Start a free workspace" link. Below are four quick
// links (Product, Security, Docs, Support) and "© Northstar Software · Privacy ·
// Terms".

// Design:
// - <footer> with a top grid `md:grid-cols-[1fr_.8fr]` (headline | CTA, self-end),
//   a link grid above a border-t, and a closing copyright line.
// - Mint base #65e6b4 with ink #111a22 text, a darker mint #4bb98f divider and
//   #35644f copyright text. Bright, light feel.
// - Typography: xs bold uppercase eyebrow with tracking-[.15em]; text-4xl
//   semibold headline (max-w-lg); xs links. The footer is rounded-lg, with padding
//   p-7 -> sm:p-10.
// - Responsive: the headline and CTA stack below md. The quick links go from 2
//   columns to 4 at sm.

// What it does:
// - Purely presentational: no content props, no state.
// - Anchors: CTA `#trial` (with HiArrowRight), `#product`, `#security`, `#docs`,
//   `#support`. "Privacy · Terms" is plain text, not links.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import MintFreeWorkspaceCTAFooter from '@/TestComponent/SectionDesigns/Sections/saas/Footer02';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <MintFreeWorkspaceCTAFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function MintFreeWorkspaceCTAFooter({
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
                'rounded-lg bg-[#65e6b4] p-7 text-[#111a22] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_.8fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em]">
                        Your next release can feel different.
                    </p>
                    <h2 className="mt-3 max-w-lg text-4xl font-semibold">
                        Give your team a clearer way to work.
                    </h2>
                </div>
                <a
                    href="#trial"
                    className="inline-flex items-center gap-2 self-end text-sm font-bold"
                >
                    Start a free workspace <HiArrowRight />
                </a>
            </div>
            <div className="mt-9 grid grid-cols-2 gap-4 border-t border-[#4bb98f] pt-4 text-xs sm:grid-cols-4">
                <a href="#product">Product</a>
                <a href="#security">Security</a>
                <a href="#docs">Docs</a>
                <a href="#support">Support</a>
            </div>
            <p className="mt-6 text-xs text-[#35644f]">
                © Northstar Software · Privacy · Terms
            </p>
        </footer>
    )
}

export default MintFreeWorkspaceCTAFooter
