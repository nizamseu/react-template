// BasicTimeline

// BasicTimeline · Timeline demo
// Description:
// Vertical chronological timeline with connected progress nodes and step descriptions.
// Perfect for activity histories, order trackings, and process workflows.
//
// Design:
// - Connected vertical stem lines (border-l-2 border-gray-200 dark:border-gray-700)
// - Brand blue (#2a85ff) node dots with white center
// - Clean typography with time badges
// - Dark mode support with dark:text-gray-300
//
// What it does:
// - Renders a vertical stream of chronological events
// - Displays timestamps and event descriptions
//
// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default; sets data-disabled
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>
//
// Usage example:
// ```jsx
// import BasicTimeline from '@/TestComponent/DataDisplay/Timeline/BasicTimeline';
//
// const MyComponent = () => {
//     return <BasicTimeline />
// }
// ```

'use client'

import { cn } from '@/design-system/lib/cn';

const timelineEvents = [
    { title: 'Project Kickoff & Requirements', time: '09:00 AM', desc: 'Initial team alignment and scope definition.' },
    { title: 'Design Review & Prototype', time: '12:30 PM', desc: 'Approved high-fidelity mockups with client.' },
    { title: 'Frontend Sprint Deployment', time: '05:00 PM', desc: 'Release deployed to staging environment.' },
]

export function BasicTimeline({
    className,
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    ...props
}) {
    return (
        <div
            className={cn('w-full max-w-md', className)}
            data-disabled={disabled || loading}
            data-size={size}
            data-variant={variant}
            {...props}
        >
            <ol className="relative border-l border-gray-200 dark:border-gray-700">
                {timelineEvents.map((event, idx) => (
                    <li key={idx} className="mb-8 ml-6 last:mb-0">
                        <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#2a85ff] shadow-sm dark:border-gray-850" />
                        <div className="flex items-center gap-2">
                            <h6 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {event.title}
                            </h6>
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#2a85ff] dark:bg-blue-950/40">
                                {event.time}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {event.desc}
                        </p>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default BasicTimeline;
