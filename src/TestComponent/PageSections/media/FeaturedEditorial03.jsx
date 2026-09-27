// BroadsheetFrontPageFeaturedEditorial

// FeaturedEditorial03 · Blogs & Digital Media › Breaking News / Featured Editorial

// Description:
// A traditional broadsheet front page for the fictional city paper The Evening Ledger. Under a
// masthead with weather and price ears and a dateline, the banner headline "Council approves
// $4.2 billion transit plan after 14-hour session" leads into a grayscale photo, justified
// multi-column copy, a second story, an "Inside today" index and three short stories, each
// ending in a jump line such as "Continued on A6". Use it for heritage news brands or print
// editions.

// Design:
// - Ivory #f4f1ea paper, ink #1a1a1a, serif only (font-serif everywhere, small caps via
//   uppercase + tracking); rules in ink at full, 40% and 20% strength, with a 4px double rule
//   under the masthead and the dateline
// - Masthead: clamp(2.5rem, 9vw, 6.5rem) black serif, flanked by boxed ears from md up (they
//   drop under the masthead as a two-cell row on mobile)
// - Body copy is text-justify + hyphens-auto in CSS columns (1 → md:2) with a 1px column rule;
//   the lead paragraph has a four-line drop cap; the lead photo is grayscale + contrast-125
// - Layout: lg:grid-cols-12 (lead 8 · second story and index 4, split by a vertical rule);
//   the bottom row is 1 → md:3 columns with vertical rules; everything collapses to one column
//   on mobile
// - Jump lines are right-aligned italic links with a ▸ glyph and an underline on hover

// What it does:
// - A "Type" control (three A buttons, aria-pressed) switches the body copy between 15, 17
//   and 19px; headlines and captions keep their size
// - Jump lines link to page anchors (#ledger-a6, #ledger-b2, #ledger-c1, #ledger-a9,
//   #ledger-d1); index entries link to #ledger-<section>; everything else is static

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import BroadsheetFrontPageFeaturedEditorial from '@/TestComponent/PageSections/media/FeaturedEditorial03';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <BroadsheetFrontPageFeaturedEditorial />
//     </main>
// )
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const typeSizes = [
    { id: 'sm', label: 'Smaller text', glyph: 'text-xs', body: 'text-[15px] leading-[1.55]' },
    { id: 'md', label: 'Standard text', glyph: 'text-sm', body: 'text-[17px] leading-[1.6]' },
    { id: 'lg', label: 'Larger text', glyph: 'text-lg', body: 'text-[19px] leading-[1.6]' },
]

const leadParagraphs = [
    'The City Council voted 11–4 early Sunday to approve a $4.2 billion expansion of the Ledger City transit network, ending a 14-hour session that stretched past 3 a.m. and drew more than 600 public comments.',
    'The plan, the largest capital program in the city’s history, adds four tram lines, a 2.3-mile harbour tunnel linking Eastport to the Old Market, and free fares for riders under 18 beginning in September 2027. Work on the first line, along Calder Avenue, is scheduled to start next spring.',
    '“We have argued about this for twenty years,” said Councilmember Rosa Delgado-Park, who chairs the transportation committee. “Tonight we stopped arguing.”',
    'Opponents, led by the Harbourside Business Alliance, said they would gather signatures to force a referendum, calling the tunnel’s $1.9 billion estimate “a number nobody outside City Hall has seen justified.” The alliance needs 38,000 valid signatures by Jan. 15.',
    'Mayor Tobias Wren is expected to sign the ordinance on Monday morning at the Calder Avenue depot.',
]

const insideToday = [
    { name: 'Arts', page: 'C1' },
    { name: 'Business', page: 'B1' },
    { name: 'Crossword', page: 'C8' },
    { name: 'Obituaries', page: 'A18' },
    { name: 'Opinion', page: 'A14' },
    { name: 'Sports', page: 'D1' },
    { name: 'Weather', page: 'A20' },
]

const briefs = [
    {
        id: 'c1',
        desk: 'Arts',
        title: 'Orchestra Strike Enters Its Third Week',
        byline: 'By Colette Marsh',
        body: 'Musicians of the Ledger Philharmonic rejected a 3 percent offer on Friday, cancelling the season’s opening Mahler cycle and 9,000 pre-sold seats.',
        jump: 'C1',
    },
    {
        id: 'a9',
        desk: 'Metro',
        title: 'Ferry to Gull Island Restored After Pier Repairs',
        byline: 'By Samuel Adeyemi',
        body: 'The 7:10 a.m. crossing returns Tuesday after a $2.8 million rebuild of the north pier, ending a four-month detour for 1,200 daily commuters.',
        jump: 'A9',
    },
    {
        id: 'd1',
        desk: 'Sports',
        title: 'Hawks Clinch Division With a Ninth-Inning Rally',
        byline: 'By Theo Lindqvist',
        body: 'Down two runs with two outs, the Hawks scored three on a bases-loaded double by rookie Jae-won Park to seal their first title since 2011.',
        jump: 'D1',
    },
]

function JumpLine({ page }) {
    return (
        <p className="mt-3 text-right">
            <a
                href={`#ledger-${page.toLowerCase()}`}
                className="inline-flex min-h-10 items-center gap-1 font-serif text-sm italic text-[#1a1a1a] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
            >
                Continued on {page}
                <span aria-hidden="true">▸</span>
            </a>
        </p>
    )
}

export function BroadsheetFrontPageFeaturedEditorial({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [typeSize, setTypeSize] = useState('md')
    const body = typeSizes.find((option) => option.id === typeSize).body

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-[#f4f1ea] py-12 font-serif text-base font-normal text-[#1a1a1a] md:py-16', className)}
            {...props}
        >
            <div lang="en" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="grid grid-cols-2 items-center gap-3 md:grid-cols-[10rem_1fr_10rem] md:gap-6">
                    <div className="order-2 border border-[#1a1a1a] p-2 text-center md:order-1">
                        <p className="text-[10px] uppercase tracking-[0.2em]">Weather</p>
                        <p className="mt-1 text-sm italic leading-snug">Showers late. High 14°, low 9°</p>
                    </div>
                    <div className="order-1 col-span-2 text-center md:order-2 md:col-span-1">
                        <p className="text-[clamp(2.5rem,9vw,6.5rem)] font-black leading-[0.95] tracking-tight text-[#1a1a1a]">
                            The Evening Ledger
                        </p>
                        <p className="mt-2 text-sm italic text-[#1a1a1a]/70">
                            “Without fear, without favour” · Established 1894
                        </p>
                    </div>
                    <div className="order-3 border border-[#1a1a1a] p-2 text-center">
                        <p className="text-[10px] uppercase tracking-[0.2em]">Late City Final</p>
                        <p className="mt-1 text-sm italic leading-snug">$2.50 · 64 pages</p>
                    </div>
                </header>

                <div className="mt-5 border-y-4 border-double border-[#1a1a1a] py-2">
                    <div className="flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] sm:flex-row sm:justify-between">
                        <p>Vol. CXXXII · No. 45,218</p>
                        <p className="font-semibold">Sunday, September 27, 2026</p>
                        <div className="flex items-center gap-2" role="group" aria-label="Body text size">
                            <span aria-hidden="true">Type</span>
                            {typeSizes.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    aria-label={option.label}
                                    aria-pressed={typeSize === option.id}
                                    className={cn(
                                        'flex size-10 items-center justify-center border font-serif font-bold normal-case tracking-normal transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]',
                                        option.glyph,
                                        typeSize === option.id
                                            ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#f4f1ea]'
                                            : 'border-[#1a1a1a]/30 text-[#1a1a1a] hover:border-[#1a1a1a]',
                                    )}
                                    onClick={() => setTypeSize(option.id)}
                                >
                                    A
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-b border-[#1a1a1a] pb-6 text-center">
                    <h2 className="mx-auto max-w-6xl font-serif text-[clamp(2rem,5.4vw,4.5rem)] font-black uppercase leading-[0.98] tracking-tight text-[#1a1a1a]">
                        Council Approves $4.2 Billion Transit Plan After 14-Hour Session
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-lg italic leading-snug text-[#1a1a1a]/80 sm:text-xl">
                        Four tram lines, a harbour tunnel and free fares for under-18s; opponents vow a ballot
                        challenge before January
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12">
                    <article className="pt-6 lg:col-span-8 lg:border-r lg:border-[#1a1a1a]/40 lg:pr-8">
                        <figure>
                            <div className="aspect-[3/2] overflow-hidden bg-[#1a1a1a]/10">
                                <img
                                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=80"
                                    alt="Traffic-lined avenue running between tall office towers"
                                    className="size-full object-cover contrast-125 grayscale"
                                />
                            </div>
                            <figcaption className="mt-2 border-b border-[#1a1a1a]/20 pb-3 text-sm italic leading-snug text-[#1a1a1a]/75">
                                Calder Avenue at rush hour on Friday. The first of four tram lines will run down its
                                centre by 2029. <span className="not-italic uppercase tracking-[0.15em] text-[10px]">Ruth Abernathy / The Evening Ledger</span>
                            </figcaption>
                        </figure>
                        <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-[#1a1a1a]/80">
                            By <span className="font-semibold text-[#1a1a1a]">Margaret Oyelaran-Hale</span> and{' '}
                            <span className="font-semibold text-[#1a1a1a]">Daniel Voss</span> · Ledger staff writers
                        </p>
                        <div className={cn('mt-4 gap-8 text-justify hyphens-auto md:columns-2 [column-rule:1px_solid_#1a1a1a40]', body)}>
                            {leadParagraphs.map((paragraph, index) => (
                                <p
                                    key={paragraph.slice(0, 24)}
                                    className={cn(
                                        'mb-3 text-[#1a1a1a]',
                                        index === 0 &&
                                            'first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-[4.4em] first-letter:font-black first-letter:leading-[0.8]',
                                    )}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                        <JumpLine page="A6" />
                    </article>

                    <aside className="mt-8 border-t-2 border-[#1a1a1a] pt-6 lg:col-span-4 lg:mt-0 lg:border-t-0 lg:pl-8">
                        <article>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a1a1a]/70">State House</p>
                            <h3 className="mt-2 font-serif text-3xl font-bold leading-[1.05] text-[#1a1a1a]">
                                Heat-Pump Grants Run Dry in Six Weeks
                            </h3>
                            <p className="mt-2 text-base italic leading-snug text-[#1a1a1a]/80">
                                A program built to last until 2028 is out of money, and 7,000 applicants are
                                still waiting
                            </p>
                            <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-[#1a1a1a]/80">
                                By <span className="font-semibold text-[#1a1a1a]">Ines Achterberg</span>
                            </p>
                            <div className={cn('mt-3 text-justify hyphens-auto', body)}>
                                <p className="mb-3 text-[#1a1a1a]">
                                    A $60 million fund meant to help homeowners replace oil furnaces has been
                                    exhausted after 11,400 households applied in its first six weeks, state energy
                                    officials confirmed Saturday.
                                </p>
                                <p className="text-[#1a1a1a]">
                                    Legislators from both parties said they would push for emergency funding when
                                    the House returns on Oct. 6.
                                </p>
                            </div>
                            <JumpLine page="B2" />
                        </article>

                        <nav aria-label="Inside today" className="mt-6 border-4 border-double border-[#1a1a1a] p-4">
                            <h3 className="text-center font-serif text-sm font-bold uppercase tracking-[0.3em] text-[#1a1a1a]">
                                Inside Today
                            </h3>
                            <ul className="mt-3 divide-y divide-[#1a1a1a]/20">
                                {insideToday.map((entry) => (
                                    <li key={entry.name}>
                                        <a
                                            href={`#ledger-${entry.name.toLowerCase()}`}
                                            className="flex min-h-10 items-center gap-2 text-base text-[#1a1a1a] hover:italic focus-visible:outline-2 focus-visible:outline-[#1a1a1a]"
                                        >
                                            {entry.name}
                                            <span aria-hidden="true" className="h-px flex-1 border-b border-dotted border-[#1a1a1a]/50" />
                                            <span className="font-semibold tabular-nums">{entry.page}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>
                </div>

                <div className="mt-8 grid grid-cols-1 border-t-4 border-double border-[#1a1a1a] md:grid-cols-3">
                    {briefs.map((brief, index) => (
                        <article
                            key={brief.id}
                            className={cn(
                                'pt-6',
                                index > 0 && 'mt-6 border-t border-[#1a1a1a]/40 md:mt-0 md:border-l md:border-t-0',
                                index === 0 ? 'md:pr-6' : 'md:px-6',
                                index === briefs.length - 1 && 'md:pr-0',
                            )}
                        >
                            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a1a1a]/70">{brief.desk}</p>
                            <h3 className="mt-2 font-serif text-xl font-bold leading-tight text-[#1a1a1a]">{brief.title}</h3>
                            <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a1a1a]/80">{brief.byline}</p>
                            <p className={cn('mt-3 text-justify text-[#1a1a1a] hyphens-auto', body)}>{brief.body}</p>
                            <JumpLine page={brief.jump} />
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BroadsheetFrontPageFeaturedEditorial
