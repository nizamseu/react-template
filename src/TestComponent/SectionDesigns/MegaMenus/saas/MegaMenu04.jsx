// AICommandCenterMegaMenu

// MegaMenu04 · SaaS Platforms › Mega menus

// Description:
// The "AI Command Center" panel for an AI or automation SaaS navbar, in a light theme.
// A command-palette bar ("Search 240+ features, APIs, and AI agent connectors..." with a
// ⌘K hint) sits above three cards: "QUICK ACTIONS" (four links), an "LLM MODEL MATRIX"
// with provider and latency per model, and a dark "Bring Your Own Cloud (BYOC)" card
// whose CTA reads "Schedule Architecture Review".

// Design:
// - Full-width search bar, then a grid-cols-1 lg:grid-cols-3 row of three cards
// - Light mint #edf3ee surface, #111a22 text; emerald #17a878 top border (border-t-2),
//   labels, latencies and link hover; the BYOC card is dark #111a22 with a mint #65e6b4
//   badge and CTA (white on hover)
// - font-mono text-[10px] bold uppercase labels, text-xs body, text-base bold BYOC
//   title; rounded-lg white cards and search bar with black/10-15 borders and shadow-sm
// - Cards stack below lg: and sit three across from lg:

// What it does:
// - The four quick actions (#action) and "Schedule Architecture Review" (#byoc) call
//   closeMenu on click
// - The search input is readOnly with a fixed value (cursor-pointer, no handler), the
//   ⌘K chip is decorative and the model matrix rows are not links; no state or effect
// - Used by FlowstateAIFloatingPillNavbar: <MegaMenu category="saas" variant={4} />
//   opens it in a dropdown panel framed with 'rounded-3xl border border-black/10 backdrop-blur-xl shadow-2xl bg-[#edf3ee]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import AICommandCenterMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/saas/MegaMenu04';

// // Inside FlowstateAIFloatingPillNavbar it opens from <MegaMenu category="saas" variant={4} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-3xl border border-black/10 backdrop-blur-xl shadow-2xl bg-[#edf3ee]">
//         <AICommandCenterMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiArrowRight, HiOutlineSearch } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AICommandCenterMegaMenu({
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
                'bg-[#edf3ee] text-[#111a22] p-8 border-t-2 border-[#17a878]',
                className,
            )}
            {...props}
        >
            {/* Interactive Command Palette Search Bar */}
            <div className="flex items-center gap-3 rounded-lg border border-black/15 bg-white px-4 py-3 shadow-sm">
                <HiOutlineSearch className="text-lg text-gray-400" />
                <input
                    type="text"
                    readOnly
                    value="Search 240+ features, APIs, and AI agent connectors..."
                    className="flex-1 bg-transparent text-xs text-gray-700 outline-none cursor-pointer"
                />
                <div className="flex items-center gap-1 font-mono text-[10px] text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">
                    <span>⌘</span>
                    <span>K</span>
                </div>
            </div>

            {/* Quick Action Chips & AI Agent Core */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="rounded-lg bg-white p-5 border border-black/10 shadow-sm flex flex-col justify-between">
                    <div>
                        <span className="font-mono text-[10px] font-bold text-[#17a878] uppercase tracking-wider">
                            QUICK ACTIONS
                        </span>
                        <ul className="mt-3 space-y-2 text-xs font-medium">
                            {['Deploy autonomous pipeline', 'Connect Snowflake data warehouse', 'Generate production API token', 'Invite 10 team seats'].map((action) => (
                                <li key={action}>
                                    <a
                                        href="#action"
                                        onClick={closeMenu}
                                        className="flex items-center justify-between py-1.5 hover:text-[#17a878] transition-colors"
                                    >
                                        <span>&bull; {action}</span>
                                        <HiArrowRight className="text-gray-400" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                        Zero CLI setup required
                    </div>
                </div>

                <div className="rounded-lg bg-white p-5 border border-black/10 shadow-sm">
                    <span className="font-mono text-[10px] font-bold text-[#17a878] uppercase tracking-wider">
                        LLM MODEL MATRIX
                    </span>
                    <div className="mt-3 space-y-2.5 text-xs">
                        {[
                            { model: 'Claude 3.5 Sonnet', latency: '180ms', provider: 'Anthropic' },
                            { model: 'GPT-4o Omnichannel', latency: '210ms', provider: 'OpenAI' },
                            { model: 'Gemini 1.5 Pro (2M ctx)', latency: '240ms', provider: 'Google' },
                            { model: 'Llama 3.3 70B (Private VPC)', latency: '85ms', provider: 'Dedicated' },
                        ].map((m) => (
                            <div key={m.model} className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <div>
                                    <span className="font-bold">{m.model}</span>
                                    <span className="block text-[10px] text-gray-500">{m.provider}</span>
                                </div>
                                <span className="font-mono text-[11px] font-bold text-[#17a878]">{m.latency}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg bg-[#111a22] text-white p-5 flex flex-col justify-between">
                    <div>
                        <span className="rounded bg-[#65e6b4] px-2 py-0.5 font-mono text-[9px] font-bold text-[#111a22]">
                            ENTERPRISE SLA
                        </span>
                        <h4 className="mt-3 font-bold text-base">Bring Your Own Cloud (BYOC)</h4>
                        <p className="mt-2 text-xs text-white/70 leading-relaxed">
                            Deploy Flowstate directly inside your private AWS VPC, Azure Subnet, or GCP Project. Your data never touches our network.
                        </p>
                    </div>
                    <a
                        href="#byoc"
                        onClick={closeMenu}
                        className="mt-4 flex items-center justify-center gap-2 rounded bg-[#65e6b4] py-2 text-xs font-bold text-[#111a22] hover:bg-white transition-colors"
                    >
                        Schedule Architecture Review <HiArrowRight />
                    </a>
                </div>
            </div>
        </div>
    )
}

export default AICommandCenterMegaMenu
