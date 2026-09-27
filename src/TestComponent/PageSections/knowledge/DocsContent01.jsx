// GuideArticleDocsContent

// DocsContent01 · Knowledge Bases & Documentation › Main Content Area

// Description:
// The main reading column of a Stackdocs guide, "Ship your first docs site in ten
// minutes." A breadcrumb, author line and lead paragraph open four numbered steps
// (Install the CLI, Scaffold a project, Configure your site, Deploy to production) with
// syntax-highlighted code blocks, a project file tree and Note / Tip / Warning
// callouts, then "Your site is live" next-step cards. Use it as the body of any
// getting-started or how-to guide.

// Design:
// - White page, ink #15121f text, violet #8b5cf6 accents over a soft violet radial
//   glow; article column plus a 280px "Guide summary" aside (sticky on lg, above the
//   steps below lg)
// - Steps are a vertical timeline: black mono numerals (01–04) joined by a violet
//   gradient rule that draws itself in when scrolled into view (static for reduced
//   motion)
// - Code blocks: rounded-2xl #14121c panels with window dots, file/terminal label, line
//   numbers, violet-tinted highlighted lines and hand-rolled token colours (keywords,
//   strings, numbers, comments, functions, flags); they scroll sideways inside
//   themselves
// - Callouts are tinted cards with an icon badge: Note violet #f5f3ff, Tip green
//   #f0fdf4, Warning amber #fffbeb; inline code renders as small mono pills
// - Responsive: title text-4xl → sm:5xl → lg:6xl; timeline gutter 2.25rem → sm:3rem;
//   the file tree sits beside its code block from md; next-step cards 1 → sm:3 columns

// What it does:
// - Step 1's code block has npm / pnpm / yarn tabs (role="tablist", arrow keys move
//   between tabs); the command shown and copied follows the selected package manager
// - Every Copy button writes the block to the clipboard (navigator.clipboard with a
//   hidden textarea fallback) and shows "Copied" for 1.8 s; "Copy all commands" in the
//   aside copies every command of the guide in order; results are announced in an
//   aria-live region
// - Step headings carry ids with a "#" anchor link; breadcrumb, author, edit and
//   next-step links point to #hash anchors (#guide-custom-domains,
//   #stackdocs-community, ...)

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <section> with cn()
// - ...props: spread onto the root <section> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import GuideArticleDocsContent from '@/TestComponent/PageSections/knowledge/DocsContent01';

// const DocsPage = () => (
//     <main className="space-y-6">
//         <GuideArticleDocsContent />
//     </main>
// )
// ```

'use client'

import { Fragment, useEffect, useId, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    HiArrowRight,
    HiCheck,
    HiChevronRight,
    HiOutlineClipboardDocument,
    HiOutlineClock,
    HiOutlineCommandLine,
    HiOutlineDocumentText,
    HiOutlineExclamationTriangle,
    HiOutlineFolder,
    HiOutlineInformationCircle,
    HiOutlineLightBulb,
    HiOutlinePencilSquare,
} from 'react-icons/hi2';
import { cn } from '@/design-system/lib/cn';

const INSTALL = {
    npm: `npm install --global @stackdocs/cli@4.2.0
stackdocs --version
# stackdocs/4.2.0 darwin-arm64 node-v20.11.1`,
    pnpm: `pnpm add --global @stackdocs/cli@4.2.0
stackdocs --version
# stackdocs/4.2.0 darwin-arm64 node-v20.11.1`,
    yarn: `yarn global add @stackdocs/cli@4.2.0
stackdocs --version
# stackdocs/4.2.0 darwin-arm64 node-v20.11.1`,
}

const SCAFFOLD = `stackdocs init acme-docs --template guide
cd acme-docs
stackdocs dev --port 4321
# Local preview ready at http://localhost:4321`

const CONFIG = `import { defineConfig } from '@stackdocs/core'

export default defineConfig({
    title: 'Acme Docs',
    baseUrl: '/docs',
    theme: { accent: '#8b5cf6', mode: 'auto' },
    // Build the sidebar from the /content folder
    sidebar: { autogenerate: true, depth: 3 },
    search: { provider: 'local', maxResults: 8 },
})`

const DEPLOY = `stackdocs build
stackdocs deploy --prod --project acme-docs
# Uploaded 48 pages (1.9 MB) in 6.2s
# Live at https://acme-docs.stackdocs.site`

const TREE = [
    { name: 'acme-docs/', depth: 0, folder: true },
    { name: 'content/', depth: 1, folder: true },
    { name: 'index.mdx', depth: 2 },
    { name: 'getting-started.mdx', depth: 2 },
    { name: 'public/', depth: 1, folder: true },
    { name: 'stackdocs.config.ts', depth: 1, accent: true },
    { name: 'package.json', depth: 1 },
]

const CALLOUTS = {
    note: {
        label: 'Note',
        icon: HiOutlineInformationCircle,
        box: 'border-[#e4dcfd] bg-[#f5f3ff]',
        badge: 'bg-[#8b5cf6] text-white',
        title: 'text-[#5b21b6]',
    },
    tip: {
        label: 'Tip',
        icon: HiOutlineLightBulb,
        box: 'border-[#c9f0d6] bg-[#f0fdf4]',
        badge: 'bg-[#16a34a] text-white',
        title: 'text-[#166534]',
    },
    warning: {
        label: 'Warning',
        icon: HiOutlineExclamationTriangle,
        box: 'border-[#fbe3a4] bg-[#fffbeb]',
        badge: 'bg-[#d97706] text-white',
        title: 'text-[#92400e]',
    },
}

const steps = [
    {
        id: 'install',
        title: 'Install the Stackdocs CLI',
        time: '2 min',
        body: 'The CLI scaffolds projects, runs the local preview server and ships your builds. It needs Node.js 20 or newer — check with `node -v` before you start.',
        callout: {
            type: 'note',
            text: 'Global installs with a system Node may ask for `sudo`. A version manager such as fnm or nvm avoids that and keeps the CLI per Node version.',
        },
    },
    {
        id: 'scaffold',
        title: 'Scaffold a project',
        time: '3 min',
        body: 'Create a new site from the `guide` template and start the dev server. Every `.mdx` file in `content/` becomes a page, and the sidebar is built from the folder structure.',
        callout: {
            type: 'tip',
            text: 'Starting from an API instead? Pass `--template api` and point it at an OpenAPI 3.1 file — Stackdocs generates one reference page per endpoint.',
        },
    },
    {
        id: 'configure',
        title: 'Configure your site',
        time: '3 min',
        body: 'Open `stackdocs.config.ts` and give the site a title and base path. Line 6 sets your brand accent — it drives links, focus rings and the active sidebar item.',
        callout: {
            type: 'note',
            text: 'Config changes hot-reload while `stackdocs dev` is running. Only a new `baseUrl` needs a restart.',
        },
    },
    {
        id: 'deploy',
        title: 'Deploy to production',
        time: '2 min',
        body: 'Build the static site and push it to Stackdocs Edge. The first deploy creates the project; later deploys only upload the pages that changed.',
        callout: {
            type: 'warning',
            text: '`--prod` replaces the live site immediately. Run `stackdocs deploy` without it first to get a shareable preview URL for review.',
        },
    },
]

const nextSteps = [
    { id: 'guide-custom-domains', title: 'Add a custom domain', meta: '5 min · DNS & HTTPS' },
    { id: 'guide-writing-mdx', title: 'Write richer pages with MDX', meta: '8 min · Components' },
    { id: 'guide-versioned-docs', title: 'Turn on versioned docs', meta: '6 min · Releases' },
]

const TS_KEYWORDS = new Set(['import', 'from', 'export', 'default', 'const', 'return', 'true', 'false', 'await'])
const TS_RE = /(\/\/.*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|([\s\S])/g
const BASH_RE = /(#.*)|('[^']*'|"(?:[^"\\]|\\.)*")|(--?[A-Za-z][\w-]*)|(\b\d+(?:\.\d+)*\b)|([^\s'"#]+)|(\s+)|([\s\S])/g

const TOKEN_CLASS = {
    keyword: 'text-[#c4b5fd]',
    string: 'text-[#86efac]',
    number: 'text-[#fdba74]',
    comment: 'italic text-[#7a7590]',
    fn: 'text-[#7dd3fc]',
    prop: 'text-[#f0abfc]',
    flag: 'text-[#c4b5fd]',
    punct: 'text-[#9690ab]',
    plain: 'text-[#ece9f5]',
}

function tokenizeTs(line) {
    return [...line.matchAll(TS_RE)].map((m) => {
        const [text, comment, str, num, word, space] = m
        if (comment) return { type: 'comment', text }
        if (str) return { type: 'string', text }
        if (num) return { type: 'number', text }
        if (word) {
            const next = line.slice(m.index + text.length).trimStart()[0]
            if (TS_KEYWORDS.has(word)) return { type: 'keyword', text }
            if (next === '(') return { type: 'fn', text }
            if (next === ':') return { type: 'prop', text }
            return { type: 'plain', text }
        }
        return { type: space ? 'plain' : 'punct', text }
    })
}

function tokenizeBash(line) {
    let expectCommand = true
    return [...line.matchAll(BASH_RE)].map((m) => {
        const [text, comment, str, flag, num, word, space] = m
        let type = 'plain'
        if (comment) type = 'comment'
        else if (str) type = 'string'
        else if (flag) type = 'flag'
        else if (num) type = 'number'
        else if (word) type = expectCommand ? 'fn' : word === '&&' || word === '|' ? 'punct' : 'plain'
        if (!space) expectCommand = word === '&&' || word === '|'
        return { type, text }
    })
}

function legacyCopy(text) {
    try {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.top = '0'
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

async function copyText(text) {
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
            return true
        }
    } catch {
        // permission denied or insecure context: use the textarea fallback
    }
    return legacyCopy(text)
}

function useCopy() {
    const [status, setStatus] = useState({ state: 'idle', n: 0 })

    useEffect(() => {
        if (status.state === 'idle') return undefined
        const id = setTimeout(() => setStatus((s) => ({ ...s, state: 'idle' })), 1800)
        return () => clearTimeout(id)
    }, [status])

    const copy = async (text) => {
        const ok = await copyText(text)
        setStatus((s) => ({ state: ok ? 'copied' : 'failed', n: s.n + 1 }))
    }

    return [status.state, copy]
}

function Inline({ text, dark = false }) {
    return text.split('`').map((part, i) =>
        i % 2 ? (
            <code
                key={i}
                className={cn(
                    'rounded-md px-1.5 py-0.5 font-mono text-[0.86em] font-medium',
                    dark ? 'bg-white/10 text-[#e9e3fb]' : 'bg-[#f1edfb] text-[#5b21b6]',
                )}
            >
                {part}
            </code>
        ) : (
            <Fragment key={i}>{part}</Fragment>
        ),
    )
}

function CopyButton({ state, label, onCopy }) {
    return (
        <button
            type="button"
            aria-label={state === 'copied' ? `${label} copied` : `Copy ${label}`}
            className={cn(
                'inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]',
                state === 'copied'
                    ? 'bg-[#8b5cf6] text-white'
                    : 'bg-white/5 text-[#cfc9e3] hover:bg-white/10 hover:text-white',
            )}
            onClick={onCopy}
        >
            {state === 'copied' ? (
                <HiCheck aria-hidden="true" className="size-4" />
            ) : (
                <HiOutlineClipboardDocument aria-hidden="true" className="size-4" />
            )}
            {state === 'copied' ? 'Copied' : state === 'failed' ? 'Press ⌘C' : 'Copy'}
        </button>
    )
}

function CodeBlock({ code, lang, label, highlight = [], tabs, activeTab, onTab }) {
    const uid = useId()
    const [state, copy] = useCopy()
    const lines = useMemo(
        () => code.split('\n').map((line) => (lang === 'bash' ? tokenizeBash(line) : tokenizeTs(line))),
        [code, lang],
    )
    const Icon = lang === 'bash' ? HiOutlineCommandLine : HiOutlineDocumentText

    const onTabKey = (event) => {
        if (!tabs) return
        const index = tabs.indexOf(activeTab)
        let next = null
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length]
        if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length]
        if (event.key === 'Home') next = tabs[0]
        if (event.key === 'End') next = tabs[tabs.length - 1]
        if (!next) return
        event.preventDefault()
        onTab(next)
        event.currentTarget.querySelector(`[data-tab="${next}"]`)?.focus()
    }

    return (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#2a2538] bg-[#14121c] shadow-[0_24px_48px_-28px_rgba(21,18,31,0.65)]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] bg-white/[0.02] py-1.5 pl-4 pr-1.5">
                <div className="flex min-w-0 items-center gap-3">
                    <span aria-hidden="true" className="hidden gap-1.5 sm:flex">
                        <span className="size-2.5 rounded-full bg-[#ff5f57]/80" />
                        <span className="size-2.5 rounded-full bg-[#febc2e]/80" />
                        <span className="size-2.5 rounded-full bg-[#28c840]/80" />
                    </span>
                    {tabs ? (
                        <div
                            role="tablist"
                            aria-label="Package manager"
                            className="flex items-center gap-1"
                            onKeyDown={onTabKey}
                        >
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    role="tab"
                                    data-tab={tab}
                                    id={`${uid}-tab-${tab}`}
                                    aria-selected={tab === activeTab}
                                    aria-controls={`${uid}-panel`}
                                    tabIndex={tab === activeTab ? 0 : -1}
                                    className={cn(
                                        'relative min-h-10 rounded-lg px-3 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]',
                                        tab === activeTab ? 'text-white' : 'text-[#8f89a6] hover:text-[#d9d3ee]',
                                    )}
                                    onClick={() => onTab(tab)}
                                >
                                    {tab === activeTab && (
                                        <motion.span
                                            layoutId={`${uid}-tab-pill`}
                                            className="absolute inset-0 rounded-lg bg-white/[0.08] ring-1 ring-white/10"
                                            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                                        />
                                    )}
                                    <span className="relative">{tab}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="flex min-w-0 items-center gap-2 font-mono text-xs text-[#b7b0cc]">
                            <Icon aria-hidden="true" className="size-4 shrink-0 text-[#a78bfa]" />
                            <span className="truncate">{label}</span>
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="hidden rounded-md border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8f89a6] sm:inline">
                        {lang === 'bash' ? 'Shell' : 'TS'}
                    </span>
                    <CopyButton state={state} label={label} onCopy={() => copy(code)} />
                </div>
            </div>
            <pre
                id={tabs ? `${uid}-panel` : undefined}
                role={tabs ? 'tabpanel' : undefined}
                aria-labelledby={tabs ? `${uid}-tab-${activeTab}` : undefined}
                aria-label={tabs ? undefined : label}
                tabIndex={0}
                className="overflow-x-auto py-4 font-mono text-[13px] leading-6 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#a78bfa]"
            >
                <code className="block w-max min-w-full">
                    {lines.map((tokens, i) => (
                        <span
                            key={i}
                            className={cn(
                                'flex pr-6',
                                highlight.includes(i + 1) && 'bg-[#8b5cf6]/15 shadow-[inset_2px_0_0_#a78bfa]',
                            )}
                        >
                            <span aria-hidden="true" className="w-11 shrink-0 select-none pr-4 text-right text-[#4f4963]">
                                {i + 1}
                            </span>
                            <span className="whitespace-pre">
                                {tokens.length === 0 && ' '}
                                {tokens.map((token, j) => (
                                    <span key={j} className={TOKEN_CLASS[token.type]}>
                                        {token.text}
                                    </span>
                                ))}
                            </span>
                        </span>
                    ))}
                </code>
            </pre>
            <span aria-live="polite" className="sr-only">
                {state === 'copied' ? `${label} copied to clipboard` : state === 'failed' ? 'Copy failed' : ''}
            </span>
        </div>
    )
}

function Callout({ type, text }) {
    const c = CALLOUTS[type]
    const Icon = c.icon
    return (
        <aside
            aria-label={c.label}
            className={cn('mt-5 flex gap-3.5 rounded-2xl border p-4 sm:gap-4 sm:p-5', c.box)}
        >
            <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', c.badge)}>
                <Icon aria-hidden="true" className="size-[18px]" />
            </span>
            <div className="min-w-0">
                <p className={cn('text-[11px] font-bold uppercase tracking-[0.2em]', c.title)}>{c.label}</p>
                <p className="mt-1 text-[15px] leading-7 text-[#3b3548]">
                    <Inline text={text} />
                </p>
            </div>
        </aside>
    )
}

function FileTree() {
    return (
        <div className="mt-5 rounded-2xl border border-[#ebe7f5] bg-[#fbfaff] p-4 font-mono text-[13px] text-[#3b3548] md:w-[17rem] md:shrink-0">
            <p className="mb-2 text-[10px] font-sans font-bold uppercase tracking-[0.22em] text-[#8d86a3]">
                Project files
            </p>
            <ul className="space-y-1">
                {TREE.map((item) => (
                    <li
                        key={item.name}
                        className="flex items-center gap-2"
                        style={{ paddingLeft: `${item.depth * 16}px` }}
                    >
                        {item.folder ? (
                            <HiOutlineFolder aria-hidden="true" className="size-4 shrink-0 text-[#8b5cf6]" />
                        ) : (
                            <HiOutlineDocumentText aria-hidden="true" className="size-4 shrink-0 text-[#a8a1bd]" />
                        )}
                        <span className={cn('min-w-0 truncate', item.accent && 'font-semibold text-[#6d28d9]')}>{item.name}</span>
                        {item.accent && (
                            <span className="ml-auto shrink-0 whitespace-nowrap rounded bg-[#ede9fe] px-1.5 text-[10px] font-sans font-bold text-[#6d28d9]">
                                step 3
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export function GuideArticleDocsContent({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const uid = useId()
    const reduceMotion = useReducedMotion()
    const [pm, setPm] = useState('npm')
    const [allState, copyAll] = useCopy()

    const allCommands = [INSTALL[pm].split('\n')[0], SCAFFOLD, DEPLOY]
        .join('\n')
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))
        .join('\n')

    const renderCode = (id) => {
        if (id === 'install')
            return (
                <CodeBlock
                    code={INSTALL[pm]}
                    lang="bash"
                    label="Install command"
                    tabs={Object.keys(INSTALL)}
                    activeTab={pm}
                    onTab={setPm}
                />
            )
        if (id === 'scaffold')
            return (
                <div className="md:flex md:items-start md:gap-4">
                    <div className="min-w-0 flex-1">
                        <CodeBlock code={SCAFFOLD} lang="bash" label="Terminal" />
                    </div>
                    <FileTree />
                </div>
            )
        if (id === 'configure')
            return <CodeBlock code={CONFIG} lang="ts" label="stackdocs.config.ts" highlight={[6]} />
        return <CodeBlock code={DEPLOY} lang="bash" label="Terminal" highlight={[2]} />
    }

    return (
        <section
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'relative overflow-clip bg-white px-4 py-16 text-base font-normal text-[#15121f] sm:px-6 md:py-24 lg:px-8',
                className,
            )}
            {...props}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(55%_65%_at_88%_0%,rgba(139,92,246,0.16),transparent_70%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[linear-gradient(to_right,rgba(139,92,246,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(139,92,246,0.07)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            />

            <div className="relative mx-auto max-w-6xl">
                <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1 text-[13px] font-medium text-[#6b6480]">
                        {['Docs', 'Guides', 'Getting started'].map((crumb) => (
                            <li key={crumb} className="flex items-center gap-1">
                                <a
                                    href={`#docs-${crumb.toLowerCase().replace(' ', '-')}`}
                                    className="inline-flex min-h-10 items-center rounded px-1 hover:text-[#6d28d9] focus-visible:outline-2 focus-visible:outline-[#8b5cf6]"
                                >
                                    {crumb}
                                </a>
                                <HiChevronRight aria-hidden="true" className="size-3.5 text-[#c3bdd4]" />
                            </li>
                        ))}
                        <li aria-current="page" className="px-1 text-[#15121f]">
                            Deploy your first site
                        </li>
                    </ol>
                </nav>

                <header className="mt-6 max-w-3xl">
                    <p className="inline-flex items-center gap-2 rounded-full border border-[#e4dcfd] bg-white/80 px-3 py-1 text-xs font-semibold text-[#6d28d9] backdrop-blur">
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-[#8b5cf6]" />
                        Guide · Beginner · Stackdocs CLI 4.2
                    </p>
                    <h2 className="mt-5 text-4xl font-semibold leading-[1.02] tracking-[-0.035em] text-[#15121f] sm:text-5xl lg:text-6xl">
                        Ship your first docs site in{' '}
                        <span className="bg-linear-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
                            ten minutes.
                        </span>
                    </h2>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4a4458]">
                        You will install the CLI, scaffold a project from the guide template, set your brand and push
                        a production build to Stackdocs Edge. No config files to write by hand, no build pipeline to
                        wire up.
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-[#6b6480]">
                        <span className="flex items-center gap-2.5">
                            <span
                                aria-hidden="true"
                                className="grid size-9 place-items-center rounded-full bg-[#15121f] text-xs font-bold text-white ring-2 ring-[#ede9fe]"
                            >
                                MK
                            </span>
                            <span>
                                <span className="font-semibold text-[#15121f]">Maya Kovač</span>, Developer Advocate
                            </span>
                        </span>
                        <span className="flex items-center gap-1.5">
                            <HiOutlineClock aria-hidden="true" className="size-4" />
                            10 min read · Updated Sep 18, 2026
                        </span>
                        <a
                            href="#stackdocs-edit-guide"
                            className="inline-flex min-h-10 items-center gap-1.5 font-semibold text-[#6d28d9] hover:text-[#5b21b6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                        >
                            <HiOutlinePencilSquare aria-hidden="true" className="size-4" />
                            Suggest an edit
                        </a>
                    </div>
                </header>

                <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
                    <aside aria-label="Guide summary" className="lg:order-last">
                        <div className="rounded-3xl border border-[#ebe7f5] bg-[#fbfaff] p-5 sm:p-6 lg:sticky lg:top-8">
                            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8d86a3]">Guide summary</p>
                            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm lg:grid-cols-1">
                                {[
                                    ['Time', '≈ 10 minutes'],
                                    ['Level', 'Beginner'],
                                    ['You need', 'Node.js 20+, a Git repo'],
                                    ['Result', 'A live site on Edge'],
                                ].map(([term, value]) => (
                                    <div key={term} className="border-l-2 border-[#ddd3fc] pl-3">
                                        <dt className="text-xs text-[#8d86a3]">{term}</dt>
                                        <dd className="mt-0.5 font-semibold text-[#15121f]">{value}</dd>
                                    </div>
                                ))}
                            </dl>
                            <button
                                type="button"
                                className={cn(
                                    'mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]',
                                    allState === 'copied'
                                        ? 'bg-[#8b5cf6] text-white'
                                        : 'bg-[#15121f] text-white hover:bg-[#2a2440]',
                                )}
                                onClick={() => copyAll(allCommands)}
                            >
                                {allState === 'copied' ? (
                                    <HiCheck aria-hidden="true" className="size-4" />
                                ) : (
                                    <HiOutlineCommandLine aria-hidden="true" className="size-4" />
                                )}
                                {allState === 'copied' ? 'Copied 6 commands' : 'Copy all commands'}
                            </button>
                            <span aria-live="polite" className="sr-only">
                                {allState === 'copied' ? 'All six guide commands copied to clipboard' : ''}
                            </span>
                            <p className="mt-3 text-center text-xs text-[#8d86a3]">Uses {pm} for the install step</p>
                            <a
                                href="#stackdocs-community"
                                className="mt-5 flex min-h-11 items-center justify-between gap-3 border-t border-[#ebe7f5] pt-4 text-sm font-semibold text-[#15121f] hover:text-[#6d28d9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6]"
                            >
                                Stuck? Ask in #help
                                <HiArrowRight aria-hidden="true" className="size-4" />
                            </a>
                        </div>
                    </aside>

                    <div className="min-w-0">
                        <ol className="space-y-14">
                            {steps.map((step, i) => (
                                <li
                                    key={step.id}
                                    className="relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-6"
                                >
                                    <div className="relative flex justify-center">
                                        <span className="relative z-10 grid size-9 place-items-center rounded-full bg-[#15121f] font-mono text-xs font-semibold text-white ring-[6px] ring-white sm:size-12 sm:text-sm">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                        {i < steps.length - 1 && (
                                            <motion.span
                                                aria-hidden="true"
                                                className="absolute -bottom-14 top-9 w-px origin-top bg-linear-to-b from-[#8b5cf6] via-[#c4b5fd] to-[#ede9fe] sm:top-12"
                                                initial={reduceMotion ? false : { scaleY: 0 }}
                                                whileInView={{ scaleY: 1 }}
                                                viewport={{ once: true, amount: 0.2 }}
                                                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                                            />
                                        )}
                                    </div>
                                    <div className="min-w-0 pt-1 sm:pt-2.5">
                                        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#8b5cf6]">
                                            Step {i + 1} · {step.time}
                                        </p>
                                        <h3
                                            id={`${uid}-${step.id}`}
                                            className="group mt-2 flex items-center gap-2 text-xl font-semibold tracking-tight text-[#15121f] sm:text-2xl"
                                        >
                                            {step.title}
                                            <a
                                                href={`#${uid}-${step.id}`}
                                                aria-label={`Link to ${step.title}`}
                                                className="grid size-10 place-items-center rounded-lg text-lg text-[#c3bdd4] opacity-100 hover:text-[#8b5cf6] focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-[#8b5cf6] md:opacity-0 md:group-hover:opacity-100"
                                            >
                                                #
                                            </a>
                                        </h3>
                                        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-[#4a4458] sm:text-base sm:leading-7">
                                            <Inline text={step.body} />
                                        </p>
                                        {renderCode(step.id)}
                                        <Callout type={step.callout.type} text={step.callout.text} />
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <div className="mt-16 overflow-hidden rounded-3xl bg-[#15121f] p-6 text-white sm:p-8">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#a78bfa]">
                                        Done · 4 of 4 steps
                                    </p>
                                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                        Your site is live. What next?
                                    </h3>
                                </div>
                                <p className="max-w-xs text-sm leading-6 text-[#b7b0cc]">
                                    <Inline dark text="Point your team at `acme-docs.stackdocs.site` and keep going." />
                                </p>
                            </div>
                            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                                {nextSteps.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            className="group flex h-full min-h-24 flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-[#8b5cf6]/60 hover:bg-[#8b5cf6]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]"
                                        >
                                            <span className="text-[15px] font-semibold leading-snug text-white">{item.title}</span>
                                            <span className="flex items-center justify-between text-xs text-[#9690ab]">
                                                {item.meta}
                                                <HiArrowRight
                                                    aria-hidden="true"
                                                    className="size-4 text-[#a78bfa] transition-transform duration-300 group-hover:translate-x-1"
                                                />
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default GuideArticleDocsContent
