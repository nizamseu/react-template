// AffixInput

// AffixInput · Input demo

// Description:
// Demonstrates prefix and suffix input additions: prefix user icon,
// suffix tooltip icon, and currency formatting prefix ($) with decimal suffix (.00).

// Design:
// - Stacked column layout with 16px vertical gap (space-y-4)
// - Prefix icon aligned left with pl-10
// - Suffix icon aligned right with pr-10
// - Currency input with text prefix and suffix addons
// - Brand blue #2a85ff focus outlines

// What it does:
// - Renders three input variations showcasing prefix and suffix placements
// - Embeds SVG icons and formatted text inside input borders
// - Pure standalone implementation

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AffixInput from '@/TestComponent/Forms/Input/AffixInput';
//
// const MyComponent = () => {
//     return <AffixInput />
// }
// ```

'use client'

import { HiOutlineUser, HiOutlineExclamationCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AffixInput({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-4', className)}
            {...props}
        >
            {/* Prefix Icon */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                    <HiOutlineUser className="text-lg" />
                </div>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-10 pr-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>

            {/* Suffix Icon */}
            <div className="relative">
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="Enter your rate"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-3.5 pr-10 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
                    <HiOutlineExclamationCircle className="text-lg" />
                </div>
            </div>

            {/* Prefix & Suffix Currency */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-500 font-medium text-sm">
                    $
                </div>
                <input
                    type="number"
                    disabled={disabled || loading}
                    placeholder="0"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 pl-8 pr-12 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-colors focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-500 font-medium text-sm">
                    .00
                </div>
            </div>
        </div>
    )
}

export default AffixInput
