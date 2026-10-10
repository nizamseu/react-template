// DisabledSlider

// DisabledSlider · Slider demo

// Description:
// Demonstrates disabled Sliders, showing muted gray track lines and prevented
// drag interactions.

// Design:
// - Grayed-out slider track with disabled thumb
// - cursor-not-allowed indicator
// - Full dark mode support

// What it does:
// - Renders an unmovable disabled slider input
// - Prevents value adjustments
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DisabledSlider from '@/TestComponent/Forms/Slider/DisabledSlider';
//
// const MyComponent = () => {
//     return <DisabledSlider />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

export function DisabledSlider({
    variant = 'primary',
    size = 'md',
    disabled = true,
    loading = false,
    defaultValue = 60,
    className,
    ...props
}) {
    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full py-4 opacity-60 cursor-not-allowed', className)}
            {...props}
        >
            <input
                disabled
                type="range"
                min="0"
                max="100"
                defaultValue={defaultValue}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-not-allowed accent-gray-400"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0</span>
                <span>{defaultValue} (Disabled)</span>
                <span>100</span>
            </div>
        </div>
    )
}

export default DisabledSlider
