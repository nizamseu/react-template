// CodeExamplesSlider

// Slider02 · Knowledge Bases & Documentation › Animated Slider

// Description:
// A deck of API recipes for the Nimbus Developer Hub under the heading "Copy, paste,
// ship.". Four cards ("Create a payment", "Verify a webhook", "List every customer",
// "Refund safely with retries") each show the endpoint, a short explanation, language
// tabs (cURL / Node.js / Python / Go), a highlighted snippet with a working Copy button
// and the expected response. Use it on a developer portal home page or an SDK landing
// page.

// Design:
// - Midnight #0f172a section with a cyan #22d3ee glow and a dotted grid; the front card
//   is #111a2e with a slate #1e293b border, two lighter cards peek out behind it ("Up
//   next")
// - lg:grid-cols-[17rem_1fr]: a numbered recipe list on the left (method badge, path,
//   cyan rule + autoplay progress on the active item); below lg it becomes a row of
//   dots
// - Snippets use mono 11.5 → sm:13px text with line numbers and a light highlighter
//   (keywords cyan, strings amber, numbers pink, functions indigo, comments slate); the
//   code area has a fixed height (lines wrap and scroll inside) so every card keeps the
//   same size
// - Deck motion: "next" throws the front card left with a tilt while the next card
//   rises from the stack; "prev" slides the card back in from the left; dragging tilts
//   the card
// - Header stacks on mobile; controls (dots below lg, counter from sm, play/pause,
//   prev/next) sit under the deck

// What it does:
// - State: [index, direction], the chosen language per recipe, copy status and hover /
//   focus / drag flags. animate() runs an 8 s progress value that advances the deck; it
//   pauses on hover, keyboard focus and drags and is off for prefers-reduced-motion
// - Drag or swipe the card (70 px, a fast flick, or any >24 px swipe under 250 ms; left
//   = next), ←/→/Home/End on the deck, prev/next buttons, the recipe list or the dots
// - Language tabs are a role="tablist" per card (←/→/Home/End switch tabs without
//   moving the deck). Copy writes the visible snippet to the clipboard and shows
//   "Copied" for 1.8 s
// - "Browse all 64 recipes" → #nimbus-recipes; each card links to its API reference
//   anchor

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CodeExamplesSlider from '@/TestComponent/PageSections/knowledge/Slider02';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <CodeExamplesSlider />
//     </main>
// )
// ```

'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { HiArrowLongLeft, HiArrowLongRight, HiArrowUpRight, HiCheck, HiMiniPause, HiMiniPlay, HiOutlineClipboardDocument } from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const AUTOPLAY_SECONDS = 8
const EASE = [0.22, 1, 0.36, 1]

const recipes = [
    {
        id: 'create-payment',
        title: 'Create a payment',
        method: 'POST',
        path: '/v1/payments',
        summary: 'Charge a saved card and confirm it in one call. Amounts are always in the smallest currency unit.',
        response: '201 Created · 142 ms',
        href: '#api-payments-create',
        snippets: [
            {
                lang: 'curl',
                label: 'cURL',
                code: [
                    'curl https://api.nimbus.dev/v1/payments \\',
                    '  -u "$NIMBUS_SECRET_KEY:" \\',
                    '  -H "Idempotency-Key: ord_8841" \\',
                    '  -d amount=4900 \\',
                    '  -d currency=usd \\',
                    '  -d customer=cus_Qm42Lk \\',
                    '  -d confirm=true',
                ],
            },
            {
                lang: 'js',
                label: 'Node.js',
                code: [
                    "import Nimbus from '@nimbus/node'",
                    '',
                    'const nimbus = new Nimbus(process.env.NIMBUS_SECRET_KEY)',
                    '',
                    'const payment = await nimbus.payments.create({',
                    '  amount: 4900, // $49.00',
                    "  currency: 'usd',",
                    "  customer: 'cus_Qm42Lk',",
                    '  confirm: true,',
                    '})',
                    '',
                    "console.info(payment.status) // 'succeeded'",
                ],
            },
            {
                lang: 'py',
                label: 'Python',
                code: [
                    'import os',
                    'import nimbus',
                    '',
                    'nimbus.api_key = os.environ["NIMBUS_SECRET_KEY"]',
                    '',
                    'payment = nimbus.Payment.create(',
                    '    amount=4900,  # $49.00',
                    '    currency="usd",',
                    '    customer="cus_Qm42Lk",',
                    '    confirm=True,',
                    ')',
                    'print(payment.status)  # "succeeded"',
                ],
            },
        ],
    },
    {
        id: 'verify-webhook',
        title: 'Verify a webhook',
        method: 'POST',
        path: '/your/webhook-endpoint',
        summary: 'Check the Nimbus-Signature header before trusting an event. Signatures older than five minutes are rejected.',
        response: '200 OK · signature valid',
        href: '#api-webhooks-signatures',
        snippets: [
            {
                lang: 'js',
                label: 'Node.js',
                code: [
                    "import Nimbus from '@nimbus/node'",
                    '',
                    'const secret = process.env.NIMBUS_WEBHOOK_SECRET',
                    '',
                    'export function handleWebhook(req, res) {',
                    "  const sig = req.headers['nimbus-signature']",
                    '  try {',
                    '    const event = Nimbus.webhooks.verify(req.rawBody, sig, secret)',
                    '    return res.status(200).json({ received: event.type })',
                    '  } catch (err) {',
                    '    return res.status(400).send(`Bad signature: ${err.message}`)',
                    '  }',
                    '}',
                ],
            },
            {
                lang: 'py',
                label: 'Python',
                code: [
                    'import os',
                    'import nimbus',
                    '',
                    'secret = os.environ["NIMBUS_WEBHOOK_SECRET"]',
                    '',
                    'def handle_webhook(body: bytes, headers: dict):',
                    '    sig = headers.get("Nimbus-Signature")',
                    '    try:',
                    '        event = nimbus.Webhook.verify(body, sig, secret)',
                    '    except nimbus.SignatureError:',
                    '        return 400, "Bad signature"',
                    '    return 200, {"received": event.type}',
                ],
            },
        ],
    },
    {
        id: 'list-customers',
        title: 'List every customer',
        method: 'GET',
        path: '/v1/customers',
        summary: 'Walk all customers with cursor pagination. The SDKs page automatically, so you never touch starting_after.',
        response: '200 OK · has_more: true',
        href: '#api-customers-list',
        snippets: [
            {
                lang: 'js',
                label: 'Node.js',
                code: [
                    "import Nimbus from '@nimbus/node'",
                    '',
                    'const nimbus = new Nimbus(process.env.NIMBUS_SECRET_KEY)',
                    'let total = 0',
                    '',
                    'for await (const customer of nimbus.customers.list({ limit: 100 })) {',
                    '  total += 1',
                    "  if (customer.metadata.plan === 'enterprise') {",
                    '    await syncToCrm(customer)',
                    '  }',
                    '}',
                    '',
                    'console.info(`Synced ${total} customers`)',
                ],
            },
            {
                lang: 'py',
                label: 'Python',
                code: [
                    'import nimbus',
                    '',
                    'total = 0',
                    'pages = nimbus.Customer.list(limit=100)',
                    '',
                    'for customer in pages.auto_paging_iter():',
                    '    total += 1',
                    '    if customer.metadata.get("plan") == "enterprise":',
                    '        sync_to_crm(customer)',
                    '',
                    'print(f"Synced {total} customers")',
                ],
            },
            {
                lang: 'curl',
                label: 'cURL',
                code: [
                    'curl -G https://api.nimbus.dev/v1/customers \\',
                    '  -u "$NIMBUS_SECRET_KEY:" \\',
                    '  -d limit=100 \\',
                    '  -d starting_after=cus_Qm42Lk \\',
                    '  -d "created[gte]=1767225600"',
                ],
            },
        ],
    },
    {
        id: 'refund-retries',
        title: 'Refund safely with retries',
        method: 'POST',
        path: '/v1/refunds',
        summary: 'Reuse the same Idempotency-Key when a request times out and Nimbus returns the first result instead of refunding twice.',
        response: '200 OK · idempotent replay',
        href: '#api-refunds-create',
        snippets: [
            {
                lang: 'js',
                label: 'Node.js',
                code: [
                    "import Nimbus from '@nimbus/node'",
                    '',
                    'const nimbus = new Nimbus(process.env.NIMBUS_SECRET_KEY, {',
                    '  maxNetworkRetries: 3, // exponential backoff',
                    '})',
                    '',
                    'const refund = await nimbus.refunds.create(',
                    "  { payment: 'pay_7Hc21x', amount: 1500 },",
                    "  { idempotencyKey: 'refund_ord_8841' },",
                    ')',
                    '',
                    'console.info(refund.id, refund.status)',
                ],
            },
            {
                lang: 'go',
                label: 'Go',
                code: [
                    'params := &nimbus.RefundParams{',
                    '    Payment: nimbus.String("pay_7Hc21x"),',
                    '    Amount:  nimbus.Int64(1500),',
                    '}',
                    'params.SetIdempotencyKey("refund_ord_8841")',
                    '',
                    'r, err := refund.New(params)',
                    'if err != nil {',
                    '    log.Fatalf("refund failed: %v", err)',
                    '}',
                    'fmt.Println(r.ID, r.Status)',
                ],
            },
            {
                lang: 'curl',
                label: 'cURL',
                code: [
                    'curl https://api.nimbus.dev/v1/refunds \\',
                    '  -u "$NIMBUS_SECRET_KEY:" \\',
                    '  -H "Idempotency-Key: refund_ord_8841" \\',
                    '  -d payment=pay_7Hc21x \\',
                    '  -d amount=1500 \\',
                    '  -d reason=requested_by_customer',
                ],
            },
        ],
    },
]

const total = recipes.length
const pad = (n) => String(n).padStart(2, '0')

// Light highlighter: sticky regexes per language, first match wins, then words are classified.
const STRING_JS = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/y
const RULES = {
    js: [['comment', /\/\/.*/y], ['string', STRING_JS], ['number', /\b\d+(?:\.\d+)?\b/y], ['word', /[A-Za-z_$][\w$]*/y]],
    go: [['comment', /\/\/.*/y], ['string', /"(?:[^"\\]|\\.)*"|`[^`]*`/y], ['number', /\b\d+(?:\.\d+)?\b/y], ['word', /[A-Za-z_][\w]*/y]],
    py: [
        ['comment', /#.*/y],
        ['string', /[fbr]?"(?:[^"\\]|\\.)*"|[fbr]?'(?:[^'\\]|\\.)*'/y],
        ['number', /\b\d+(?:\.\d+)?\b/y],
        ['word', /[A-Za-z_][\w]*/y],
    ],
    curl: [
        ['comment', /#.*/y],
        ['string', /'[^']*'|"[^"]*"/y],
        ['flag', /-{1,2}[A-Za-z][\w-]*/y],
        ['word', /[A-Za-z_$][\w@./:$[\]=-]*/y],
    ],
}
const KEYWORDS = {
    js: ['import', 'from', 'export', 'default', 'const', 'let', 'await', 'async', 'for', 'of', 'if', 'else', 'return', 'new', 'try', 'catch', 'function'],
    py: ['import', 'from', 'def', 'return', 'for', 'in', 'if', 'else', 'try', 'except', 'with', 'as'],
    go: ['package', 'import', 'func', 'return', 'if', 'for', 'range', 'var'],
    curl: [],
}
const CONSTANTS = new Set(['true', 'false', 'null', 'undefined', 'True', 'False', 'None', 'nil'])

function tokenize(line, lang) {
    const tokens = []
    let plain = ''
    let firstWord = true
    let i = 0
    const flush = () => {
        if (plain) tokens.push({ type: 'plain', text: plain })
        plain = ''
    }
    while (i < line.length) {
        let hit = null
        for (const [type, re] of RULES[lang]) {
            re.lastIndex = i
            const m = re.exec(line)
            if (m && m[0]) {
                hit = { type, text: m[0] }
                break
            }
        }
        if (!hit) {
            plain += line[i]
            i += 1
            continue
        }
        flush()
        let { type } = hit
        if (type === 'word') {
            const rest = line.slice(i + hit.text.length)
            if (lang === 'curl') type = firstWord && hit.text === 'curl' ? 'command' : /^https?:/.test(hit.text) ? 'string' : 'plain'
            else if (KEYWORDS[lang].includes(hit.text)) type = 'keyword'
            else if (CONSTANTS.has(hit.text)) type = 'number'
            else if (/^\s*\(/.test(rest)) type = 'fn'
            else if (/^\s*:(?!=)/.test(rest) || (lang === 'py' && /^=(?!=)/.test(rest))) type = 'prop'
            else if (/^[A-Z]/.test(hit.text)) type = 'type'
            else type = 'plain'
            firstWord = false
        }
        tokens.push({ type, text: hit.text })
        i += hit.text.length
    }
    flush()
    return tokens
}

const tokenClass = {
    plain: 'text-[#e2e8f0]',
    comment: 'italic text-[#64748b]',
    string: 'text-[#fde68a]',
    number: 'text-[#f9a8d4]',
    keyword: 'text-[#22d3ee]',
    fn: 'text-[#a5b4fc]',
    prop: 'text-[#7dd3fc]',
    type: 'text-[#5eead4]',
    flag: 'text-[#f0abfc]',
    command: 'font-semibold text-[#22d3ee]',
}

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

const cardVariants = {
    enter: (dir) =>
        dir < 0
            ? { x: -150, y: 0, scale: 1, rotate: -7, opacity: 0, zIndex: 2 }
            : { x: 0, y: -34, scale: 0.93, rotate: 0, opacity: 0, zIndex: 1 },
    center: {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 210, damping: 27, opacity: { duration: 0.35 } },
    },
    exit: (dir) =>
        dir < 0
            ? { x: 0, y: -34, scale: 0.93, opacity: 0, zIndex: 1, transition: { duration: 0.4, ease: EASE } }
            : { x: -170, rotate: -8, opacity: 0, zIndex: 2, transition: { duration: 0.45, ease: EASE } },
}

function MethodBadge({ method }) {
    return (
        <span
            className={cn(
                'inline-flex h-6 shrink-0 items-center rounded-md px-2 font-mono text-[11px] font-bold tracking-wide',
                method === 'GET' ? 'border border-[#22d3ee]/50 text-[#67e8f9]' : 'bg-[#22d3ee] text-[#0f172a]',
            )}
        >
            {method}
        </span>
    )
}

function RecipeCard({ recipe, index, live, lang, onLang, copied, onCopy, idBase }) {
    const snippet = recipe.snippets.find((s) => s.lang === lang) ?? recipe.snippets[0]
    const tabRefs = useRef([])

    const handleTabKey = (event, i) => {
        const count = recipe.snippets.length
        let next = null
        if (event.key === 'ArrowRight') next = (i + 1) % count
        else if (event.key === 'ArrowLeft') next = (i - 1 + count) % count
        else if (event.key === 'Home') next = 0
        else if (event.key === 'End') next = count - 1
        if (next === null) return
        event.preventDefault()
        event.stopPropagation()
        onLang(recipe.snippets[next].lang)
        tabRefs.current[next]?.focus()
    }

    return (
        <article className="flex h-full flex-col rounded-3xl border border-[#1e293b] bg-[#111a2e] p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] sm:p-7">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <MethodBadge method={recipe.method} />
                <code className="min-w-0 truncate font-mono text-xs text-[#94a3b8] sm:text-[13px]">{recipe.path}</code>
                <span className="ml-auto font-mono text-[11px] text-[#64748b]">
                    Recipe {pad(index + 1)}/{pad(total)}
                </span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-3xl">{recipe.title}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#94a3b8]">{recipe.summary}</p>

            <div className="mt-5 flex items-end justify-between gap-3 border-b border-[#1e293b]">
                {live ? (
                    <div role="tablist" aria-label={`Language for ${recipe.title}`} className="-mb-px flex min-w-0 gap-1 overflow-hidden">
                        {recipe.snippets.map((s, i) => {
                            const selected = s.lang === snippet.lang
                            return (
                                <button
                                    key={s.lang}
                                    ref={(el) => {
                                        tabRefs.current[i] = el
                                    }}
                                    id={`${idBase}-tab-${s.lang}`}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls={`${idBase}-panel`}
                                    tabIndex={selected ? 0 : -1}
                                    className={cn(
                                        'min-h-10 shrink-0 border-b-2 px-2.5 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#22d3ee] sm:px-3.5',
                                        selected ? 'border-[#22d3ee] text-white' : 'border-transparent text-[#64748b] hover:text-[#cbd5e1]',
                                    )}
                                    onClick={() => onLang(s.lang)}
                                    onKeyDown={(event) => handleTabKey(event, i)}
                                >
                                    {s.label}
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex gap-1">
                        {recipe.snippets.map((s) => (
                            <span key={s.lang} className="min-h-10 px-2.5 font-mono text-xs sm:px-3.5">
                                {s.label}
                            </span>
                        ))}
                    </div>
                )}
                {live ? (
                    <button
                        type="button"
                        aria-label={copied ? 'Snippet copied' : `Copy the ${snippet.label} snippet`}
                        className={cn(
                            'mb-1.5 inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-lg px-3 font-mono text-[11px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]',
                            copied ? 'bg-[#22d3ee] text-[#0f172a]' : 'bg-white/5 text-[#cbd5e1] hover:bg-white/10 hover:text-white',
                        )}
                        onClick={() => onCopy(snippet)}
                    >
                        {copied ? <HiCheck aria-hidden="true" className="size-3.5" /> : <HiOutlineClipboardDocument aria-hidden="true" className="size-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                ) : (
                    <span className="mb-1.5 min-h-10 w-20" />
                )}
            </div>

            {live ? (
                <div
                    id={`${idBase}-panel`}
                    role="tabpanel"
                    tabIndex={0}
                    aria-labelledby={`${idBase}-tab-${snippet.lang}`}
                    className="mt-4 h-[22rem] touch-pan-y overflow-y-auto overscroll-contain rounded-2xl bg-[#0b1222] py-4 font-mono text-[11.5px] leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee] sm:text-[13px]"
                >
                    <AnimatePresence initial={false} mode="wait">
                        <motion.pre
                            key={snippet.lang}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="m-0 font-mono"
                        >
                            <code className="block">
                                {snippet.code.map((line, i) => (
                                    <span key={`${i}-${line}`} className="flex pr-3 sm:pr-4">
                                        <span aria-hidden="true" className="w-7 shrink-0 select-none pr-2.5 text-right text-[#334155] sm:w-11 sm:pr-4">
                                            {i + 1}
                                        </span>
                                        <span className="min-w-0 whitespace-pre-wrap [overflow-wrap:anywhere]">
                                            {line
                                                ? tokenize(line, snippet.lang).map((t, k) => (
                                                      <span key={`${k}-${t.text}`} className={tokenClass[t.type]}>
                                                          {t.text}
                                                      </span>
                                                  ))
                                                : ' '}
                                        </span>
                                    </span>
                                ))}
                            </code>
                        </motion.pre>
                    </AnimatePresence>
                </div>
            ) : (
                <div className="mt-4 h-[22rem]" />
            )}

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="inline-flex items-center gap-2 font-mono text-[#94a3b8]">
                    <span className="size-2 rounded-full bg-[#34d399] shadow-[0_0_10px_#34d399]" />
                    {recipe.response}
                </span>
                {live ? (
                    <a
                        href={recipe.href}
                        draggable={false}
                        className="group inline-flex min-h-10 items-center gap-1.5 rounded-md font-semibold text-[#67e8f9] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                    >
                        Open in API reference
                        <HiArrowUpRight aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                ) : (
                    <span className="inline-flex min-h-10 items-center">Open in API reference</span>
                )}
            </div>
        </article>
    )
}

export function CodeExamplesSlider({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const [[index, direction], setPage] = useState([0, 0])
    const [langs, setLangs] = useState({})
    const [copyState, setCopyState] = useState(null)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)
    const [dragging, setDragging] = useState(false)
    const [playPref, setPlayPref] = useState(null)
    const [hydrated, setHydrated] = useState(false)
    const prefersReduced = useReducedMotion()
    const progress = useMotionValue(0)
    const dragX = useMotionValue(0)
    const tilt = useTransform(dragX, [-240, 240], [-5, 5])
    const stageRef = useRef(null)
    const panning = useRef(false)
    const moved = useRef(false)
    const panAt = useRef(0)
    const snapBack = useRef(null)

    const reduce = hydrated && Boolean(prefersReduced)
    const autoplayOn = playPref ?? !reduce
    const playing = autoplayOn && !hovered && !focused && !dragging
    const recipe = recipes[index]
    const upNext = [recipes[(index + 1) % total], recipes[(index + 2) % total]]
    const lang = langs[recipe.id] ?? recipe.snippets[0].lang
    const copied = copyState?.key === `${recipe.id}:${lang}` && copyState.ok

    const paginate = useCallback(
        (dir) => {
            progress.jump(0)
            setPage(([current]) => [(current + dir + total) % total, dir])
        },
        [progress],
    )

    const goTo = (target) => {
        if (target === index) return
        progress.jump(0)
        setPage([target, target > index ? 1 : -1])
    }

    useEffect(() => {
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (!playing) return undefined
        const controls = animate(progress, 1, {
            duration: AUTOPLAY_SECONDS * (1 - progress.get()),
            ease: 'linear',
            onComplete: () => paginate(1),
        })
        return () => controls.stop()
    }, [playing, index, paginate, progress])

    useEffect(() => {
        if (!copyState) return undefined
        const id = setTimeout(() => setCopyState(null), 1800)
        return () => clearTimeout(id)
    }, [copyState])

    useEffect(() => () => snapBack.current?.stop(), [])

    const copySnippet = async (snippet) => {
        const text = snippet.code.join('\n')
        let ok = false
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text)
                ok = true
            }
        } catch {
            ok = false
        }
        if (!ok) ok = legacyCopy(text)
        setCopyState({ key: `${recipe.id}:${snippet.lang}`, label: snippet.label, ok, at: Date.now() })
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') paginate(1)
        else if (event.key === 'ArrowLeft') paginate(-1)
        else if (event.key === 'Home') goTo(0)
        else if (event.key === 'End') goTo(total - 1)
        else return
        event.preventDefault()
        setFocused(true)
        const stage = stageRef.current
        if (stage && stage !== event.target && stage.contains(event.target)) stage.focus({ preventScroll: true })
    }

    const handleFocus = (event) => {
        let visible = true
        try {
            visible = event.target.matches(':focus-visible')
        } catch {
            visible = true
        }
        if (visible) setFocused(true)
    }

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
    }

    // framer-motion calls onPan synchronously but defers onPanStart to the next frame,
    // so whichever handler runs first sets up the drag.
    const beginPan = () => {
        if (panning.current) return
        panning.current = true
        moved.current = true
        panAt.current = performance.now()
        snapBack.current?.stop()
        setDragging(true)
    }

    const handlePan = (_, info) => {
        beginPan()
        dragX.set(info.offset.x * 0.45)
    }

    const handlePanEnd = (_, info) => {
        panning.current = false
        setDragging(false)
        const { offset, velocity } = info
        // Pan velocity reads low when the frame loop was idle, so a short, quick swipe
        // (< 250 ms, > 24 px) also counts as a flick in the drag direction.
        const flick = performance.now() - panAt.current < 250 && Math.abs(offset.x) > 24
        if (offset.x < -70 || (offset.x < -10 && (velocity.x < -400 || flick))) paginate(1)
        else if (offset.x > 70 || (offset.x > 10 && (velocity.x > 400 || flick))) paginate(-1)
        snapBack.current = animate(dragX, 0, { type: 'spring', stiffness: 320, damping: 32 })
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative isolate overflow-hidden bg-[#0f172a] px-4 py-16 text-base font-normal text-[#e2e8f0] sm:px-6 lg:px-10 lg:py-24',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(148,163,184,0.16)_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-40 -z-10 size-[34rem] rounded-full bg-[#22d3ee] opacity-[0.12] blur-[130px]" />

            <MotionConfig reducedMotion="user">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-xl">
                            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#22d3ee]">Nimbus Developer Hub · Recipes</p>
                            <h2 className="mt-4 text-4xl font-semibold leading-none tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
                                Copy, paste, <span className="text-[#22d3ee]">ship.</span>
                            </h2>
                            <p className="mt-4 text-sm leading-6 text-[#94a3b8] sm:text-base sm:leading-7">
                                Production-ready snippets for the four calls every integration needs. Pick a language, copy
                                it, done.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                            <p className="font-mono text-xs text-[#64748b]">API v3.2 · SDKs 8.4</p>
                            <a
                                href="#nimbus-recipes"
                                className="group inline-flex min-h-10 items-center gap-2 self-start rounded-md text-sm font-semibold text-white transition-colors hover:text-[#67e8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee] md:self-auto"
                            >
                                Browse all 64 recipes
                                <HiArrowLongRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>

                    <div
                        role="region"
                        aria-roledescription="carousel"
                        aria-label="Nimbus API code recipes"
                        className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10"
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onPointerEnter={(event) => {
                            if (event.pointerType === 'mouse') setHovered(true)
                        }}
                        onPointerLeave={(event) => {
                            if (event.pointerType === 'mouse') setHovered(false)
                        }}
                    >
                        <ol aria-label="Recipes" className="hidden self-start lg:mt-10 lg:block">
                            {recipes.map((item, i) => {
                                const active = i === index
                                return (
                                    <li key={item.id}>
                                        <button
                                            type="button"
                                            aria-label={`Recipe ${i + 1}: ${item.title}`}
                                            aria-current={active ? 'true' : undefined}
                                            className={cn(
                                                'group relative flex w-full gap-4 overflow-hidden rounded-xl px-4 py-4 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]',
                                                active ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]',
                                            )}
                                            onClick={() => goTo(i)}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={cn('absolute inset-y-3 left-0 w-0.5 rounded-full transition-colors', active ? 'bg-[#22d3ee]' : 'bg-transparent')}
                                            />
                                            <span className={cn('font-mono text-xs', active ? 'text-[#22d3ee]' : 'text-[#475569]')}>{pad(i + 1)}</span>
                                            <span className="min-w-0">
                                                <span className={cn('block text-sm font-semibold', active ? 'text-white' : 'text-[#94a3b8] group-hover:text-[#cbd5e1]')}>
                                                    {item.title}
                                                </span>
                                                <span className="mt-1 block truncate font-mono text-[11px] text-[#64748b]">
                                                    {item.method} {item.path}
                                                </span>
                                            </span>
                                            <span aria-hidden="true" className="absolute inset-x-4 bottom-0 h-px bg-[#1e293b]">
                                                {active && <motion.span className="absolute inset-0 origin-left bg-[#22d3ee]/70" style={{ scaleX: autoplayOn ? progress : 1 }} />}
                                            </span>
                                        </button>
                                    </li>
                                )
                            })}
                        </ol>

                        <div className="min-w-0">
                            <div className="relative pt-10">
                                <div aria-hidden="true" className="absolute inset-x-10 top-0 h-28 rounded-3xl border border-white/5 bg-[#0c1426] sm:inset-x-14">
                                    <p className="truncate px-5 pt-1.5 font-mono text-[10px] text-[#475569]">
                                        {pad(((index + 2) % total) + 1)} · {upNext[1].title}
                                    </p>
                                </div>
                                <div aria-hidden="true" className="absolute inset-x-5 top-5 h-28 rounded-3xl border border-white/[0.07] bg-[#0f182c] sm:inset-x-7">
                                    <p className="truncate px-5 pt-1.5 font-mono text-[10px] text-[#64748b]">
                                        Up next · {upNext[0].title}
                                    </p>
                                </div>

                                <motion.div
                                    ref={stageRef}
                                    role="group"
                                    tabIndex={0}
                                    aria-label="Recipe cards, drag or use the left and right arrow keys to browse"
                                    className={cn(
                                        'relative grid touch-pan-y select-none rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#22d3ee]',
                                        dragging ? 'cursor-grabbing' : 'cursor-grab',
                                    )}
                                    onPointerDownCapture={() => {
                                        moved.current = false
                                    }}
                                    onClickCapture={(event) => {
                                        if (moved.current) {
                                            moved.current = false
                                            event.preventDefault()
                                            event.stopPropagation()
                                        }
                                    }}
                                    onPanStart={beginPan}
                                    onPan={handlePan}
                                    onPanEnd={handlePanEnd}
                                >
                                    {/* Invisible stack of every card keeps the deck height stable. */}
                                    {recipes.map((item, i) => (
                                        <div key={item.id} inert aria-hidden="true" className="invisible col-start-1 row-start-1">
                                            <RecipeCard recipe={item} index={i} live={false} />
                                        </div>
                                    ))}

                                    <motion.div className="absolute inset-0" style={{ x: dragX, rotate: tilt }}>
                                        <AnimatePresence initial={false} custom={direction}>
                                            <motion.div
                                                key={recipe.id}
                                                role="group"
                                                aria-roledescription="slide"
                                                aria-label={`${index + 1} of ${total}: ${recipe.title}`}
                                                custom={direction}
                                                variants={cardVariants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                className="absolute inset-0 origin-bottom"
                                            >
                                                <RecipeCard
                                                    live
                                                    recipe={recipe}
                                                    index={index}
                                                    lang={lang}
                                                    copied={copied}
                                                    idBase={`${uid}-${recipe.id}`}
                                                    onLang={(value) => setLangs((current) => ({ ...current, [recipe.id]: value }))}
                                                    onCopy={copySnippet}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </motion.div>
                                </motion.div>
                            </div>

                            <div className="mt-6 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <p className="hidden whitespace-nowrap font-mono text-sm tabular-nums text-[#64748b] sm:block">
                                        <span className="text-white">{pad(index + 1)}</span> / {pad(total)}
                                    </p>
                                    <div role="group" aria-label="Choose a recipe" className="flex items-center lg:hidden">
                                        {recipes.map((item, i) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                aria-label={`Recipe ${i + 1}: ${item.title}`}
                                                aria-current={i === index ? 'true' : undefined}
                                                className="group grid h-10 w-7 place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#22d3ee]"
                                                onClick={() => goTo(i)}
                                            >
                                                <span
                                                    className={cn(
                                                        'relative block h-1.5 overflow-hidden rounded-full transition-all duration-300',
                                                        i === index ? 'w-6 bg-[#22d3ee]/30' : 'w-1.5 bg-[#334155] group-hover:bg-[#64748b]',
                                                    )}
                                                >
                                                    {i === index && (
                                                        <motion.span className="absolute inset-0 origin-left bg-[#22d3ee]" style={{ scaleX: autoplayOn ? progress : 1 }} />
                                                    )}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label={autoplayOn ? 'Pause autoplay' : 'Start autoplay'}
                                        className="grid size-11 place-items-center rounded-xl text-lg text-[#94a3b8] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                                        onClick={() => setPlayPref(!autoplayOn)}
                                    >
                                        {autoplayOn ? <HiMiniPause aria-hidden="true" /> : <HiMiniPlay aria-hidden="true" />}
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Previous recipe"
                                        className="grid size-11 place-items-center rounded-xl border border-[#1e293b] text-lg text-white transition-colors hover:border-[#22d3ee] hover:text-[#22d3ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22d3ee]"
                                        onClick={() => paginate(-1)}
                                    >
                                        <HiArrowLongLeft aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next recipe"
                                        className="grid size-11 place-items-center rounded-xl bg-[#22d3ee] text-lg text-[#0f172a] transition-colors hover:bg-[#67e8f9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#67e8f9]"
                                        onClick={() => paginate(1)}
                                    >
                                        <HiArrowLongRight aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                            <p aria-live={playing ? 'off' : 'polite'} aria-atomic="true" className="sr-only">
                                Recipe {index + 1} of {total}: {recipe.title}
                            </p>
                            <p aria-live="polite" className="sr-only">
                                {copyState ? (copyState.ok ? `${copyState.label} snippet copied` : 'Copy failed') : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </MotionConfig>
        </section>
    )
}

export default CodeExamplesSlider
