// ContentSwitcher

// ContentSwitcher · Switcher demo

// Description:
// Demonstrates Switcher components with embedded text or icons inside the track,
// such as a/b labels and Sun / Moon day/night icons.

// Design:
// - Track with embedded inside content (icons or letters)
// - Sun icon (RiSunLine) when checked, Moon icon (RiMoonClearLine) when unchecked
// - Smooth sliding translation animation
// - Full dark mode support

// What it does:
// - Renders two switcher instances showing text content and icon content
// - Toggles checked state and displays active visual cues
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import ContentSwitcher from '@/TestComponent/Forms/Switcher/ContentSwitcher';
//
// const MyComponent = () => {
//     return <ContentSwitcher />
// }
// ```

'use client'

import { useState } from 'react';
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';
import { cn } from '@/design-system/lib/cn';

export function ContentSwitcher({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [textChecked, setTextChecked] = useState(true)
    const [iconChecked, setIconChecked] = useState(false)

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-col gap-4 max-w-sm', className)}
            {...props}
        >
            {/* Text Content Switcher */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    role="switch"
                    aria-checked={textChecked}
                    disabled={disabled || loading}
                    className={cn(
                        'relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                        textChecked ? 'bg-[#2a85ff]' : 'bg-gray-300 dark:bg-gray-600',
                    )}
                    onClick={() => setTextChecked(!textChecked)}
                >
                    <span
                        className={cn(
                            'pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md text-xs font-bold text-gray-700 transition duration-200 ease-in-out',
                            textChecked ? 'translate-x-7' : 'translate-x-0',
                        )}
                    >
                        {textChecked ? 'A' : 'B'}
                    </span>
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Text mode ({textChecked ? 'Option A' : 'Option B'})
                </span>
            </div>

            {/* Icon Content Switcher */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    role="switch"
                    aria-checked={iconChecked}
                    disabled={disabled || loading}
                    className={cn(
                        'relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                        iconChecked ? 'bg-[#2a85ff]' : 'bg-gray-700',
                    )}
                    onClick={() => setIconChecked(!iconChecked)}
                >
                    <span
                        className={cn(
                            'pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md text-sm transition duration-200 ease-in-out',
                            iconChecked ? 'translate-x-7 text-amber-500' : 'translate-x-0 text-indigo-500',
                        )}
                    >
                        {iconChecked ? <RiSunLine /> : <RiMoonClearLine />}
                    </span>
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme mode ({iconChecked ? 'Light' : 'Dark'})
                </span>
            </div>
        </div>
    )
}

export default ContentSwitcher
