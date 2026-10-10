// ExtraClassCard

// ExtraClassCard · Cards demo
// Description:
// Card component with custom container and body styling overrides.
// Demonstrates applying specific padding, gradient accents, or specialized border treatments.
//
// Design:
// - Top accent gradient strip (brand blue to indigo)
// - Custom internal body padding (p-8)
// - Rounded-2xl corners with crisp shadow
// - Dark mode support with dark:bg-gray-800
//
// What it does:
// - Demonstrates modular customization of card headers, padding, and decorative borders
//
// Props:
// - title: string (default: "Custom Styled Card")
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import ExtraClassCard from '@/TestComponent/DataDisplay/Cards/ExtraClassCard';
//
// const MyComponent = () => {
//     return <ExtraClassCard />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function ExtraClassCard({
    children,
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Custom Styled Card',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'relative w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition',
                'dark:border-gray-700 dark:bg-gray-800',
                (disabled || loading) && 'opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {/* Top decorative gradient bar */}
            <div className="h-2 w-full bg-linear-to-r from-[#2a85ff] via-indigo-500 to-purple-500" />

            <div className="p-8">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#2a85ff] dark:bg-blue-950/40">
                    Pro Feature
                </span>
                <h5 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h5>
                <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {children || (
                        <p>
                            Custom class overrides allow tailoring padding, typography scales,
                            and decorative gradients precisely for high-impact cards.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ExtraClassCard;
