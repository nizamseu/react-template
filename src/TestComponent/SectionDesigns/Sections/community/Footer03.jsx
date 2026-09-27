// CommonroomThreeColumnLinkFooter

// Footer03 · Social Networks & Communities › Footers

// Description:
// A classic light footer for COMMONROOM: the brand and tagline ("More room for the things that
// bring us together."), a block of quick links (Find a group, Local events, Host a meetup, Safety
// center) and a "Find us elsewhere" column with Instagram and TikTok links, closed by a
// copyright line.

// Design:
// - Three equal columns (md:grid-cols-[1fr_1fr_1fr]); the middle column is a 2×2 link grid; a
//   bottom copyright row with a border-t
// - Palette: cream #f7ede6 background, dark brown #27201d text, gray-600 / gray-500 secondary
//   text, beige #e7d4c8 divider; light and warm
// - Typography & shapes: font-black xl wordmark, text-sm links, uppercase bold xs column heading,
//   ↗ glyphs on the social links; rounded-lg footer
// - Responsive: columns stack below md (the link grid stays two per row); padding p-7 → sm:p-10

// What it does:
// - Purely presentational: no content props, no state
// - Anchors: #discover, #events, #hosts, #safety, #instagram, #tiktok; "Privacy" and "Terms" in
//   the copyright line are plain text followed by a decorative inline arrow icon

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <footer> with cn()
// - ...props: spread onto the root <footer> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import CommonroomThreeColumnLinkFooter from '@/TestComponent/SectionDesigns/Sections/community/Footer03';

// const LandingPage = () => (
//     <main className="space-y-6">
//         <CommonroomThreeColumnLinkFooter />
//     </main>
// )
// ```

'use client'

import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CommonroomThreeColumnLinkFooter({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <footer
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn(
                'rounded-lg bg-[#f7ede6] p-7 text-[#27201d] sm:p-10',
                className,
            )}
            {...props}
        >
            <div className="grid gap-8 md:grid-cols-[1fr_1fr_1fr]">
                <div>
                    <p className="text-xl font-black">COMMONROOM</p>
                    <p className="mt-3 max-w-xs text-sm text-gray-600">
                        More room for the things that bring us together.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <a href="#discover">Find a group</a>
                    <a href="#events">Local events</a>
                    <a href="#hosts">Host a meetup</a>
                    <a href="#safety">Safety center</a>
                </div>
                <div>
                    <p className="text-xs font-bold uppercase">
                        Find us elsewhere
                    </p>
                    <div className="mt-3 flex gap-3 text-xs">
                        <a href="#instagram">Instagram ↗</a>
                        <a href="#tiktok">TikTok ↗</a>
                    </div>
                </div>
            </div>
            <p className="mt-8 border-t border-[#e7d4c8] pt-4 text-xs text-gray-500">
                © Commonroom 2026 · Privacy · Terms{' '}
                <HiArrowRight className="inline" />
            </p>
        </footer>
    )
}

export default CommonroomThreeColumnLinkFooter
