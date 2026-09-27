import { HiArrowRight, HiOutlineSparkles } from 'react-icons/hi'

/**
 * AutumnMakers Collection Split Hero
 *
 * Hero01 · E-commerce & Marketplaces › Hero sections
 *
 * Description:
 * Editorial split-screen hero for an independent-makers homeware shop presenting
 * "The autumn collection / 2026". The left column shows the eyebrow "Objects with a
 * point of view", the serif headline "Keep the good things close." and an "Explore the
 * collection" link; the right column is a full-bleed product photo with a "Maker no. 014 ·
 * Form & Field" caption card and a round "New season" badge.
 *
 * Design:
 * - Two-column grid (md:grid-cols-[.88fr_1.12fr], min-h-[430px]); the text column uses
 *   flex-col justify-between to pin the eyebrow at the top and the "01 — 04 / Curated for
 *   everyday" marker at the bottom; the image column is relative with absolute overlays.
 * - Warm light palette: cream #f3eee6 background, ink #1c1b19 text, muted browns #685c4c,
 *   #846c4e, #625d55, #777067; image placeholder #d2c3aa, caption card #f8f5ef, lime badge
 *   #d6f36a with #202315 text. Dark mode: #26231f background, white text, #d5c5ae / #d0c9be.
 * - Serif display headline text-5xl → sm:text-6xl → lg:text-7xl (leading-[0.98]); small
 *   uppercase tracked eyebrows (tracking-[0.12em]); underline-style CTA (border-b);
 *   rounded-lg shell with overflow-hidden; circular h-14 w-14 badge.
 * - Single column on mobile (image below text, min-h-72), side by side from md; padding
 *   scales p-7 → sm:p-10 → lg:p-14 and the caption card offset grows at sm.
 *
 * What it does:
 * - Purely presentational: no props, no state.
 * - One anchor CTA "Explore the collection" → #collection; Unsplash image with descriptive
 *   alt text; icons HiOutlineSparkles and HiArrowRight from react-icons/hi.
 *
 * Usage example:
 * ```jsx
 * import Hero01 from '@/TestComponent/SectionDesigns/Sections/ecommerce/Hero01'
 *
 * const LandingPage = () => (
 *     <main className="space-y-6">
 *         <Hero01 />
 *     </main>
 * )
 * ```
 */
export default function Hero01() {
    return (
        <section className="overflow-hidden rounded-lg bg-[#f3eee6] text-[#1c1b19] dark:bg-[#26231f] dark:text-white">
            <div className="grid min-h-[430px] md:grid-cols-[.88fr_1.12fr]">
                <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-14">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#685c4c] dark:text-[#d5c5ae]">
                        <HiOutlineSparkles className="text-lg" /> Objects with a
                        point of view
                    </div>
                    <div className="py-10 md:py-0">
                        <p className="text-sm text-[#846c4e]">
                            The autumn collection / 2026
                        </p>
                        <h2 className="mt-4 max-w-lg font-serif text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
                            Keep the good things close.
                        </h2>
                        <p className="mt-5 max-w-sm text-sm leading-6 text-[#625d55] dark:text-[#d0c9be]">
                            Useful, quietly beautiful pieces from independent
                            makers. Chosen to be used every day.
                        </p>
                        <a
                            href="#collection"
                            className="mt-7 inline-flex items-center gap-3 border-b border-[#1c1b19] pb-2 text-sm font-semibold dark:border-white"
                        >
                            Explore the collection <HiArrowRight />
                        </a>
                    </div>
                    <p className="text-xs text-[#777067]">
                        01 — 04 <span className="mx-2">/</span> Curated for
                        everyday
                    </p>
                </div>
                <div className="relative min-h-72 overflow-hidden bg-[#d2c3aa]">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=1400&q=85"
                        alt="Handcrafted homeware arranged in warm natural light"
                    />
                    <div className="absolute bottom-5 left-5 max-w-[200px] bg-[#f8f5ef] p-4 text-[#1c1b19] sm:bottom-8 sm:left-8">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em]">
                            Maker no. 014
                        </p>
                        <p className="mt-1 font-serif text-xl">Form & Field</p>
                        <p className="mt-1 text-xs text-[#71695e]">
                            Small batch, made slowly
                        </p>
                    </div>
                    <span className="absolute right-5 top-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#d6f36a] text-[10px] font-bold uppercase leading-tight text-center text-[#202315]">
                        New
                        <br />
                        season
                    </span>
                </div>
            </div>
        </section>
    )
}
