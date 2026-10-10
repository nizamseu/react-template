// OtherCombinationInputGroup

// OtherCombinationInputGroup · InputGroup demo

// Description:
// Demonstrates advanced composite input groups chaining inputs with
// dropdown selects (e.g. domain extension .com, .net, .io) and date pickers.

// Design:
// - Stacked column layout with 16px vertical gap
// - Input joined seamlessly with a select dropdown on the right
// - Input joined seamlessly with a select dropdown on the left
// - Brand blue #2a85ff focus outlines
// - Full dark mode support

// What it does:
// - Chains distinct input types (text input, select dropdown) into single input rows
// - Demonstrates flexible component chaining
// - Standalone single component format

// Props:
// - variant: "primary" (exposed as data-variant)
// - size: "md" (exposed as data-size)
// - disabled, loading: false by default
// - className: merged onto root <div> with cn()
// - ...props: spread onto root <div>

// Usage example:
// ```jsx
// import OtherCombinationInputGroup from '@/TestComponent/Forms/InputGroup/OtherCombinationInputGroup';
//
// const MyComponent = () => {
//     return <OtherCombinationInputGroup />
// }
// ```

'use client'

import { useState } from 'react';
import { cn } from '@/design-system/lib/cn';

const domainOptions = ['.com', '.net', '.io', '.org', '.dev']
const protocolOptions = ['https://', 'http://', 'ftp://']

export function OtherCombinationInputGroup({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const [domain, setDomain] = useState('.com')
    const [protocol, setProtocol] = useState('https://')

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('max-w-lg w-full space-y-4', className)}
            {...props}
        >
            {/* Input with Appended Select */}
            <div className="flex rounded-lg shadow-sm">
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="mywebsite"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
                <select
                    value={domain}
                    disabled={disabled || loading}
                    className="inline-flex items-center px-3 py-2 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setDomain(e.target.value)}
                >
                    {domainOptions.map((ext) => (
                        <option key={ext} value={ext}>
                            {ext}
                        </option>
                    ))}
                </select>
            </div>

            {/* Prepended Select with Input */}
            <div className="flex rounded-lg shadow-sm">
                <select
                    value={protocol}
                    disabled={disabled || loading}
                    className="inline-flex items-center px-3 py-2 rounded-none rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                    onChange={(e) => setProtocol(e.target.value)}
                >
                    {protocolOptions.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    disabled={disabled || loading}
                    placeholder="domain.com"
                    className="flex-1 min-w-0 block w-full px-3.5 py-2 rounded-none rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:border-[#2a85ff] focus:outline-none focus:ring-1 focus:ring-[#2a85ff]"
                />
            </div>
        </div>
    )
}

export default OtherCombinationInputGroup
