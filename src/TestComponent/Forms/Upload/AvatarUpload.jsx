// AvatarUpload

// AvatarUpload · Upload demo

// Description:
// Demonstrates a circular Avatar profile picture uploader with image preview,
// hover upload icon overlay, and local file validation.

// Design:
// - Circular avatar frame (h-24 w-24 rounded-full)
// - Hover overlay with camera / plus icon
// - Brand blue #2a85ff ring on hover
// - Full dark mode support

// What it does:
// - Validates image file type and generates instant local preview URL
// - Manages avatar image state
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import AvatarUpload from '@/TestComponent/Forms/Upload/AvatarUpload';
//
// const MyComponent = () => {
//     return <AvatarUpload />
// }
// ```

'use client'

import { useState, useRef } from 'react';
import { HiOutlineCamera } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function AvatarUpload({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [avatarUrl, setAvatarUrl] = useState(null)
    const inputRef = useRef(null)

    const handleFile = (e) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setAvatarUrl(URL.createObjectURL(file))
        }
    }

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('inline-flex flex-col items-center gap-2', className)}
            {...props}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                disabled={disabled || loading}
                className="hidden"
                onChange={handleFile}
            />
            <div
                className={cn(
                    'group relative h-24 w-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer bg-gray-50 dark:bg-gray-800 flex items-center justify-center transition-all hover:border-[#2a85ff]',
                    (disabled || loading) && 'opacity-50 cursor-not-allowed',
                )}
                onClick={() => !disabled && !loading && inputRef.current?.click()}
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar Preview"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <HiOutlineCamera className="text-3xl text-gray-400 group-hover:text-[#2a85ff] transition-colors" />
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                    Change
                </div>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
                Click to upload avatar
            </span>
        </div>
    )
}

export default AvatarUpload
