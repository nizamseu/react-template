// NextChapterDarkHeroWithProofStrip

// Hero04 · Learning Management & EdTech › Hero sections

// Description:
// Dark, image-free hero with the eyebrow "YOUR NEXT CHAPTER" and the large sans
// headline "Make your next skill count." A side block pitches practical skills
// with a lime "Start learning" pill, and a bottom strip lists proof points:
// "1,200+ lessons / Expert instructors / Learn on your time".

// Design:
// - Flex row on md (headline block left, max-w-sm copy/CTA block right,
//   md:items-end) above a border-t proof strip
// - Dark palette: #102d36 background, white text (white/65, white/50), lime
//   #c8ef70 eyebrow and CTA, white/20 divider
// - Sans headline text-5xl -> sm:text-6xl font-semibold (leading .95), xs bold
//   uppercase eyebrow (.16em tracking), rounded-full CTA; rounded-lg section
// - flex-col below md (CTA block drops under the headline); padding p-7 -> sm:p-11

// What it does:
// - Purely presentational: no content props, no state
// - Single anchor "Start learning" -> #start with HiArrowRight icon; the proof
//   strip is static text

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import NextChapterDarkHeroWithProofStrip from '@/TestComponent/SectionDesigns/Sections/learning/Hero04';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <NextChapterDarkHeroWithProofStrip />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function NextChapterDarkHeroWithProofStrip({
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
                'rounded-lg bg-[#102d36] p-7 text-white sm:p-11',
                className,
            )}
            {...props}
        >
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[.16em] text-[#c8ef70]">
                        YOUR NEXT CHAPTER
                    </p>
                    <h2 className="mt-4 max-w-2xl text-5xl font-semibold leading-[.95] sm:text-6xl">
                        Make your next skill count.
                    </h2>
                </div>
                <div className="max-w-sm">
                    <p className="text-sm leading-6 text-white/65">
                        Build the practical skills that move your work, your
                        team, and your ideas forward.
                    </p>
                    <a
                        href="#start"
                        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#c8ef70] px-5 py-3 text-sm font-bold text-[#102d36]"
                    >
                        Start learning <HiArrowRight />
                    </a>
                </div>
            </div>
            <div className="mt-10 border-t border-white/20 pt-4 text-xs text-white/50">
                1,200+ lessons <span className="mx-3">/</span> Expert
                instructors <span className="mx-3">/</span> Learn on your time
            </div>
        </section>
    )
}

export default NextChapterDarkHeroWithProofStrip
