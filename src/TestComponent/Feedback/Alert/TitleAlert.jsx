// TitleAlert

// TitleAlert · Alert demo

// Description:
// Demonstrates an Alert banner with a dedicated bold title above the description body text.

// Design:
// - Danger red theme (border-rose-200, bg-rose-50)
// - Bold title ("Error!") with description text
// - Red X-circle icon aligned with the title
// - Full dark mode support (dark:bg-rose-950/30, dark:border-rose-800/40)

// What it does:
// - Renders an alert with a header title and supporting description
// - Highlight critical errors or warnings

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - title: string (default: "Error!")
// - children: node (default text)
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import TitleAlert from '@/TestComponent/Feedback/Alert/TitleAlert';
//
// const MyComponent = () => {
//     return <TitleAlert />
// }
// ```

'use client'

import { HiXCircle } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

export function TitleAlert({
    children = 'Additional description and information about copywriting.',
    className,
    disabled = false,
    loading = false,
    size = 'md',
    title = 'Error!',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn(
                'flex w-full max-w-xl items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900 transition-colors',
                'dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-200',
                (disabled || loading) && 'cursor-not-allowed opacity-60',
                className,
            )}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            role="alert"
            {...props}
        >
            <HiXCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <div className="flex-1">
                {title && (
                    <div className="mb-1 font-semibold text-rose-950 dark:text-rose-100">
                        {title}
                    </div>
                )}
                <div>{children}</div>
            </div>
        </div>
    )
}

export default TitleAlert
