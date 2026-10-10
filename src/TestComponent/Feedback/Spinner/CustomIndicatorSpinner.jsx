// CustomIndicatorSpinner

// CustomIndicatorSpinner · Spinner demo

// Description:
// Demonstrates replacing the default continuous circle spinner with an alternative
// segmented icon indicator (ImSpinner9) while maintaining smooth rotation.

// Design:
// - Distinct segmented spiral loader icon
// - Brand blue #2a85ff accent
// - Smooth CSS animate-spin
// - Size: 40px

// What it does:
// - Renders an alternative icon-based spinner
// - Provides visual variation for design aesthetics

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomIndicatorSpinner from '@/TestComponent/Feedback/Spinner/CustomIndicatorSpinner';
//
// const MyComponent = () => {
//     return <CustomIndicatorSpinner />
// }
// ```

'use client'

import { ImSpinner9 } from 'react-icons/im';
import { cn } from '@/design-system/lib/cn';

export function CustomIndicatorSpinner({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('inline-flex items-center justify-center', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <ImSpinner9 className="h-10 w-10 animate-spin text-[#2a85ff]" />
        </div>
    )
}

export default CustomIndicatorSpinner
