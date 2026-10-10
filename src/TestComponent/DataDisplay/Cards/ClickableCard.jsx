// ClickableCard

// ClickableCard · Cards demo
// Description:
// Interactive card component responding to hover and click events.
// Perfect for catalog entries, dashboard feature links, and selectable item cards.
//
// Design:
// - Interactive hover-lift transition (-translate-y-1) and deep shadow elevation (hover:shadow-lg)
// - Hover border highlight with brand blue (#2a85ff) tint
// - Subtle indicator arrow or chevron in the corner
//
// What it does:
// - Fires onClick callback when clicked
// - Provides accessible button role and keyboard interaction
//
// Props:
// - title: string (default: "Interactive Clickable Card")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import ClickableCard from '@/TestComponent/DataDisplay/Cards/ClickableCard';
//
// const MyComponent = () => {
//     return <ClickableCard onClick={() => console.log('Card clicked')} />
// }
// ```

'use client'

import { useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function ClickableCard({
    children,
    className,
    disabled = false,
    loading = false,
    onClick,
    size = 'md',
    title = 'Interactive Clickable Card',
    variant = 'primary',
    ...props
}) {
    const [clicks, setClicks] = useState(0)

    const handleClick = (e) => {
        if (!disabled && !loading) {
            setClicks((prev) => prev + 1)
            onClick?.(e)
        }
    }

    return (
        <div
            className={cn(
                'group relative w-full max-w-md cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200',
                'hover:-translate-y-1 hover:border-[#2a85ff]/50 hover:shadow-lg',
                'dark:border-gray-700 dark:bg-gray-800 dark:hover:border-[#2a85ff]/60',
                (disabled || loading) && 'cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-none',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            role="button"
            tabIndex={0}
            onClick={handleClick}
            {...props}
        >
            <div className="flex items-start justify-between gap-4">
                <h5 className="text-lg font-bold text-gray-900 transition group-hover:text-[#2a85ff] dark:text-gray-100">
                    {title}
                </h5>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2a85ff] transition group-hover:bg-[#2a85ff] group-hover:text-white dark:bg-blue-950/40">
                    <HiArrowRight className="h-4 w-4" />
                </span>
            </div>

            <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {children || (
                    <p>
                        Click this card to trigger an action. Interactive elevation feedback lets users
                        know it is clickable. Click count: <strong>{clicks}</strong>
                    </p>
                )}
            </div>
        </div>
    )
}

export default ClickableCard;
