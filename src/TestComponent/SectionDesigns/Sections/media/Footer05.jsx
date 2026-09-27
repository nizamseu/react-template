// PodcastAppsFooter

// Footer05 · Blogs & Digital Media › Footers

// Description:
// A light footer that sends readers to Margin's podcast. Under the kicker
// "The paper, in your pocket" and the heading "Take the conversation with
// you." it invites visitors to listen on their favourite podcast app, with
// Apple Podcasts and Spotify pill links and a short copyright line.

// Design:
// - Flex row (stacked by default): text block left, two pill links right
//   (self-start), then a ruled copyright line
// - White card with warm border #d7cec0, ink #28221e, rust kicker #a84f34,
//   grey copy gray-500 (#6b7280), divider #e8e1d7
// - Serif text-3xl heading; bold xs uppercase kicker; rounded-full pills
//   with the default border colour and "↗" external-link marks; rounded-lg
//   container
// - Column layout below md, `md:flex-row` from md; pills wrap; padding
//   p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state, no imports
// - Links: `#apple` (Apple Podcasts) and `#spotify` (Spotify)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PodcastAppsFooter from '@/TestComponent/SectionDesigns/Sections/media/Footer05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <PodcastAppsFooter />
//     </main>
// )
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function PodcastAppsFooter({
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
                'rounded-lg border border-[#d7cec0] bg-white p-7 text-[#28221e] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-6 md:flex-row">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a84f34]">
                        The paper, in your pocket
                    </p>
                    <h2 className="mt-2 font-serif text-3xl">
                        Take the conversation with you.
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Listen to Margin on your favorite podcast app.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3 self-start">
                    <a
                        href="#apple"
                        className="rounded-full border px-4 py-2 text-xs"
                    >
                        Apple Podcasts ↗
                    </a>
                    <a
                        href="#spotify"
                        className="rounded-full border px-4 py-2 text-xs"
                    >
                        Spotify ↗
                    </a>
                </div>
            </div>
            <p className="mt-8 border-t border-[#e8e1d7] pt-4 text-xs text-gray-500">
                © Margin · Editorial independence matters.
            </p>
        </footer>
    )
}

export default PodcastAppsFooter
