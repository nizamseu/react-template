// TypeAlert

// TypeAlert · Alert demo

// Description:
// Demonstrates all standard status types supported by the Alert component:
// Info, Warning, Success, and Danger (Error), each with coordinated icons and colors.

// Design:
// - Info: Blue theme (#2a85ff / #e0f2fe)
// - Warning: Amber theme
// - Success: Emerald green theme
// - Danger: Rose/red theme
// - Consistent spacing (space-y-3), rounded containers, and dark mode support

// What it does:
// - Renders a stacked set of four alerts
// - Matches type with corresponding SVG icon and color tokens
// - Pure Tailwind styling

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import TypeAlert from '@/TestComponent/Feedback/Alert/TypeAlert';
//
// const MyComponent = () => {
//     return <TypeAlert />
// }
// ```

'use client'

import {
    HiCheckCircle,
    HiInformationCircle,
    HiExclamation,
    HiXCircle,
} from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const alerts = [
    {
        bg: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 text-blue-900 dark:text-blue-200',
        icon: <HiInformationCircle className="h-5 w-5 shrink-0 text-[#2a85ff]" />,
        text: 'Additional description and information about copywriting.',
        type: 'info',
    },
    {
        bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200',
        icon: <HiExclamation className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />,
        text: 'Additional description and information about copywriting.',
        type: 'warning',
    },
    {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200',
        icon: <HiCheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />,
        text: 'Additional description and information about copywriting.',
        type: 'success',
    },
    {
        bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40 text-rose-900 dark:text-rose-200',
        icon: <HiXCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />,
        text: 'Additional description and information about copywriting.',
        type: 'danger',
    },
]

export function TypeAlert({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('w-full max-w-xl space-y-3', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {alerts.map((item) => (
                <div
                    key={item.type}
                    className={cn(
                        'flex items-start gap-3 rounded-lg border p-4 text-sm transition-colors',
                        item.bg,
                        (disabled || loading) && 'cursor-not-allowed opacity-60',
                    )}
                    role="alert"
                >
                    <div className="mt-0.5">{item.icon}</div>
                    <div className="flex-1">{item.text}</div>
                </div>
            ))}
        </div>
    )
}

export default TypeAlert
