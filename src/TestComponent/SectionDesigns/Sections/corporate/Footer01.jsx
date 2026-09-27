// HardestQuestionContactFooter

// Footer01 · Corporate & Business › Footers

// Description:
// Dark three-column footer for Northstar Advisory. It opens with the invitation "Bring us
// your hardest question." and a "Start a conversation" link, then a 2x2 grid of site links
// (Capabilities, Careers, Client work, Contact) and a contact column with offices, email
// and social labels, closing with "© Northstar Advisory 2026 · Privacy · Terms".

// Design:
// - Grid md:grid-cols-[1.1fr_1fr_1fr] gap-8 (pitch | links | contact) above a copyright
//   row separated by a white/15 top border
// - Dark navy #121c2c background, white text, sky-blue #84b9ff eyebrow, links and contact
//   text in white/60, legal line in white/40
// - Headline text-4xl font-semibold; eyebrow text-xs bold uppercase tracking-[.16em];
//   rounded-lg footer, no borders on links
// - Below md all three columns stack into one; padding p-7 -> sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: #contact (CTA with HiArrowRight and in the link grid), #services, #careers,
//   #work; the email (hello@northstar.example), "LinkedIn ↗ Instagram ↗" and
//   Privacy / Terms are plain text, not links

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import HardestQuestionContactFooter from '@/TestComponent/SectionDesigns/Sections/corporate/Footer01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <HardestQuestionContactFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function HardestQuestionContactFooter({
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
            <div className="grid gap-8 md:grid-cols-[1.1fr_1fr_1fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#84b9ff]">
                        The next move starts here
                    </p>
                    <h2 className="mt-3 max-w-sm text-4xl font-semibold">
                        Bring us your hardest question.
                    </h2>
                    <a
                        href="#contact"
                        className="mt-5 inline-flex items-center gap-2 text-sm"
                    >
                        Start a conversation <HiArrowRight />
                    </a>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-white/60">
                    <a href="#services">Capabilities</a>
                    <a href="#careers">Careers</a>
                    <a href="#work">Client work</a>
                    <a href="#contact">Contact</a>
                </div>
                <div className="text-sm text-white/60">
                    <p>New York · London · Singapore</p>
                    <p className="mt-2">hello@northstar.example</p>
                    <p className="mt-5 text-xs">
                        LinkedIn ↗ &nbsp; Instagram ↗
                    </p>
                </div>
            </div>
            <p className="mt-9 border-t border-white/15 pt-4 text-xs text-white/40">
                © Northstar Advisory 2026 · Privacy · Terms
            </p>
        </footer>
    )
}

export default HardestQuestionContactFooter
