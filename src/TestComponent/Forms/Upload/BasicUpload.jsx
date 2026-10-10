// BasicUpload

// BasicUpload · Upload demo

// Description:
// Demonstrates a clean file upload button with native file browser trigger
// and selected file listing with remove action.

// Design:
// - Clean outline button with upload icon (HiCloudUpload)
// - Selected file pills with file name, size, and close icon
// - Brand blue #2a85ff hover effects
// - Full dark mode support

// What it does:
// - Triggers file selection input on button click
// - Manages array of selected files and allows removing items
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import BasicUpload from '@/TestComponent/Forms/Upload/BasicUpload';
//
// const MyComponent = () => {
//     return <BasicUpload />
// }
// ```

'use client'

import { useState, useRef } from 'react';
import { HiCloudUpload, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function BasicUpload({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [files, setFiles] = useState([])
    const inputRef = useRef(null)

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files || [])
        setFiles((prev) => [...prev, ...selected])
    }

    const remove = (idx) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx))
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-md w-full space-y-3', className)}
            {...props}
        >
            <input
                ref={inputRef}
                multiple
                type="file"
                disabled={disabled || loading}
                className="hidden"
                onChange={handleFileChange}
            />
            <button
                type="button"
                disabled={disabled || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm disabled:opacity-50"
                onClick={() => inputRef.current?.click()}
            >
                <HiCloudUpload className="text-lg text-[#2a85ff]" />
                Select Files
            </button>

            {files.length > 0 && (
                <div className="space-y-1.5 pt-1">
                    {files.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/40 text-xs text-gray-700 dark:text-gray-300"
                        >
                            <span className="truncate max-w-[240px] font-medium">{file.name}</span>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                                onClick={() => remove(idx)}
                            >
                                <HiX className="text-sm" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default BasicUpload
