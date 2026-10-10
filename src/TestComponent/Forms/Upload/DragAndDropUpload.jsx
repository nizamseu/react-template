// DragAndDropUpload

// DragAndDropUpload · Upload demo

// Description:
// Demonstrates a large drag-and-drop file dropzone area with dashed borders,
// upload cloud icon, file size guidance, and file drop feedback.

// Design:
// - Dashed border dropzone (border-2 border-dashed border-gray-300 dark:border-gray-600)
// - Centered cloud upload icon (HiCloudUpload) and informative text
// - Brand blue #2a85ff hover and active drag border
// - Full dark mode support

// What it does:
// - Handles dragOver, dragLeave, drop, and file input click events
// - Lists uploaded files with preview metadata
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import DragAndDropUpload from '@/TestComponent/Forms/Upload/DragAndDropUpload';
//
// const MyComponent = () => {
//     return <DragAndDropUpload />
// }
// ```

'use client'

import { useState } from 'react';
import { HiCloudUpload, HiX } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function DragAndDropUpload({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [files, setFiles] = useState([])
    const [isDragging, setIsDragging] = useState(false)

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        if (disabled || loading) return
        const dropped = Array.from(e.dataTransfer.files || [])
        setFiles((prev) => [...prev, ...dropped])
    }

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
            <label
                className={cn(
                    'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
                    isDragging
                        ? 'border-[#2a85ff] bg-blue-50/50 dark:bg-blue-950/20'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/40 hover:border-[#2a85ff]',
                    (disabled || loading) && 'opacity-50 cursor-not-allowed',
                )}
                onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                <HiCloudUpload className="text-4xl text-gray-400 dark:text-gray-500 mb-2" />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    Drop your files here, or <span className="text-[#2a85ff]">browse</span>
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Support for PNG, JPG, PDF up to 10MB
                </span>
                <input
                    multiple
                    type="file"
                    disabled={disabled || loading}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>

            {files.length > 0 && (
                <div className="space-y-1.5 pt-1">
                    {files.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 shadow-xs"
                        >
                            <span className="truncate max-w-[240px] font-medium">{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                            <button
                                type="button"
                                className="text-gray-400 hover:text-red-500 transition-colors"
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

export default DragAndDropUpload
