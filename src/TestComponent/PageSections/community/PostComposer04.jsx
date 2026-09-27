// PhotoUploadPostComposer

// PostComposer04 · Social Networks & Communities › Post Creation Widget

// Description:
// A stark, black-and-white photo post composer for Snapshot. Under "Four frames. One
// story." a 2×2 frame board accepts up to four images (file picker or drag and drop),
// previews them instantly, and gives each frame its own caption, a remove button and a
// "Make cover" action. A details column holds the post caption, crop ratio and the "Share"
// button; shared posts appear in a "Your grid" list. Use it for photo-first communities.

// Design:
// - Two columns on lg (frame board 1.35fr + details 1fr); stacks below lg; the board is
//   grid-cols-2 at every width so slots stay large enough to tap
// - Pure black #000 section, white type, neutral #a3a3a3 / #737373 secondary text,
//   hairlines white/15; a single white primary button that inverts on hover
// - Square corners throughout; mono uppercase micro-labels with wide tracking, a
//   text-5xl → lg:text-8xl display heading and a giant mono "02/04" frame counter
// - Frames pop in/out with AnimatePresence + layout (off for reduced motion); the board
//   gets a white dashed outline while files are dragged over it
// - Crop ratio (1:1 / 4:5 / 16:9) changes the aspect of every slot and the posted grid

// What it does:
// - Files come from a hidden multiple <input type="file" accept="image/*"> (opened by
//   "Choose photos" or any empty slot) or a drop onto the board; non-images, files over
//   10 MB and anything past four frames are rejected with messages
// - Each file preview uses URL.createObjectURL; the URL is revoked when that frame is
//   removed, when its posted item is deleted, and for everything left on unmount
// - "Use sample frames" fills free slots with library photos (no object URLs) for demos
// - Validation: at least one frame and a post caption up to 2,200 characters; submit
//   (preventDefault) moves the frames into "Your grid" and shows a status message

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import PhotoUploadPostComposer from '@/TestComponent/PageSections/community/PostComposer04';

// const CommunityPage = () => (
//     <main className="space-y-6">
//         <PhotoUploadPostComposer />
//     </main>
// )
// ```

'use client'

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
    PiCameraBold,
    PiImageSquareBold,
    PiStarFill,
    PiTrashBold,
    PiUploadSimpleBold,
    PiXBold,
} from 'react-icons/pi';
import { cn } from '@/design-system/lib/cn';

const MAX_FRAMES = 4
const MAX_BYTES = 10 * 1024 * 1024
const CAPTION_MAX = 2200
const FRAME_CAPTION_MAX = 80

const ratios = [
    { id: 'square', label: '1:1', aspect: 'aspect-square' },
    { id: 'portrait', label: '4:5', aspect: 'aspect-[4/5]' },
    { id: 'landscape', label: '16:9', aspect: 'aspect-video' },
]
const ratioById = Object.fromEntries(ratios.map((r) => [r.id, r]))

const samples = [
    {
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
        name: 'shinjuku-rain.jpg',
        caption: 'Shinjuku, 11:40 pm',
    },
    {
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        name: 'yasaka-street.jpg',
        caption: 'Yasaka pagoda at dawn',
    },
    {
        url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        name: 'kit.jpg',
        caption: 'The kit: one body, two primes',
    },
    {
        url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
        name: 'ridge.jpg',
        caption: 'Chasing light on the ridge',
    },
]

const ME = {
    name: 'Lena Park',
    handle: '@lena.frames',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
}

const seedPosted = [
    {
        id: 'posted-0',
        ratio: 'portrait',
        caption: 'Two nights, one roll of Tri-X energy. Kyoto keeps its secrets until the tourists go home.',
        time: 'Yesterday',
        frames: [
            { id: 'seed-a', url: samples[1].url, caption: samples[1].caption, source: 'sample' },
            { id: 'seed-b', url: samples[0].url, caption: samples[0].caption, source: 'sample' },
        ],
    },
]

function formatBytes(bytes) {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const pad = (n) => String(n).padStart(2, '0')

export function PhotoUploadPostComposer({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const inputRef = useRef(null)
    const urlsRef = useRef(new Set())
    const nextId = useRef(0)

    const [frames, setFrames] = useState([])
    const [caption, setCaption] = useState('')
    const [ratio, setRatio] = useState('portrait')
    const [errors, setErrors] = useState([])
    const [dragging, setDragging] = useState(false)
    const [posted, setPosted] = useState(seedPosted)
    const [status, setStatus] = useState('')

    useEffect(() => {
        const urls = urlsRef.current
        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url))
            urls.clear()
        }
    }, [])

    const makeId = () => {
        nextId.current += 1
        return `frame-${nextId.current}`
    }

    const revoke = (frame) => {
        if (frame.source !== 'file') return
        URL.revokeObjectURL(frame.url)
        urlsRef.current.delete(frame.url)
    }

    const addFiles = (fileList) => {
        const incoming = Array.from(fileList || [])
        if (!incoming.length) return
        const problems = []
        const accepted = []
        let skipped = 0
        const room = MAX_FRAMES - frames.length
        for (const file of incoming) {
            if (!file.type.startsWith('image/')) {
                problems.push(`${file.name} is not an image.`)
                continue
            }
            if (file.size > MAX_BYTES) {
                problems.push(`${file.name} is ${formatBytes(file.size)} — the limit is 10 MB.`)
                continue
            }
            if (accepted.length >= room) {
                skipped += 1
                continue
            }
            const url = URL.createObjectURL(file)
            urlsRef.current.add(url)
            accepted.push({ id: makeId(), url, name: file.name, bytes: file.size, caption: '', source: 'file' })
        }
        if (skipped) problems.push(`Only ${MAX_FRAMES} frames per post — ${skipped} ${skipped === 1 ? 'photo was' : 'photos were'} skipped.`)
        setErrors(problems)
        if (accepted.length) {
            setFrames((list) => [...list, ...accepted])
            setStatus(`${accepted.length} ${accepted.length === 1 ? 'frame' : 'frames'} added.`)
        }
    }

    const addSamples = () => {
        const used = new Set(frames.map((f) => f.url))
        const free = samples.filter((s) => !used.has(s.url)).slice(0, MAX_FRAMES - frames.length)
        if (!free.length) return
        setErrors([])
        setFrames((list) => [
            ...list,
            ...free.map((s) => ({ id: makeId(), url: s.url, name: s.name, caption: s.caption, source: 'sample' })),
        ])
        setStatus(`${free.length} sample ${free.length === 1 ? 'frame' : 'frames'} added.`)
    }

    const removeFrame = (id) => {
        const frame = frames.find((f) => f.id === id)
        if (!frame) return
        revoke(frame)
        setFrames((list) => list.filter((f) => f.id !== id))
        setErrors([])
        setStatus(`Removed ${frame.name}.`)
    }

    const makeCover = (id) => {
        setFrames((list) => {
            const frame = list.find((f) => f.id === id)
            return [frame, ...list.filter((f) => f.id !== id)]
        })
        setStatus('Cover frame updated.')
    }

    const setFrameCaption = (id, value) => setFrames((list) => list.map((f) => (f.id === id ? { ...f, caption: value } : f)))

    const deletePosted = (postId) => {
        const post = posted.find((p) => p.id === postId)
        post?.frames.forEach(revoke)
        setPosted((list) => list.filter((p) => p.id !== postId))
        setStatus('Post deleted.')
    }

    const over = caption.length > CAPTION_MAX
    const problem = frames.length === 0 ? 'Add at least one frame.' : over ? `Caption is ${caption.length - CAPTION_MAX} characters too long.` : null
    const valid = problem === null

    const onSubmit = (event) => {
        event.preventDefault()
        if (!valid) return
        nextId.current += 1
        setPosted((list) => [
            { id: `posted-${nextId.current}`, ratio, caption: caption.trim(), time: 'Just now', frames },
            ...list,
        ])
        setFrames([])
        setCaption('')
        setErrors([])
        setStatus(`Shared ${frames.length} ${frames.length === 1 ? 'frame' : 'frames'} to ${ME.handle}.`)
    }

    const openPicker = () => {
        if (frames.length >= MAX_FRAMES) return
        inputRef.current?.click()
    }

    const onDrop = (event) => {
        event.preventDefault()
        setDragging(false)
        addFiles(event.dataTransfer.files)
    }

    const aspect = ratioById[ratio].aspect
    const slots = Array.from({ length: MAX_FRAMES }, (_, i) => frames[i] ?? null)
    const pop = reduceMotion ? 1 : 0.92

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('relative bg-black px-4 py-16 text-base font-normal text-white sm:px-6 md:py-24 lg:px-10', className)}
            {...props}
        >
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-8 border-b border-white/15 pb-10 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#a3a3a3]">
                            Snapshot / New post / {ME.handle}
                        </p>
                        <h2 className="mt-5 text-5xl font-black uppercase leading-[0.9] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
                            Four frames.
                            <br />
                            <span className="text-transparent [-webkit-text-stroke:1.5px_#fff]">One story.</span>
                        </h2>
                    </div>
                    <p className="font-mono text-6xl font-bold leading-none tabular-nums tracking-tight text-white sm:text-7xl" aria-live="polite">
                        {pad(frames.length)}
                        <span className="text-white/30">/{pad(MAX_FRAMES)}</span>
                        <span className="sr-only"> frames added</span>
                    </p>
                </div>

                <form noValidate className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14" onSubmit={onSubmit}>
                    <div
                        className={cn(
                            'relative min-w-0 outline-2 outline-offset-8 transition-[outline-color]',
                            dragging ? 'outline-dashed outline-white' : 'outline-transparent',
                        )}
                        onDragOver={(e) => {
                            e.preventDefault()
                            if (!dragging) setDragging(true)
                        }}
                        onDragLeave={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false)
                        }}
                        onDrop={onDrop}
                    >
                        <input
                            ref={inputRef}
                            multiple
                            type="file"
                            accept="image/*"
                            aria-label="Upload photos"
                            className="sr-only"
                            tabIndex={-1}
                            onChange={(e) => {
                                addFiles(e.target.files)
                                e.target.value = ''
                            }}
                        />
                        <ul className="grid grid-cols-2 gap-3 sm:gap-4">
                            <AnimatePresence initial={false} mode="popLayout">
                                {slots.map((frame, i) =>
                                    frame ? (
                                        <motion.li
                                            key={frame.id}
                                            layout={!reduceMotion}
                                            initial={{ opacity: 0, scale: pop }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: pop }}
                                            transition={{ duration: 0.25 }}
                                            className="min-w-0"
                                        >
                                            <div className={cn('group relative overflow-hidden bg-[#171717]', aspect)}>
                                                <img
                                                    src={frame.url}
                                                    alt={frame.caption || `Frame ${i + 1}: ${frame.name}`}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-linear-to-b from-black/70 to-transparent p-2">
                                                    <span className="bg-black px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                                                        {i === 0 ? (
                                                            <span className="inline-flex items-center gap-1">
                                                                <PiStarFill className="size-3" aria-hidden="true" />
                                                                Cover
                                                            </span>
                                                        ) : (
                                                            pad(i + 1)
                                                        )}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove frame ${i + 1}, ${frame.name}`}
                                                        className="grid size-10 place-items-center bg-white text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                                        onClick={() => removeFrame(frame.id)}
                                                    >
                                                        <PiXBold className="size-4" aria-hidden="true" />
                                                    </button>
                                                </div>
                                                {i > 0 && (
                                                    <button
                                                        type="button"
                                                        className="absolute bottom-2 left-2 min-h-10 bg-black/80 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                                        onClick={() => makeCover(frame.id)}
                                                    >
                                                        Make cover
                                                    </button>
                                                )}
                                            </div>
                                            <label htmlFor={`${uid}-${frame.id}`} className="sr-only">
                                                Caption for frame {i + 1}
                                            </label>
                                            <input
                                                id={`${uid}-${frame.id}`}
                                                type="text"
                                                value={frame.caption}
                                                maxLength={FRAME_CAPTION_MAX}
                                                placeholder="Frame caption"
                                                className="mt-2 block min-h-11 w-full border-0 border-b border-white/20 bg-transparent px-0 text-sm text-white placeholder:text-[#737373] focus:border-white focus:outline-none focus-visible:outline-none"
                                                onChange={(e) => setFrameCaption(frame.id, e.target.value)}
                                            />
                                            <p className="mt-1 flex justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#737373]">
                                                <span className="truncate">
                                                    {frame.source === 'file' ? formatBytes(frame.bytes) : 'Sample'} · {frame.name}
                                                </span>
                                                <span className="shrink-0 tabular-nums">
                                                    {frame.caption.length}/{FRAME_CAPTION_MAX}
                                                </span>
                                            </p>
                                        </motion.li>
                                    ) : (
                                        <motion.li key={`empty-${i}`} layout={!reduceMotion} className="min-w-0">
                                            <button
                                                type="button"
                                                tabIndex={i === frames.length ? 0 : -1}
                                                aria-label={`Add photos (slot ${i + 1} of ${MAX_FRAMES})`}
                                                className={cn(
                                                    'flex w-full flex-col items-center justify-center gap-3 border border-dashed border-white/25 p-3 text-center text-[#a3a3a3] transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                                                    aspect,
                                                )}
                                                onClick={openPicker}
                                            >
                                                {i === frames.length ? (
                                                    <>
                                                        <PiUploadSimpleBold className="size-7 text-white" aria-hidden="true" />
                                                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] sm:text-[11px]">
                                                            Drop or choose
                                                        </span>
                                                    </>
                                                ) : (
                                                    <PiImageSquareBold className="size-6 opacity-40" aria-hidden="true" />
                                                )}
                                            </button>
                                        </motion.li>
                                    ),
                                )}
                            </AnimatePresence>
                        </ul>
                        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-[#737373]">
                            JPG, PNG, HEIC or WebP · up to 10 MB each · max {MAX_FRAMES} frames
                        </p>
                    </div>

                    <div className="min-w-0 lg:border-l lg:border-white/15 lg:pl-10">
                        <div className="flex items-center gap-3">
                            <img src={ME.avatar} alt="" loading="lazy" className="size-11 object-cover grayscale" />
                            <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-white">{ME.name}</p>
                                <p className="truncate font-mono text-xs text-[#a3a3a3]">{ME.handle}</p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                disabled={frames.length >= MAX_FRAMES}
                                className="inline-flex min-h-12 items-center justify-center gap-2 border border-white px-3 text-sm font-bold text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white"
                                onClick={openPicker}
                            >
                                <PiCameraBold className="size-4" aria-hidden="true" />
                                Choose photos
                            </button>
                            <button
                                type="button"
                                disabled={frames.length >= MAX_FRAMES}
                                className="min-h-12 border border-white/25 px-3 text-sm font-semibold text-[#d4d4d4] transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={addSamples}
                            >
                                Use sample frames
                            </button>
                        </div>

                        {errors.length > 0 && (
                            <ul role="alert" className="mt-4 space-y-1 border-l-2 border-white pl-3 text-sm text-white">
                                {errors.map((e) => (
                                    <li key={e}>{e}</li>
                                ))}
                            </ul>
                        )}

                        <label htmlFor={`${uid}-caption`} className="mt-8 block font-mono text-[11px] uppercase tracking-[0.24em] text-[#a3a3a3]">
                            Caption
                        </label>
                        <textarea
                            id={`${uid}-caption`}
                            rows={5}
                            value={caption}
                            placeholder="Where, when, what it felt like…"
                            aria-invalid={over}
                            aria-describedby={`${uid}-hint`}
                            className={cn(
                                'mt-3 block w-full resize-none border bg-[#0a0a0a] p-4 text-base leading-relaxed text-white placeholder:text-[#525252] focus:outline-none',
                                over ? 'border-white' : 'border-white/15 focus:border-white/60',
                            )}
                            onChange={(e) => setCaption(e.target.value)}
                        />
                        <p className={cn('mt-2 text-right font-mono text-xs tabular-nums', over ? 'font-bold text-white underline' : 'text-[#737373]')}>
                            {caption.length.toLocaleString('en-US')} / {CAPTION_MAX.toLocaleString('en-US')}
                        </p>

                        <p id={`${uid}-ratio`} className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-[#a3a3a3]">
                            Crop
                        </p>
                        <div role="group" aria-labelledby={`${uid}-ratio`} className="mt-3 grid grid-cols-3 border border-white/15">
                            {ratios.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    aria-pressed={ratio === r.id}
                                    className={cn(
                                        'min-h-11 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white',
                                        ratio === r.id ? 'bg-white text-black' : 'text-[#a3a3a3] hover:text-white',
                                    )}
                                    onClick={() => setRatio(r.id)}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 border-t border-white/15 pt-6">
                            <p id={`${uid}-hint`} className="text-sm text-[#a3a3a3]">
                                {valid ? `Ready — ${frames.length} ${frames.length === 1 ? 'frame' : 'frames'}, cropped ${ratioById[ratio].label}.` : problem}
                            </p>
                            <button
                                type="submit"
                                disabled={!valid}
                                className="mt-4 inline-flex min-h-14 w-full items-center justify-center bg-white text-sm font-black uppercase tracking-[0.2em] text-black transition-colors hover:bg-[#d4d4d4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:bg-[#262626] disabled:text-[#737373]"
                            >
                                {frames.length > 1 ? `Share ${frames.length} frames` : 'Share'}
                            </button>
                            <p role="status" className="mt-3 min-h-5 font-mono text-xs text-[#d4d4d4]">
                                {status}
                            </p>
                        </div>
                    </div>
                </form>

                <div className="mt-16 border-t border-white/15 pt-10">
                    <div className="flex items-end justify-between gap-4">
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">Your grid</h3>
                        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#737373]">
                            {posted.length} {posted.length === 1 ? 'post' : 'posts'}
                        </p>
                    </div>
                    {posted.length === 0 && (
                        <p className="mt-6 text-sm text-[#737373]">Nothing here yet — your shared frames will land here.</p>
                    )}
                    <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <AnimatePresence initial={false}>
                            {posted.map((post) => {
                                const postAspect = ratioById[post.ratio].aspect
                                const count = post.frames.length
                                return (
                                    <motion.li
                                        key={post.id}
                                        layout={!reduceMotion}
                                        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.35 }}
                                    >
                                        <article className="border border-white/15">
                                            <div className="grid grid-cols-2 gap-px bg-white/15">
                                                {post.frames.map((f, i) => (
                                                    <figure
                                                        key={f.id}
                                                        className={cn(
                                                            'relative overflow-hidden bg-black',
                                                            (count === 1 || (count === 3 && i === 0)) && 'col-span-2',
                                                        )}
                                                    >
                                                        <img
                                                            src={f.url}
                                                            alt={f.caption || `Frame ${i + 1}`}
                                                            loading="lazy"
                                                            className={cn(
                                                                'w-full object-cover',
                                                                count === 1 || (count === 3 && i === 0) ? 'aspect-video' : postAspect,
                                                            )}
                                                        />
                                                        {f.caption && (
                                                            <figcaption className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/85 to-transparent px-2 pb-1.5 pt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-white">
                                                                {f.caption}
                                                            </figcaption>
                                                        )}
                                                    </figure>
                                                ))}
                                            </div>
                                            <div className="flex items-start gap-3 p-4">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#737373]">
                                                        {post.time} · {count} {count === 1 ? 'frame' : 'frames'}
                                                    </p>
                                                    {post.caption && (
                                                        <p className="mt-2 break-words text-sm leading-relaxed text-[#e5e5e5]">{post.caption}</p>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    aria-label="Delete this post"
                                                    className="grid size-10 shrink-0 place-items-center border border-white/15 text-[#a3a3a3] transition-colors hover:border-white hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                                    onClick={() => deletePosted(post.id)}
                                                >
                                                    <PiTrashBold className="size-4" aria-hidden="true" />
                                                </button>
                                            </div>
                                        </article>
                                    </motion.li>
                                )
                            })}
                        </AnimatePresence>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default PhotoUploadPostComposer
