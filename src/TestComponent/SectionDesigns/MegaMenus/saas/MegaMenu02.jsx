// DeveloperAPIHubMegaMenu

// MegaMenu02 · SaaS Platforms › Mega menus

// Description:
// The "Developer & API Hub" panel for a developer-tool or API-platform navbar. It lists
// six "Developer SDKs" (TypeScript, Python, Go Lang, Rust, Ruby, cURL / REST) with
// versions and a "$ npm install @signal/sdk" line, previews a syntax-coloured
// stream_events.ts snippet ("200 OK • 12ms"), and shows a "CHANGELOG • THIS WEEK" box
// with two releases and an "Open API Playground" CTA.

// Design:
// - lg:grid-cols-12 layout: SDK column (lg:col-span-4, a 2-column tile grid), code
//   window (lg:col-span-5) and changelog box (lg:col-span-3)
// - Dark #0e161c surface, #d6e3ea text, #263640 top border; mint #65e6b4 labels, SDK
//   badges, tile hover borders, status text and CTA fill (#0e161c text, white on hover)
// - Monospace SDK tiles, install line, code and dates; code tokens in purple-400,
//   emerald-300, blue-300, yellow-300 and gray-500 under red/amber/green window dots
// - Rounded tiles, rounded-lg code window (bg-black/60, white/15 border) and changelog
//   box (white/[0.02], white/10 border); no shadow of its own
// - The three blocks stack below lg:; the <pre> scrolls sideways (overflow-x-auto)

// What it does:
// - The six SDK tiles (#sdk) and "Open API Playground" (#playground) call closeMenu on
//   click
// - The copy button beside the npm command has no onClick (only a "Copy command" title);
//   the code snippet and changelog entries are static text; no state or effect
// - Used by SignalDevDeveloperConsoleNavbar: <MegaMenu category="saas" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-none border border-[#263640] shadow-2xl bg-[#0e161c]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import DeveloperAPIHubMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/saas/MegaMenu02';

// // Inside SignalDevDeveloperConsoleNavbar it opens from <MegaMenu category="saas" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-none border border-[#263640] shadow-2xl bg-[#0e161c]">
//         <DeveloperAPIHubMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import {
    HiArrowRight,
    HiOutlineClipboardCopy,
    HiOutlineTerminal,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DeveloperAPIHubMegaMenu({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    closeMenu,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'bg-[#0e161c] text-[#d6e3ea] p-8 border-t border-[#263640]',
                className,
            )}
            {...props}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: SDKs and Languages */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#65e6b4] uppercase tracking-wider">
                        <HiOutlineTerminal className="text-base" /> Developer SDKs
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        {[
                            { lang: 'TypeScript', v: 'v4.12.0', icon: 'TS' },
                            { lang: 'Python', v: 'v3.9.4', icon: 'PY' },
                            { lang: 'Go Lang', v: 'v1.22.1', icon: 'GO' },
                            { lang: 'Rust', v: 'v0.8.2', icon: 'RS' },
                            { lang: 'Ruby', v: 'v2.4.0', icon: 'RB' },
                            { lang: 'cURL / REST', v: 'OpenAPI 3.1', icon: 'HTTP' },
                        ].map((sdk) => (
                            <a
                                key={sdk.lang}
                                href="#sdk"
                                onClick={closeMenu}
                                className="flex items-center justify-between rounded border border-white/10 bg-white/5 p-2.5 hover:border-[#65e6b4] transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="rounded bg-[#65e6b4]/20 px-1 py-0.5 text-[9px] font-bold text-[#65e6b4]">
                                        {sdk.icon}
                                    </span>
                                    <span className="text-white">{sdk.lang}</span>
                                </div>
                                <span className="text-[10px] text-white/40">{sdk.v}</span>
                            </a>
                        ))}
                    </div>
                    <div className="rounded border border-white/10 bg-black/40 p-3 flex items-center justify-between font-mono text-xs">
                        <span className="text-white/80">$ npm install @signal/sdk</span>
                        <button
                            type="button"
                            className="text-white/40 hover:text-white"
                            title="Copy command"
                        >
                            <HiOutlineClipboardCopy />
                        </button>
                    </div>
                </div>

                {/* Center: Live Code Snippet Preview */}
                <div className="lg:col-span-5 rounded-lg border border-white/15 bg-black/60 p-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-white/50">
                        <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                            <span className="ml-2">stream_events.ts</span>
                        </div>
                        <span className="text-[#65e6b4]">200 OK &bull; 12ms</span>
                    </div>
                    <pre className="mt-3 text-white/80 leading-relaxed overflow-x-auto">
                        <code>
                            <span className="text-purple-400">import</span> {'{'} Signal {'}'}{' '}
                            <span className="text-purple-400">from</span>{' '}
                            <span className="text-emerald-300">&apos;@signal/sdk&apos;</span>
                            {'\n'}
                            <span className="text-purple-400">const</span> client ={' '}
                            <span className="text-purple-400">new</span>{' '}
                            <span className="text-blue-300">Signal</span>({'{'}
                            {'\n'}  apiKey: process.env.SIGNAL_KEY,
                            {'\n'}  region: <span className="text-emerald-300">&apos;eu-central-1&apos;</span>
                            {'\n'}{'}'})
                            {'\n'}
                            <span className="text-gray-500">// Subscribe to real-time events</span>
                            {'\n'}
                            <span className="text-purple-400">await</span> client.events.
                            <span className="text-yellow-300">listen</span>({'{'}
                            {'\n'}  channel: <span className="text-emerald-300">&apos;orders.created&apos;</span>,
                            {'\n'}  onEvent: (data) =&gt; console.
                            <span className="text-yellow-300">log</span>(data),
                            {'\n'}{'}'})
                        </code>
                    </pre>
                </div>

                {/* Right: Changelog Ticker */}
                <div className="lg:col-span-3 space-y-4 bg-white/[0.02] p-4 rounded-lg border border-white/10">
                    <span className="text-[10px] font-mono text-[#65e6b4] uppercase tracking-wider block">
                        CHANGELOG &bull; THIS WEEK
                    </span>
                    <div className="space-y-3 text-xs">
                        <div>
                            <span className="font-mono text-[10px] text-white/40">TODAY &bull; v4.12.0</span>
                            <p className="font-medium text-white">Added WebAssembly Edge Workers with sub-1ms cold starts</p>
                        </div>
                        <div>
                            <span className="font-mono text-[10px] text-white/40">OCT 03 &bull; v4.11.2</span>
                            <p className="font-medium text-white">Native OpenTelemetry v1.3 trace exporter released</p>
                        </div>
                    </div>
                    <a
                        href="#playground"
                        onClick={closeMenu}
                        className="mt-3 flex items-center justify-center gap-2 rounded bg-[#65e6b4] py-2 text-xs font-bold text-[#0e161c] hover:bg-white transition-colors"
                    >
                        Open API Playground <HiArrowRight />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default DeveloperAPIHubMegaMenu
