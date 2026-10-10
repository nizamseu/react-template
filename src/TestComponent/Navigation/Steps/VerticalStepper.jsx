// VerticalStepperWithTitles

// VerticalStepper · Steps demo

// Description:
// A static 4-step stepper laid out top-to-bottom, each numbered circle
// with a title to its right (Login, Order Placed, In Review, Approved).
// Step 1 is complete (check icon), step 2 is current and steps 3-4 are
// pending. Display-only.

// Design:
// - Column layout (flex-col, items-start); circle + title in a row per step
// - Vertical connector below each step except the last: w-0.5, min-h-14,
//   ms-4 so it sits under the circle centre; blue #2a85ff after a complete
//   step, otherwise gray-200 (dark:bg-gray-600)
// - Complete: filled #2a85ff circle with white HiCheck; current: 2px
//   #2a85ff border (dark:text-gray-100); pending: gray-300 border
//   (dark:border-gray-600); title bold gray-600 (dark:text-gray-300)
// - No responsive breakpoints

// What it does:
// - currentStep is a hard-coded local constant (1), not state
// - isComplete / isCurrent are derived per step from its index
// - No state, no event handlers
// - No content props.

// Props:
// - variant: "primary" (the only design; exposed as data-variant)
// - size: "md" (the only size; exposed as data-size)
// - disabled, loading: false by default; set data-disabled, no visual change
// - className: merged onto the root <div> with cn()
// - ...props: spread onto the root <div> (id, aria-*, ref, handlers)

// Usage example:
// ```jsx
// import VerticalStepperWithTitles from '@/TestComponent/VerticalStepper';

// const Vertical = () => {
//     return <VerticalStepperWithTitles />
// }
// ```

'use client'

import { HiCheck } from 'react-icons/hi';
import { cn } from '@/design-system/lib/cn';

const steps = ['Login', 'Order Placed', 'In Review', 'Approved']

export function VerticalStepperWithTitles({
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className,
    ...props
}) {
    const currentStep = 1

    return (
        <div
            data-variant={variant}
            data-size={size}
            data-disabled={disabled || loading}
            className={cn('flex flex-col items-start', className)}
            {...props}
        >
            {steps.map((title, index) => {
                const isComplete = index < currentStep
                const isCurrent = index === currentStep

                return (
                    <div
                        key={title}
                        className="flex flex-col items-start"
                    >
                        <div className="flex items-center">
                            <div
                                className={`box-border flex h-9 w-9 min-w-[2.25rem] items-center justify-center rounded-full text-lg font-semibold ${
                                    isComplete
                                        ? 'border-0 bg-[#2a85ff] text-white'
                                        : isCurrent
                                          ? 'border-2 border-[#2a85ff] text-[#2a85ff] dark:text-gray-100'
                                          : 'border-2 border-gray-300 dark:border-gray-600'
                                }`}
                            >
                                {isComplete ? <HiCheck /> : index + 1}
                            </div>
                            <div className="relative ms-3">
                                <span className="block whitespace-nowrap font-bold text-gray-600 dark:text-gray-300">
                                    {title}
                                </span>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`ms-4 min-h-14 w-0.5 ${isComplete ? 'bg-[#2a85ff]' : 'bg-gray-200 dark:bg-gray-600'}`}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}

export default VerticalStepperWithTitles