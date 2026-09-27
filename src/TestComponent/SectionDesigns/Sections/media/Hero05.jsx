// TerracottaPublicationManifestoHero

// Hero05 · Blogs & Digital Media › Hero sections

// Description:
// A bold brand-statement hero for "A PUBLICATION FOR THE CURIOUS". The
// two-line serif headline "Good questions. / Better stories." sits next to a
// short line about reporting "for people who like to look a little closer"
// and an underlined "Get the Sunday edition" subscribe link.

// Design:
// - Two-column grid `md:grid-cols-[1fr_.7fr]`: kicker and headline on the
//   left, description and link pushed to the bottom (justify-end) on the
//   right; no imagery
// - Solid terracotta block #a84f34 with warm white text #fff7ee and white/80
//   supporting copy; white underline on the link
// - Serif headline text-5xl → sm:text-6xl, leading-[.95]; bold xs uppercase
//   tracked kicker; rounded-lg container
// - Single column below md; padding p-7 → sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - One text link "Get the Sunday edition" to `#subscribe` with arrow icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import TerracottaPublicationManifestoHero from '@/TestComponent/SectionDesigns/Sections/media/Hero05';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <TerracottaPublicationManifestoHero />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TerracottaPublicationManifestoHero({
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
                'rounded-lg bg-[#a84f34] p-7 text-[#fff7ee] sm:p-11',
                className,
            )}
            {...props}
        >
            <div className="grid gap-7 md:grid-cols-[1fr_.7fr]">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.17em]">
                        A PUBLICATION FOR THE CURIOUS
                    </p>
                    <h2 className="mt-4 font-serif text-5xl leading-[.95] sm:text-6xl">
                        Good questions.
                        <br />
                        Better stories.
                    </h2>
                </div>
                <div className="flex flex-col justify-end">
                    <p className="text-sm leading-6 text-white/80">
                        Reporting and ideas for people who like to look a little
                        closer.
                    </p>
                    <a
                        href="#subscribe"
                        className="mt-5 inline-flex items-center gap-2 self-start border-b border-white pb-2 text-sm"
                    >
                        Get the Sunday edition <HiArrowRight />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default TerracottaPublicationManifestoHero
