// GroupAvatar

// GroupAvatar · Avatar demo
// Description:
// Chained avatar group component for team rosters, collaborators, and attendee lists.
// Stacks avatars with negative margin overlap and displays an overflow count (+N) for remaining members.
//
// Design:
// - Overlapping horizontal avatar chain (-space-x-3)
// - Knockout white border ring between items (ring-2 ring-white dark:ring-gray-800)
// - Overflow summary pill (+N) with muted background and bold text
// - Hover effect bringing individual avatar above siblings (hover:z-10)
//
// What it does:
// - Renders up to maxCount avatars and displays omitted count for the rest
// - Supports clickable omitted badge
//
// Props:
// - maxCount: number (default: 4)
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import GroupAvatar from '@/TestComponent/DataDisplay/Avatar/GroupAvatar';
//
// const MyComponent = () => {
//     return <GroupAvatar maxCount={4} />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

const sampleUsers = [
    { name: 'Sarah Connor', src: '/img/avatars/thumb-1.jpg' },
    { name: 'John Doe', src: '/img/avatars/thumb-2.jpg' },
    { name: 'Alex Smith', src: '/img/avatars/thumb-3.jpg' },
    { name: 'Emily Blunt', src: '/img/avatars/thumb-4.jpg' },
    { name: 'Michael Scott', src: '/img/avatars/thumb-5.jpg' },
    { name: 'Pam Beesly', src: '/img/avatars/thumb-6.jpg' },
]

export function GroupAvatar({
    className,
    disabled = false,
    loading = false,
    maxCount = 4,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    const visibleUsers = sampleUsers.slice(0, maxCount)
    const omittedCount = sampleUsers.length - maxCount

    return (
        <div
            className={cn('inline-flex items-center -space-x-2.5', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            {visibleUsers.map((user, idx) => (
                <div
                    key={idx}
                    className="relative transition hover:z-10 hover:scale-105"
                    title={user.name}
                >
                    <img
                        alt={user.name}
                        className={cn(
                            'h-10 w-10 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm',
                            (disabled || loading) && 'opacity-50',
                        )}
                        src={user.src}
                    />
                </div>
            ))}

            {omittedCount > 0 && (
                <div
                    className={cn(
                        'relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700 ring-2 ring-white dark:bg-gray-700 dark:text-gray-200 dark:ring-gray-800 shadow-sm transition hover:z-10 hover:scale-105',
                        (disabled || loading) && 'opacity-50',
                    )}
                    title={`${omittedCount} more members`}
                >
                    +{omittedCount}
                </div>
            )}
        </div>
    )
}

export default GroupAvatar;
