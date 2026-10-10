// LabelExtraForm

// LabelExtraForm · FormControl demo

// Description:
// Demonstrates custom extra content alongside form labels, including
// an interactive info tooltip beside the Name label and an "(optional)"
// tag badge beside the Email label.

// Design:
// - Vertical stacked form fields with 16px vertical spacing
// - Interactive question mark icon (HiOutlineQuestionMarkCircle) with hover tooltip
// - Subtle "(optional)" badge indicator
// - Full dark mode support

// What it does:
// - Implements self-contained tooltip without external library
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <form> with cn()
// - ...props: spread onto root <form>

// Usage example:
// ```jsx
// import LabelExtraForm from '@/TestComponent/Forms/FormControl/LabelExtraForm';
//
// const MyComponent = () => {
//     return <LabelExtraForm />
// }
// ```

'use client'

import { useState } from 'react';
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function LabelExtraForm({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [showTooltip, setShowTooltip] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        window.alert(JSON.stringify({ name, email }, null, 2))
    }

    return (
        <form
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('space-y-4 max-w-xl text-gray-900 dark:text-gray-100', className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Name
                    </label>
                    <div className="relative inline-flex items-center">
                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none"
                            aria-label="Field info"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <HiOutlineQuestionMarkCircle className="text-base" />
                        </button>
                        {showTooltip && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded shadow-md whitespace-nowrap z-10 pointer-events-none">
                                Enter your full legal name
                            </div>
                        )}
                    </div>
                </div>
                <input
                    type="text"
                    value={name}
                    disabled={disabled || loading}
                    placeholder="Please Input"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Email
                    </label>
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                        (optional)
                    </span>
                </div>
                <input
                    type="email"
                    value={email}
                    disabled={disabled || loading}
                    placeholder="Please Input"
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3.5 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={disabled || loading}
                    className="rounded-lg font-medium px-4 py-2 text-sm bg-[#2a85ff] hover:bg-[#2075e8] text-white transition-colors disabled:opacity-50 shadow-sm"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

export default LabelExtraForm
