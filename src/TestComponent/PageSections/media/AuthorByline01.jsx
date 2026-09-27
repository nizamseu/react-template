// InlineShareAuthorByline

// AuthorByline01 · Blogs & Digital Media › Author Bylines

// Description:
// A quiet, literary article opener for the long-read title Longform Review. It sets the
// kicker "Essay — Cities & Water", the serif headline "Under the pavement, a river still
// remembers its name", an italic dek, then a ruled byline with avatar, name, role, date and
// read time plus a share row (Copy link, Email, Save, text size), followed by the opening
// paragraphs with a drop cap. Use it at the top of essays, features and long-form stories.

// Design:
// - Pure white #ffffff page, ink #141414 type, muted #6b6b6b meta and #e7e4de hairlines;
//   monochrome on purpose, the only "colour" is the ink-filled Saved and Copied states
// - Serif editorial type (sans only for meta and share controls): italic wordmark, headline
//   text-4xl → md:text-6xl → lg:text-7xl with an italic phrase, italic dek, ruled kicker
// - Byline sits between two hairlines: 48px round avatar, name + role, date and read time
//   separated by thin dividers; share buttons are 40px outlined circles (icon only on
//   mobile) that fill ink on hover
// - Opening paragraph has a 4-line serif drop cap (first-letter) and the second paragraph
//   fades out under a white gradient before "Continue reading"
// - Responsive: byline and share row stack on mobile and sit on one line from md; body
//   column is max-w-2xl, header max-w-4xl, both centred

// What it does:
// - Copy link writes the page URL + #under-the-pavement to the clipboard (fallback: hidden
//   textarea + execCommand) and shows "Link copied" for 2 s (timeout cleared on unmount),
//   announced in an aria-live region
// - Save toggles aria-pressed and a filled bookmark; "Aa" cycles the body text size
//   (Small / Medium / Large) and its aria-label reports the current size
// - Email links to #share-by-email; "Continue reading" links to #under-the-pavement-2

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import InlineShareAuthorByline from '@/TestComponent/PageSections/media/AuthorByline01';

// const MagazinePage = () => (
//     <main className="space-y-6">
//         <InlineShareAuthorByline />
//     </main>
// )
// ```

'use client'

import { useEffect, useState } from 'react';
import { HiArrowLongRight, HiBookmark, HiCheck, HiOutlineBookmark, HiOutlineEnvelope, HiOutlineLink } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const textSizes = [
    { label: 'Small', body: 'text-[17px] leading-[1.75]', cap: 'first-letter:text-[4.1rem]' },
    { label: 'Medium', body: 'text-[19px] leading-[1.75] sm:text-xl', cap: 'first-letter:text-[4.6rem] sm:first-letter:text-[4.9rem]' },
    { label: 'Large', body: 'text-[21px] leading-[1.7] sm:text-[23px]', cap: 'first-letter:text-[5.1rem] sm:first-letter:text-[5.6rem]' },
]

function legacyCopy(text) {
    try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(area)
        return ok
    } catch {
        return false
    }
}

const shareButton =
    'inline-flex size-10 items-center justify-center gap-2 rounded-full border border-[#141414]/20 text-sm text-[#141414] transition-colors duration-200 hover:border-[#141414] hover:bg-[#141414] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414] sm:w-auto sm:px-4'

export function InlineShareAuthorByline({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [copied, setCopied] = useState(null)
    const [saved, setSaved] = useState(false)
    const [sizeIndex, setSizeIndex] = useState(1)
    const text = textSizes[sizeIndex]

    useEffect(() => {
        if (copied === null) return undefined
        const id = setTimeout(() => setCopied(null), 2000)
        return () => clearTimeout(id)
    }, [copied])

    const copyLink = async () => {
        const url = `${window.location.origin}${window.location.pathname}#under-the-pavement`
        let ok = false
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url)
                ok = true
            }
        } catch {
            ok = false
        }
        if (!ok) ok = legacyCopy(url)
        setCopied(ok ? 'ok' : 'fail')
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-hidden bg-white px-4 py-16 font-serif text-base font-normal text-[#141414] sm:px-6 md:py-24 lg:px-10',
                className,
            )}
            {...props}
        >
            <header className="mx-auto max-w-4xl text-center">
                <p className="font-serif text-lg italic text-[#141414]">Longform Review</p>
                <p className="mt-3 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#6b6b6b]">
                    <span aria-hidden="true" className="h-px w-6 bg-[#141414] sm:w-10" />
                    Essay — Cities &amp; Water
                    <span aria-hidden="true" className="h-px w-6 bg-[#141414] sm:w-10" />
                </p>
                <h2 className="mt-6 font-serif text-4xl font-normal leading-[1.02] tracking-[-0.02em] text-[#141414] sm:text-5xl md:text-6xl lg:text-7xl">
                    Under the pavement, <em className="italic">a river still remembers</em> its name
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg italic leading-relaxed text-[#141414]/70 sm:text-xl">
                    For eleven years a retired surveyor has traced the buried streams beneath the old
                    city with an 1856 map, a torch and 600 manhole covers. What he found rewrites the
                    story of its floods.
                </p>
            </header>

            <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-5 border-y border-[#e7e4de] py-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                        alt="Portrait of Helena Marsh"
                        className="size-12 shrink-0 rounded-full object-cover grayscale"
                    />
                    <div className="min-w-0 text-left">
                        <p className="text-base text-[#141414]">
                            By{' '}
                            <a
                                href="#author-helena-marsh"
                                className="font-semibold underline decoration-[#141414]/25 underline-offset-4 transition-colors hover:decoration-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                            >
                                Helena Marsh
                            </a>
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 font-sans text-[13px] text-[#6b6b6b]">
                            <span>Senior Writer, Cities</span>
                            <span aria-hidden="true" className="h-3 w-px bg-[#141414]/20" />
                            <time dateTime="2026-09-21">21 September 2026</time>
                            <span aria-hidden="true" className="h-3 w-px bg-[#141414]/20" />
                            <span>24 min read</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-sans" aria-label="Share and reading options" role="group">
                    <button
                        type="button"
                        aria-label={copied === 'ok' ? 'Link copied' : 'Copy link'}
                        className={cn(shareButton, copied === 'ok' && 'border-[#141414] bg-[#141414] text-white')}
                        onClick={copyLink}
                    >
                        {copied === 'ok' ? (
                            <HiCheck aria-hidden="true" className="size-4" />
                        ) : (
                            <HiOutlineLink aria-hidden="true" className="size-4" />
                        )}
                        <span className="hidden sm:inline">
                            {copied === 'ok' ? 'Link copied' : copied === 'fail' ? 'Copy failed' : 'Copy link'}
                        </span>
                    </button>
                    <a href="#share-by-email" aria-label="Share by email" className={shareButton}>
                        <HiOutlineEnvelope aria-hidden="true" className="size-4" />
                        <span className="hidden sm:inline">Email</span>
                    </a>
                    <button
                        type="button"
                        aria-pressed={saved}
                        aria-label={saved ? 'Saved to reading list' : 'Save to reading list'}
                        className={cn(shareButton, saved && 'border-[#141414] bg-[#141414] text-white')}
                        onClick={() => setSaved((v) => !v)}
                    >
                        {saved ? (
                            <HiBookmark aria-hidden="true" className="size-4" />
                        ) : (
                            <HiOutlineBookmark aria-hidden="true" className="size-4" />
                        )}
                        <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
                    </button>
                    <span aria-hidden="true" className="mx-1 h-6 w-px bg-[#e7e4de]" />
                    <button
                        type="button"
                        aria-label={`Text size: ${text.label}. Change text size`}
                        className="inline-flex h-10 min-w-10 items-center justify-center gap-0.5 rounded-full border border-[#141414]/20 px-3 font-serif text-[#141414] transition-colors hover:border-[#141414] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141414]"
                        onClick={() => setSizeIndex((i) => (i + 1) % textSizes.length)}
                    >
                        <span aria-hidden="true" className="text-sm">A</span>
                        <span aria-hidden="true" className="text-lg">a</span>
                        <span aria-hidden="true" className="ml-1.5 flex items-end gap-0.5">
                            {textSizes.map((t, i) => (
                                <span
                                    key={t.label}
                                    className={cn(
                                        'w-1 rounded-full transition-colors',
                                        i === 0 && 'h-1.5',
                                        i === 1 && 'h-2.5',
                                        i === 2 && 'h-3.5',
                                        i <= sizeIndex ? 'bg-[#141414]' : 'bg-[#141414]/20',
                                    )}
                                />
                            ))}
                        </span>
                    </button>
                </div>
            </div>

            <p aria-live="polite" className="sr-only">
                {copied === 'ok' ? 'Link copied to clipboard' : copied === 'fail' ? 'Could not copy the link' : ''}
            </p>

            <div className={cn('relative mx-auto mt-12 max-w-2xl text-[#141414] transition-[font-size] duration-300', text.body)}>
                <p
                    className={cn(
                        'first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-serif first-letter:leading-[0.8] first-letter:text-[#141414]',
                        text.cap,
                    )}
                >
                    The first thing Anselmo Duarte does when he reaches a manhole is kneel and listen. It
                    is a little after five on a wet Tuesday in March, and the street above the old tannery
                    district is still dark. He lifts the cover with a hooked iron bar he made himself, lowers
                    a torch on a length of washing line, and waits. Somewhere under the tarmac, eleven metres
                    down, water is moving. “There,” he says, not looking up. “That is the Ribeira. She has
                    not seen daylight since 1871, and she is still exactly where she was.”
                </p>
                <p className="mt-6 text-[#141414]/85">
                    For more than a decade, Duarte has been walking the city with a folded copy of a
                    surveyor’s map from 1856, marking in red pencil every cover where he can hear a buried
                    stream. His notebooks, 43 of them, now hold a map the city itself does not have.
                </p>
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-white via-white/80 to-transparent"
                />
            </div>

            <div className="mx-auto mt-4 flex max-w-2xl justify-center">
                <a
                    href="#under-the-pavement-2"
                    className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-[#141414] px-6 font-sans text-sm font-semibold text-[#141414] transition-colors duration-200 hover:bg-[#141414] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#141414]"
                >
                    Continue reading
                    <HiArrowLongRight
                        aria-hidden="true"
                        className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                    />
                </a>
            </div>
        </section>
    )
}

export default InlineShareAuthorByline
