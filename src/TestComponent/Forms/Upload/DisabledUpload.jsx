// DisabledUpload

// DisabledUpload · Upload demo

// Description:
// Demonstrates disabled Upload buttons and dropzones with muted styles
// and disabled file picking.

// Design:
// - Disabled button and disabled dashed dropzone
// - Opacity-50, cursor-not-allowed
// - Full dark mode support

// What it does:
// - Renders disabled file upload triggers
// - Prevents file dialogue opening
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled: true by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DisabledUpload from '@/TestComponent/Forms/Upload/DisabledUpload';
//
// const MyComponent = () => {
//     return <DisabledUpload />
// }
// ```

'use client'

import { HiCloudUpload } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DisabledUpload({
    variant = 'primary',
    size = 'md',
    disabled = true,
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
            {/* Disabled Button */}
            <button
                disabled
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-400 text-sm font-medium cursor-not-allowed opacity-60"
            >
                <HiCloudUpload className="text-lg" />
                Select Files (Disabled)
            </button>

            {/* Disabled Dropzone */}
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/20 rounded-xl cursor-not-allowed opacity-60">
                <HiCloudUpload className="text-3xl text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">
                    File dropzone is disabled
                </span>
            </div>
        </div>
    )
}

export default DisabledUpload
