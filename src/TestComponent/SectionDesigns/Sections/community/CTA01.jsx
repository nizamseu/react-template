// PrivateDiscordGuildInviteCTA

// CTA01 · Social Networks & Communities › Banner CTAs

// Description:
// A dark invitation banner for a "PRIVATE DISCORD GUILD" of 24,000+ builders, headlined "Where the
// World's Most Ambitious Independent Creators Congregate." It lists the perks (design teardown
// voice stages, co-founder match channels, weekly live demos, strict moderation) and offers a
// "Join Discord Community" button with a "Free membership • Invite links expire weekly" note.

// Design:
// - Single left-aligned content block (max-w-2xl) inside a padded banner; the button and note share
//   a row
// - Palette: dark brown #241c19 background, white headline, white/70 body, peach #ffccad eyebrow and
//   button (dark #241c19 label, hover white), white/50 note, white/10 border; dark theme with shadow-2xl
// - Typography & shapes: mono uppercase tracked eyebrow, serif bold headline text-3xl → sm:text-4xl,
//   mono uppercase button label; rounded-2xl banner, rounded-full button
// - Responsive: below sm the button and note stack full-width (note centred); from sm they sit side
//   by side; padding p-8 → sm:p-12

// What it does:
// - Purely presentational: no content props, no state
// - One anchor CTA "Join Discord Community" → #discord-invite (HiArrowRight icon)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PrivateDiscordGuildInviteCTA from '@/TestComponent/SectionDesigns/Sections/community/CTA01';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PrivateDiscordGuildInviteCTA />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function PrivateDiscordGuildInviteCTA({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden rounded-2xl border border-white/10 bg-[#241c19] p-8 text-white sm:p-12 shadow-2xl',
                className,
            )}
            {...props}
        >
            <div className="relative z-10 max-w-2xl">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffccad]">
                    PRIVATE DISCORD GUILD &bull; 24,000+ BUILDERS
                </span>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                    Where the World’s Most Ambitious Independent Creators Congregate.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                    Get access to private design teardown voice stages, co-founder match channels, and weekly live project demos. Zero spam, strictly moderated.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <a
                        href="#discord-invite"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#ffccad] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-[#241c19] hover:bg-white transition-colors"
                    >
                        <span>Join Discord Community</span>
                        <HiArrowRight />
                    </a>
                    <span className="font-mono text-xs text-white/50 text-center sm:text-left">
                        Free membership &bull; Invite links expire weekly
                    </span>
                </div>
            </div>
        </section>
    )
}

export default PrivateDiscordGuildInviteCTA
