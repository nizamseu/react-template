// ConversationStarterCTAFooter

// Footer04 · Corporate & Business › Footers

// Description:
// Dark closing footer led by a call to action: the eyebrow "The work starts with a
// conversation", the headline "Tell us where you want to go." and a "Get in touch"
// button, followed by a slim legal row with "© Northstar Advisory 2026" and
// "Privacy · Terms · LinkedIn".

// Design:
// - Top block flex-col -> md:flex-row md:items-end justify-between with a white/15 bottom
//   border; legal row flex-wrap justify-between beneath
// - Dark navy #121c2c background, white text, sky-blue #84b9ff eyebrow and filled button
//   (text #121c2c), legal row in white/45
// - Headline text-5xl font-semibold max-w-2xl; button rounded-md px-5 py-3 text-sm
//   semibold; rounded-lg footer
// - Below md the button drops under the headline; padding p-7 -> sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor CTA "Get in touch" -> #contact with HiArrowRight; the legal and
//   LinkedIn items are plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import ConversationStarterCTAFooter from '@/TestComponent/SectionDesigns/Sections/corporate/Footer04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <ConversationStarterCTAFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ConversationStarterCTAFooter({
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
                'rounded-lg bg-[#121c2c] p-7 text-white sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-8 border-b border-white/15 pb-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.14em] text-[#84b9ff]">
                        The work starts with a conversation
                    </p>
                    <h2 className="mt-3 max-w-2xl text-5xl font-semibold">
                        Tell us where you want to go.
                    </h2>
                </div>
                <a
                    href="#contact"
                    className="inline-flex items-center gap-2 rounded-md bg-[#84b9ff] px-5 py-3 text-sm font-semibold text-[#121c2c]"
                >
                    Get in touch <HiArrowRight />
                </a>
            </div>
            <div className="mt-5 flex flex-wrap justify-between gap-4 text-xs text-white/45">
                <span>© Northstar Advisory 2026</span>
                <span>Privacy · Terms · LinkedIn</span>
            </div>
        </footer>
    )
}

export default ConversationStarterCTAFooter
