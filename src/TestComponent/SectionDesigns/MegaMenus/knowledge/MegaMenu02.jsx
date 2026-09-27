// SelfServiceHubMegaMenu

// MegaMenu02 · Knowledge Bases & Documentation › Mega menus

// Description:
// A light self-service help-center panel for a developer platform's knowledge base. A
// search bar reads "Describe your issue (e.g. How do I rotate automated webhook
// secrets?)" with a "Press Enter" hint, followed by three popular-article cards (DATABASE &
// STORAGE, SECURITY & IAM, BILLING & PLANS) with a title, helpfulness and read time, and a
// "Read Full Article →" link.

// Design:
// - Stacked: full-width search bar, then article cards in 1 column on mobile and 3 from md:
// - Pale mint #f4f8f5 surface with #162720 text and a #d1e2d7 top border; white search bar
//   and cards with gray-200/300 borders; deep green #41715d category labels, title hover
//   and links; emerald-800 "Press Enter" hint
// - rounded-xl shadow-sm search bar, rounded-lg shadow-sm cards; text-sm bold titles,
//   font-mono text-[10px] categories and a divider above each card link
// - Cards use flex-col justify-between so the links line up; no dark: variants

// What it does:
// - Each "Read Full Article →" links to #art and calls closeMenu on click
// - Visual only: the input is readOnly with a fixed value, "Press Enter" is a plain span
//   and the titles look clickable (hover colour, cursor-pointer) but are not links
// - Helpfulness lines render "&bull;" as literal text (JS strings); no state or effects
// - Used by FieldguideHelpCenterNavbar: <MegaMenu category="knowledge" variant={2} />
//   opens it in a dropdown panel framed with 'rounded-2xl border border-[#d1e2d7] shadow-xl bg-[#f4f8f5]'.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - closeMenu: optional; called when a link in the panel is clicked
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import SelfServiceHubMegaMenu from '@/TestComponent/SectionDesigns/MegaMenus/knowledge/MegaMenu02';

// // Inside FieldguideHelpCenterNavbar it opens from <MegaMenu category="knowledge" variant={2} />.
// // On its own, wrap it in the same frame the dropdown uses:
// const MenuPreview = () => (
//     <div className="rounded-2xl border border-[#d1e2d7] shadow-xl bg-[#f4f8f5]">
//         <SelfServiceHubMegaMenu closeMenu={() => {}} />
//     </div>
// )
// ```

'use client'

import { HiOutlineSearch } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function SelfServiceHubMegaMenu({
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
                'bg-[#f4f8f5] text-[#162720] p-8 border-t border-[#d1e2d7]',
                className,
            )}
            {...props}
        >
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm">
                <HiOutlineSearch className="text-lg text-gray-400" />
                <input
                    type="text"
                    readOnly
                    value="Describe your issue (e.g. How do I rotate automated webhook secrets?)"
                    className="flex-1 bg-transparent text-xs text-gray-800 outline-none cursor-pointer"
                />
                <span className="font-mono text-[11px] text-emerald-800 font-bold">Press Enter</span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Configuring Multi-Region Active-Active Database Replication',
                        helpful: '99% found helpful &bull; 8m read',
                        category: 'DATABASE & STORAGE',
                    },
                    {
                        title: 'Managing Enterprise SSO via Okta, Azure AD and Google Workspace',
                        helpful: '96% found helpful &bull; 6m read',
                        category: 'SECURITY & IAM',
                    },
                    {
                        title: 'Understanding Consumption Billing & Automatic Usage Quotas',
                        helpful: '94% found helpful &bull; 4m read',
                        category: 'BILLING & PLANS',
                    },
                ].map((art) => (
                    <div key={art.title} className="rounded-lg bg-white p-5 border border-gray-200 flex flex-col justify-between shadow-sm">
                        <div>
                            <span className="font-mono text-[10px] text-[#41715d] font-bold">{art.category}</span>
                            <h5 className="mt-1 font-bold text-sm text-gray-900 hover:text-[#41715d] cursor-pointer">
                                {art.title}
                            </h5>
                            <p className="mt-2 text-xs text-gray-500">{art.helpful}</p>
                        </div>
                        <a href="#art" onClick={closeMenu} className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#41715d] underline">
                            Read Full Article &rarr;
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelfServiceHubMegaMenu
