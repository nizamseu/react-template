// CustomizeUpload

// CustomizeUpload · Upload demo

// Description:
// Demonstrates a customized file uploader with a primary solid action button
// and styled file upload list progress indicators.

// Design:
// - Primary brand blue #2a85ff button with cloud icon
// - Detailed file list items with size, status, and remove actions
// - Full dark mode support

// What it does:
// - Manages file upload list with progress display
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import CustomizeUpload from '@/TestComponent/Forms/Upload/CustomizeUpload';
//
// const MyComponent = () => {
//     return <CustomizeUpload />
// }
// ```

'use client'

import { useState, useRef } from 'react';
import { HiOutlineCloudUpload, HiCheckCircle, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function CustomizeUpload({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [files, setFiles] = useState([
        { name: 'document-report.pdf', size: 245000 },
        { name: 'profile-picture.jpg', size: 108000 },
    ])
    const inputRef = useRef(null)

    const handleFile = (e) => {
        const newFiles = Array.from(e.target.files || []).map((f) => ({
            name: f.name,
            size: f.size,
        }))
        setFiles((prev) => [...prev, ...newFiles])
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
                onChange={handleFile}
            />
            <button
                type="button"
                disabled={disabled || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2a85ff] hover:bg-[#2075e8] text-white text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                onClick={() => inputRef.current?.click()}
            >
                <HiOutlineCloudUpload className="text-lg" />
                Upload Your File
            </button>

            <div className="space-y-2 pt-1">
                {files.map((file, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs"
                    >
                        <div className="flex items-center gap-2.5 truncate">
                            <HiCheckCircle className="text-emerald-500 text-lg shrink-0" />
                            <div className="truncate text-xs">
                                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                                <p className="text-gray-400">{(file.size / 1024).toFixed(1)} KB • Completed</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            onClick={() => remove(idx)}
                        >
                            <HiX className="text-sm" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CustomizeUpload
